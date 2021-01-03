---
layout: post
title: 'How Obama and Trump Responded to School Shootings'
date: 2018-03-03 05:00:00
thumbnail: /assets/img/post-thumbnails/obama-trump-guns.png
landing-proj:  true
landing-order: 18
landing-img:   /assets/img/proj-thumbnails/comparing-obama-trump-on-guns.png
landing-large: false
new-post-style: true
---

In response to a suggestion from [Franklin Leonard](https://twitter.com/franklinleonard){:target="_blank"}, the Washington Post recently published [a video](https://www.youtube.com/watch?v=uHrvODeA8-E){:target="_blank"} providing an hour-by-hour comparison of how President Obama and President Trump responded in the wake of school shootings. The video is a very compelling piece for comparing (and contrasting) the differences in these two presidents' approaches.

The video did a great job juxtaposing Obama's and Trump's intraday activities and responses (comparing Obama's first day of response to Trump's, etc.), but I felt it was hard to compare the actual timing of each event. I decided to re-visualize <span id="footnote-1" class="footnote">this information</span> into one single timeline to (hopefully) present a slightly different effect.

<!-- more -->

<svg id="d3-obama-trump-gun-response">
</svg>

<style>
#d3-obama-trump-gun-response {
    width: 100%;
    height: 2000px;
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

text.header {
    font-size: 24px;
    text-anchor: middle;
}

line#center-line {
    stroke: #dadede;
    stroke-width: 2;
}

line.marker-line-day {
    stroke: #dadede;
    stroke-width: 1;
}

line.marker-line {
    stroke: #a4a4a4;
    stroke-width: 1;
}

circle.marker-circle {
    stroke: gray;
    fill: #dadede;
}

text.marker-text-day {
    font-size: 12px;
    text-anchor: middle;
}

text.time-string, text.desc-string {
    font-size: 12px;
}

.time-string.Obama, .desc-string.Obama { text-anchor: end; }
.time-string.Trump, .desc-string.Trump { text-anchor: start; }

.header.Obama, .time-string.Obama { fill: #77bdee; }
.header.Trump, .time-string.Trump { fill: #ff6e6c; }

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
    d.event_id = +d.event_id;
    return d;
}, function(error, d) {

    // add headers
    ot_gun_svg.append('text')
        .classed('header', true)
        .classed('Obama', true)
        .attr('x', margin.left + width * 1 / 4 - 10)
        .attr('y', margin.top + 7)
        .attr('wrap-width', 200)
        .attr('alt-wrap-width', 100)
        .text('Obama, Newtown');

    ot_gun_svg.append('text')
        .classed('header', true)
        .classed('Trump', true)
        .attr('x', margin.left + width * 3 / 4 + 10)
        .attr('y', margin.top + 7)
        .attr('wrap-width', 200)
        .attr('alt-wrap-width', 100)
        .text('Trump, Parkland');

    wrap(d3.selectAll('text.header'), (width > 500 ? true : false));

    // add center line
    ot_gun_svg.append('line')
        .attr('id', 'center-line')
        .attr('x1', margin.left + width / 2)
        .attr('x2', margin.left + width / 2)
        .attr('y1', margin.top)
        .attr('y2', margin.top + height);

    // for each day in timeline, add day markers
    for (var i = 0; i < max_hour; i += 24) {
        ot_gun_svg.append('line')
            .classed('marker-line-day', true)
            .attr('x1', margin.left + width * 9 / 20)
            .attr('x2', margin.left + width * 11 / 20)
            .attr('y1', margin.top  + (i / max_hour) * height)
            .attr('y2', margin.top  + (i / max_hour) * height);

        ot_gun_svg.append('rect')
            .classed('marker-text-cover-day', true)
            .attr('x', margin.left + width / 2 - 20)
            .attr('y', margin.top  + (i / max_hour) * height - 8)
            .attr('width', 40)
            .attr('height', 16)
            .style('fill', 'white');

        ot_gun_svg.append('text')
            .classed('marker-text-day', true)
            .attr('x', margin.left + width / 2)
            .attr('y', margin.top  + (i / max_hour) * height + 2)
            .text(i >= 6 * 24 ? 'Later' : 'Day ' + ((i / 24) + 1));
    }

    data = d;
    render_events(data);
});

function draw_marker_line(path) {
    for (var i = 0; i < path.length - 1; i++) {
        ot_gun_svg.append('line')
            .classed('marker-line', true)
            .attr('x1', path[i][0])
            .attr('x2', path[i + 1][0])
            .attr('y1', path[i][1])
            .attr('y2', path[i + 1][1]);
    }
}

