---
layout: generative-sketch
title:  "Sine Scroll"
date:   2020-07-13 10:06:41
thumbnail: /projects/generative-sketchbook/assets/img/thumbnails/sine-scroll.png
---

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const width = Math.min(500, $("#p5-container").width()),
          height = width,
          padding = 5;

    let t = 0,
        dt = 0.02;

    const grid_size = [300, 50];

    let bars = [ ];

    /********************************/
    /*** DECLARE HELPER FUNCTIONS ***/
    /********************************/

    function draw_bar(x0, h0) {
        let c = p.lerpColor(p.color("#8EF9F3"), p.color("#8377D1"), p.map(x0, 0, grid_size[0], 0, 1))
        p.strokeWeight(0.5);
        p.stroke(c);
        p.fill(c);

        let x = p.map(x0, 0, grid_size[0], padding, width - padding),
            h = p.map(h0, 0, grid_size[1], 0, (height - 2 * padding) / 2),
            y = height / 2 - h,
            w = (width - 2 * padding) / grid_size[0];
        p.rect(x, y, w, h);
    }

    function draw_line(x0, h0, x1, h1) {
        let x2 = p.map(x0, 0, grid_size[0], padding, width - padding),
            x3 = p.map(x1, 0, grid_size[0], padding, width - padding),
            y2 = height / 2 - (p.map(h0, 0, grid_size[1], 0, (height - 2 * padding) / 2)),
            y3 = height / 2 - (p.map(h1, 0, grid_size[1], 0, (height - 2 * padding) / 2));

        p.strokeWeight(3);
        p.line(x2, y2, x3, y3);
    }

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(width, height);
        p.frameRate(50);
    };

    p.draw = function() {

        // clear background
        p.background("white");

        // draw flat lines (while bars is not populated enough to fill screen)
        for (let i = 0; i < p.max(0, grid_size[0] - bars.length); i++) {
            draw_bar(i, 0);
        }

        // draw bars
        for (let i = p.max(0, bars.length - grid_size[0]); i < bars.length; i++) {
            draw_bar(grid_size[0] - bars.length + i, bars[i]);
            if (bars.length > 1) {
                if ([0, bars.length - grid_size[0], bars.length].indexOf(i) == -1) {
                    draw_line(grid_size[0] - bars.length + i - 1, bars[i - 1], grid_size[0] - bars.length + i, bars[i]);
                }
            }
        }

        // add new bar
        if (p.random() < 1) bars.push(grid_size[1] * 0.8 * p.sin(t));
        else bars.push(0);
        t += dt;
    };

}

new p5(sketch, 'p5-container');

</script>