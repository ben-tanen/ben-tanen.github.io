---
layout: generative-sketch
title:  "Circle Wave"
date:   2019-06-03 10:06:41
thumbnail: /assets/img/generative-sketch-thumbnails/circle-wave.png
---

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const w = Math.min(500, $("#p5-container").width()),
          h = w;

    const steps = 50,
          dt = 0.1;

    let t = 0;

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(w, h);
        p.frameRate(15);

        p.stroke("white");
        p.fill("black");
    };

    p.draw = function() {

        // clear background (set to black)
        p.background("black");

        // draw a wave with circles
        for (let i = 0; i < steps; i++) {
            const t0 = p.map(i, 0, steps - 1, t, t + 2 * p.PI),
                  x = w / (steps - 1) * i,
                  y = h / 2 + (h * .2) * (p.sin(t0) - p.sin(t + 2 * p.PI));
            p.circle(x - w / 2, y, w * .45);
        }

        // increment t
        t += dt;
        
    };

}

new p5(sketch, 'p5-container');

</script>