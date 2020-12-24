---
layout: generative-sketch
title:  "Color Picker"
date:   2020-12-20 10:06:41
thumbnail: /projects/generative-sketchbook/assets/img/thumbnails/color-picker.png
---

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const width = Math.min(500, $("#p5-container").width()),
          height = width;

    const colors = [
        [255, 0, 0],
        [255, 0, 255],
        [0, 0, 255],
        [0, 255, 255],
        [0, 255, 0],
        [255, 255, 0]
    ];

    const color_step_x = width / colors.length,
          color_step_y = height / 4;

    let color_bg = p.color("black"),
        color_bgs = [color_bg];

    let band_step = 0;

    /********************************/
    /*** DECLARE HELPER FUNCTIONS ***/
    /********************************/

    function drawGradient() {
        for (let i = 0; i < width; i++) {

            let ci = Math.floor(i / color_step_x)
                cx = p.lerpColor(p.color(colors[ci]), 
                                 p.color(colors[ci < (colors.length - 1) ? ci + 1 : 0]), 
                                 (i % color_step_x) / color_step_x);

            for (let j = 0; j < height / 2; j++) {

                let cy = p.lerpColor(j < color_step_y ? p.color("white") : cx,
                                     j < color_step_y ? cx : p.color("black"),
                                     (j % color_step_y) / color_step_y);
                p.stroke(cy);
                p.point(i, j);

            }
        }
    }

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(width, height);
        p.textAlign(p.CENTER, p.CENTER);

        drawGradient();

        p.noStroke();
        p.fill("black");
        p.rect(0, height / 2, width, height / 2);
    };

    p.draw = function() {

        // set background color
        if (0 <= p.mouseX & p.mouseX <= width & 0 <= p.mouseY & p.mouseY <= height / 2) {
            if (band_step > width) {
                band_step = 0;
                color_bgs = [ ];
            } else {
                band_step++;
            }
            color_bg = p.color(p.get(p.mouseX, p.mouseY));
            color_bgs.push(color_bg);
        }

        // draw background in lower half
        p.fill(color_bg);
        p.rect(0, height / 2, width, height / 2);

        p.stroke("black");
        p.fill("white");
        p.textSize(16);
        p.textAlign(p.RIGHT, p.TOP);
        p.text(p.hex([p.red(color_bg), p.green(color_bg), p.blue(color_bg)], 2), width * 0.98, height * 0.52);
        p.noStroke();

        for (let i = 0; i < band_step; i++) {
            p.stroke("black");
            p.fill(color_bgs[i]);
            p.fill("red");
            p.circle(i, p.map(p.red(color_bgs[i]), 255, 0, height * 0.51, height * 0.99), 8);
            p.fill("green");
            p.circle(i, p.map(p.green(color_bgs[i]), 255, 0, height * 0.51, height * 0.99), 8);
            p.fill("blue");
            p.circle(i, p.map(p.blue(color_bgs[i]), 255, 0, height * 0.51, height * 0.99), 8);
        }

        // parse RGB values
        // p.fill("#ff0000");
        // p.rect(width * 0.1, height * 0.6, p.map(p.red(color_bg), 0, 255, 0, width * 0.8), height * 0.1);
        // p.fill("#00ff00");
        // p.rect(width * 0.1, height * 0.7, p.map(p.green(color_bg), 0, 255, 0, width * 0.8), height * 0.1);
        // p.fill("#0000ff");
        // p.rect(width * 0.1, height * 0.8, p.map(p.blue(color_bg), 0, 255, 0, width * 0.8), height * 0.1);

    };

}

new p5(sketch, 'p5-container');

</script>