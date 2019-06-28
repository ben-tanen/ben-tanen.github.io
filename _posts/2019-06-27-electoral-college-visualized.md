---
layout: post
title: "2016 Electoral College Path Visualized"
date: 2019-06-27 04:00:00
categories: data visualization project politics 2016 hidden
landing-description: visualizing the 2016 path to Electoral College victory
excerpt_separator: <!-- more -->
---

[2% error!](https://fivethirtyeight.com/features/trump-is-just-a-normal-polling-error-behind-clinton/)

<div id="d3-2016-electoral-college-paths-container">
    <div id="d3-2016-electoral-college-paths-controls">
        <div class="slider-container">
            <p>Florida: <span class="slider-margin-text" id="FL">Trump +1.20%</span></p>
            <input type="range" min="-80" max="320" value="120" step="10" class="slider" id="FL">
        </div>
        <div class="slider-container">
            <p>Michigan: <span class="slider-margin-text" id="MI">Trump +0.22%</span></p>
            <input type="range" min="-178" max="222" value="22" step="10" class="slider" id="MI">
        </div>
        <div class="slider-container">
            <p>Minnesota: <span class="slider-margin-text" id="MN">Clinton +1.52%</span></p>
            <input type="range" min="-352" max="48" value="-152" step="10" class="slider" id="MN">
        </div>
        <div class="slider-container">
            <p>New Hampshire: <span class="slider-margin-text" id="NH">Clinton +0.37%</span></p>
            <input type="range" min="-237" max="163" value="-37" step="10" class="slider" id="NH">
        </div>
        <div class="slider-container">
            <p>Pennsylvania: <span class="slider-margin-text" id="PA">Trump +0.72%</span></p>
            <input type="range" min="-128" max="272" value="72" step="10" class="slider" id="PA">
        </div>
        <div class="slider-container">
            <p>Wisconsin: <span class="slider-margin-text" id="WI">Trump +0.76%</span></p>
            <input type="range" min="-124" max="276" value="76" step="10" class="slider" id="WI">
        </div>
    </div>
    <svg id="d3-2016-electoral-college-paths">
    </svg>
</div>

<style>
.slider-container {
    width: calc(33% - 2px);
    margin-bottom: 5px;
    display: inline-block;
}

.slider-container p {
    font-size: 13px;
    text-align: center;
    margin-bottom: 2px;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  background: #dedede;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  background: gray;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  background: gray;
  cursor: pointer;
}

#d3-2016-electoral-college-paths {
    width: 100%;
    height: 600px;
}

rect.trump {
    fill: #ff6e6c;
    cursor: pointer;
}

rect.clinton {
    fill: #77bdee;
    cursor: pointer;
}

.ecvotes-cumu-text {
    font-size: 25px;
    fill: black;
}

.ecvotes-cumu-text#trump {
    fill: #ff6e6c;
}

.ecvotes-cumu-text#clinton {
    text-anchor: end;
    fill: #77bdee;
}

#x-axis-trump text, #x-axis-clinton text {
    text-anchor: middle;
    fill: black;
}

#y-axis .tick text {
    text-anchor: middle;
}

#y-axis .tick rect {
    fill: white;
}

#line270 {
    stroke-width: 1;
    stroke: gray;
}

#line270-caption {
    font-size: 12px;
    fill: gray;
}
</style>

<script>

/*********************/
/*** INIT VARIABLE ***/
/*********************/

var ec_paths_svg = d3.select("#d3-2016-electoral-college-paths");

var margin = {top: 5, right: 10, bottom: 35, left: 10, middle: 50},
    width  = $("#d3-2016-electoral-college-paths").width() -  margin.left - margin.right,
    height = $("#d3-2016-electoral-college-paths").height() - margin.top - margin.bottom,
    is_mobile = (width >= 470 ? false : true);

// set domains: x = possible vote margins, y = possible EC votes
var x = d3.scaleLinear().domain([0, 0.5]).range([0, (width - margin.middle) / 2]),
    y = d3.scaleLinear().domain([0, 305]).range([height, 0]);

