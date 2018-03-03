---
layout: post
title: 'How Obama and Trump Respond to School Shootings'
date: 2018-02-26 05:00:00
categories: data visualization project politics graphic
landing-description: comparing how Obama and Trump respond to school shootings
thumbnail: /assets/img/post-thumbnails/obama-trump-guns.png
excerpt_separator: <!-- more -->
---

In response to a suggestion from Franklin Leonard, the Washington Post recently published [a video](https://www.youtube.com/watch?v=uHrvODeA8-E){:target="_blank"} providing an hour-by-hour comparison of how President Obama and President Trump responded in the wake of school shootings. The video is a very compelling piece for comparing (and contrasting) the differences in these two presidents' approaches.

The video did a great job juxtaposing Obama's and Trump's intraday activities and responses (comparing Obama's first day of response to Trump's, etc.), but I felt it was hard to compare the actual timing of each event. I decided to re-visualize <span id="footnote-1" class="footnote">this information</span> into one single timeline to (hopefully) present a slightly different effect.

<p id="mobile-notice"><i>It seems like you are viewing this page on a small screen or mobile phone. Unfortunately, I haven't optimized this yet for narrow screens so it's going to look a bit like a dumpster fire. I'm working on it. Sorry!</i></p>

<!-- more -->

<svg id="d3-obama-trump-gun-response">
</svg>

<style>
#d3-obama-trump-gun-response {
    width: 100%;
    height: 2000px;
}

#mobile-notice {
    display: none;
}

@media (max-width: 550px) {
    #mobile-notice {
        display: initial;
    }
}

.footnote {
    color: #77bdee;
    cursor: pointer;
}

.footnote:hover {
    text-decoration: underline;
}

.jBox-Tooltip{
    font-family: 'Yantramanav', 'sans-serif';
    max-width: 300px;
}
</style>

<script>
new jBox('Tooltip', {
  attach: '#footnote-1',
  content: "I used transcribed versions of the Washington Post's chyrons for each event's time and description. Some of the descriptions were slightly edited for clarity in this alternate format. Whenever an explicit time was not given (e.g., evening), I used an approximate time."
});

var ot_gun_svg = d3.select("#d3-obama-trump-gun-response");

var margin = {top: 25, right: 15, bottom: 25, left: 15},
    width  = $('#d3-obama-trump-gun-response').width() -  margin.left - margin.right,
    height = $('#d3-obama-trump-gun-response').height() - margin.top - margin.bottom,
    is_mobile = (width >= 470 ? false : true);

var max_hour = 24 * 6 + 8;

var data = [ ];

d3.csv("/assets/data/trump-obama-gun-comp-data.csv", function(d) {
    d.time_approx = +d.time_approx;
    d.hours_into_day = +d.hours_into_day;
    d.days_since_shooting = +d.days_since_shooting;
    d.branch_offset = +d.branch_offset;
    d.first_of_day = +d.first_of_day;
    d.wrap_width = +d.wrap_width;
    d.alt_wrap_width = +d.alt_wrap_width;
    return d;
}, function(error, d) {

    // add headers
    ot_gun_svg.append('text')
        .attr('id', 'obama-header')
        .attr('x', margin.left + width * 1 / 4)
        .attr('y', margin.top + 7)
        .attr('wrap-width', 200)
        .attr('alt-wrap-width', 100)
        .style('font-size', 24)
        .style('text-anchor', 'middle')
        .style('fill', '#77bdee')
        .text('Obama, Newtown');

    ot_gun_svg.append('text')
        .attr('id', 'trump-header')
        .attr('x', margin.left + width * 3 / 4)
        .attr('y', margin.top + 7)
        .attr('wrap-width', 200)
        .attr('alt-wrap-width', 100)
        .style('font-size', 24)
        .style('text-anchor', 'middle')
        .style('fill', '#ff6e6c')
        .text('Trump, Parkland');

    wrap(d3.selectAll('#trump-header, #obama-header'), (width > 500 ? true : false));


    // add center line
    ot_gun_svg.append('line')
        .attr('id', 'center-line')
        .attr('x1', margin.left + width / 2)
        .attr('x2', margin.left + width / 2)
        .attr('y1', margin.top)
        .attr('y2', margin.top + height)
        .style('stroke', '#dadede')
        .style('stroke-width', 2);

    // for each day in timeline, add day markers
    for (var i = 0; i < max_hour; i += 24) {
        ot_gun_svg.append('line')
            .attr('class', 'marker-line-day')
            .attr('x1', margin.left + width * 9 / 20)
            .attr('x2', margin.left + width * 11 / 20)
            .attr('y1', margin.top  + (i / max_hour) * height)
            .attr('y2', margin.top  + (i / max_hour) * height)
            .style('stroke', '#dadede')
            .style('stroke-width', 1);

        ot_gun_svg.append('rect')
            .attr('class', 'marker-text-cover-day')
            .attr('x', margin.left + width / 2 - 20)
            .attr('y', margin.top  + (i / max_hour) * height - 8)
            .attr('width', 40)
            .attr('height', 16)
            .style('fill', 'white');

        ot_gun_svg.append('text')
            .attr('class', 'marker-text-day')
            .attr('x', margin.left + width / 2)
            .attr('y', margin.top  + (i / max_hour) * height + 2)
            .style('font-size', 12)
            .style('text-anchor', 'middle')
            .text(i >= 6 * 24 ? 'Later' : 'Day ' + ((i / 24) + 1));
    }

    data = d;
    render_events(data);
});

