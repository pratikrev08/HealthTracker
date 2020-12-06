function setActivityGauge(summary) {
  // Move
  var moveGaugeConfig = activityGaugeDefaultSettings();
  moveGaugeConfig.maxValue = summary.activeEnergyBurnedGoal;
  moveGaugeConfig.circleColor = "#FF7777";
  moveGaugeConfig.waveColor = "#FF7777";
  // moveGaugeConfig.textColor = "#FF4444";
  moveGaugeConfig.textColor = "#000000";
  // moveGaugeConfig.waveTextColor = "#F3F5F7";
  moveGaugeConfig.waveTextColor = "#000000";
  moveGaugeConfig.displayPercent = false;
  activityGauge("gaugeMove", summary.activeEnergyBurned, moveGaugeConfig);

  // Exercise
  var exerciseGaugeConfig = activityGaugeDefaultSettings();
  exerciseGaugeConfig.maxValue = summary.appleExerciseGoal;
  // exerciseGaugeConfig.waveTextColor = "#F3F5F7";
  exerciseGaugeConfig.textColor = "#000000";
  exerciseGaugeConfig.waveTextColor = "#000000";
  exerciseGaugeConfig.displayPercent = false;
  activityGauge("gaugeExercise", summary.appleExerciseTime, exerciseGaugeConfig);

  // Stand
  var standGaugeConfig = activityGaugeDefaultSettings();
  standGaugeConfig.maxValue = summary.appleStandHoursGoal;
  standGaugeConfig.circleColor = "#99CE58";
  standGaugeConfig.waveColor = "#99CE58";
  // standGaugeConfig.textColor = "#99CA58";
  // standGaugeConfig.waveTextColor = "#F3F5F7";
  standGaugeConfig.textColor = "#000000";
  standGaugeConfig.waveTextColor = "#000000";
  standGaugeConfig.displayPercent = false;
  activityGauge("gaugeStand", summary.appleStandHours, standGaugeConfig);
}

function setActivityGraph(graphElement, data, timeFilter, minDate, maxDate) {

  if (timeFilter.length == 10 || timeFilter >= 1 && timeFilter<= 12 || timeFilter > 12) {
    // MOVE
    if (graphElement.parentNode.parentElement.className == 'moveSummary') {
      plotMoveGraph(data, timeFilter, minDate, maxDate);
    }
    // EXERCISE
    if (graphElement.parentNode.parentElement.className == 'exerciseSummary') {
      plotExerciseGraph(data, timeFilter, minDate, maxDate);
    }
    // STAND
    if (graphElement.parentNode.parentElement.className == 'standSummary') {
      plotStandGraph(data, timeFilter, minDate, maxDate);
    }
  }
}

