function AddAxes (svg, xAxis, yAxis, margin, chartWidth, chartHeight, yTitle) {

  var axes = svg.append('g');  
  axes.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(xAxis);
    

  axes.append('g')
    .attr('class', 'y axis')
    .call(yAxis);
}

function AddLabels(svg, margin, chartWidth, chartHeight, yTitle) {
  var labels = svg.append('g');
  var select_length = document.getElementById("select-length");  
  var length_text = select_length.options[select_length.selectedIndex].value;
  labels
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)      
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(yTitle);
  labels
      .append('text')
      .attr('y', -6 + chartHeight)
      .text('Location (' + length_text + ')');     


}

function DrawPaths (svg, data, x, y, limits) {
  var line = d3.svg.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); });

  var line0 = [];
  line0.push({x:0, y:0});
  line0.push({x:return_beam_length(), y:0});

  svg.append("path")
      .datum(line0)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", line);

  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", line);

  var area = d3.svg.area()
    .x(function(d) { return x(d.x); })
    .y0(70)
    .y1(function(d) { return y(d.y); });

  // add the area
  svg.append("path")
     .data([data])
     .attr("class", "area")
     .attr("d", area);

  //var maxPointY = d3.max(data, function(d){ return d.y; });
  //var minPointY = d3.min(data, function(d){ return d.y; });
  //var indexes = [];
  //indexes.push(GetAllIndexes(data, maxPointY));
  //indexes.push(GetAllIndexes(data, minPointY));
  /*var maxPointX = data[data.findIndex(function (d) {
    return d.y == maxPointY;
  })].x;
  var minPointX = data[data.findIndex(function (d) {
    return d.y == minPointY;
  })].x;*/

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg.selectAll("circle")
       .data(data)
       .enter().append("circle")
       .style("fill", "transparent")
       .attr("r", 4)
       .attr("cx", function(d) { return x(d.x);})
       .attr("cy", function(d) { return y(d.y);})
       .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.x.toFixed(6) + ", " + d.y.toFixed(6))
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });

  // Add the scatterplot
  svg.selectAll("dot")
       .data(limits)
       .enter().append("circle")
       .style("fill", "red")
       .attr("r", 4)
       .attr("cx", function(d) { return x(d.x);})
       .attr("cy", function(d) { return y(d.y);})
       .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.x.toFixed(6) + ", " + d.y.toFixed(6))
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });

  /*svg.append("text")
        .data(limits)
        .attr("x", function(d) { return x(d.x);})
        .attr("y", function(d) { return x(d.y);})
        .text(function(d) { return d.y})
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "red");*/
}

function GetAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i].y === val)
            indexes.push(i);
    return indexes;
}

function MakeShearChart (daa, title) {
  var data = daa;
  var svgWidth  = document.getElementById("shear-chart").offsetWidth,
      svgHeight = 200,
      margin = { top: 20, right: 75, bottom: 40, left: 75 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var limitMin = d3.min(data, function (d) { return d.y; });
  var limitMax = d3.max(data, function (d) { return d.y; });
  var limits = FindLimitPoints(data, limitMin, limitMax, 5);

  var select_length = document.getElementById("select-length");
  var length_text = select_length.options[select_length.selectedIndex].value;
  var select_force = document.getElementById("select-force");
  var force_text = select_force.options[select_force.selectedIndex].value;
  var shearSummary = limitSummary(limits, "Shear Load", length_text, force_text);

  document.getElementById('shear-limits').innerHTML = shearSummary;
  console.log(limitMax,limitMin);
  var yLimit = Math.max(Math.abs(limitMin), Math.abs(limitMax));

  var x = d3.scale.linear().range([0, chartWidth])
            .domain([0, return_beam_length()]),
            //.domain(d3.extent(data, function (d) { return d.x; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([-1*yLimit, yLimit]);
  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10).tickFormat(d3.format(".2f"))
                .tickValues([limitMin,limitMax]);

  
  var svg = d3.select('#shear-chart').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);

  AddAxes(svg, xAxis, yAxis, margin, chartWidth, chartHeight, title);
  DrawPaths(svg, data, x, y, limits);
  AddLabels(svg, margin, chartWidth, chartHeight, title);
}

