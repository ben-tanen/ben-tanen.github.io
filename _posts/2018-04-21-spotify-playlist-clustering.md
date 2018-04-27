---
layout: post
title: 'Making Spotify Playlists Using K-Means Clustering'
date: 2018-04-21 05:00:00
categories: data visualization project music spotify graphic hidden
landing-description: making Spotify playlists using clustering algorithms
thumbnail: /assets/img/post-thumbnails/spotify-clustering.png
excerpt_separator: <!-- more -->
---

{% highlight python %}
def pull_saved_tracks(limit = 50, offset = 0):
    saved_tracks = [ ]

    saved_tracks_obj = sp.current_user_saved_tracks(limit = limit, offset = offset)
    num_saved_tracks = saved_tracks_obj['total']

    while (offset < num_saved_tracks):
        saved_tracks_obj = sp.current_user_saved_tracks(limit = limit, offset = offset)

        for track_obj in saved_tracks_obj['items']:
            saved_tracks.append({
                'name': track_obj['track']['name'],
                'artists': ', '.join([artist['name'] for artist in track_obj['track']['artists']]),
                'track_id': track_obj['track']['id']
            })

        offset += limit
        
    return saved_tracks
{% endhighlight %}

{% include figure.html src="/assets/img/posts/spotify-clusters-ex1.png" alt="Examples of the first playlist clusters" %}

<!-- more -->

<div id="d3-spotify-clustering-container">
    <svg id="d3-spotify-clustering">
    </svg>
</div>

<style>
#d3-spotify-clustering-container {
    width: 100%;
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
        if (d[i].days_since_shooting < 6) {
            ot_gun_svg.append('text')
                .classed('desc-string', true)
                .classed(d[i].obama_trump, true)
                .attr('x', marker_line_path[marker_line_path.length - 1][0] + (d[i].obama_trump == "Obama" ? -5 : 5))
                .attr('y', marker_line_path[marker_line_path.length - 1][1] + 18)
                .attr('wrap-width', d[i].wrap_width)
                .attr('alt-wrap-width', d[i].alt_wrap_width)
                .text(d[i].description);
        } else {
            ot_gun_svg.append('text')
                .classed('desc-string', true)
                .classed(d[i].obama_trump, true)
                .attr('x', marker_line_path[marker_line_path.length - 1][0] + (d[i].obama_trump == "Obama" ? -5 : 5))
                .attr('y', marker_line_path[marker_line_path.length - 1][1] + 3)
                .attr('wrap-width', d[i].wrap_width)
                .attr('alt-wrap-width', d[i].alt_wrap_width)
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