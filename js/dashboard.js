// update filters based on data
function updateFilters(data, minDate, maxDate, type, workoutDates=null, sleepAnalysisDates=null, audioExposureDates=null){
  var parseFilterDate = d3.timeParse('%m-%d-%Y');
  var formatWorkoutDate = d3.timeFormat('%Y-%m-%d');
  var workoutDateConfig;

  // update Month list
  month = {1:'January', 2:'February', 3:'March', 4:'April', 5:'May',
            6:'June', 7:'July', 8:'August', 9:'September', 10:'October',
            11:'November', 12:'December'}
  minMonth = parseInt(minDate.substring(0,2))
  maxMonth = parseInt(maxDate.substring(0,2))
  var monthOptions = '<option value="" selected>Month</option>'
  for (i=minMonth; i<=maxMonth; i++) {
    monthOptions += '<option value="' + i + '">' + month[i] + '</option>'
  }

  if (type == 'activity'){
    document.getElementById("selectedMonthActivity").innerHTML = monthOptions;
    // update Year list
    minYear = parseInt(minDate.substring(6,10))
    maxYear = parseInt(maxDate.substring(6,10))
    var yearOptions = '<option value="" selected>Year</option>'
    for (i=minYear; i<=maxYear; i++) {
      yearOptions += '<option value="' + i + '">' + i + '</option>'
    }
    document.getElementById("selectedYearActivity").innerHTML = yearOptions;
    // calendar config
    dateConfig = {
      defaultDate: minDate,
      dateFormat: 'm-d-Y',
      minDate: minDate,
      maxDate: maxDate,
      // callback function to load data for on date selected
      onChange:
      function(selectedDates, dateStr, instance) {
          $('#selectedMonthActivity').val(instance.currentMonth+1);
          $('#selectedYearActivity').val(instance.currentYear);
          updateGauges(data, dateStr);
          updateSummaryGraphs(data, dateStr, minDate, maxDate);
          flatpickr('#selectedDateHeart', dateConfig).setDate(new Date(parseFilterDate(dateStr)), true, 'm-d-Y');
          // flatpickr('#selectedDateWorkout', dateConfig).setDate(new Date(parseFilterDate(dateStr)), true, 'm-d-Y');
        }
      }
      var selectedDate = flatpickr('#selectedDateActivity', dateConfig);
  }
  if (type == 'record') {
    document.getElementById("selectedMonthHeart").innerHTML = monthOptions;
    // update Year list
    minYear = parseInt(minDate.substring(6,10))
    maxYear = parseInt(maxDate.substring(6,10))
    var yearOptions = '<option value="" selected>Year</option>'
    for (i=minYear; i<=maxYear; i++) {
      yearOptions += '<option value="' + i + '">' + i + '</option>'
    }
    document.getElementById("selectedYearHeart").innerHTML = yearOptions;
    // calendar config
    dateConfig = {
      defaultDate: minDate,
      dateFormat: 'm-d-Y',
      minDate: minDate,
      maxDate: maxDate,
      // callback function to load data for on date selected
      onChange:
      function(selectedDates, dateStr, instance) {
          $('#selectedMonthHeart').val(instance.currentMonth+1);
          $('#selectedYearHeart').val(instance.currentYear);
          updateHeartGraph(data, dateStr, minDate, maxDate);
        },
      onValueUpdate:
      function(selectedDates, dateStr, instance) {
          $('#selectedMonthHeart').val(instance.currentMonth+1);
          $('#selectedYearHeart').val(instance.currentYear);
          if(instance == this.selectedDate)
            updateHeartGraph(data, dateStr, minDate, maxDate);
        }
      }
      var selectedDate = flatpickr('#selectedDateHeart', dateConfig);
  }
  if (type == 'workout') {
    // update enabled date format
    workoutDates.forEach(function(d, i) {
      // this[i] = formatWorkoutDate(parseFilterDate(d));
      this[i] = new Date(parseFilterDate(d))
    },workoutDates);
    // calendar config
    workoutDateConfig = {
      defaultDate: workoutDates[workoutDates.length - 1],
      dateFormat: 'm-d-Y',
      minDate: minDate,
      maxDate: maxDate,
      enable: workoutDates,
      // callback function to load data for on date selected
      onChange:
      function(selectedDates, dateStr, instance) {
          updateWorkoutData(data, dateStr);
        }
      }
      var selectedDate = flatpickr('#selectedDateWorkout', workoutDateConfig);
  }
  if (type == 'sleep') {
    // update enabled date format
    sleepAnalysisDates.forEach(function(d, i) {
      // this[i] = formatWorkoutDate(parseFilterDate(d));
      this[i] = new Date(parseFilterDate(d))
    },sleepAnalysisDates);
    // calendar config
    sleepDateConfig = {
      defaultDate: sleepAnalysisDates[sleepAnalysisDates.length - 1],
      dateFormat: 'm-d-Y',
      minDate: minDate,
      maxDate: maxDate,
      enable: sleepAnalysisDates,
      // callback function to load data for on date selected
      onChange:
      function(selectedDates, dateStr, instance) {
          updateSleepData(data, dateStr);
        }
      }
      var selectedDate = flatpickr('#selectedDateSleep', sleepDateConfig);
  }
  if (type == 'audio') {
    // update enabled date format
    audioExposureDates.forEach(function(d, i) {
      // this[i] = formatWorkoutDate(parseFilterDate(d));
      this[i] = new Date(parseFilterDate(d))
    },audioExposureDates);
    // calendar config
    audioDateConfig = {
      defaultDate: audioExposureDates[audioExposureDates.length - 1],
      dateFormat: 'm-d-Y',
      minDate: minDate,
      maxDate: maxDate,
      enable: audioExposureDates,
      // callback function to load data for on date selected
      onChange:
      function(selectedDates, dateStr, instance) {
          updateAudioData(data, dateStr);
        }
      }
      var selectedDate = flatpickr('#selectedDateAudio', audioDateConfig);
  }
}