function MakeMomentChart (data, title) {
  var svgWidth  = document.getElementById("shear-chart").offsetWidth,
      svgHeight = 200,
      margin = { top: 20, right: 75, bottom: 40, left: 75 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var limitMin = d3.min(data, function (d) { return d.y; });
  var limitMax = d3.max(data, function (d) { return d.y; });
  var limits = FindLimitPoints(data, limitMin, limitMax, 5);

  var select_length = document.getElementById("select-length");
  var length_text = select_length.options[select_length.selectedIndex].value;
  var select_force = document.getElementById("select-force");
  var force_text = select_force.options[select_force.selectedIndex].value;
  var momentSummary = limitSummary(limits, "Moment Load", length_text, force_text + "-" + length_text);

  document.getElementById('moment-limits').innerHTML = momentSummary;

  var yLimit = Math.max(Math.abs(limitMin), Math.abs(limitMax));

  var x = d3.scale.linear().range([0, chartWidth])
            .domain([0, return_beam_length()]),
            //.domain(d3.extent(data, function (d) { return d.x; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([-1*yLimit, yLimit]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10).tickFormat(d3.format(".2f"))
                .tickValues([limitMin,limitMax]);

  var svg = d3.select('#moment-chart').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);

  AddAxes(svg, xAxis, yAxis, margin, chartWidth, chartHeight, title);
  DrawPaths(svg, data, x, y, limits);
  AddLabels(svg, margin, chartWidth, chartHeight, title);
}

function MakeSlopeChart (data, title) {
  var svgWidth  = document.getElementById("slope-chart").offsetWidth,
      svgHeight = 200,
      margin = { top: 20, right: 75, bottom: 40, left: 75 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var limitMin = d3.min(data, function (d) { return d.y; });
  var limitMax = d3.max(data, function (d) { return d.y; });
  var limits = FindLimitPoints(data, limitMin, limitMax, 10);

  var select_length = document.getElementById("select-length");
  var length_text = select_length.options[select_length.selectedIndex].value;


  var slopeSummary = limitSummary(limits, "Slope", length_text, "Deg");

  document.getElementById('slope-limits').innerHTML = slopeSummary;

  var yLimit = Math.max(Math.abs(limitMin), Math.abs(limitMax));

  var x = d3.scale.linear().range([0, chartWidth])
            .domain([0, return_beam_length()]),
            //.domain(d3.extent(data, function (d) { return d.x; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([-1*yLimit, yLimit]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10).tickFormat(d3.format(".2e"))
                .tickValues([limitMin,limitMax]);

  var svg = d3.select('#slope-chart').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);

  AddAxes(svg, xAxis, yAxis, margin, chartWidth, chartHeight, title);
  DrawPaths(svg, data, x, y, limits);
  AddLabels(svg, margin, chartWidth, chartHeight, title);
}

function MakeDeflectionChart (data, title) {
  var svgWidth  = document.getElementById("deflection-chart").offsetWidth,
      svgHeight = 200,
      margin = { top: 20, right: 75, bottom: 40, left: 75 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var limitMin = d3.min(data, function (d) { return d.y; });
  var limitMax = d3.max(data, function (d) { return d.y; });

  var limits = FindLimitPoints(data, limitMin, limitMax, 10);

  var section_length_elements = document.getElementsByClassName("section-length-unit");// Find the elements
  var section_length_text =  section_length_elements[0].innerText;
  var select_length = document.getElementById("select-length");
  var length_text = select_length.options[select_length.selectedIndex].value;

  var deflectionSummary = limitSummary(limits, "Deflection", length_text, section_length_text);

  document.getElementById('deflection-limits').innerHTML = deflectionSummary;

  var yLimit = Math.max(Math.abs(limitMin), Math.abs(limitMax));

  var x = d3.scale.linear().range([0, chartWidth])
            .domain([0, return_beam_length()]),
            //.domain(d3.extent(data, function (d) { return d.x; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([-1*yLimit, yLimit]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10).tickFormat(d3.format(".2e"))
                .tickValues([limitMin,limitMax]);

  var svg = d3.select('#deflection-chart').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);

  AddAxes(svg, xAxis, yAxis, margin, chartWidth, chartHeight, title);
  DrawPaths(svg, data, x, y, limits);
  AddLabels(svg, margin, chartWidth, chartHeight, title);
}

