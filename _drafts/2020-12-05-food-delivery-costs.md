---
layout: post
title:  "Do You Know How Much Your Food Delivery Costs?"
date:   2020-12-05 10:05:41
categories: project food delivery visualization
show-on-landing: false
landing-description: ...
d3v: v6
---

<div id="fooddelivery-viz">
    <svg id="fooddelivery-svg"></svg>
</div>


<style>
    #fooddelivery-viz {
        width: 100%;
        height: 310px;
    }

    #fooddelivery-svg {
        width: 100%;
        height: 100%;
    }

    rect.bar.food_cost {
        fill: #a9a9a9;
    }

    rect.bar.addl_cost {
        fill: orange;
    }

    rect.drag-target {
        cursor: col-resize;
        fill: rgba(255, 0, 0, 0);
    }

    text.bar-label {
        fill: black;
        text-anchor: end;
        alignment-baseline: middle;
    }

    text.bar-cost-label {
        fill: black;
        text-anchor: start;
        alignment-baseline: middle;
    }

    line.x-axis-gridline {
        stroke: #c9c9c9;
        stroke-dasharray: 5 5;
    }

    line.x-axis-gridline#baseline {
        stroke: black;
        stroke-dasharray: 0;
    }

    g#show-me-btn {
        cursor: pointer;
    }
</style>
<script>
/**********************/
/*** INIT VARIABLES ***/
/**********************/

let margin = {top: 30, right: 60, bottom: 0, left: 120, bar: 5, label: 8},
    width  = $("#fooddelivery-viz").width() - margin.left - margin.right,
    height = $("#fooddelivery-viz").height() - margin.top - margin.bottom;

const bar_height = 40,
      target_width = 20;

const axis_ticks = [0, 5, 10, 15, 20, 25, 30];

let revealed = false;

// create svg
let svg = d3.select("#fooddelivery-svg");

// create scales
let x = d3.scaleLinear().domain([0, 30]).range([0, width]);

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

// take string to produce clean id
function clean_id(str) {
    return str.replace(" ", "-").toLowerCase();
}

// draw grid + axis
function draw_grid() {
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisTop(x)
            .tickValues(axis_ticks)
            .tickFormat(d3.format("$.0f")));

    svg.append("g")
        .attr("id", "x-axis-grid")
        .selectAll("line.x-axis-gridline")
        .data(axis_ticks).enter()
        .append("line")
        .classed("x-axis-gridline", true)
        .attr("id", d => d == 0 ? "baseline" : "grid")
        .attr("x1", d => margin.left + x(d) + 0.5)
        .attr("x2", d => margin.left + x(d) + 0.5)
        .attr("y1", margin.top)
        .attr("y2", margin.top + height);
}

// draw bars
function draw_bars() {
    let bars = svg.selectAll("g.bar")
        .data(data).enter()
        .append("g")
        .classed("bar", true);

    bars.append("rect")
        .classed("bar", true)
        .classed("food_cost", true)
        .attr("id", d => "bar-" + clean_id(d.id))
        .attr("x", margin.left)
        .attr("y", d => margin.top + data.indexOf(d) * (bar_height + margin.bar) + margin.bar)
        .attr("width", d => x(d.food_cost))
        .attr("height", bar_height);

    bars.append("rect")
        .classed("bar", true)
        .classed("addl_cost", true)
        .classed("draggable", d => d.draggable)
        .attr("id", d => "bar-" + clean_id(d.id))
        .attr("x", d => margin.left + x(d.food_cost))
        .attr("y", d => margin.top + data.indexOf(d) * (bar_height + margin.bar) + margin.bar)
        .attr("width", d => x(d.addl_cost))
        .attr("height", bar_height);

    bars.append("text")
        .classed("bar-label", true)
        .attr("id", d => "label-" + clean_id(d.id))
        .attr("x", d => margin.left - margin.label)
        .attr("y", d => margin.top + data.indexOf(d) * (bar_height + margin.bar) + margin.bar + bar_height * 0.5)
        .text(d => d.id);

    bars.append("text")
        .classed("bar-cost-label", true)
        .classed("draggable", d => d.draggable)
        .attr("id", d => "cost-label-" + clean_id(d.id))
        .attr("x", d => margin.left + margin.label + x(d.food_cost + d.addl_cost))
        .attr("y", d => margin.top + data.indexOf(d) * (bar_height + margin.bar) + margin.bar + bar_height * 0.5)
        .text(d => d3.format("$.2f")(d.food_cost + d.addl_cost));

    if (!revealed) {
        svg.selectAll("g.bar")
            .filter(d => d.draggable)
            .append("rect")
            .classed("drag-target", true)
            .attr("id", d => "drag-target-" + d.id)
            .attr("x", d => margin.left + x(d.food_cost + d.addl_cost) - target_width / 2)
            .attr("y", d => margin.top + data.indexOf(d) * (bar_height + margin.bar) + margin.bar)
            .attr("width", target_width)
            .attr("height", bar_height)
            .call(d3.drag()
                .on("drag", (event, d) => (d.addl_cost = x.invert(event.x - margin.left) - d.food_cost))
                .on("drag.update", update_drag));
    }
}

