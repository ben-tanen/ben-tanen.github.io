---
layout: post
title: 'Polar Line Charts in D3'
date: 2017-01-08 15:05:41
categories: project data visualization
thumbnail: /assets/img/post-thumbnails/d3-polar.gif
---

<style>
#d3-polar-container {
    width: 90%;
    max-width: 450px;
    height: 450px;
    margin: auto;
}

#polar-line-chart {
    width: 100%;
    height: 100%;
}

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

#polar-line-chart .play-text:hover {
    text-decoration: underline;
}
</style>

A few weeks ago, I came across [this very interesting (and very scary) visualization](http://blogs.reading.ac.uk/climate-lab-book/files/2016/05/spiral_optimized.gif){:target="_blank"} of the change in global temperatures over the last two centuries. I was particularly impressed with their choice to use a polar chart to show annual changes as opposed to the traditional chart choices.

Since [D3 and Mike Bostock](https://bost.ocks.org/mike/){:target="_blank"} have generally implemented every type of chart imaginable, I was surprised that I couldn't find anything like this sort of polar line chart that I could use for other data sets. As a result, I decided to code it up myself, which you can see below. What better data to show of the chart than the original climate data so that is what you see below.

<div id='d3-polar-container'>
    <svg id="polar-line-chart"></svg>
</div>

Now that I have the chart ready to go, I'll keep my eyes open for other data sets that might work well for this sort of radial chart, and as always, I'll post it here.

<script>
/* resize svg height if needed */
let c_width = $("#d3-polar-container").width(),
    is_mobile = c_width < 450;
$("#d3-polar-container").css("height", c_width);

/* initialize svg and variables */
var polar_svg = d3.select("#polar-line-chart"),
    margin = {top: 55, left: 45, bottom: 35, right: 45, center: 75},
    width  = c_width - margin.left - margin.right;
    height = c_width - margin.top - margin.bottom;

// polar scales
var t = d3.scaleTime().range([0, 2 * Math.PI]),
    r = d3.scaleLinear().range([0, (width - margin.center) / 2]);

// cartesian conversion
var x = function(t, r) { return (margin.left) + (width / 2) + ((r + (margin.center / 2)) *  Math.sin(t)); },
    y = function(t, r) { return (margin.top) + (height / 2) - ((r + (margin.center / 2)) *  Math.cos(t)); }

var line = d3.line()
    .x(function(d) { return x(t(d.month), r(d.value)); })
    .y(function(d) { return y(t(d.month), r(d.value)); });

var color = d3.scaleLinear()
    .range(["#2a96e8", "#fb6767"]);

/* draw polar background */
polar_svg.append('circle')
    .attr("r", width / 2)
    .attr("cx", margin.left + width / 2)
    .attr("cy", margin.top + height / 2)
    .style("fill", "#ececec")
    .style("stroke", "#000")
    .style("stroke-width", "0.5px");

polar_svg.append('circle')
    .attr("r", margin.center / 2)
    .attr("cx", margin.left + width / 2)
    .attr("cy", margin.top + height / 2)
    .style("fill", "white")
    .style("stroke", "#000")
    .style("stroke-width", "0.5px");

/* pull data */
d3.csv("/assets/data/d3-radial-temp.csv", function(d) {
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

    polar_svg.selectAll("g")
        .data(ticks).enter()
        .append("circle")
        .attr("cx", margin.left + width / 2)
        .attr("cy", margin.top + height / 2)
        .attr("r", function(d) { return margin.center / 2 + r(d); })
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", "0.25px");

    polar_svg.append("rect")
        .attr("x", margin.left + (margin.center + width) / 2 + 5)
        .attr("y", margin.top + height / 2 - 10)
        .attr("width", (width - margin.center) / 2 - 7)
        .attr("height", 20)
        .attr("fill", "#ececec");

    /* render center year, "play", title, and month text */
    var text_size = (!is_mobile ? 1 : 0.8);

    polar_svg.append("text")
        .attr("class", "year-text")
        .style("font-size", text_size - 0.1 + "em")
        .attr("transform", `translate(${margin.left + width / 2 - (!is_mobile ? 15 : 12)}, ${margin.top + height / 2 + (!is_mobile ? 5 : 4)})`)
        .text("1850");

    polar_svg.append("text")
        .style("font-size", text_size + "em")
        .attr("transform", "translate(10, 15)")
        .text("Global Temperature Change in °C (1850 - 2016)");

    polar_svg.append("text")
        .style("font-size", text_size - 0.1 + "em")
        .attr("transform", `translate(${width + margin.left + 10}, ${height / 2 + margin.top - 8}) rotate(90)`)
        .text("Apr");

    polar_svg.append("text")
        .style("font-size", text_size - 0.1 + "em")
        .attr("transform", `translate(${width / 2 + margin.left - 8}, ${margin.top - 8})`)
        .text("Jan");

    polar_svg.append("text")
        .style("font-size", text_size - 0.1 + "em")
        .attr("transform", `translate(${margin.left - 8}, ${height / 2 + margin.top + 8}) rotate(270)`)
        .text("Oct");

    polar_svg.append("text")
        .style("font-size", text_size - 0.1 + "em")
        .attr("transform", `translate(${width / 2 + margin.left + 8}, ${height + margin.top + 8}) rotate(180)`)
        .text("Jul");

    $("#d3-polar-container").ready(function() {
        polar_svg.append("text")
            .attr("class", "play-text")
            .style("font-size", text_size + "em")
            .attr("transform", "translate(" + 10 + "," + 35 + ")")
            .text("Play");
    });

    /* animate on click */
    polar_svg.select(".play-text").on("click", function() {
        /* clear paths and axis */
        polar_svg.selectAll(".line").remove();
        polar_svg.select("#axis").remove();
        polar_svg.selectAll(".year-text.added").remove();
        polar_svg.selectAll(".year-text").text("1850");
        polar_svg.selectAll(".year-text-cover").remove();

        /* update center text */
        setTimeout(function() {
            let ix = 0;
            update_year = setInterval(function() {
                ix = ix + 1;
                                    
                /* draw new path */
                polar_svg.append("path")
                    .attr("class", "line")
                    .attr("d", line([data[ix - 1], data[ix]]))
                    .style("stroke", color(data[ix - 1].year))
                    .style("stroke-width", (!is_mobile ? '1px' : '0.5px'))

                /* update center text (or stop) */
                if (ix == data.length - 1) clearInterval(update_year);
                else polar_svg.select(".year-text").text(+data[ix].year);
            }, 5);
        }, 500)

        /* re-render axis */
        polar_svg.append("g")
            .attr("id", "axis")
            .attr("transform", "translate(" + (margin.left + (margin.center + width) / 2) + "," + (margin.top + (height / 2) - 6) + ")")
            .style("font-size", (!is_mobile ? 0.6 : 0.5) + "em")
            .call(axis);
    });

    /* render radial ticks */
    polar_svg.append("g")
        .attr("id", "axis")
        .attr("transform", "translate(" + (margin.left + (margin.center + width) / 2) + "," + (margin.top + (height / 2) - 6) + ")")
        .style("font-size", (!is_mobile ? 0.6 : 0.5) + "em")
        .call(axis);
});

</script>



