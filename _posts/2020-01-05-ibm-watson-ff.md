---
layout: post
title:  "How Accurate Are IBM Watson's Fantasy Football Projections"
date:   2020-01-05 15:05:41
categories: project data visualization football fantasy ibm hidden
thumbnail: /assets/img/post-thumbnails/ff-ibm-watson.png
show-on-landing: true
landing-description: the accuracy of IBM Watson's fantasy football projections
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate voluptatum recusandae adipisci nulla, maxime praesentium reprehenderit at ratione eveniet odit. Eius blanditiis, labore nihil recusandae quidem consectetur natus laudantium incidunt.

<div id="d3-ff-ibm-container">
    <div id="d3-ff-ibm-title">
        <h3>Forecasted vs. actual probabilities for IBM Watson + ESPN fantasy football projections</h3>
        <p>Bucket size: <span class="bucket-button">n = 1</span><span class="bucket-button selected">n = 2</span><span class="bucket-button">n = 5</span><span class="bucket-button">n = 10</span></p>
    </div>
    <svg id="d3-ff-ibm">
    </svg>
</div>

<style>
#d3-ff-ibm-container {
    width: 100%;
}

#d3-ff-ibm {
    width: 100%;
    height: 400px;
}

#d3-ff-ibm-title h3 {
    text-align: center;
    color: #77bdee;
}

#d3-ff-ibm-title p {
    margin: 5px 0 0 0;
    text-align: center;
    font-size: 14px;
}

.bucket-button {
    padding: 1px 5px;
    margin: 0 2px;
    background-color: #bfbfbf;
    border-radius: 5px;
    color: white;
    cursor: pointer;
}

.bucket-button.selected {
    background-color: #77bdee;
}

text.axis-label {
    text-anchor: middle;
    font-size: 13px;
    font-weight: bold;
}

text#guideline-label {
    fill: #bfbfbf;
}

line#guideline {
    stroke: #bfbfbf;
    stroke-dasharray: 3 3;
}

circle.bucket {
    fill: #77bdee;
    stroke: black;
}

span.tooltip-highlight {
    font-weight: bold;
}

</style>

<script>

/*********************/
/*** INIT VARIABLE ***/
/*********************/

let ffibm_svg = d3.select("#d3-ff-ibm");

let margin = {top: 10, right: 15, bottom: 35, left: 45},
    width  = $("#d3-ff-ibm").width() - margin.left - margin.right,
    height = $("#d3-ff-ibm").height() - margin.top - margin.bottom,
    is_mobile = (width >= 470 ? false : true);

// set domains: x = projected probability, y = actual probability
let x = d3.scaleLinear().domain([0, 1]).range([0, width]),
    y = d3.scaleLinear().domain([0, 1]).range([height, 0]),
    r = d3.scaleLinear().range([2, 15]);

// create empty list to store data
let data = [ ];

let bucket_sizes = [1, 2, 5, 10],
    bucket_size = 2;

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

function render_axes() {
    ffibm_svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(".0%")));

    ffibm_svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0%")));

    ffibm_svg.append('text')
        .classed("axis-label", true)
        .attr("id", "x-axis-label")
        .attr("transform", `translate(${margin.left + x(0.5)}, ${margin.top + height + margin.bottom - 5})`)
        .text("Forecasted chance of occurring");

    ffibm_svg.append('text')
        .classed("axis-label", true)
        .attr("id", "y-axis-label")
        .attr("transform", `translate(${margin.left - 35}, ${margin.top + y(0.5)}), rotate(270)`)
        .text("Actual chance of occurring");
}

function render_guideline() {
    ffibm_svg.append("line")
        .attr("id", "guideline")
        .attr("x1", margin.left + x(0))
        .attr("x2", margin.left + x(1))
        .attr("y1", margin.top + y(0))
        .attr("y2", margin.top + y(1));

    ffibm_svg.append("text")
        .classed("axis-label", true)
        .attr("id", "guideline-label")
        .attr("transform", `translate(${margin.left + x(0.8)}, ${margin.top + y(0.8) - 7}), rotate(${Math.atan(height / width) * -180 / Math.PI})`)
        .text("Perfectly calibrated projections");
}

function render_points(bucket_size, animate) {

    // limit data and set radius scale based on data extent
    let data_lim = data.filter((d) => d.bucket_size === bucket_size);
    r.domain(d3.extent(data_lim, (d) => d.n));

    // create circles
    let cs = ffibm_svg.selectAll("circle")
        .data(data_lim).enter()
        .append("circle")
        .classed("bucket", true)
        .attr("id", (d) => "bucket" + d.bucket_size + "-" + Math.round(d.pct * 100))
        .attr("cx", (d) => margin.left + x(d.pct))
        .attr("cy", (d) => margin.top + y(d.accuracy))
        .attr("r", 0);

    // animate (if desired)
    if (animate) cs.transition().duration(200).attr("r", (d) => r(d.n));
    else cs.attr("r", (d) => r(d.n));

    // add tooltips for circles
    new jBox("Tooltip", {
        attach: "circle.bucket",
        content: "...",
        onOpen: function() {
            let d = d3.select(this.source[0]).data()[0];

            this.setContent(`<p>IBM Watson + ESPN made <span class='tooltip-highlight'>${d.n}</span> projections with a probability ${bucket_size === 1 ? "of" : "between"} <span class='tooltip-highlight'>${bucket_range(d.pct * 100, bucket_size)}</span>. They actually occurred <span class='tooltip-highlight'>${Math.round(d.accuracy * 100)}%</span> of the time.</p>`);
        }
    });
}

function bucket_range(pct, bucket_size) {
    let lower = Math.max(0, Math.round((Math.round(pct / bucket_size) - 0.49) * bucket_size)),
        upper = Math.min(100, Math.round((Math.round(pct / bucket_size) + 0.49) * bucket_size));

    return lower + (bucket_size === 1 ? "" : " - " + upper) + "%";
}

function resize() {

    // delete existing elements
    ffibm_svg.selectAll("#x-axis, #y-axis, text.axis-label, line#guideline, circle.bucket").remove();

    // update width properties and scales
    width = $("#d3-ff-ibm").width() - margin.left - margin.right;
    x.range([0, width]);

    // rerender
    render_axes();
    render_guideline();
    render_points(bucket_size, false);
}

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

d3.csv("/assets/data/ff-ibm-watson-projections.csv", (d) => {
    d.pct = +d.pct;
    d.n = +d.n;
    d.n_correct = +d.n_correct;
    d.bucket_size = +d.bucket_size;
    d.accuracy = +d.accuracy;
    return d;
}, (e, d) => {
    if (e) throw e;

    // store data for later
    for (let i = 0; i < d.length; i++) data.push(d[i]);

    // draw axis, guideline, and initial points
    render_axes();
    render_guideline();
    render_points(bucket_size, true);
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(window).resize(resize);

$('.bucket-button').click(function() {

    // properly highlight button
    $('.bucket-button').removeClass('selected');
    $(this).addClass('selected');
    
    // update bucket size
    bucket_size = bucket_sizes[$(this).index()];

    // remove points and redraw with right bucket size
    ffibm_svg.selectAll("circle.bucket").remove();
    render_points(bucket_size, true);
})

</script>