function MakeShearStressChart (data, title) {
  var svgWidth  = document.getElementById("shear-stress-chart").offsetWidth,
      svgHeight = 200,
      margin = { top: 20, right: 75, bottom: 40, left: 75 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var limitMin = d3.min(data, function (d) { return d.y; });
  var limitMax = d3.max(data, function (d) { return d.y; });
  var limits = FindLimitPoints(data, limitMin, limitMax, 6);

  var section_stress_elements = document.getElementsByClassName("section-stress-unit");
  var section_stress_text = section_stress_elements[0].innerText;
  var select_length = document.getElementById("select-length");
  var length_text = select_length.options[select_length.selectedIndex].value;

  var shearStressSummary = limitSummary(limits, "Shear Stress", length_text, section_stress_text);

  document.getElementById('shear-stress-limits').innerHTML = shearStressSummary;

  var yLimit = Math.max(Math.abs(limitMin), Math.abs(limitMax));

  var x = d3.scale.linear().range([0, chartWidth])
            .domain([0, return_beam_length()]),
            //.domain(d3.extent(data, function (d) { return d.x; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([-1*yLimit, yLimit]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10).tickFormat(d3.format(".2f"))
                .tickValues([limitMin,limitMax]);
  var svg = d3.select('#shear-stress-chart').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);

  AddAxes(svg, xAxis, yAxis, margin, chartWidth, chartHeight, title);
  DrawPaths(svg, data, x, y, limits);
  AddLabels(svg, margin, chartWidth, chartHeight, title);
}

function MakeBendingStressChart (dataBottom, dataTop, title) {
  var svgWidth  = document.getElementById("bending-stress-chart").offsetWidth,
      svgHeight = 200,
      margin = { top: 20, right: 75, bottom: 40, left: 75 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var limitMaxBottom = d3.min(dataBottom, function (d) { return d.y; });
  var limitsBottom = FindLimitPoints(dataBottom, 0, limitMaxBottom, 6);

  var limitMaxTop = d3.max(dataTop, function (d) { return d.y; });
  var limitsTop = FindLimitPoints(dataTop, 0, limitMaxTop, 6);

  var section_stress_elements = document.getElementsByClassName("section-stress-unit");
  var section_stress_text = section_stress_elements[0].innerText;
  var select_length = document.getElementById("select-length");
  var length_text = select_length.options[select_length.selectedIndex].value;

  var yLimit = Math.max(Math.abs(limitMaxBottom), Math.abs(limitMaxTop));

  var x = d3.scale.linear().range([0, chartWidth])
            .domain([0, return_beam_length()]),
            //.domain(d3.extent(data, function (d) { return d.x; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([-1*yLimit, yLimit]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10).tickValues([0, limitMaxTop])
                .tickFormat(d3.format(".2e"));

  var svg = d3.select('#bending-stress-chart').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);

  AddAxes(svg, xAxis, yAxis, margin, chartWidth, chartHeight, title);
  DrawPathsBendingStress(svg, dataBottom, dataTop, x, y, limitsTop, limitsBottom);
  AddLabels(svg, margin, chartWidth, chartHeight, title);

  for(i = 0; i<limitsBottom.length; i++){
    limitsBottom[i].y = Math.abs(limitsBottom[i].y); 
  }
  var bendingStressSummary = limitSummary(limitsTop, "Top Bending Stress", length_text, section_stress_text);
  bendingStressSummary = bendingStressSummary + limitSummary(limitsBottom, "Bottom Bending Stress", length_text, section_stress_text);
  document.getElementById('bending-stress-limits').innerHTML = bendingStressSummary;

}