/* ---------------- SUMMARY ------------------------------ */
// Update gauge values with mean for day, month or year
function updateGauges(data, timeFilter) {

  // date
  if (timeFilter.length == 10) {
    var summary = {
     activeEnergyBurned: d3.mean(data, function(d) {
       if (d['@dateComponents'] == timeFilter)
         return d['@activeEnergyBurned'];
     }),
     activeEnergyBurnedGoal: d3.mean(data, function(d) {
       if (d['@dateComponents'] == timeFilter)
         return d['@activeEnergyBurnedGoal'];
     }),
     appleExerciseTime: d3.mean(data, function(d) {
       if (d['@dateComponents'] == timeFilter)
         return d['@appleExerciseTime'];
     }),
     appleExerciseGoal: d3.mean(data, function(d) {
       if (d['@dateComponents'] == timeFilter)
         return d['@appleExerciseTimeGoal'];
     }),
     appleStandHours: d3.mean(data, function(d) {
       if (d['@dateComponents'] == timeFilter)
         return d['@appleStandHours'];
     }),
     appleStandHoursGoal: d3.mean(data, function(d) {
       if (d['@dateComponents'] == timeFilter)
         return d['@appleStandHoursGoal'];
     })
   }
   setActivityGauge(summary)
  }
  // month
  if (timeFilter >= 1 && timeFilter<= 12) {
    var summary = {
     activeEnergyBurned: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(0,2)) == timeFilter)
         return d['@activeEnergyBurned'];
     }),
     activeEnergyBurnedGoal: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(0,2)) == timeFilter)
         return d['@activeEnergyBurnedGoal'];
     }),
     appleExerciseTime: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(0,2)) == timeFilter)
         return d['@appleExerciseTime'];
     }),
     appleExerciseGoal: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(0,2)) == timeFilter)
         return d['@appleExerciseTimeGoal'];
     }),
     appleStandHours: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(0,2)) == timeFilter)
         return d['@appleStandHours'];
     }),
     appleStandHoursGoal: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(0,2)) == timeFilter)
         return d['@appleStandHoursGoal'];
     }),
   }
   setActivityGauge(summary)
  }
  // year
  if (timeFilter > 12) {
    var summary = {
     activeEnergyBurned: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(6,10)) == timeFilter)
         return d['@activeEnergyBurned'];
     }),
     activeEnergyBurnedGoal: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(6,10)) == timeFilter)
         return d['@activeEnergyBurnedGoal'];
     }),
     appleExerciseTime: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(6,10)) == timeFilter)
         return d['@appleExerciseTime'];
     }),
     appleExerciseGoal: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(6,10)) == timeFilter)
         return d['@appleExerciseTimeGoal'];
     }),
     appleStandHours: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(6,10)) == timeFilter)
         return d['@appleStandHours'];
     }),
     appleStandHoursGoal: d3.mean(data, function(d) {
       if (parseInt(d['@dateComponents'].substring(6,10)) == timeFilter)
         return d['@appleStandHoursGoal'];
     }),
   }
   setActivityGauge(summary)
  }
}
// Update graph plot with mean for day, month or year
function updateSummaryGraphs(data, timeFilter, minDate, maxDate){
  var graphMove = document.getElementById('graphMove');
  var graphExercise = document.getElementById('graphExercise');
  var graphStand = document.getElementById('graphStand');
  setActivityGraph(graphMove, data, timeFilter, minDate, maxDate)
  setActivityGraph(graphExercise, data, timeFilter, minDate, maxDate)
  setActivityGraph(graphStand, data, timeFilter, minDate, maxDate)
}

/* ---------------- HEART MONITOR ------------------------------ */
// Update heart monitor graph
function updateHeartGraph(data, timeFilter, minDate, maxDate){
  if (timeFilter){
    // remove old canvas
    $("#graphHeart").remove();
    $(".heartMonitorGraph").append('<canvas id="graphHeart"></canvas>');
    // set canvas for heart monitor graph
    var graphHeart = document.getElementById('graphHeart');
    graphHeart.width = $(".heartMonitorGraph").outerWidth();
    graphHeart.height = $(".heartMonitorGraph").outerHeight()*0.8;
    graphHeart.style.width = $(".heartMonitorGraph").outerWidth();
    graphHeart.style.height = $(".heartMonitorGraph").outerHeight()*0.8;
    setHeartMonitorGraph(graphHeart, data, timeFilter, minDate, maxDate);
  }
}

/* ---------------- WORKOUT ------------------------------ */
// Update workout data
function updateWorkoutData(data, timeFilter) {
  // set only data for chosen date
  var workouts = [];
  if(timeFilter) {
    data.forEach(function(d) {
      if (d['@creationDate'] == timeFilter)
        workouts.push(d)
    });
    setWorkoutTable(workouts)
  }
}

/* ---------------- SLEEP ANALYSIS ------------------------------ */
// Update sleep data
function updateSleepData(data, timeFilter) {
  // set only data for chosen date
  var sleepRecords = [];
  if(timeFilter) {
    data.forEach(function(d) {
      if (d['@creationDate'] == timeFilter)
        sleepRecords.push(d)
    });
    setSleepData(sleepRecords)
  }
}

/* ---------------- AUDIO EXPOSURE ------------------------------ */
// Update audio data
function updateAudioData(data, timeFilter) {
  // set only data for chosen date
  var audioRecords = [];
  if(timeFilter) {
    data.forEach(function(d) {
      if (d['@creationDate'] == timeFilter)
        audioRecords.push(d)
    });
    setAudioData(audioRecords)
  }
}
