---
layout: post
title:  'Random D3 Fun'
date:   2016-09-28 15:05:41
categories: d3 random design
thumbnail: /assets/img/post-thumbnails/random-d3.gif
---

I'm currently taking (and loving) a data visualization course, so naturally, I'm learning a little D3.js to make some *sick* visualizations. Below is my first experiment with some SVG animation (likely more to come). Clearly it is art. Have fun clicking away!

<div id='d3-sample-container' style='margin: auto; width: 300px; cursor: pointer;'>
</div>
<script>
    /* make that d3 svg canvas */
    var dimension = 300;
    var random_svg = d3.select('#d3-sample-container').append('svg')
        .attr('width', dimension)
        .attr('height', dimension)
        .style('background-color', 'black');

    /* declare some helper functions */
    var get_group = function(i, j) {
        return (4 - i) + j;
    }

    var get_radius = function(n) {
        return (dimension / 10) * Math.pow(87 / 100, n + 1);
    }

    var get_rand_pos = function() {
        return Math.random() * dimension;
    }

    /* initialize some vars */
    var isAligned = false;
    var circles   = [ ];
    var cxs = [dimension * (1 / 10), 
               dimension * (3 / 10),
               dimension * (5 / 10),
               dimension * (7 / 10),
               dimension * (9 / 10)
              ];
    var cys = [dimension * (1 / 10), 
               dimension * (3 / 10),
               dimension * (5 / 10),
               dimension * (7 / 10),
               dimension * (9 / 10)
              ];
    var fill = ["#0081ff", 
                "#5791ff", 
                "#779fff", 
                "#98b1ff", 
                "#aec0ff", 
                "#c7d1ff", 
                "#d9dfff", 
                "#ecefff", 
                "#ffffff"
               ];

    /* generate those circles */
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            var group_n = get_group(i,j);
            var c_i = random_svg.append("circle")
                .attr("cx", get_rand_pos())
                .attr("cy", get_rand_pos())
                .attr("r",  get_radius(group_n))
                .attr("fill", fill[group_n])
                .attr("ci", i)
                .attr("cj", j)
                .attr("group", group_n);
            circles.push(c_i);
        }
    }

    /* toggle alignment */
    random_svg.on("click", function() {
        for (var i = 0; i < circles.length; i++) {
            var c    = circles[i];
            var cn   = +c.attr("group");
            var ci   = +c.attr("ci");
            var cj   = +c.attr("cj");
            var cx   = (isAligned ? get_rand_pos() : cxs[ci]);
            var cy   = (isAligned ? get_rand_pos() : cys[cj]);

            c.transition()
             .duration(1000)
             .attr("cx", cx)
             .attr("cy", cy);
        }
        isAligned = !isAligned;
    });
</script>