// create empty list to store data
var data = [ ];

// keep track of adjustments to 6 swing states
var swing_state_mods = {
    "FL": $(".slider#FL").val(),
    "MI": $(".slider#MI").val(),
    "MN": $(".slider#MN").val(),
    "NH": $(".slider#NH").val(),
    "PA": $(".slider#PA").val(),
    "WI": $(".slider#WI").val(),
}

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

// update values for swing states depending on user slider inputs
function update_swing_state_data(d) {
    if (["FL", "MI", "MN", "NH", "PA", "WI"].indexOf(d.state_abbrev) >= 0) {
        d.votemargin = +swing_state_mods[d.state_abbrev] / 1e4;
        if (d.votemargin < 0) {
            d.votemargin = -d.votemargin;
            d.winner = "Clinton";
        } else {
            d.winner = "Trump";
        }
    }
    return d;
}

// update swing state values and re-sort accordingly
function update_data() {

    // update swing state values
    data = data.map(d => update_swing_state_data(d));

    // sort by winner then vote margin
    data.sort((a, b) => {
        if (a.winner === b.winner) return d3.descending(a.votemargin, b.votemargin);
        else return d3.descending(a.winner, b.winner);
    });
}

function render_blocks() {
    // keep track of cumulative EC votes for each candidate,
    // will determine height to place new blocks
    let ecvotes_clinton_cumu = 0,
        ecvotes_trump_cumu = 0;

    for (let i = 0; i < data.length; i++) {
        let d = data[i];

        ec_paths_svg.append("rect")
            .classed(d.winner === "Trump" ? "trump" : "clinton", true)
            .attr("state", d.state)
            .attr("winner", d.winner)
            .attr("votemargin", d.votemargin)
            .attr("ecvotes", d.ecvotes)
            .attr("x", margin.left + (width / 2) + (d.winner === "Trump" ? -1 : 0) * x(d.votemargin) + (d.winner === "Trump" ? -1 : 1) * margin.middle / 2)
            .attr("y", margin.top + y((d.winner === "Trump" ? ecvotes_trump_cumu : ecvotes_clinton_cumu) + d.ecvotes) + 1.5)
            .attr("width", x(d.votemargin))
            .attr("height", y(305 - d.ecvotes) - 1.5);

        if (d.winner === "Clinton") ecvotes_clinton_cumu += d.ecvotes;
        else ecvotes_trump_cumu += d.ecvotes;
    }

    // add text to show how many electoral votes each candidate has
    ec_paths_svg.append("text")
        .classed("ecvotes-cumu-text", true)
        .attr("id", "clinton")
        .attr("x", margin.left + width)
        .attr("y", margin.top + y(270) - 25)
        .text("Clinton: " + ecvotes_clinton_cumu);

    ec_paths_svg.append("text")
        .classed("ecvotes-cumu-text", true)
        .attr("id", "trump")
        .attr("x", margin.left)
        .attr("y", margin.top + y(270) - 25)
        .text("Trump: " + ecvotes_trump_cumu);

    // add tooltips for blocks
    new jBox("Tooltip", {
        attach: "rect.trump, rect.clinton",
        content: "...",
        onOpen: function() {
            var state       = $(this.source).attr("state"),
                swing_state = ["Florida", "Michigan", "Minnesota", "New Hampshire", "Pennsylvania", "Wisconsin"].indexOf(state) >= 0,
                winner      = $(this.source).attr("winner"),
                votemargin  = d3.format(".2%")($(this.source).attr("votemargin")),
                ecvotes     = $(this.source).attr("ecvotes");

            this.setContent(`<p><b>${state}</b></p><p>${winner} won${swing_state ? "*" : ""} ${ecvotes} Electoral Votes by a margin of ${votemargin}</p>`);
        }
    });
}

