Template.bar_charts.bars = function() {
  return '';//return an array of JSON objects from here//Things.find({});
}

Template.bar_charts.events({
  //TODO
});

Template.bar_chart.bar = function() {
  //TODO
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10, "%");

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("data.tsv", type, function(error, data) {
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); });

  });
};

Template.vthing.circle = function() {
  var id = "a" + this._id;
  var selector_id = "#" + id;

  existing_circles = d3.select("#vthings").selectAll("g");
  console.log("current # of things = " + existing_circles.size());

  x_increment = (500 - 50) / (existing_circles.size() + 2);
  x_next = x_increment + 50;

  Template.vthing._draw_existing(existing_circles, x_next, x_increment);

  x_next = x_next + (x_increment * existing_circles.size());

  circle = d3.select("#vthings").selectAll(selector_id)
  circle_data = circle.data([id]);
  g_container = circle_data.enter()
          .append("g")
          .classed("thing", true)
          .attr("id", function(d) { return d })
          .attr("transform", function(d){
            i = x_next;
            x_next = x_next + x_increment;
            console.log("new circle at x = " + i);
            return "translate("+i+",100)"
          });

    g_container.append("circle")
          .style("stroke", "gray")
          .style("fill", "white")
          .attr("r", 40)
          .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
          .on("mouseout", function(){d3.select(this).style("fill", "white");});

    g_container.append("text")
          .attr("dx", function(d) { return -20 })
          .text(this.name);
}

Template.vthing._draw_existing = function(existing_circles, x_next, x_increment) {
  existing_circles
      .transition()
      .duration(750)
      .style("stroke", "gray")
      .attr("transform", function(d){
        i = x_next;
        x_next = x_next + x_increment;
        console.log("move existing circle to x = " + i);
        return "translate("+i+",100)"
      });
}

d3.selection.prototype.size = function() {
  var n = 0;
  this.each(function() { ++n; });
  return n;
};


var type = function(d) {
  d.frequency = +d.frequency;
  return d;
};