function render_events(d) { 
    for (var i = 0; i < d.length; i++) {
        var time_str = "",
            branch_h = margin.top + ((24 * d[i].days_since_shooting + d[i].hours_into_day) / max_hour) * height,
            branch_w = margin.left + width / 2 + (width * (3 + d[i].branch_offset) / 20) * (d[i].obama_trump == "Obama" ? -1 : 1),
            marker_line_path = [[margin.left + width / 2, branch_h], [branch_w, branch_h]];

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

        // adjust branch placement if mobile
        if (is_mobile) {
            if (d[i].event_id == 1) {
                marker_line_path = [[margin.left + width / 2, branch_h],
                                    [margin.left + width / 2 - 20, branch_h],
                                    [margin.left + width / 2 - 20, branch_h - 60],
                                    [margin.left + width * 1.25 / 4, branch_h - 60]];
            } else if (d[i].event_id == 2) {
                marker_line_path = [[margin.left + width / 2, branch_h],
                                    [margin.left + width * .8 / 4, branch_h]]
            } else if (d[i].event_id == 5) {
                marker_line_path = [[margin.left + width / 2, branch_h],
                                    [margin.left + width / 2 - 20, branch_h],
                                    [margin.left + width / 2 - 20, branch_h - 60],
                                    [margin.left + width * 1.5 / 4, branch_h - 60]];
            } else if (d[i].event_id == 7) {
                marker_line_path = [[margin.left + width / 2, branch_h],
                                    [margin.left + width / 2 - 20, branch_h],
                                    [margin.left + width / 2 - 20, branch_h - 60],
                                    [margin.left + width * 1.25 / 4, branch_h - 60]];
            } else if (d[i].event_id == 12) {
                marker_line_path = [[margin.left + width / 2, branch_h],
                                    [margin.left + width / 2 + 20, branch_h],
                                    [margin.left + width / 2 + 20, branch_h - 80],
                                    [margin.left + width * 2.6 / 4, branch_h - 80]];
            } else if (d[i].event_id == 14) { 
                marker_line_path = [[margin.left + width / 2, branch_h],
                                    [margin.left + width / 2 + 30, branch_h],
                                    [margin.left + width / 2 + 30, branch_h - 100],
                                    [margin.left + width * 2.95 / 4, branch_h - 100]];
            } else if (d[i].event_id == 16) { 
                marker_line_path = [[margin.left + width / 2, branch_h],
                                    [margin.left + width / 2 + 15, branch_h],
                                    [margin.left + width / 2 + 15, branch_h + 40],
                                    [margin.left + width * 2.35 / 4, branch_h + 40]];
            } else if (d[i].event_id == 19) {
                marker_line_path = [[margin.left + width / 2, branch_h],
                                    [margin.left + width / 2 + 30, branch_h],
                                    [margin.left + width / 2 + 30, branch_h - 90],
                                    [margin.left + width * 2.7 / 4, branch_h - 90]];
            } else if (d[i].event_id == 20) {
                marker_line_path = [[margin.left + width / 2, branch_h],
                                    [margin.left + width / 2 + 40, branch_h],
                                    [margin.left + width / 2 + 40, branch_h + 70],
                                    [margin.left + width * 3.2 / 4, branch_h + 70]];
            } else if (d[i].event_id == 21) {
                marker_line_path = [[margin.left + width / 2, branch_h],
                                    [margin.left + width / 2 + 10, branch_h],
                                    [margin.left + width / 2 + 10, branch_h + 55],
                                    [margin.left + width * 2.35 / 4, branch_h + 55]];
            }
        }

        // draw branch
        draw_marker_line(marker_line_path);

        // place time description
        ot_gun_svg.append('text')
            .classed('time-string', true)
            .classed(d[i].obama_trump, true)
            .attr('x', marker_line_path[marker_line_path.length - 1][0] + (d[i].obama_trump == "Obama" ? -5 : 5))
            .attr('y', marker_line_path[marker_line_path.length - 1][1] + 3)
            .text(time_str);

        // place marker circle
        ot_gun_svg.append('circle')
            .classed('marker-circle', true)
            .attr('r', 3.5)
            .attr('cx', margin.left + width / 2)
            .attr('cy', branch_h);

        // place description
        ot_gun_svg.append('text')
            .classed('desc-string', true)
            .classed(d[i].obama_trump, true)
            .attr('x', marker_line_path[marker_line_path.length - 1][0] + (d[i].obama_trump == "Obama" ? -5 : 5))
            .attr('y', marker_line_path[marker_line_path.length - 1][1] + (d[i].days_since_shooting < 6 ? 18 : 3))
            .attr('wrap-width', d[i].wrap_width)
            .attr('alt-wrap-width', d[i].alt_wrap_width)
            .text(d[i].description);
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
    d3.select('.header.Obama').attr('x', margin.left + width * 1 / 4);
    d3.select('.header.Trump').attr('x', margin.left + width * 3 / 4);

    if (width >= 470) {
        d3.select('.header.Obama').text("Obama, Newton");
        d3.select('.header.Trump').text("Trump, Parkland");
    } else if (width < 470) {
        d3.select('.header.Obama').text("Obama");
        d3.select('.header.Trump').text("Trump");
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