function render_axes() {
    // add x-axes (one for each candidate)
    ec_paths_svg.append("g")
        .attr("id", "x-axis-clinton")
        .attr("transform", "translate(" + (margin.left + (width + margin.middle) / 2) + ", " + (margin.top + height + 2) + ")")
        .call(d3.axisBottom(x).tickValues([0.1, 0.2, 0.3, 0.4, 0.5]).tickFormat(d3.format(".0%")))
        .append("text")
        .attr("transform", "translate(" + (width / 4) + ", 30)")
        .text("Clinton winning vote margin");

    x.domain([0.5, 0]); // flip the domain to show a flipped axis for trump

    ec_paths_svg.append("g")
        .attr("id", "x-axis-trump")
        .attr("transform", "translate(" + margin.left + ", " + (margin.top + height + 2) + ")")
        .call(d3.axisBottom(x).tickValues([0.1, 0.2, 0.3, 0.4, 0.5]).tickFormat(d3.format(".0%")))
        .append("text")
        .attr("transform", "translate(" + (width / 4) + ", 30)")
        .text("Trump winning vote margin");

    x.domain([0, 0.5]); // flip domain back

    // add y-axis
    ec_paths_svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + (margin.left + (width / 2)) + ", " + margin.top + ")")
        .call((g) => {

            // adding generic axis
            g.call(d3.axisRight(y).ticks(5))

            // removing middle line
            g.selectAll(".domain").remove();

            // adding white box for text to sit over line
            g.selectAll(".tick").append("rect").attr("x", -10).attr("y", -5).attr("width", 20).attr("height", 10);

            // extending line across middle
            g.selectAll(".tick line").attr("x1", -margin.middle * 0.4).attr("x2", margin.middle * 0.4);

            // centering tick text and moving to front of parent g
            g.selectAll(".tick text").attr("x", 0).each(function() {
                this.parentNode.appendChild(this);
            });
        });

    // add line showing 270 electoral votes
    ec_paths_svg.append("line")
        .attr("id", "line270")
        .attr("x1", margin.left)
        .attr("x2", margin.left + width)
        .attr("y1", margin.top + y(270))
        .attr("y2", margin.top + y(270))

    ec_paths_svg.append("text")
        .attr("id", "line270-caption")
        .attr("x", margin.left)
        .attr("y", margin.top + y(270) + 12)
        .text("270 Electoral Votes");
}

function resize() {

    // delete existing elements
    d3.selectAll("rect.trump, rect.clinton, .ecvotes-cumu-text").remove();
    d3.selectAll("#x-axis-trump, #x-axis-clinton, #y-axis").remove();
    d3.selectAll("#line270, #line270-caption").remove();
    
    // reset d3 width and x scale
    width = $("#d3-2016-electoral-college-paths").width() -  margin.left - margin.right;
    x.range([0, (width - margin.middle) / 2]);

    // re-render
    render_axes();
    render_blocks();
}

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

d3.csv("/assets/data/election2016-results.csv", (d) => {
    d.ecvotes = +(d.winner === "Trump" ? d.ecvotes_trump : d.ecvotes_clinton);
    d.ecvotes_clinton = +d.ecvotes_clinton;
    d.ecvotes_trump = +d.ecvotes_trump;
    d.popvotes_clinton = +d.popvotes_clinton;
    d.popvotes_trump = +d.popvotes_trump;
    d.popvotes_total = +d.popvotes_total;
    d.votemargin = +d.votemargin;
    return d;
}, (e, d) => {
    if (e) throw e;

    // store data for later
    for (var i = 0; i < d.length; i++) data.push(d[i]);

    // update data for swing state mods and sort
    update_data();

    // render block and axes
    render_axes();
    render_blocks();
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(window).resize(() => resize());

$(".slider").change(function() {
    var id  = $(this).attr("id"),
        val = $(this).val();

    // update mod track
    swing_state_mods[id] = val;

    // update text
    $('.slider-margin-text#' + id).text((val < 0 ? "Clinton" : "Trump") + " +" + (Math.abs(val) / 100) + "%");

    // update data
    update_data();

    // delete blocks and re-render
    d3.selectAll("rect.trump, rect.clinton, .ecvotes-cumu-text").remove();
    render_blocks();
})

</script>

