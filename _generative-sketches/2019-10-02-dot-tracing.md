---
layout: generative-sketch
title:  "Progressive Dot Tracing"
date:   2019-10-02 10:06:41
thumbnail: /assets/img/generative-sketch-thumbnails/dot-tracing.png
---

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const w = Math.min(500, $("#p5-container").width()),
          h = w;

    /* styling vars */
    const dot_r = 25,
          line_w = 5,
          dot_c = "#77bdee",
          line_c = "#d2e9fa";

    /* position vars */
    const n_dots = 15,
          n_lines = n_dots - 1;
    let points = [];

    /* animation vars */
    const n_dot_frames = 4,
          n_line_frames = 4;
    let state = 0,
        frame = 0,
        n_visible_dots = 0,
        n_visible_lines = 0;

    /********************************/
    /*** DECLARE HELPER FUNCTIONS ***/
    /********************************/

    function randomize_position() {
        return [p.random(w * 0.1, w * 0.9), p.random(h * 0.1, h * 0.9)];
    }

    function randomize_positions() {
        points = [];
        for (let i = 0; i < n_dots; i++) {
            let pos = randomize_position();
            while (calculate_min_buffer(pos, i) < dot_r * 2.5) {
                pos = randomize_position();
            }
            points.push(pos);
        }
    }

    function calculate_min_buffer(pos, dot_ix) {
        let min_buffer = w;
        for (let i = 0; i < dot_ix; i++) {
            min_buffer = p.min(min_buffer, p.pow(p.pow(pos[0] - points[i][0], 2) + p.pow(pos[1] - points[i][1], 2), 0.5));
        }
        return min_buffer;
    }

    function on_dot() {
        return state < n_dots;
        // return state % 2 == 0;
        // return (state == 0) | (state % 2 == 1);
    }

    function render_dot_appearing(dot_ix, frame) {
        p.fill(p.color(dot_c));
        p.noStroke();
        p.circle(points[dot_ix][0], points[dot_ix][1], dot_r * frame / n_dot_frames);
    }

    function render_line_appearing(line_ix, frame) {
        p.stroke(p.color(line_c));
        p.strokeWeight(line_w);
        let dx = (points[line_ix + 1][0] - points[line_ix][0]) * frame / n_line_frames,
            dy = (points[line_ix + 1][1] - points[line_ix][1]) * frame / n_line_frames;
        p.line(points[line_ix][0], points[line_ix][1], points[line_ix][0] + dx, points[line_ix][1] + dy);
    }

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(w, h);
        p.frameRate(15);
        p.background("white");

        randomize_positions();    
    };

    p.draw = function() {
        if (state == 0) {
            p.clear();
            p.background("white");
        }

        if (on_dot()) {
            render_dot_appearing(state - n_visible_lines, frame);
        } else {
            render_line_appearing(state - n_visible_dots, frame);
            for (let i = 0; i < n_visible_dots; i++) render_dot_appearing(i, n_dot_frames);
        }

        frame++;
        if ((on_dot() & frame > n_dot_frames) | (!on_dot() & frame > n_line_frames)) {
            if (on_dot()) n_visible_dots++;
            else n_visible_lines++;
            state++;
            frame = 0;
        }
        if (n_visible_lines >= n_lines & n_visible_dots >= n_dots) {
            state = 0;
            n_visible_dots = 0;
            n_visible_lines = 0;
            randomize_positions();
        }
    };

}

new p5(sketch, 'p5-container');

</script>

While I find this sketch to be moderately interesting, the main purpose of this experiment was to play around with showing progression. I exported each frame generated in Processing (the version you see here was recreated in p5.js), which, over the course of many attempts, made a series of images for each iteration of the sketch. Once completed (or at least I was satisifed with the sketch), I strung all the images together into a series of .GIFs that show the progression. See below.

{% include figure.html autolink="yes" src="/projects/generative-sketchbook/assets/img/dot-to-line-progress-0.gif" alt="A series of attempts in the process of making the final product" width=300 %}

{% include figure.html autolink="yes" src="/projects/generative-sketchbook/assets/img/dot-to-line-progress-1.gif" alt="A series of attempts in the process of making the final product" width=300 %}

{% include figure.html autolink="yes" src="/projects/generative-sketchbook/assets/img/dot-to-line-progress-2.gif" alt="A series of attempts in the process of making the final product" width=300 %}

{% include figure.html autolink="yes" src="/projects/generative-sketchbook/assets/img/dot-to-line-progress-3.gif" alt="A series of attempts in the process of making the final product" width=300 %}

{% include figure.html autolink="yes" src="/projects/generative-sketchbook/assets/img/dot-to-line-progress-4.gif" alt="A series of attempts in the process of making the final product" width=300 %}

{% include figure.html autolink="yes" src="/projects/generative-sketchbook/assets/img/dot-to-line-progress-5.gif" alt="A series of attempts in the process of making the final product" width=300 %}

<style>
    p.fig-paragraph {
        text-align: left !important;
    }
</style>