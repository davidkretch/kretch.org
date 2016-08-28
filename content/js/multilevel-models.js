// Multilevel models

function polygon(x, y, r, edges) {
  var points = [];
  var start = Math.PI/2;
  var period = 2 * Math.PI/edges;
  for (var i = 0; i < edges; i++) {
    points.push([x - r * Math.cos(start + i * period), y - r * Math.sin(start + i * period)]);
  }
  return points.join(" ");
}

function star(x, y, r1, r2, edges) {
  var edges = 2 * edges;
  var points = [];
  var start = Math.PI/2;
  period = 2 * Math.PI/edges;
  for (var i = 0; i < edges; i++) {
    var i_r = i % 2 == 0 ? r1 : r2;
    points.push([x - i_r * Math.cos(start + i * period), y - i_r * Math.sin(start + i * period)]);
  }
  return points.join(" ");
}

function createPlot(selector, data) {

  // Plot areas
  var svg = d3.select(selector)
      .attr("class", "graph")
      .selectAll("svg")
      .data(data)
      .enter()
      .append("svg")
      .attr("class", function(d, i) { return "state" + i; });

  setSize();

  // Data points
  var points = svg.append("g")
     .attr("class", "data")

  points.selectAll("circle")
      .data(function(d) { return d.data; })
      .enter()
      .append("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr("r", 5);

  // Rug
  var rug = svg.append("g")
      .attr("class", "rug")

  rug.selectAll("line")
      .data(function(d) { return d.data; })
      .enter()
      .append("line")
      .attr("class", "rug")
      .attr("x1", function(d) { return x(d.x); })
      .attr("x2", function(d) { return x(d.x); })
      .attr("y1", y(0.9))
      .attr("y2", y(1.0));

  // True means
  means = svg.append("g")
      .attr("class", "mean")

  means.append("polygon")
      .attr("points", function(d) { return star(x(d.mean), y(0.5), 18, 9, 5); });

  // Estimated means
  est_means = svg.append("g")
      .attr("class", "est-mean");

  // Facet labels
  var labels = svg.append("g")
      .attr("class", "label")

  labels.append("text")
      .attr("x", x(0.01))
      .attr("y", y(0.2))
      .text(function(d) { return d.state; });

  // Legend
  legend = svg
      .filter(":last-child")
      .append("g")
      .attr("class", "legend")

  legend.append("text")
     .attr("x", x(0.87))
     .attr("y", y(0.9))
     .text("true mean");

  legend.append("polygon")
     .attr("points", function(d) { return star(x(0.85), y(0.85), 8, 4, 5); })
     .attr("class", "mean");

  return(svg)
}

function plot1(data) {
  var plot1 = createPlot("#plot1", data);

  plot1.selectAll(".data")
      .attr("class", "data data-colored")
      .selectAll("circle")
      .attr("r", 6);
}

function plot2(data) {
  var plot2 = createPlot("#plot2", data);

  plot2.select(".est-mean")
      .append("polygon")
      .attr("points", function(d) { return polygon(x(d.est_mean), y(0.5), 12, 3); });

  legend2 = plot2.select(".legend");

  legend2.append("polygon")
     .attr("points", function(d) { return polygon(x(0.85), y(0.67), 8, 3); })
     .attr("class", "est-mean");

  legend2.append("text")
     .attr("x", x(0.87))
     .attr("y", y(0.7))
     .text("est. mean");
}

function plot3(data) {
  var plot3 = createPlot("#plot3", data);

  plot3.insert("g", ":first-child")
      .attr("class", "overall-est-mean")
      .append("line")
      .attr("x1", function(d) { return x(d.overall_est_mean); })
      .attr("x2", function(d) { return x(d.overall_est_mean); })
      .attr("y1", y(0))
      .attr("y2", y(1));

  legend3 = plot3.select(".legend");

  legend3.append("polygon")
      .attr("points", function(d) {return polygon(x(0.85), y(0.67), 8, 3); })
      .attr("class", "est-mean");

  legend3.append("text")
      .attr("x", x(0.87))
      .attr("y", y(0.7))
      .text("est. mean");
      
  plot3.selectAll("g.est-mean")
        .append("polygon");

  var DURATION = 2000;

  function displayEstimates() {

    plot3.select("g.legend polygon.est-mean")
        .style("fill", "#ffd700")
        .transition()
        .duration(2000)
        .style("fill", "#f8766d")
        .transition();

    plot3.selectAll("g.est-mean polygon")
        .attr("points", function(d) { return polygon(x(d.est_mean), y(0.5), 12, 3); })
        .style("fill", "#ffd700")
        .transition()
        .duration(2000)
        .attr("points", function(d) { return polygon(x(d.new_est_mean), y(0.5), 12, 3); })
        .style("fill", "#f8766d")
        .transition()
        .on("end", displayEstimates);

  }

  displayEstimates();
}

function setSize() {

  var WIDTH = 670;
  var HEIGHT = 100;

  d3.selectAll("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);

  x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, WIDTH]);

  y = d3.scaleLinear()
      .domain([0, 1])
      .range([0, HEIGHT]);
}

/*****************************************************************************/

/*****************************************************************************/

d3.json("data/multilevel-models.json", function(error, data) {

  data.forEach(function(d) {
    d.data = d.data.map(function(e, i) { return {x: d.data[i], y: 0.5}; } );
  });

  plot1(data);
  plot2(data);
  plot3(data);

});