function render_events(d) { 
    for (var i = 0; i < d.length; i++) {
        var time_str = "",
            branch_h = margin.top + ((24 * d[i].days_since_shooting + d[i].hours_into_day) / max_hour) * height,
            branch_w = margin.left + width / 2 + (width * (3 + d[i].branch_offset) / 20) * (d[i].obama_trump == "Obama" ? -1 : 1);

        // parse time string
        var time_str = "";
        
        if (d[i].days_since_shooting == 6) {
            time_str == "";
        } else if (d[i].first_of_day == 1) {
            if (d[i].time_approx == 1 && d[i].alt_time_desc.length > 0) time_str = d[i].date + ", " + d[i].alt_time_desc;
            else if (d[i].time_approx == 1) time_str = d[i].date;
            else time_str = d[i].date + ", " + d[i].time;
        } else {
            if (d[i].time_approx == 1 && d[i].alt_time_desc.length > 0) time_str = d[i].alt_time_desc;
            else if (d[i].time_approx == 1) time_str = d[i].date;
            else time_str = d[i].time;
        }

        ot_gun_svg.append('line')
            .attr('class', 'marker-line')
            .attr('x1', margin.left + width / 2)
            .attr('x2', branch_w)
            .attr('y1', branch_h)
            .attr('y2', branch_h)
            .style('stroke', '#a4a4a4')
            .style('stroke-width', 1);

        ot_gun_svg.append('circle')
            .attr('class', 'marker-circle')
            .attr('r', 3.5)
            .attr('cx', margin.left + width / 2)
            .attr('cy', branch_h)
            .style('stroke', 'gray')
            .style('fill', '#dadede');

        ot_gun_svg.append('text')
            .attr('class', 'time-string')
            .attr('x', branch_w + (d[i].obama_trump == "Obama" ? -5 : 5))
            .attr('y', branch_h + 3)
            .style('font-size', 12)
            .style('fill', (d[i].obama_trump == "Obama" ? '#77bdee' : '#ff6e6c'))
            .style('text-anchor', (d[i].obama_trump == "Obama" ? 'end' : 'start'))
            .text(time_str);

        if (d[i].days_since_shooting < 6) {
            ot_gun_svg.append('text')
                .attr('class', 'desc-string')
                .attr('x', branch_w + (d[i].obama_trump == "Obama" ? -5 : 5))
                .attr('y', branch_h + 18)
                .attr('wrap-width', d[i].wrap_width)
                .attr('alt-wrap-width', d[i].alt_wrap_width)
                .style('font-size', 12)
                .style('text-anchor', (d[i].obama_trump == "Obama" ? 'end' : 'start'))
                .text(d[i].description);
        } else {
            ot_gun_svg.append('text')
                .attr('class', 'desc-string')
                .attr('x', branch_w + (d[i].obama_trump == "Obama" ? -5 : 5))
                .attr('y', branch_h + 3)
                .attr('wrap-width', d[i].wrap_width)
                .attr('alt-wrap-width', d[i].alt_wrap_width)
                .style('font-size', 12)
                .style('text-anchor', (d[i].obama_trump == "Obama" ? 'end' : 'start'))
                .text(d[i].description);
        }
    }

    wrap(d3.selectAll('.desc-string'), (width > 630 ? true : false));
}

function wrap(text, wide) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            ww = (wide ? text.attr("wrap-width") : text.attr("alt-wrap-width")),
            dy = 0,
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > ww) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

$(window).resize(function() {
    width = $('#d3-obama-trump-gun-response').width() -  margin.left - margin.right;
    
    // move over headers, center line,  and day markers
    d3.select('#obama-header').attr('x', margin.left + width * 1 / 4);
    d3.select('#trump-header').attr('x', margin.left + width * 3 / 4);

    if (width >= 450) {
        d3.select('#obama-header').text("Obama, Newton");
        d3.select('#trump-header').text("Trump, Parkland");
    } else if (width < 450) {
        d3.select('#obama-header').text("Obama");
        d3.select('#trump-header').text("Trump");
    }

    d3.select('#center-line').attr('x1', margin.left + width / 2).attr('x2', margin.left + width / 2);

    d3.selectAll('.marker-line-day').attr('x1', margin.left + width * 9 / 20).attr('x2', margin.left + width * 11 / 20);

    d3.selectAll('.marker-text-cover-day').attr('x', margin.left + width / 2 - 20);

    d3.selectAll('.marker-text-day').attr('x', margin.left + width / 2);

    // re-render events
    d3.selectAll('.marker-line, .marker-circle, .time-string, .desc-string').remove();
    render_events(data);

    // if under 470, enter mobile view
    if (width < 470 & is_mobile == false) {
        is_mobile = true;
    } else if (width >= 470 & is_mobile == true) {
        is_mobile = false;
    }
});
</script>