function setHeartMonitorGraph(graphHeart, data, timeFilter, minDate, maxDate){
  // valid timeFilter
  if (timeFilter.length == 10 || timeFilter >= 1 && timeFilter<= 12 || timeFilter > 12) {
    var xValues = [], yValues = [];
    var colors = [];
    var outFocusColor = '#FFCCCC';
    var inFocusColor = '#FF7777';
    var parseDateFilter = d3.timeParse('%m-%d-%Y');
    var formatTimeFilter = d3.timeFormat('%m-%d-%Y');
    var parseMonthFilter = d3.timeParse('%B');
    var formatMonthFilter = d3.timeFormat('%m');
    var formatDateDayFilter = d3.timeFormat('%d %a');
    var graph;
    var heartImg = document.createElement('img');
    heartImg.src = 'js/heart.png';

    // fill metrics
    var avgHeartRate = document.getElementById('avgHeartRate');
    var heartRateRange = document.getElementById('heartRateRange');
    heartRateRange.innerHTML = '';

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
      // yValues - Heart Rate
      for (i = 0; i < xValues.length; i++) {
        yValues.push(d3.mean(data, function(d) {
            if (d['@creationDate'] == xValues[i] && d['@type'] == 'HKQuantityTypeIdentifierHeartRate') {
                return d['@value'];
              }
          }));
      }
      var plotlyFormat = d3.timeFormat('%Y-%m-%d');
      for (i=0;i<yValues.length;i++){
        if (yValues[i] == null) {yValues[i] = 0;}
        else{
          yValues[i] = parseFloat(yValues[i].toFixed(2));
        }
        xValues[i] = formatDateDayFilter(parseDateFilter(xValues[i]));
      }
      for (i=0; i<xValues.length; i++){
        if (xValues[i] == formatDateDayFilter(parseDateFilter(timeFilter))) {
          colors.push(inFocusColor);
          avgHeartRate.innerHTML = 'Average Heart Rate:&nbsp&nbsp&nbsp<b>' + yValues[i].toFixed(1) + '</b>&nbspbpm';
        }
        else {
          colors.push(outFocusColor);
        }
      }
      if (yValues.length > 1)
        heartRateRange.innerHTML = 'Range:&nbsp&nbsp&nbsp<b>' + d3.min(yValues).toFixed(1) + ' - ' + d3.max(yValues).toFixed(1) + '</b>&nbspbpm';
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
          if (d['@creationDate'].substring(0,2) == formatMonthFilter(parseMonthFilter(xValues[i]))
          && d['@type'] == 'HKQuantityTypeIdentifierHeartRate')
            return d['@value'];
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
          avgHeartRate.innerHTML = 'Average Heart Rate:&nbsp&nbsp&nbsp<b>' + yValues[i].toFixed(1) + '</b>&nbspbpm';
        }
        else {
          colors.push(outFocusColor);
        }
      }
      if (yValues.length > 1)
        heartRateRange.innerHTML = 'Range:&nbsp&nbsp&nbsp<b>' + d3.min(yValues).toFixed(1) + ' - ' + d3.max(yValues).toFixed(1) + '</b>&nbspbpm';
        // heartRateRange.innerHTML = 'Range:&nbsp&nbsp&nbsp<b>' + yValues[0].toFixed(1) + ' - ' + yValues[yValues.length-1].toFixed(1) + '</b>&nbspbpm';
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
          if (parseInt(d['@creationDate'].substring(6,10)) == timeFilter
          && d['@type'] == 'HKQuantityTypeIdentifierHeartRate')
            return d['@value'];
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
          avgHeartRate.innerHTML = 'Average Heart Rate:&nbsp&nbsp&nbsp<b>' + yValues[i].toFixed(1) + '</b>&nbspbpm';
        }
        else {
          colors.push(outFocusColor);
        }
      }
      if (yValues.length > 1)
        heartRateRange.innerHTML = 'Range:&nbsp&nbsp&nbsp<b>' + d3.min(yValues).toFixed(1) + ' - ' + d3.max(yValues).toFixed(1) + '</b>&nbspbpm';
        // heartRateRange.innerHTML = 'Range:&nbsp&nbsp&nbsp<b>' + yValues[0].toFixed(1) + ' - ' + yValues[yValues.length-1].toFixed(1) + '</b>&nbspbpm';
    }

    // plot graphHeart
    config = {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [{
            data: yValues,
            label: '',
            backgroundColor: colors,
            pointRadius: 8,
            borderWidth: 2,
            borderColor: colors,
            hoverRadius: 10,
            hoverBorderWidth: 2,
            pointStyle: 'rectRounded',
            fill: true,
            showLine: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Average Heart Rate',
          fontFamily: "'Roboto Mono', monospace",
          fontSize: 10,
          fontColor: 'black',
          fontStyle: 400
        },
        scales: {
          xAxes: [{
            gridLines: {
  						display: true
  					},
            ticks: {
              fontColor: '#565A5C',
              fontFamily: '"Montserrat", sans-serif',
              fontSize: 12,
              fontStyle: 100
            }
          }],
          yAxes: [{
            gridLines: {
  						display: false
  					},
            ticks: {
              display: false
            }
          }]
        },
        legend: {
          display: false,
        },
        tooltips: {
          backgroundColor: '#FFFFFF',
          borderColor: '#565A5C',
          borderWidth: 1,
          caretSize: 4,
          caretPadding: 6,
          cornerRadius: 4,
          displayColors: false,
          bodyFontColor: '#565A5C',
          bodyFontFamily: '"Montserrat", sans-serif',
          bodyAlign: 'center',
          callbacks: {
             label: function(tooltipItem) {
                    return tooltipItem.yLabel;
             },
             title: function(tooltipItem) {
                    return
             }
          }
          }
        }
      }
    graph = new Chart(graphHeart, config);
  }
}
