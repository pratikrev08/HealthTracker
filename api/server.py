from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

import pandas as pd
import xmltodict
import calendar
from datetime import *

import os
import urllib.parse as up
import psycopg2

import requests
import json

app = Flask(__name__)
CORS(app)

# connect to PostgreSQL db 
up.uses_netloc.append("postgres")
url = up.urlparse("postgres://pjmbonro:mOXtteij2asTMpQ0nzMt5GJWmWhM8wDi@isilo.db.elephantsql.com:5432/pjmbonro")

@app.route("/api/v1/create_user", methods=['POST'])
def create_user():
    sql = """INSERT INTO users(username, password) VALUES(%s, %s) RETURNING user_id"""

    try:
        username = request.json["username"]
        password = request.json["password"]

        conn = psycopg2.connect(database=url.path[1:], 
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port
        )

        # create a new cursor
        cur = conn.cursor()
        # execute the INSERT statement
        cur.execute(sql, (username,password,))
        # get the generated id back
        userid = cur.fetchone()[0]
        # commit the changes to the database
        conn.commit()
        # close communication with the database
        cur.close()

        result = {'userid': userid, 'created': True}
        return make_response(jsonify(result), 200)
    except (Exception, psycopg2.DatabaseError) as error:
        response = { 'status': 'error', 'message': 'Internal Server Error', 'error': error, 'created': False}
        return make_response(jsonify(response), 500)
    finally:
        if conn is not None:
            conn.close()

@app.route("/api/v1/get_users", methods=['GET'])
def get_users():
    sql = """SELECT username FROM users"""

    try:
        conn = psycopg2.connect(database=url.path[1:], 
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port
        )

        # create a new cursor
        cur = conn.cursor()
        # execute the INSERT statement
        cur.execute(sql)
        # get the users
        users = cur.fetchall()
        # close communication with the database
        cur.close()

        return make_response(jsonify(users), 200)
    except (Exception, psycopg2.DatabaseError) as error:
        response = { 'status': 'error', 'message': 'Internal Server Error', 'error': error }
        return make_response(jsonify(response), 500)
    finally:
        if conn is not None:
            conn.close()

