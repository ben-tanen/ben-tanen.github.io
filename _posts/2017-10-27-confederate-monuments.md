---
layout: post
title: 'What Does the Public Think About Confederate Monuments?'
date: 2017-10-27 05:00:00
thumbnail: /assets/img/post-thumbnails/confederate-monuments.png
landing-proj:  true
landing-order: 1
landing-img:   /assets/img/posts/redistricting-sankey-vert.png
landing-large: false
---

I recently came across [an article](http://kut.org/post/uttt-poll-most-texas-voters-say-confederate-memorials-shouldn-t-move-0) from KUT, Austin's NPR station, about Confederate statues with the following news graphic:

{% include figure.html autolink="yes" src="/assets/img/posts/confederate-monuments-poll.jpg" alt="The original graphic on Confederate statues" width=550 %}

The contents of the graphic and the results of the poll were interesting, but more than anything, I was intrigued by their choice of chart type. On my first viewing, it took me a second to mentally reconcile what exactly was going on. What were all the bars? Why all the colors? I then noticed the clustering and realized it was not just any bar chart, but instead a clustered *and* stacked bar chart. It's now clear they wanted to emphasize the contrast between the "move or remove" responses and the "leave them" responses, but with so many bars and mixed colors, I found myself lost in comparisons.

<!-- more -->

In an effort to think about how I would tweak this chart, I immediately jumped to the idea of using a 100% stacked bar chart. I quickly threw one together (see below) but it still just didn't seem right. In this styling, I think the groupings (Republican vs. Independent vs. Democrat) becomes a little more clear, but this chart lost the contrast between the "move or remove" and "leave" responses that was present in the original graphic. Ultimately, I don't think this was much of an improvement and was actually more of a step back.

{% include figure.html autolink="yes" src="/assets/img/posts/confederate-monuments-remake.png" alt="A quick remake of the Confederate statue graphic" width=550 %}

While the 100% stacked bar chart wasn't exactly what I was looking for, it did remind me of [an article](http://www.visualisingdata.com/2016/08/little-visualisation-design-part-21/) from Andy Kirk and his ["little of visualization design" series](http://www.visualisingdata.com/2016/03/little-visualisation-design/). In the post, Kirk talked about improving [a 100% stacked bar chart on lies in politics](http://mannmetrics.com/who-lies-more/) by turning it into [a diverging stacked bar chart](https://peltiertech.com/diverging-stacked-bar-charts/). Kirk said that this change would help emphasize the polarity in the chart and I knew this was exactly what I was looking to do for the KUT chart. So I took a whack at remake #2, leading to the diverging bar chart below, which I think is a winner, or, at the very least, an improvement.

<svg id="d3-confederate-poll">
</svg>

At the end of the day, this was all mostly just an exercise for myself. KUT did a good job with their chart and more importantly with using their chart as one of many parts to tell an interesting story. Data visualization is hard and a lot of it ends up being very subjective on what works and what doesn't. To some, KUT's original chart may be better than my remake. I simply wanted to use this as a chance to work on my own design skills. If you have any thoughts or ideas on improvements or changes, I'd love to hear!

<style>
#d3-confederate-poll {
    width: 100%;
    height: 290px;
}

text.pct-label {
    fill: #36393a;
    font-size: 10px;
    text-anchor: middle;
}

rect.legend {
    width: 15px;
    height: 15px;
}

