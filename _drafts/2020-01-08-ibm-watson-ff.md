---
layout: post
title:  "Is IBM Watson Good At Fantasy Football?"
date:   2020-01-08 15:05:41
categories: project data visualization football fantasy ibm
thumbnail: /assets/img/post-thumbnails/ff-ibm-watson.png
landing-description: the accuracy of IBM Watson's fantasy football projections
---

In the years since IBM's Watson supercomputer infamously appeared on <i>Jeopardy</i> in 2011, Watson has become a household name and one of the most well-known examples of artificial intelligence in the real world. Much of this fame has come from IBM's continued marketing that integrates and showcases Watson in a variety of real-world applications. An example is [IBM's recent partnership with ESPN](https://www.ibm.com/sports/fantasy/) to bring Watson's AI capabilities to ESPN's fantasy football system in the form of player-by-player performance projections. [Per IBM's marketing materials](https://www.youtube.com/watch?v=uDeP5b3iKfU) for the project, Watson was trained to predict weekly scoring ranges for players to indicate their upsides and downsides as well as the projected likelihood that a player will exceed or fall below these thresholds. These projections are shown to fantasy football players when viewing a specific athlete's stats and are also frequently used in discussions on [ESPN's fantasy-driven shows](https://www.espn.com/watch/series/e2d4e77d-6242-42d3-a6db-e749751f0ef4/the-fantasy-show).

<div class='columns two'>
    <div class='column'>
        {% include figure.html src="/assets/img/posts/ibm-watson-proj-ex.jpg" alt="An example of Watson's player projections." %}
    </div>
    <div class='column'>
        <p>For the 2019 season, Watson made projections for hundreds of players across 17 weeks, which amounts to thousands of distinct player projections. For each projection, a player is given two point thresholds (an upside or "boom" threshold and a downside or "bust" threshold) that indicate how strong of a week Watson projects for that player. Watson also assigns probabilities for these thresholds and the overall likelihood of a player having a good or bad week. For example, in week 5, Watson gave Patrick Mahomes a boom threshold of 28.3 points and a bust threshold of 10.0 points, where each had an 8% chance of occurring. This means that, based on Watson's projections, Mahomes had an 8% chance of having a great week (scoring 28.3 or more points), an 8% chance of having a bad week (scoring 10 or fewer points), and 84% chance of scoring somewhere in between - he ultimately went on to score 18.5 points.</p>
    </div>
</div>

IBM and ESPN have described these projections as a way for fantasy football players to quickly gain insights and another tool for players to use when making game-time decisions. However, after a few seasons of the partnership, there is still relatively little information on the overall accuracy of these projections. IBM has said that [Watson helped an IBM data scientist go undefeated in fantasy football](https://www.ibm.com/thought-leadership/fantasy-football/index.html), but this is one example and is obviously from a somewhat biased perspective. Thus, inspired by [a recent project from FiveThirtyEight](https://projects.fivethirtyeight.com/checking-our-work/), I decided to find out for myself.

Using all of Watson's projections, we can assess Watson's accuracy by measuring how well calibrated its predictions are. In this context, calibration is a measure of how accurately Watson's predicts align with the real-world results of what it predicted. For example, if, over the course of the season, Watson made 100 projections that have a 40% chance of occurring and 40 of them were correct, we would say that the model is well-calibrated. However, if instead 70% of these predictions were correct, we would say that Watson is poorly calibrated. This is because the forecasted likelihood associated with these projections (40% chance) were inconsistent with the actual likelihood for which they occurred (70% chance).

We can therefore measure Watson's overall calibration by bucketing thousands of its projections based on their predicted chance and then test how often those projections actually occurred. If we plot this, we would expect a perfectly calibrated model to follow the dotted diagonal line, while a poorly calibrated model would diverge from this line at different points. By this measure, this year's data would indicate that Watson is doing so-so. Each dot in the plot below represents a group of projections and for the most part, these points somewhat correlate with the trend we would expect for a perfectly calibrated model, though it's clear Watson has been far from perfect.

<div id="d3-ff-ibm-container">
    <div id="d3-ff-ibm-title">
        <h3>Forecasted vs. actual probabilities for IBM Watson + ESPN fantasy football projections</h3>
        <p>Bucket size: <span class="bucket-button">n = 1</span><span class="bucket-button selected">n = 2</span><span class="bucket-button">n = 5</span><span class="bucket-button">n = 10</span></p>
    </div>
    <svg id="d3-ff-ibm">
    </svg>
</div>

It is worth noting the importance of sample size when we talk about calibration. If a model makes 100,000 projections with a likelihood of 20% and 20% of these projections are correct, it is fair to say that the model is well-calibrated. However, if a model makes five similar projections (all with a 20% chance of occurring) and two of them (40%) are correct, we should hesitate from calling the model poorly calibrated. This measure of calibration, like all things in statistics, follows [the law of large numbers](https://en.wikipedia.org/wiki/Law_of_large_numbers) so there is always a possibility of irregular outcomes with smaller sample sizes. Thus, it is worth noting that the dots/buckets that appear the furthest from perfectly calibrated are often associated with groups with relatively fewer projections. To play around with this, you can change the size of the buckets above, which will change the range of projections included in a particular bucket (e.g., when n = 2, all projections between 25 - 27% are grouped together; when n = 10, all projections between 25 - 30% are grouped together).

Given all of this, it is worth asking if this application of Watson is successful? From a strictly data science perspective, Watson has done a fine but not great job. To be fair, it is incredibly difficult to predict the performance of individual players with any real sense of accuracy. There are so many convoluted factors that can lead to a successful game for a particular athlete, more than even Watson's mighty powers might be able to entirely understand.

However, as much as Watson and its applications are depicted as data science projects, I don't think IBM assesses Watson's success from a data science perspective. Instead, by [all reasonable accounts](https://gizmodo.com/why-everyone-is-hating-on-watson-including-the-people-w-1797510888), Watson is actually a very expensive marketing tool. Watson's work with ESPN never appears to be marketed as the next great tool for fantasy football players to dominate in leagues but rather as the next great tool that ESPN could use to keep users engaged. Thus Watson's success is likely not measured by its calibration or accuracy, but rather how much money it can make for ESPN and how many new clients it can bring in for IBM. Watson has certainly developed the capabilities to do some remarkable things - beating Ken Jennings is no laughing matter - but more than anything, Watson's work at ESPN serves as a shiny example of all the things that other business could potentially accomplish if they pay lots of money to IBM.

{% capture methodology-note %}
IBM Watson's weekly player projections were scraped from ESPN for weeks 1 - 16 of the 2019 season. ESPN did not report projections for all players in all weeks, both when the player was not likely to play or when the player did not have enough relevant data available to make a projection. If the player had no projection for week 16, it was not possible to view Watson's projections for the player in prior weeks, so these data are not reflected. In total, 2930 player-weeks of data were used, where each player-week had three projections, resulting in 8790 total projections assessed.

Watson's point projections reflect <a href="https://www.nbcsports.com/bayarea/49ers/what-ppr-means-fantasy-football-and-three-picks-target-draft">PPR</a> scoring.

You can view the full list of projections used <a href="/projects/fantasy-football/data/ibm-watson-ff-projections-2019.csv">here</a>.
{% endcapture %}
{% include methodology-note.html content=methodology-note break='yes' %}

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

d3.csv("/projects/fantasy-football/data/ff-ibm-watson-projections.csv", (d) => {
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