function DrawPathsBendingStress(svg, dataBottom, dataTop, x, y, limitsTop, limitsBottom) {
  var allData = dataBottom.concat(dataTop);
  var line = d3.svg.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); });

  var line0 = [];
  line0.push({x:0, y:0});
  line0.push({x:return_beam_length(), y:0});

  svg.append("path")
      .datum(line0)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", line);

  svg.append("path")
      .datum(allData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", line);

  var area = d3.svg.area()
    .x(function(d) { return x(d.x); })
    .y0(70)
    .y1(function(d) { return y(d.y); });

  // add the area
  svg.append("path")
     .data([allData])
     .attr("class", "area")
     .attr("d", area);

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg.append("g")
       .attr("id", "dataTop")
       .selectAll("circle")
       .data(dataTop)
       .enter().append("svg:circle")
       .style("fill", "transparent")
       .attr("r", 4)
       .attr("cx", function(d) { return x(d.x);})
       .attr("cy", function(d) { return y(d.y);})
       .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.x.toFixed(6) + ", " + d.y.toFixed(6))
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });
  svg.append("g")
       .attr("id", "dataBottom")
       .selectAll("circle")
       .data(dataBottom)
       .enter().append("svg:circle")
       .style("fill", "transparent")
       .attr("r", 4)
       .attr("cx", function(d) { return x(d.x);})
       .attr("cy", function(d) { return y(d.y);})
       .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.x.toFixed(6) + ", " + d.y.toFixed(6)*-1)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });

  // Add the scatterplot
  svg.append("g")
       .attr("id", "limitsBottom")
       .selectAll("dot")
       .data(limitsBottom)
       .enter().append("circle")
       .style("fill", "red")
       .attr("r", 4)
       .attr("cx", function(d) { return x(d.x);})
       .attr("cy", function(d) { return y(d.y);})
       .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.x.toFixed(6) + ", " + d.y.toFixed(6)*-1)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });
  svg.append("g")
       .attr("id", "limitsTop")
       .selectAll("dot")
       .data(limitsTop)
       .enter().append("circle")
       .style("fill", "red")
       .attr("r", 4)
       .attr("cx", function(d) { return x(d.x);})
       .attr("cy", function(d) { return y(d.y);})
       .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.x.toFixed(6) + ", " + d.y.toFixed(6))
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });
}

function ClearCharts()
{
    document.getElementById('shear-chart').innerHTML = "";
    document.getElementById('moment-chart').innerHTML = "";
    document.getElementById('slope-chart').innerHTML = "";
    document.getElementById('deflection-chart').innerHTML = "";
    document.getElementById('shear-stress-chart').innerHTML = "";
    document.getElementById('bending-stress-chart').innerHTML = "";
    document.getElementById('shear-limits').innerHTML = "";
    document.getElementById('moment-limits').innerHTML = "";
    document.getElementById('slope-limits').innerHTML = "";
    document.getElementById('deflection-limits').innerHTML = "";
    document.getElementById('shear-stress-limits').innerHTML = "";
    document.getElementById('bending-stress-limits').innerHTML = "";
    document.getElementById('reaction-results').innerHTML = "";
}

