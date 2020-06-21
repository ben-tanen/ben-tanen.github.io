---
layout: generative-sketch
title:  "Circle Scrunch"
date:   2019-06-04 10:06:41
thumbnail: /assets/img/generative-sketch-thumbnails/circle-scrunch.png
---

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const w = Math.min(500, $("#p5-container").width()),
          h = w;

    const steps = 80,
          dt = 0.1;

    let t = 0;

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(w, h);
        p.frameRate(15);

        p.stroke("black");
        p.fill("white");
    };

    p.draw = function() {

        // clear background (set to black)
        p.background("white");

        // 
        for (let i = 0; i < steps; i++) {
            const r = p.sin(p.map(i, 0, steps - 1, t, t + 2 * p.PI)) * 80 + 150,
                  x = w / (steps - 1) * i,
                  y = h - h / (steps - 1) * i;
            p.circle(x - (w / 2), y + (h / 2), r);
        }

        // increment t
        t += dt;
        
    };

}

new p5(sketch, 'p5-container');

</script>