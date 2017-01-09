---
layout: post
title: 'Polar Line Charts in D3'
date: 2017-01-08 15:05:41
categories: project data visualization
---

A few weeks ago, I came across [this very interesting (and very scary) visualization](http://blogs.reading.ac.uk/climate-lab-book/files/2016/05/spiral_optimized.gif){:target="_blank"} of the change in global temperatures over the last two centuries. I was particularly impressed with their choice to use a polar chart to show annual changes as opposed to the traditional chart choices.

Since [D3 and Mike Bostock](https://bost.ocks.org/mike/){:target="_blank"} have generally implemented every type of chart imaginable, I was surprised that I couldn't find anything like this sort of polar line chart that I could use for other data sets. As a result, I decided to code it up myself, which you can see below. What better data to show of the chart than the original climate data so that is what you see below.

<style>
#polar-line-chart .line {
    fill: none;
    stroke: steelblue;
    stroke-width: 1px;
}

#polar-line-chart .domain {
    display: none;
}

#polar-line-chart .year-text {
    font-family: sans-serif;
    font-size: 14px;
}

#polar-line-chart .play-text {
    font-family: sans-serif;
    font-size: 18px;
    cursor: pointer;
    fill: #77bdee;
}
</style>

<div id='d3-polar-container' style='margin: auto; width: 400px;'>
    <svg id="polar-line-chart" width="400" height="400"></svg>
</div>
<script src="http://d3js.org/d3.v4.min.js"></script>
<script>

/* initialize svg and variables */
var svg = d3.select("#polar-line-chart"),
    margin = {top: 25, left: 25, bottom: 25, right: 25, center: 75},
    width = svg.attr("width") - margin.left - margin.right;
    height = svg.attr("height") - margin.top - margin.bottom;

// polar scales
var t = d3.scaleTime().range([0, 2 * Math.PI]),
    r = d3.scaleLinear().range([0, (width - margin.center) / 2]);

// cartesian conversion
var x = function(t, r) { return (margin.left) + (width / 2) + ((r + (margin.center / 2)) * Math.cos(t)); },
    y = function(t, r) { return (margin.top) + (height / 2) - ((r + (margin.center / 2)) * Math.sin(t)); }

var line = d3.line()
    .x(function(d) { return x(t(d.month), r(d.value)); })
    .y(function(d) { return y(t(d.month), r(d.value)); });

var color = d3.scaleLinear()
    .range(["#2a96e8", "#fb6767"]);

/* draw polar background */
svg.append('circle')
    .attr("r", width / 2)
    .attr("cx", margin.left + width / 2)
    .attr("cy", margin.top + height / 2)
    .style("fill", "#ececec")
    .style("stroke", "#000")
    .style("stroke-width", "0.5px");

svg.append('circle')
    .attr("r", margin.center / 2)
    .attr("cx", margin.left + width / 2)
    .attr("cy", margin.top + height / 2)
    .style("fill", "white")
    .style("stroke", "#000")
    .style("stroke-width", "0.5px");

/* pull data */
d3.csv("/data/d3-radial-temp.csv", function(d) {
    d.year  = +d.year;
    d.month = +d.month;
    d.value = +d.v2;
    return d;
}, function(error, data) {
    if (error) throw error;

    var [t_min, t_max] = d3.extent(data, function(d) { return d.month; }),
        [r_min, r_max] = d3.extent(data, function(d) { return d.value;   });
    var r_margin = {top: 0.15, bottom: 0};

    t.domain([t_min, t_max + 1]);
    r.domain([r_min - r_margin.bottom, r_max + r_margin.top]);
    color.domain(d3.extent(data, function(d) { return d.year; }));

    /* draw polar axes */
    var ticks = r.ticks(5).splice(1);
    var axis  = d3.axisBottom(r).tickValues(ticks).tickSize(0).tickFormat(d3.format(".1f"));

    svg.selectAll("g")
        .data(ticks).enter()
        .append("circle")
        .attr("cx", margin.left + width / 2)
        .attr("cy", margin.top + height / 2)
        .attr("r", function(d) { return margin.center / 2 + r(d); })
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", "0.25px");

    svg.append("rect")
        .attr("x", margin.left + (margin.center + width) / 2 + 5)
        .attr("y", margin.top + height / 2 - 10)
        .attr("width", (width - margin.center) / 2 - 7)
        .attr("height", 20)
        .attr("fill", "#ececec");

    /* render center year, "play", and title text */
    svg.append("text")
        .attr("class", "year-text")
        .attr("transform", "translate(" + (margin.left + width / 2 - 15) + "," + (margin.top + height / 2 + 5) + ")")
        .text("1850");

    $(document).ready(function() {
        svg.append("text")
            .attr("class", "play-text")
            .attr("transform", "translate(" + 10 + "," + 35 + ")")
            .text("Play");
    });

    svg.append("text")
        .attr("transform", "translate(" + 10 + "," + 15 + ")")
        .text("Global Temperature Change in °C (1850 - 2016)");

    svg.select(".play-text").on("click", function() {
        /* clear paths and axis */
        svg.selectAll(".line").remove();
        svg.select("#axis").remove();
        svg.selectAll(".year-text.added").remove();
        svg.selectAll(".year-text").text("1850");
        svg.selectAll(".year-text-cover").remove();

        for (var i = 1; i < data.length; i++) {
            /* draw new path */
            svg.append("path")
                .attr("class", "line")
                .attr("d", line([data[i - 1], data[i]]))
                .style("stroke", color(data[i - 1].year))
                .style("opacity", 0)
                .transition()
                .duration(50)
                .delay(1000 + 5 * i)
                .style("opacity", 1);

            /* update center text */
            if (data[i - 1].month == 1) {
                svg.append("rect")
                    .attr("class", "year-text-cover")
                    .attr("x", margin.left + width / 2 - margin.center / 2 + 15)
                    .attr("y", margin.left + width / 2 - margin.center / 2 + 15)
                    .attr("width", 45)
                    .attr("height", 45)
                    .attr("fill", "white")
                    .style("opacity", 0)
                    .transition()
                    .duration(0)
                    .delay(1000 + 5 * i)
                    .style("opacity", 1);

                svg.append("text")
                    .classed("year-text", true)
                    .classed("added", true)
                    .attr("transform", "translate(" + (margin.left + width / 2 - 15) + "," + (margin.top + height / 2 + 5) + ")")
                    .text(data[i - 1].year)
                    .style("opacity", 0)
                    .transition()
                    .duration(0)
                    .delay(1000 + 5 * i)
                    .style("opacity", 1);
            }
        }

        /* re-render axis */
        svg.append("g")
            .attr("id", "axis")
            .attr("transform", "translate(" + (margin.left + (margin.center + width) / 2) + "," + (margin.top + (height / 2) - 6) + ")")
            .call(axis);
    });

    /* render radial ticks */
    svg.append("g")
        .attr("id", "axis")
        .attr("transform", "translate(" + (margin.left + (margin.center + width) / 2) + "," + (margin.top + (height / 2) - 6) + ")")
        .call(axis);
});
</script>

Now that I have the chart ready to go, I'll keep my eyes open for other data sets that might work well for this sort of radial chart, and as always, I'll post it here.