function FindLimitPoints(data, limitMinY, limitMaxY, decimalPoints)
{
  if(limitMinY == 0){
    if (Array.isArray(data)) {
      console.log("the given data is an array")
    var allPoints = data.filter(function(d){
      if(roundNumber(d.y, decimalPoints) == roundNumber(limitMaxY, decimalPoints))
      { 
        return d; 
      }
    });
  }
else{
  console.log("the given data is not an array");
}
}else{
  if (Array.isArray(data)) {
    console.log("the given data is an array")
    var allPoints = data.filter(function(d){
      if(roundNumber(d.y, decimalPoints) == roundNumber(limitMaxY, decimalPoints)
        || roundNumber(d.y, decimalPoints) == roundNumber(limitMinY, decimalPoints))
      { 
        return d; 
      }
    });
  }else{
    console.log("the given data is not an array");
  }
  }
    /*if(d.y == limitMaxY)
    { 
      return d; 
    }
    if(d.y == limitMinY)
    { 
      return d; 
    }
  });*/
  var limitPoints = [];
  var compare;
  for(i = 0; i < allPoints.length; i++){
    if (i == 0) {
        if(roundNumber(allPoints[i].y, 5) == 0.00000){continue;}
        limitPoints.push(allPoints[i]);
        compare = allPoints[i].y;
        continue;
    }  
    if (i == allPoints.length -1){
      if(roundNumber(allPoints[i].y, 5) == 0.00000 && limitPoints.length > 0){
        if(roundNumber(allPoints[i-1].x, 6) != roundNumber(limitPoints[limitPoints.length-1].x, 6)
          && roundNumber(allPoints[i-1].y, 5) != 0.00000){
            limitPoints.push(allPoints[i-1]);
        }
        continue;
      }
      if(limitPoints.length > 0){
        if(roundNumber(allPoints[i].x, 6) != roundNumber(limitPoints[limitPoints.length-1].x, 6)
        || roundNumber(allPoints[i].y, decimalPoints) != roundNumber(limitPoints[limitPoints.length-1].y, decimalPoints)){
          limitPoints.push(allPoints[i]);
          continue;
        }
      }else{
          limitPoints.push(allPoints[i]);
          continue;
      }
    }      
    if (allPoints[i].y != compare){
      if(roundNumber(allPoints[i].y, 5) == 0.00000){continue;}
      if(limitPoints.length > 0){
        if(roundNumber(allPoints[i].y, decimalPoints) != roundNumber(limitPoints[limitPoints.length-1].y, decimalPoints)){
          limitPoints.push(allPoints[i]);
          if (roundNumber(allPoints[i-1].x, 6) == roundNumber(limitPoints[limitPoints.length-1].x, 6)) {
            limitPoints.push(allPoints[i-1]);
          }
            //limitPoints.push(allPoints[i-1]);
        }
      }else{
        limitPoints.push(allPoints[i]);
      }
      compare = allPoints[i].y;
      continue;
    }
    //compare = allPoints[i].y;
  }
  return limitPoints;
}

function DecimalPlaces(num) {
  return (num.toString().split('.')[1] || []).length;
}

// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    }
  });
}

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

function roundNumber(num, scale) {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}

function limitSummary(limits, type, unitX, unitY) {
  var summaryMax="";
  var summary="";
  var summaryMin="";
  var limit = "";
  for (var i = 0; i < limits.length; i++){
      var new_limit = limits[i].y.toFixed(3);
      if(new_limit >=0){
        if(summaryMax == ""){
          summaryMax = "<p>(Max +ve)" + type + " (" + unitY + "): " + 
          new_limit + ",</p><p>Location" + " (" + unitX + "): " 
          + limits[i].x.toFixed(3);
        }else{
          summaryMax = summaryMax + ", " + limits[i].x.toFixed(3);
        }
      }else{
        if(summaryMin == ""){
          summaryMin = "<p>(Max -ve)" + type + " (" + unitY + "): " + 
          new_limit + ",</p><p>Location" + " (" + unitX + "): " 
          + limits[i].x.toFixed(3);
        }else{
          summaryMin = summaryMin + ", " + limits[i].x.toFixed(3);
        }
      }
      if(i == limits.length-1){
        if(summaryMax!=""){
          summaryMax = summaryMax + "</p>"
        }
        if(summaryMin!=""){
          summaryMin = summaryMin + "</p>"
        }        
        summary = summaryMax + summaryMin;
      }
  }
  return summary;
}

