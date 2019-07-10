---
layout: post
title: 'A First Attempt At Generative Art'
date: 2018-04-23 05:00:00
categories: data visualization project art generative graphic
landing-description: an attempt at making generative art
thumbnail: /assets/img/post-thumbnails/gen-art.png
excerpt_separator: <!-- more -->
---

<div id="d3-gen-art-container">
    <svg id="d3-gen-art"></svg>
    <div id="d3-gen-art-controls">
        <p>
            <!-- Color Steps -->
            <input type="range" min="1" max="30" value="10" id="range_span">
        </p>
        <p style="text-align: right">
            <!-- Type: -->
            <input type="radio" id="viz-type-1" name="viz-type" value="radial" checked>
            <label for="viz-type-1">Radial</label>

            <input type="radio" id="viz-type-2" name="viz-type" value="line">
            <label for="viz-type-2">Line</label>
        </p>
    </div>
</div>

A recent trip to [the Boston MFA](https://www.mfa.org/){:target="_blank"} inspired me to try making more art for art's sake. I've never been particularly crafty with a pencil or paint brush so I decided my artistic medium would have to be digital. I've been fascinated by generative art ([the dot is black](http://thedotisblack.com/){:target="_blank"} has always been a quality source for interesting pieces) so I thought I would take a whack at it.

Wikipedia says [generative art](https://en.wikipedia.org/wiki/Generative_art){:target="_blank"} must be created partially or entirely using an autonomous system, but I prefer [Anders Hoff's definition](http://inconvergent.net/thoughts-on-generative-art/){:target="_blank"} of the art form: 

> "I would argue that it does not really matter whether you are generating characters, dialogue or environments for a computer game, geometry as part of a building, digital or analogue art, a musical composition, or a poem. In all cases you are using a system of some kind to help you along. Either towards a specific goal, some unidentified result, or somewhere in-between. To me the main point is usually to experiment with a small system that consists of a set of relatively simple rules."

With that in mind, I set out to see what I could create. While I enjoy the pieces I've seen, I found a lot of generative art lacked color. As a personal fan of color, I knew I wanted to somehow include some in my piece. This led me to a question: how would a color describe itself?

Without the ability to have personal discussions with a color, I opted to use a color's own codified representation (specifically the binary representation of a color's hex code) to generate each color's pattern in the piece. Doing so led to the piece above.

Feel free to play around with it and let me know if you have any thoughts on it! Is this generative art? Is there a greater meaning behind this piece? Am I just a hack making pretty pictures? Let me know and I'll let you know if I agree!

<style>
#d3-gen-art-container {
    width: 100%;
    max-width: 600px;
    margin: auto;
}

#d3-gen-art {
    width: 100%;
}

#d3-gen-art-controls p {
    width: calc(50% - 5px);
    display: inline-block;
}

#viz-type-2 {
    margin-left: 10px;
}
</style>
<script>

/*********************/
/*** INIT VARIABLE ***/
/*********************/

var svg = d3.select('#d3-gen-art');

var margin = {top: 5, right: 5, bottom: 5, left: 5},
    width  = $('#d3-gen-art').width() -  margin.left - margin.right,
    height = $('#d3-gen-art').width() - margin.top - margin.bottom;

var colors = ['#77bdee', '#80ff80', '#ff6666', '#ee77ee', '#77eeee'];

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

// convert rgb color to hex color
function color_rgb_to_hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

// convert hex color to binary string
function color_hex_to_bin(hex) {
    let bin = parseInt(hex.substring(1, 100), 16).toString(2);

    if (bin.length < 24) return "0".repeat(24 - bin.length) + bin;
    else return bin;
}