@app.route("/api/v1/push_data", methods=['POST'])
def push_data():
    try:
        userid = request.form['userid']

        print('Parsing data ...')
        data = request.files['healthData']
        input_data = xmltodict.parse(data.read())

        # get individual data tables from export.xml
        records_list = input_data['HealthData']['Record']
        health_data = pd.DataFrame(records_list)

        # WORKOUT data
        workout_list = input_data['HealthData']['Workout']
        health_data_workout = pd.DataFrame(workout_list)
        # smaller sample data for demo
        health_data_workout = health_data_workout[:100]

        # ACTIVITY data
        activity_summary_list = input_data['HealthData']['ActivitySummary']
        health_data_activity = pd.DataFrame(activity_summary_list)
        metrics = ['@activeEnergyBurned', '@activeEnergyBurnedGoal', '@appleExerciseTime', '@appleExerciseTimeGoal', '@appleStandHours', '@appleStandHoursGoal']
        for metric in metrics:
            health_data_activity.loc[:, metric] = pd.to_numeric(health_data_activity.loc[:, metric])
            health_data_activity.loc[:, metric] = pd.to_numeric(health_data_activity.loc[:, metric])
        activity_columns = ['@dateComponents', '@activeEnergyBurned', '@activeEnergyBurnedGoal', '@activeEnergyBurnedUnit', '@appleExerciseTime', '@appleExerciseTimeGoal', '@appleStandHours', '@appleStandHoursGoal']
        health_data_activity = health_data_activity[activity_columns]
        # smaller sample data for demo
        health_data_activity = health_data_activity[:100]

        # RECORD data
        data_record_columns = ['HKCategoryTypeIdentifierSleepAnalysis','HKQuantityTypeIdentifierEnvironmentalAudioExposure','HKQuantityTypeIdentifierHeadphoneAudioExposure',
                       'HKQuantityTypeIdentifierHeartRate','HKQuantityTypeIdentifierOxygenSaturation','HKQuantityTypeIdentifierBasalEnergyBurned','HKQuantityTypeIdentifierActiveEnergyBurned']
        health_data_record = health_data[health_data['@type'].isin(data_record_columns)]
        record_columns = ['@type', '@unit', '@creationDate', '@startDate', '@endDate', '@value']
        health_data_record = health_data_record[record_columns]
        # smaller sample data for demo
        health_data_record = health_data_record[:100]

        # create tables for each data type - activity, workout, record
        conn = psycopg2.connect(database=url.path[1:], 
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port
        )
        # create a new cursor
        cur = conn.cursor()
        
        # ---------- WORKOUT ----------
        print('Dropping previous workout table entries for current user')
        sql = """DELETE FROM workout WHERE user_id = %s"""
        cur.execute(sql, (userid,))
        conn.commit()

        sql = """INSERT INTO workout(user_id, workoutActivityType, duration, durationUnit, totalDistance, totalDistanceUnit, totalEnergyBurned, 
        totalEnergyBurnedUnit, sourceName, sourceVersion, creationDate, startDate, endDate, MetadataEntry, device, WorkoutEvent) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

        print('Uploading workout data...')
        for index, row in health_data_workout.iterrows():
            cur.execute(sql, (userid, str(row['@workoutActivityType']), str(row['@duration']), str(row['@durationUnit']), str(row['@totalDistance']), str(row['@totalDistanceUnit']), str(row['@totalEnergyBurned']), str(row['@totalEnergyBurnedUnit']), str(row['@sourceName']), str(row['@sourceVersion']), str(row['@creationDate']), str(row['@startDate']), str(row['@endDate']), str(row['MetadataEntry']), str(row['@device']), str(row['WorkoutEvent']),))
        
        # commit the changes to the database
        conn.commit()
        print('upload complete')

        # ---------- ACTIVITY ----------
        print('Dropping previous activity table entries for current user')
        sql = """DELETE FROM activity WHERE user_id = %s"""
        cur.execute(sql, (userid,))
        conn.commit()

        sql = """INSERT INTO activity(user_id, dateComponents, activeEnergyBurned, activeEnergyBurnedGoal, activeEnergyBurnedUnit, 
        appleExerciseTime, appleExerciseTimeGoal, appleStandHours, appleStandHoursGoal) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)"""

        print('Uploading activity data...')
        for index, row in health_data_activity.iterrows():
            cur.execute(sql, (userid, str(row['@dateComponents']), str(row['@activeEnergyBurned']), str(row['@activeEnergyBurnedGoal']), str(row['@activeEnergyBurnedUnit']), str(row['@appleExerciseTime']), str(row['@appleExerciseTimeGoal']), str(row['@appleStandHours']), str(row['@appleStandHoursGoal']),))
        
        # commit the changes to the database
        conn.commit()
        print('upload complete')

        # ---------- RECORD ----------
        print('Dropping previous record table entries for current user')
        sql = """DELETE FROM record WHERE user_id = %s"""
        cur.execute(sql, (userid,))
        conn.commit()

        sql = """INSERT INTO record(user_id, type, unit, creationDate, startDate, endDate, value) VALUES(%s, %s, %s, %s, %s, %s, %s)"""

        print('Uploading record data...')
        for index, row in health_data_record.iterrows():
            cur.execute(sql, (userid, str(row['@type']), str(row['@unit']), str(row['@creationDate']), str(row['@startDate']), str(row['@endDate']), str(row['@value']),))
        
        # commit the changes to the database
        conn.commit()
        print('upload complete')

        # close communication with the database
        cur.close()

        result = {'dataStorageComplete': True}
        return make_response(jsonify(result), 200)
    except (Exception, psycopg2.DatabaseError) as error:
        response = { 'status': 'error', 'message': 'Internal Server Error', 'error': error, 'dataStorageComplete': False}
        return make_response(jsonify(response), 500)

@app.route("/api/v1/pull_data", methods=['POST'])
def get_data():
    try:
        username = request.json["username"]
        password = request.json["password"]

        conn = psycopg2.connect(database=url.path[1:], 
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port
        )
        # create a new cursor
        cur = conn.cursor()

        print("fetching user_id for existing user...")
        sql = """SELECT user_id FROM users WHERE username = %s AND password = %s"""
        cur.execute(sql, (username,password,))
        try:
            userid = cur.fetchone()[0]
        except (Exception, TypeError) as error:
            print('User does not exist')
            result = {'dataFetched': False}
            return make_response(jsonify(result), 200)
 
        # ---------- WORKOUT ----------
        print('Fetching workout table data')
        sql = """SELECT * FROM workout WHERE user_id = %s"""
        cur.execute(sql, (userid,))
        workoutData = cur.fetchall()
        print(f'workout data fecthed\nRows: {len(workoutData)}')

        # ---------- ACTIVITY ----------
        print('Fetching workout table data')
        sql = """SELECT * FROM activity WHERE user_id = %s"""
        cur.execute(sql, (userid,))
        activityData = cur.fetchall()
        print(f'activity data fecthed\nRows: {len(activityData)}')

        # ---------- RECORD ----------
        print('Fetching workout table data')
        sql = """SELECT * FROM record WHERE user_id = %s"""
        cur.execute(sql, (userid,))
        recordData = cur.fetchall()
        print(f'record data fecthed\nRows: {len(recordData)}')

        # close communication with the database
        cur.close()

        result = {'dataFetched': True}
        return make_response(jsonify(result), 200)
    except (Exception, psycopg2.DatabaseError) as error:
        response = { 'status': 'error', 'message': 'Internal Server Error', 'error': error, 'dataFetched': False }
        return make_response(jsonify(response), 500)

if __name__ == "__main__":
    app.run(port=5001, host="0.0.0.0")