.remove    { fill: #e95946; }
.move      { fill: #42b0a1; }
.leave-add { fill: #f9a545; }
.leave     { fill: #a6a6a6; }

</style>

<script>
var confederate_svg = d3.select("#d3-confederate-poll");

var margin = {top: 100, right: 15, bottom: 75, left: 15, bar: 8},
    width  = $('#d3-confederate-poll').width() -  margin.left - margin.right,
    height = $('#d3-confederate-poll').height() - margin.top - margin.bottom;

var scale = d3.scaleLinear().range([0, width]).domain([-1,1]).nice();

var data = [ ];

d3.csv("/assets/data/kut-poll-data.csv", function(d) {
    d.leave = +d.leave;
    d.leave_add = +d.leave_add;
    d.remove = +d.remove;
    d.move = +d.move;
    d.unsure = +d.unsure;
    return d;
}, function(error, d) {
    for (var i = 0; i < d.length; i++) data.push(d[i]);

    bar_size = (height - (margin.bar * (data.length - 1))) / data.length;

    for (var i = 0; i < data.length; i++) {
        render_bar(data, i);
    }

    render_axes();
    render_text();
});

// make chart resizable
$(window).resize(function() {
    width  = $('#d3-confederate-poll').width() -  margin.left - margin.right;

    scale.range([0, width]);

    d3.selectAll('text').remove();
    d3.selectAll('rect').remove();
    d3.selectAll('line').remove();
    d3.select('#x-axis').remove();

    for (var i = 0; i < data.length; i++) {
        render_bar(data, i);
    }

    render_axes();
    render_text();
});

function render_bar(data, i) {
    confederate_svg.append('rect')
        .attr('class', 'bar leave-add')
        .attr('width', scale(data[i].leave_add) - scale(0))
        .attr('height', bar_size)
        .attr('x', margin.left + scale(0))
        .attr('y', margin.top + bar_size * i + margin.bar * i + (i > 0 ? margin.bar : 0));

    if (scale(data[i].leave_add) - scale(0) > 25) {
        confederate_svg.append('text')
            .attr('class', 'text pct-label')
            .attr('x', margin.left + scale(0) + (scale(data[i].leave_add) - scale(0)) / 2)
            .attr('y', margin.top + bar_size * (i + 0.65) + margin.bar * i + (i > 0 ? margin.bar : 0))
            .text((data[i].leave_add * 100).toFixed(0) + "%");
    }

    confederate_svg.append('rect')
        .attr('class', 'bar leave')
        .attr('width', scale(data[i].leave) - scale(0))
        .attr('height', bar_size)
        .attr('x', margin.left + scale(data[i].leave_add))
        .attr('y', margin.top + bar_size * i + margin.bar * i + (i > 0 ? margin.bar : 0));

    if (scale(data[i].leave) - scale(0) > 25) {
        confederate_svg.append('text')
            .attr('class', 'pct-label')
            .attr('x', margin.left + scale(data[i].leave_add) + (scale(data[i].leave) - scale(0)) / 2)
            .attr('y', margin.top + bar_size * (i + 0.65) + margin.bar * i + (i > 0 ? margin.bar : 0))
            .text((data[i].leave * 100).toFixed(0) + "%");
    }

    confederate_svg.append('rect')
        .attr('class', 'bar remove')
        .attr('width', scale(data[i].remove) - scale(0))
        .attr('height', bar_size)
        .attr('x', margin.left + scale(-data[i].remove - data[i].move))
        .attr('y', margin.top + bar_size * i + margin.bar * i + (i > 0 ? margin.bar : 0));

    if (scale(data[i].remove) - scale(0) > 25) {
        confederate_svg.append('text')
            .attr('class', 'pct-label')
            .attr('x', margin.left + scale(-data[i].remove - data[i].move) + (scale(data[i].remove) - scale(0)) / 2)
            .attr('y', margin.top + bar_size * (i + 0.65) + margin.bar * i + (i > 0 ? margin.bar : 0))
            .text((data[i].remove * 100).toFixed(0) + "%");
    }

    confederate_svg.append('rect')
        .attr('class', 'bar move')
        .attr('width', scale(data[i].move) - scale(0))
        .attr('height', bar_size)
        .attr('x', margin.left + scale(-data[i].move))
        .attr('y', margin.top + bar_size * i + margin.bar * i + (i > 0 ? margin.bar : 0));

    if (scale(data[i].move) - scale(0) > 25) {
        confederate_svg.append('text')
            .attr('class', 'text pct-label')
            .attr('x', margin.left + scale(-data[i].move) + (scale(data[i].move) - scale(0)) / 2)
            .attr('y', margin.top + bar_size * (i + 0.65) + margin.bar * i + (i > 0 ? margin.bar : 0))
            .text((data[i].move * 100).toFixed(0) + "%");
    }

    confederate_svg.append('text')
        .attr('class', 'text label')
        .attr('x', margin.left + scale(-data[i].remove - data[i].move) - 7)
        .attr('y', margin.top + bar_size * (i + 0.6) + margin.bar * i + (i > 0 ? margin.bar : 0))
        .style('font-size', '11.5px')
        .style('text-anchor', 'end')
        .text(clean_group_name(data[i].group));
}

function render_axes() {
    confederate_svg.append('line')
        .attr('id', 'midline')
        .attr('x1', margin.left + scale(0) + 0.5)
        .attr('x2', margin.left + scale(0) + 0.5)
        .attr('y1', margin.top)
        .attr('y2', margin.top + height + margin.bar * 2)
        .attr('stroke', 'black');

    confederate_svg.append('line')
        .attr('id', 'breakline')
        .attr('x1', margin.left)
        .attr('x2', margin.left + width)
        .attr('y1', margin.top + bar_size + margin.bar)
        .attr('y2', margin.top + bar_size + margin.bar)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.75)
        .attr('stroke-dasharray', '5, 5');

    confederate_svg.append("g")
        .attr("id","x-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top + height + margin.bar * 2})`)
        .call(d3.axisBottom(scale).ticks(5).tickFormat(function (d) { 
            if (d < 0) d = -d; // No nagative labels
            return d3.format(".0%")(d);
        }));
}

function render_text() {
    if (width <= 450) {
        confederate_svg.append("text")
            .attr('id', 'title1')
            .attr('id', 'title2')
            .attr("transform", `translate(${margin.left + width / 2}, 16)`)
            .style('font-size', '16px')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text("What to do with");

        confederate_svg.append("text")
            .attr('id', 'title1')
            .attr('id', 'title2')
            .attr("transform", `translate(${margin.left + width / 2}, 32)`)
            .style('font-size', '16px')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text("Confederate monuments?");
    } else {
        confederate_svg.append("text")
            .attr('id', 'title')
            .attr("transform", `translate(${margin.left + width / 2}, 27.5)`)
            .style('font-size', '18px')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text("What to do with Confederate monuments?");
    }

    /* legend */
    confederate_svg.append("rect")
        .attr('class', 'legend remove')
        .attr("x", margin.left + width / 2 - 20)
        .attr("y", 42.5);

    confederate_svg.append("text")
        .attr("transform", `translate(${margin.left + width / 2 - 25}, 55)`)
        .style('font-size', '12px')
        .style('text-anchor', 'end')
        .text("Remove them");

    confederate_svg.append("rect")
        .attr('class', 'legend move')
        .attr("x", margin.left + width / 2 - 20)
        .attr("y", 67.5);

    confederate_svg.append("text")
        .attr("transform", `translate(${margin.left + width / 2 - 25}, 80)`)
        .style('font-size', '12px')
        .style('text-anchor', 'end')
        .text("Move to museums");

    confederate_svg.append("rect")
        .attr('class', 'legend leave-add')
        .attr("x", margin.left + width / 2 + 5)
        .attr("y", 67.5);

    confederate_svg.append("text")
        .attr("transform", `translate(${margin.left + width / 2 + 25}, 80)`)
        .style('font-size', '12px')
        .style('text-anchor', 'start')
        .text(`${width <= 300 ? "A" : "Leave them, a"}dd ${width <= 400 ? " " : "historical "}context`);

    confederate_svg.append("rect")
        .attr('class', 'legend leave')
        .attr("x", margin.left + width / 2 + 5)
        .attr("y", 42.5);

    confederate_svg.append("text")
        .attr("transform", `translate(${margin.left + width / 2 + 25}, 55)`)
        .style('font-size', '12px')
        .style('text-anchor', 'start')
        .text("Leave them as is");

    /* source */
    confederate_svg.append("text")
        .attr("transform", `translate(${margin.left + width}, ${margin.top + height + 55})`)
        .style('font-size', '11px')
        .style('text-anchor', 'end')
        .style('fill', '#989c9e')
        .text("Source: UT/TT Poll, KUT 90.5");
}

function clean_group_name(group) {
    if (width <= 450) {
        if (group == "independents") return "Indep.";
        else if (group == "all") return "All";
        else return group[0].toUpperCase() + group.substring(1,3) + ".";
    }
    else {
        return group[0].toUpperCase() + group.substring(1,group.length);
    }
}
</script>