// line pattern for representing the binary representation of a color with colors
function line_viz(colors, color_steps) {
    let rect_width  = width / 24,
        rect_height = height / ((colors.length - 1) * color_steps + 1),
        rect_margin = 9;

    // for sequential color pairs (n - 1 pairs), ranges from color_i to color_{i + 1}
    for (let i = 0; i < colors.length - 1; i++) {
        let color_scale = d3.scaleLinear()
            .domain([0, color_steps])
            .range([colors[i], colors[i + 1]]);

        // for each color in the scale (color_step steps)
        for (let j = 0; j < color_steps; j++) {
            let color     = color_scale(j),
                color_bin = color_hex_to_bin(color_rgb_to_hex(color));
            
            // for each bit in color
            for (let k = 0; k < 24; k++) {
                if (color_bin[k] == "1") {
                    svg.append('rect')
                        .attr('x', margin.left + k * rect_width + rect_margin)
                        .attr('y', margin.top + i * rect_height * color_steps + j * rect_height)
                        .attr('width', Math.max(rect_width  - 2 * rect_margin, 2))
                        .attr('height', rect_height)
                        .style('fill', color)
                        .style('stroke', color)
                        .style('stroke-width', 0.25);
                }
            }
        }
    }

    // add in last color (color_i) to bottom row
    let color     = colors[colors.length - 1],
        color_bin = color_hex_to_bin(color);
    for (let i = 0; i < 24; i++) {
        if (color_bin[i] == "1") {
            svg.append('rect')
                .attr('x', margin.left + i * rect_width + rect_margin)
                .attr('y', margin.top + (colors.length - 1) * rect_height * color_steps)
                .attr('width', Math.max(rect_width - 2 * rect_margin, 2))
                .attr('height', rect_height)
                .style('fill', color)
                .style('stroke', color)
                .style('stroke-width', 0.25);
        }
    }
}

// radial pattern for representing the binary representation of a color with colors
function radial_viz(colors, color_steps) {
    let arc = d3.arc(),
        angle_diff = 2 * Math.PI / colors.length,
        radius_margin = 4.5;

    // for each color in list, make ranging color scale
    for (let i = 0; i < colors.length; i++) {
        let color_scale = d3.scaleLinear()
            .domain([0, color_steps])
            .range([colors[i], colors[i + 1 < colors.length ? i + 1 : 0]]);

        // for each color in color scale (color_steps steps)
        for (let j = 0; j < color_steps; j++) {
            let color     = color_scale(j),
                color_bin = color_hex_to_bin(color_rgb_to_hex(color));

            // for each bit in color
            for (let k = 0; k < 24; k++) {
                if (color_bin[k] == '1') {
                    svg.append('path')
                        .attr('transform', `translate(${margin.left + width / 2}, ${margin.top + height / 2})`)
                        .attr('d', arc({
                            innerRadius: (width * k)       / (2 * 24) + radius_margin,
                            outerRadius: (width * (k + 1)) / (2 * 24) - radius_margin,
                            startAngle: angle_diff  * (j / color_steps + i),
                            endAngle: angle_diff * ((j + 1) / color_steps + i)
                        }))
                        .style('fill', color)
                        .style('stroke', color)
                        .style('stroke-width', 0.1);
                }
            }
        }
    }
}

var viz_fns = [line_viz, radial_viz],
    viz_ix  = 1;

/*******************/
/*** RENDER PLOT ***/
/*******************/

// make svg plot square
svg.style('height', svg.style('width'));

// draw viz
viz_fns[viz_ix](colors, parseInt($("#range_span").val()));

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

// on color step slider update
d3.select('#range_span')
    .on("input", function() {
        svg.selectAll('rect, path').remove();

        viz_fns[viz_ix](colors, parseInt($("#range_span").val()));
    });

// on viz type radio update
d3.selectAll('input[name="viz-type"]')
    .on("change", function() {
        svg.selectAll('rect, path').remove();

        if (d3.select(this).attr('value') == "radial") viz_ix = 1;
        else viz_ix = 0;

        viz_fns[viz_ix](colors, parseInt($("#range_span").val()));
    });

// on resize
$(window).resize(function() {
    if ($('#d3-gen-art').width() - margin.left - margin.right != width) {
        svg.selectAll('rect, path').remove();

        svg.style('height', svg.style('width'));

        width  = $('#d3-gen-art').width() -  margin.left - margin.right,
        height = $('#d3-gen-art').width() - margin.top - margin.bottom;

        viz_fns[viz_ix](colors, parseInt(document.getElementById("range_span").value));
    }
});

</script>