// plot graphs in Summary
function plotMoveGraph(data, timeFilter, minDate, maxDate) {

  var xValues = [], yValues = [];
  var colors = [];
  var outFocusColor = '#FFCCCC';
  var inFocusColor = '#FF7777';
  var tickFormat = '%d %a';
  var parseDateFilter = d3.timeParse('%m-%d-%Y');
  var formatTimeFilter = d3.timeFormat('%m-%d-%Y');
  var parseMonthFilter = d3.timeParse('%B');
  var formatMonthFilter = d3.timeFormat('%m');
  var plotlyFormat = d3.timeFormat('%Y-%m-%d');

  // date
  if (timeFilter.length == 10) {
    date = parseDateFilter(timeFilter);
    startDate = d3.timeDay.offset(date, -3);
    endDate = d3.timeDay.offset(date, 3);
    // xValues
    var currentDate = startDate;
    while (currentDate <= endDate) {
      // conditon for edge dates
      if (currentDate >= parseDateFilter(minDate) && currentDate <= parseDateFilter(maxDate))
        xValues.push(formatTimeFilter(currentDate));
      currentDate = d3.timeDay.offset(currentDate, 1);
    }
    // yValues
    for (i = 0; i < xValues.length; i++) {
      yValues.push(d3.mean(data, function(d) {
          if (d['@dateComponents'] == xValues[i]) {
              return d['@activeEnergyBurned'];
            }
        }));
    }
    var plotlyFormat = d3.timeFormat('%Y-%m-%d');
    for (i=0;i<yValues.length;i++){
      if (yValues[i] == null) {yValues[i] = 0;}
      else{
        yValues[i] = parseFloat(yValues[i].toFixed(2));
      }
      xValues[i] = plotlyFormat(parseDateFilter(xValues[i]));
    }
    for (i=0; i<xValues.length; i++){
      if (xValues[i] == plotlyFormat(parseDateFilter(timeFilter))) {
        colors.push(inFocusColor);
      }
      else {
        colors.push(outFocusColor);
      }
    }
  }

  // month
  if (timeFilter >= 1 && timeFilter<= 12) {
    month = {1:'January', 2:'February', 3:'March', 4:'April', 5:'May',
              6:'June', 7:'July', 8:'August', 9:'September', 10:'October',
              11:'November', 12:'December'}
    minMonth = parseInt(minDate.substring(0,2))
    maxMonth = parseInt(maxDate.substring(0,2))
    // xValues
    for (i=minMonth; i<=maxMonth; i++) {
      xValues.push(month[i]);
    }
    // yValues
    for (i = 0; i < xValues.length; i++) {
      yValues.push(d3.mean(data, function(d) {
        if (d['@dateComponents'].substring(0,2) == formatMonthFilter(parseMonthFilter(xValues[i])))
          return d['@activeEnergyBurned'];
        }));
    }
    for (i=0;i<yValues.length;i++){
      if (yValues[i] == null) {yValues[i] = 0;}
      else{
        yValues[i] = parseFloat(yValues[i].toFixed(2));
      }
    }
    for (i=0; i<xValues.length; i++){
      if (xValues[i] == month[timeFilter]) {
        colors.push(inFocusColor);
      }
      else {
        colors.push(outFocusColor);
      }
    }
  }

  // year
  if (timeFilter > 12) {
    minYear = parseInt(minDate.substring(6,10))
    maxYear = parseInt(maxDate.substring(6,10))
    // xValues
    for (i=minYear; i<=maxYear; i++) {
      xValues.push(i);
    }
    // yValues
    for (i = 0; i < xValues.length; i++) {
      yValues.push(d3.mean(data, function(d) {
        if (parseInt(d['@dateComponents'].substring(6,10)) == timeFilter)
          return d['@activeEnergyBurned'];
        }));
    }
    for (i=0;i<yValues.length;i++){
      if (yValues[i] == null) {yValues[i] = 0;}
      else{
        yValues[i] = parseFloat(yValues[i].toFixed(2));
      }
    }
    for (i=0; i<xValues.length; i++){
      if (xValues[i] == timeFilter) {
        colors.push(inFocusColor);
      }
      else {
        colors.push(outFocusColor);
      }
    }
    tickFormat = 'f';
  }

  var trace = {
    x: xValues,
    y: yValues,
    name: 'Active Energy Burned',
    type: 'scatter',
    line: {
      shape: 'spline',
      color: 'rgba(255, 68, 68, 0.5)'
    },
    marker: {
      color: colors,
      size: 10,
      line: {
        color: 'rgba(255, 68, 68, 0.5)',
        width: 1
      }
    },
    hoverinfo: 'y'
  };
  var layout = {
    plot_bgcolor:"#F3F5F7",
    paper_bgcolor:"#F3F5F7",
    xaxis: {
      showgrid: true,
      tickfont: {
        family: 'Montserrat, sans-serif',
        size: 9,
        color: '#565A5C'
      },
      tickmode: "linear",
      nticks: xValues.length,
      tickformat: tickFormat
    },
    yaxis: {
      showgrid: false,
    },
    margin: {'l': 0, 'r': 0, 't': 0, 'b': 20},
    hoverlabel: { bgcolor: "#F3F5F7"}
  }
  var config = {
    modeBarButtonsToRemove: ['toImage', 'zoom2d', 'pan2d', 'select2d', 'lasso2d',
    'zoomIn2d', 'zoomOut2d', 'toggleSpikelines', 'hoverClosestCartesian',
    'hoverCompareCartesian', 'autoScale2d', 'resetScale2d'],
    displaylogo: false
  }

  var data = [trace];
  Plotly.newPlot('graphMove', data, layout, config);

}
function plotExerciseGraph(data, timeFilter, minDate, maxDate) {

  var xValues = [], yValues = [];
  var colors = [];
  var outFocusColor = '#B3CCD9';
  var inFocusColor = '#178BCA';
  var tickFormat = '%d %a';
  var parseDateFilter = d3.timeParse('%m-%d-%Y');
  var formatTimeFilter = d3.timeFormat('%m-%d-%Y');
  var parseMonthFilter = d3.timeParse('%B');
  var formatMonthFilter = d3.timeFormat('%m');
  var plotlyFormat = d3.timeFormat('%Y-%m-%d');

  // date
  if (timeFilter.length == 10) {
    date = parseDateFilter(timeFilter);
    startDate = d3.timeDay.offset(date, -3);
    endDate = d3.timeDay.offset(date, 3);
    // xValues
    var currentDate = startDate;
    while (currentDate <= endDate) {
      // conditon for edge dates
      if (currentDate >= parseDateFilter(minDate) && currentDate <= parseDateFilter(maxDate))
        xValues.push(formatTimeFilter(currentDate));
      currentDate = d3.timeDay.offset(currentDate, 1);
    }
    // yValues
    for (i = 0; i < xValues.length; i++) {
      yValues.push(d3.mean(data, function(d) {
          if (d['@dateComponents'] == xValues[i]) {
              return d['@appleExerciseTime'];
            }
        }));
    }
    for (i=0;i<yValues.length;i++){
      if (yValues[i] == null) {yValues[i] = 0;}
      else{
        yValues[i] = parseFloat(yValues[i].toFixed(2));
      }
      xValues[i] = plotlyFormat(parseDateFilter(xValues[i]));
    }
    for (i=0; i<xValues.length; i++){
      if (xValues[i] == plotlyFormat(parseDateFilter(timeFilter))) {
        colors.push(inFocusColor);
      }
      else {
        colors.push(outFocusColor);
      }
    }
  }

  // month
  if (timeFilter >= 1 && timeFilter<= 12) {
    month = {1:'January', 2:'February', 3:'March', 4:'April', 5:'May',
              6:'June', 7:'July', 8:'August', 9:'September', 10:'October',
              11:'November', 12:'December'}
    minMonth = parseInt(minDate.substring(0,2))
    maxMonth = parseInt(maxDate.substring(0,2))
    // xValues
    for (i=minMonth; i<=maxMonth; i++) {
      xValues.push(month[i]);
    }
    // yValues
    for (i = 0; i < xValues.length; i++) {
      yValues.push(d3.mean(data, function(d) {
        if (d['@dateComponents'].substring(0,2) == formatMonthFilter(parseMonthFilter(xValues[i])))
          return d['@appleExerciseTime'];
        }));
    }
    for (i=0;i<yValues.length;i++){
      if (yValues[i] == null) {yValues[i] = 0;}
      else{
        yValues[i] = parseFloat(yValues[i].toFixed(2));
      }
    }
    for (i=0; i<xValues.length; i++){
      if (xValues[i] == month[timeFilter]) {
        colors.push(inFocusColor);
      }
      else {
        colors.push(outFocusColor);
      }
    }
  }

  // year
  if (timeFilter > 12) {
    minYear = parseInt(minDate.substring(6,10))
    maxYear = parseInt(maxDate.substring(6,10))
    // xValues
    for (i=minYear; i<=maxYear; i++) {
      xValues.push(i);
    }
    // yValues
    for (i = 0; i < xValues.length; i++) {
      yValues.push(d3.mean(data, function(d) {
        if (parseInt(d['@dateComponents'].substring(6,10)) == timeFilter)
          return d['@appleExerciseTime'];
        }));
    }
    for (i=0;i<yValues.length;i++){
      if (yValues[i] == null) {yValues[i] = 0;}
      else{
        yValues[i] = parseFloat(yValues[i].toFixed(2));
      }
    }
    for (i=0; i<xValues.length; i++){
      if (xValues[i] == timeFilter) {
        colors.push(inFocusColor);
      }
      else {
        colors.push(outFocusColor);
      }
    }
    tickFormat = 'f';
  }

  var trace = {
    x: xValues,
    y: yValues,
    name: 'Exercise Time',
    type: 'scatter',
    line: {
      shape: 'spline',
      color: 'rgba(4, 86, 129, 0.5)'
    },
    marker: {
      color: colors,
      size: 10,
      line: {
        color: 'rgba(4, 86, 129, 0.5)',
        width: 1
      }
    },
    hoverinfo: 'y'
  };
  var layout = {
    plot_bgcolor:"#F3F5F7",
    paper_bgcolor:"#F3F5F7",
    xaxis: {
      showgrid: true,
      tickfont: {
        family: 'Montserrat, sans-serif',
        size: 9,
        color: '#565A5C'
      },
      tickmode: "linear",
      nticks: xValues.length,
      tickformat: tickFormat
    },
    yaxis: {
      showgrid: false,
    },
    margin: {'l': 0, 'r': 0, 't': 0, 'b': 20},
    hoverlabel: { bgcolor: "#F3F5F7"}
  }
  var config = {
    modeBarButtonsToRemove: ['toImage', 'zoom2d', 'pan2d', 'select2d', 'lasso2d',
    'zoomIn2d', 'zoomOut2d', 'toggleSpikelines', 'hoverClosestCartesian',
    'hoverCompareCartesian', 'autoScale2d', 'resetScale2d'],
    displaylogo: false
  }
  var data = [trace];
  Plotly.newPlot('graphExercise', data, layout, config);
}
function plotStandGraph(data, timeFilter, minDate, maxDate) {

  var xValues = [], yValues = [];
  var colors = [];
  var outFocusColor = '#E0EFCC';
  var inFocusColor = '#99CE58';
  var tickFormat = '%d %a';
  var parseDateFilter = d3.timeParse('%m-%d-%Y');
  var formatTimeFilter = d3.timeFormat('%m-%d-%Y');
  var parseMonthFilter = d3.timeParse('%B');
  var formatMonthFilter = d3.timeFormat('%m');
  var plotlyFormat = d3.timeFormat('%Y-%m-%d');

  // date
  if (timeFilter.length == 10) {
    date = parseDateFilter(timeFilter);
    startDate = d3.timeDay.offset(date, -3);
    endDate = d3.timeDay.offset(date, 3);
    // xValues
    var currentDate = startDate;
    while (currentDate <= endDate) {
      // conditon for edge dates
      if (currentDate >= parseDateFilter(minDate) && currentDate <= parseDateFilter(maxDate))
        xValues.push(formatTimeFilter(currentDate));
      currentDate = d3.timeDay.offset(currentDate, 1);
    }
    // yValues
    for (i = 0; i < xValues.length; i++) {
      yValues.push(d3.mean(data, function(d) {
          if (d['@dateComponents'] == xValues[i]) {
              return d['@appleStandHours'];
            }
        }));
    }
    for (i=0;i<yValues.length;i++){
      if (yValues[i] == null) {yValues[i] = 0;}
      else{
        yValues[i] = parseFloat(yValues[i].toFixed(2));
      }
      xValues[i] = plotlyFormat(parseDateFilter(xValues[i]));
    }
    for (i=0; i<xValues.length; i++){
      if (xValues[i] == plotlyFormat(parseDateFilter(timeFilter))) {
        colors.push(inFocusColor);
      }
      else {
        colors.push(outFocusColor);
      }
    }
  }

  // month
  if (timeFilter >= 1 && timeFilter<= 12) {
    month = {1:'January', 2:'February', 3:'March', 4:'April', 5:'May',
              6:'June', 7:'July', 8:'August', 9:'September', 10:'October',
              11:'November', 12:'December'}
    minMonth = parseInt(minDate.substring(0,2))
    maxMonth = parseInt(maxDate.substring(0,2))
    // xValues
    for (i=minMonth; i<=maxMonth; i++) {
      xValues.push(month[i]);
    }
    // yValues
    for (i = 0; i < xValues.length; i++) {
      yValues.push(d3.mean(data, function(d) {
        if (d['@dateComponents'].substring(0,2) == formatMonthFilter(parseMonthFilter(xValues[i])))
          return d['@appleStandHours'];
        }));
    }
    for (i=0;i<yValues.length;i++){
      if (yValues[i] == null) {yValues[i] = 0;}
      else{
        yValues[i] = parseFloat(yValues[i].toFixed(2));
      }
    }
    for (i=0; i<xValues.length; i++){
      if (xValues[i] == month[timeFilter]) {
        colors.push(inFocusColor);
      }
      else {
        colors.push(outFocusColor);
      }
    }
  }

  // year
  if (timeFilter > 12) {
    minYear = parseInt(minDate.substring(6,10))
    maxYear = parseInt(maxDate.substring(6,10))
    // xValues
    for (i=minYear; i<=maxYear; i++) {
      xValues.push(i);
    }
    // yValues
    for (i = 0; i < xValues.length; i++) {
      yValues.push(d3.mean(data, function(d) {
        if (parseInt(d['@dateComponents'].substring(6,10)) == timeFilter)
          return d['@appleStandHours'];
        }));
    }
    for (i=0;i<yValues.length;i++){
      if (yValues[i] == null) {yValues[i] = 0;}
      else{
        yValues[i] = parseFloat(yValues[i].toFixed(2));
      }
    }
    for (i=0; i<xValues.length; i++){
      if (xValues[i] == timeFilter) {
        colors.push(inFocusColor);
      }
      else {
        colors.push(outFocusColor);
      }
    }
    tickFormat = 'f';
  }

  var trace = {
    x: xValues,
    y: yValues,
    name: 'Stand Hours',
    type: 'scatter',
    line: {
      shape: 'spline',
      color: 'rgba(153, 206, 88, 0.5)'
    },
    marker: {
      color: colors,
      size: 10,
      line: {
        color: 'rgba(153, 206, 88, 0.5)',
        width: 1
      }
    },
    hoverinfo: 'y'
  };
  var layout = {
    plot_bgcolor:"#F3F5F7",
    paper_bgcolor:"#F3F5F7",
    xaxis: {
      showgrid: true,
      tickfont: {
        family: 'Montserrat, sans-serif',
        size: 9,
        color: '#565A5C'
      },
      tickmode: "linear",
      nticks: xValues.length,
      tickformat: tickFormat
    },
    yaxis: {
      showgrid: false,
    },
    margin: {'l': 0, 'r': 0, 't': 0, 'b': 20},
    hoverlabel: { bgcolor: "#F3F5F7"}
  }
  var config = {
    modeBarButtonsToRemove: ['toImage', 'zoom2d', 'pan2d', 'select2d', 'lasso2d',
    'zoomIn2d', 'zoomOut2d', 'toggleSpikelines', 'hoverClosestCartesian',
    'hoverCompareCartesian', 'autoScale2d', 'resetScale2d'],
    displaylogo: false
  }
  var data = [trace];
  Plotly.newPlot('graphStand', data, layout, config);
}
