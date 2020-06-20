---
layout: generative-sketch
title:  "Circle Follow"
date:   2019-08-17 10:06:41
thumbnail: /assets/img/generative-sketch-thumbnails/circle-follow.png
---

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const w = 500,
          h = 500;

    let cx, cy;

    let t = 0,
        dt = 0.01;

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(w, h);
        p.frameRate(15);
        p.background("#000");
        
        cx = w / 2;
        cy = h / 2;
        
        p.stroke(119, 189, 238, 150);
        p.strokeWeight(2);
        p.noFill();
    };

    p.draw = function() {
        if (p.mouseX > 0 & p.mouseY > 0 & p.mouseX < w & p.mouseY < h) {
            let r = (100 * p.sin(t)) + 50;
            p.circle(cx, cy, r);
            cx += (p.mouseX - cx) / 5;
            cy += (p.mouseY - cy) / 5;
            t += dt;
        }
    };

    p.keyPressed = function() {
        p.clear();
        p.background("#000");
    }

    p.mouseClicked = function() {
        p.clear();
        p.background("#000");
    }

}

new p5(sketch, 'p5-container');

</script>

Drag your mouse over the canvas to see the circle follow. Click or press any key to erase the canvas.