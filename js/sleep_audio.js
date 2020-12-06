// set data for Sleep Analysis
function setSleepData(data) {
  var hours = Math.floor(data[0]['@value']/60);
  var minutes = Math.floor(data[0]['@value']%60);
  document.getElementById('sleepInBed').innerHTML = hours.toString() + '&nbsphr&nbsp&nbsp' + minutes.toString() + '&nbspmin';
}

//set data for Audio Exposure
function setAudioData(data) {
  var volume = d3.mean(data, function(d) {
    if (d['@type'] == 'HKQuantityTypeIdentifierHeadphoneAudioExposure')
      return d['@value'];
  }).toFixed(1);
  document.getElementById('avgAudioExposure').innerHTML = volume.toString() + '&nbspdbA';
}
