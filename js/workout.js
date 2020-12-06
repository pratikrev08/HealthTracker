function setWorkoutTable(data) {

  var workouts= ''
  // get unique workoutTypes
  var workoutType = d3.set(data, function(d) { return d['@workoutActivityType']; }).values();
  workoutType.forEach(function(t) {
    var source, durationUnit, totalDistanceUnit, totalEnergyBurnedUnit;
    var duration = 0;
    var totalDistance = 0;
    var totalEnergyBurned = 0;
    data.forEach(function(d){
      if(t == d['@workoutActivityType']){
        source = d['@sourceName'];
        durationUnit = d['@durationUnit'];
        totalDistanceUnit = d['@totalDistanceUnit'];
        totalEnergyBurnedUnit = d['@totalEnergyBurnedUnit'];
        duration += d['@duration'];
        totalDistance += d['@totalDistance'];
        totalEnergyBurned += d['@totalEnergyBurned'];
      }
    });
    t = t.replace(/^HKWorkoutActivityType/, '').toUpperCase();
    // add row to workout table
    workoutRow = '<div style="display:flex;width=100%;margin:0 1%"><div style="width: 5%;min-width: 25px;margin: 2.5% 2%;font-family: Montserrat, sans-serif;font-weight: 300;text-align: center;transform: rotate(-180deg);writing-mode: vertical-rl;">' + t +  '</div><div style="width: 5%;min-width: 100px;margin: 2.5% 2%"><p style="font-family: Roboto Mono, monospace;font-weight: 400;font-size: 0.6rem;margin-top: 2.5%">Source</p><p style="margin-top: 2%">&nbsp&nbsp' + source + '</p></div><div style="width: 80%;min-width:380px;text-align:center;display:flex;margin: 2.5% 2%"><!-- <div style="display:flex;min-width: 260px;min-width: 350px;text-align:left;"> --><div style="display:block;width:33.33%"><p style="font-family: Roboto Mono, monospace;font-weight: 400;font-size: 0.6rem;margin-top: 2.5%">Duration</p><p style="font-size:1.5rem;font-weight: 400;margin-top: 2%;color:#99CE58">&nbsp&nbsp' + duration.toFixed(1).toString() + '&nbsp' + durationUnit + '</p></div><div style="display:block;width:33.33%"><p style="font-family: Roboto Mono, monospace;font-weight: 400;font-size: 0.6rem;margin-top: 2.5%">Total Distance</p><p style="font-size:1.5rem;margin-top: 2%;font-weight: 400;color: #178BCA;">&nbsp&nbsp' + totalDistance.toFixed(1).toString() + '&nbsp' + totalDistanceUnit + '</p></div><div style="display:block;width:33.33%"><p style="font-family: Roboto Mono, monospace;font-weight: 400;font-size: 0.6rem;margin-top: 2.5%">Total Energy Burned</p><p style="font-size:1.5rem;margin-top: 2%;font-weight: 400;color: #FF7777;">&nbsp&nbsp' + totalEnergyBurned.toFixed(1).toString() + '&nbsp' + totalEnergyBurnedUnit + '</p></div></div></div>';
    workouts += '<tr><td>' + workoutRow + '</td></tr>';
  });
  // add padding if single row
  if(workoutType.length == 1)
    workouts = '<tr><td></br></br></br></br></td></tr>' + workouts;
  else
    workouts = '<tr><td></br></br></td></tr>' + workouts;
  document.getElementById('workoutTable').innerHTML = workouts;

}

// workoutRow = '<div style="display:flex;width=100%;margin:0 1%"><div style="width: 10%;min-width: 35px;margin: 2.5% 2%;font-family: Montserrat, sans-serif;font-weight: 300;text-align: center;transform: rotate(-180deg);writing-mode: vertical-rl;">' + t +  '</div><div style="width=20%;text-align:center;display:flex"><div style="min-width: 260px;min-width: 350px;text-align:left;"><div style="display:flex"><p style="width:40%;font-family: Roboto Mono, monospace;font-weight: 400;font-size: 0.6rem;margin-top: 2.5%">Source: </p><p style="width:60%;text-align: left;font-size:0.9rem;margin-top: 2%">&nbsp&nbsp' + source + '</p></div><div style="display:flex"><p style="width:40%;font-family: Roboto Mono, monospace;font-weight: 400;font-size: 0.6rem;margin-top: 2.5%">Duration: </p><p style="width:60%;text-align: left;font-size:0.9rem;margin-top: 2%">&nbsp&nbsp' + duration.toFixed(1).toString() + '&nbsp' + durationUnit + '</p></div><div style="display:flex"><p style="width:40%;font-family: Roboto Mono, monospace;font-weight: 400;font-size: 0.6rem;margin-top: 2.5%">Total Distance: </p><p style="width:60%;text-align: left;font-size:0.9rem;margin-top: 2%">&nbsp&nbsp' + totalDistance.toFixed(1).toString() + '&nbsp' + totalDistanceUnit + '</p></div><div style="display:flex"><p style="width:40%;font-family: Roboto Mono, monospace;font-weight: 400;font-size: 0.6rem;margin-top: 2.5%">Total Energy Burned: </p><p style="width:60%;text-align: left;font-size:0.9rem;margin-top: 2%">&nbsp&nbsp' + totalEnergyBurned.toFixed(1).toString() + '&nbsp' + totalEnergyBurnedUnit + '</p></div></div></div><div style="width=60%;text-align:center">Radar Chart</div></div>'