function draw_show_btn() {
    let sect = svg.append("g")
        .attr("id", "show-me-sect");

    sect.append("rect")
        .attr("id", "show-me-cover")
        .attr("x", 0)
        .attr("y", margin.top + bar_height + 2 * margin.bar)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .style("fill", "rgba(255, 255, 255, 1)");

    let btn = sect.append("g")
        .attr("id", "show-me-btn")
        .on("click", reveal_bars);

    btn.append("rect")
        .attr("x", margin.left + width / 2 - 75)
        .attr("y", margin.top + 1.25 * bar_height + margin.bar)
        .attr("width", 150)
        .attr("height", 35)
        .attr("rx", 15)
        .style("fill", "#77bdee");

    btn.append("text")
        .attr("x", margin.left + width / 2)
        .attr("y", margin.top + 1.25 * bar_height + margin.bar + 17.5)
        .text("Show me how I did")
        .style("fill", "white")
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle");
}

// reveal bars
function reveal_bars() {
    revealed = true;

    svg.select("rect.drag-target").remove();

    svg.select("#show-me-cover")
        .transition()
        .duration(500)
        .attr("y", height)
        .delay(200)
        .remove();

    svg.select("#show-me-btn")
        .transition()
        .duration(100)
        .style("opacity", 0)
        .delay(200)
        .remove();
}

// update bar position
function update_drag() {
    svg.selectAll("rect.bar.draggable")
        .attr("width", d => x(Math.min(19.3, Math.max(0, d.addl_cost))));

    svg.selectAll("text.bar-cost-label.draggable")
        .attr("x", d => margin.left + x(d.food_cost + Math.min(19.3, Math.max(0, d.addl_cost))) + margin.label)
        .text(d => d3.format("$.2f")(d.food_cost + Math.min(19.3, Math.max(0, d.addl_cost))))

    svg.selectAll("rect.drag-target")
        .attr("x", d => margin.left + x(d.food_cost + Math.min(19.3, Math.max(0, d.addl_cost))) - target_width / 2);
}

// resize chart on page size change
function resize() {

    // reset width
    width = $("#fooddelivery-viz").width() - margin.left - margin.right;
    x.range([0, width]);

    // remove existing elements
    svg.selectAll("#x-axis, #x-axis-grid, g.bar, g#show-me-sect").remove();

    // redraw
    draw_grid();
    draw_bars(revealed);
    if (!revealed) draw_show_btn();
}

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

let data = [{id: "Your guess", food_cost: 10.70, addl_cost: 0.5, draggable: true},
            {id: "Chipotle website", food_cost: 10.70, addl_cost: 0.87},
            {id: "DoorDash", food_cost: 12.05, addl_cost: 5.28},
            {id: "Uber Eats", food_cost: 12.40, addl_cost: 9.31},
            {id: "GrubHub", food_cost: 12.40, addl_cost: 10.87},
            {id: "Postmates", food_cost: 12.65, addl_cost: 13.16}];

data.sort(function(x, y){
   return d3.ascending(x.food_cost + x.addl_cost, y.food_cost + y.addl_cost);
});

draw_grid();
draw_bars(true);
draw_show_btn();

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(window).resize(resize);

</script>


