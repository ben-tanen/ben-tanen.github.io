---
layout: generative-sketch
title:  "Loading Circles V2"
date:   2019-08-14 10:06:41
thumbnail: /projects/generative-sketchbook/assets/img/thumbnails/loading-circle-v2.png
---

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const w = Math.min(500, $("#p5-container").width()),
          h = w;

    // basic colors
    const WHITE    = "#FFFFFF",
          BLACK    = "#000000",
          BT_BLUE  = "#77BDEE",
          BT_RED   = "#FF6E6C",
          BT_GREEN = "#23CE6B";

    const dt = [0.01, 0.00875, 0.0075, 0.00625, 0.005]; // array of speeds to update arc angles
          
    const N_ARC = dt.length; // number of arcs to draw

    let r  = [], // array of arc radiuses
        t0 = [], // array of arc starting angles (in radians)
        t1 = [], // array of arc ending angles (in radians)
        c  = [], // array of arc colors
        s  = []; // array of arc states (to be used in winding_logic fxns)

    const R_BOUNDS = [0.25, 0.9]; // min and max radiuses (bounds for r)

    // populate arrays
    const dr = (R_BOUNDS[1] - R_BOUNDS[0]) / (N_ARC - 1),
          dc = 1.0 / (N_ARC - 1);
    for (let i = 0; i < N_ARC; i++) {
        r.push(R_BOUNDS[1] - i * dr);
        t0.push(0);
        t1.push(0);
        c.push(p.lerpColor(p.color(BT_BLUE), p.color(WHITE), i * dc));
        s.push(0);
    }

    /********************************/
    /*** DECLARE HELPER FUNCTIONS ***/
    /********************************/

    // draw a circle with a radius of r and a color of c
    function draw_center_circle(r, c) {
        p.fill(c);
        p.noStroke();
        p.circle(w / 2, h / 2, w * r);
    }

    // draw an arc with radius of r 
    // that spans from t0 to t1 (ranging from 0 - 1 => 0 - 2PI)
    // with a stroke width of wt and color of c
    function draw_arc(r, t0, t1, wt, c) {
        if (t0 == t1) return;
        p.fill("black");
        p.stroke(p.color(c));
        p.strokeWeight(wt);
        p.arc(w / 2, h / 2, w * r, h * r, 
            p.map(p.min(t0, t1), -1, 1, -2 * p.PI, 2 * p.PI), 
            p.map(p.max(t0, t1), -1, 1, -2 * p.PI, 2 * p.PI));
    }

    // update arrays to reflect interated winding
    // logic1 = when circle fully winds, begin to wind from other end (slinky-like)
    function update_wind_logic1(i) {
        if (t1[i] >= 1 & t0[i] >= 1) {
            t1[i] = t0[i] = 0;
        } else if (t1[i] >= 1) {
            t0[i] += dt[i];
        } else t1[i] += dt[i];
        bound_arc_angles(i, 0, 1);
    }

    // logic2 = when circle fully winds, unwind
    function update_wind_logic2(i) {
        if (t1[i] >= 1) {
            s[i] = 1;
            t1[i] -= dt[i];
        } else if (t1[i] <= 0) {
            s[i] = 0;
            t1[i] += dt[i];
        } else if (s[i] == 0) t1[i] += dt[i];
        else t1[i] -= dt[i];
        bound_arc_angles(i, 0, 1);
    }

    // logic3 = both ends wind from right to left, then unwind
    function update_wind_logic3(i) {
        if (t1[i] >= 0.5) {
            s[i] = 1;
            t1[i] -= dt[i];
            t0[i] += dt[i];
        } else if (t1[i] <= 0) {
            s[i] = 0;
            t1[i] += dt[i];
            t0[i] -= dt[i];
        } else if (s[i] == 0) {
            t1[i] += dt[i];
            t0[i] -= dt[i];
        } else {
            t1[i] -= dt[i];
            t0[i] += dt[i];
        }
        bound_arc_angles(i, -0.5, 0.5);
    }

    // bound arc angles (between 0 and 1)
    function bound_arc_angles(i, min, max) {
        t0[i] = +p.max(min, p.min(max, t0[i])).toFixed(5);
        t1[i] = +p.max(min, p.min(max, t1[i])).toFixed(5);
        if (t0[i] > t1[i]) {
            t0[i] = t1[i] = (t1[i] - t0[i]) / 2;
        }
    } 

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(w, h);
        p.frameRate(30);
        p.angleMode(p.RADIANS)
    };

    p.draw = function() {
        // clear page
        p.clear();
        p.background("black");
  
        // draw arcs and update winding positions
        for (let i = 0; i < N_ARC; i++) {
            draw_arc(r[i], t0[i], t1[i], 20, c[i]);
            update_wind_logic2(i);
        }
  
        // draw center circle
        draw_center_circle(R_BOUNDS[0] / 2, c[N_ARC - 1]);
    };

}

new p5(sketch, 'p5-container');

</script>