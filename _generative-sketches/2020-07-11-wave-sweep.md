---
layout: generative-sketch
title:  "Wave Sweep"
date:   2020-07-11 10:06:41
thumbnail: /projects/generative-sketchbook/assets/img/thumbnails/wave-sweep.gif
---

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const width = Math.min(500, $("#p5-container").width()),
          height = width;

    let theta = 0,
        d_theta = 0.005;

    let offset = 0,
        d_offset = 0.1;

    /********************************/
    /*** DECLARE HELPER FUNCTIONS ***/
    /********************************/

    function draw_squiggle(x1, y1, x2, y2, amp, wave_len, offset, outline) {

        if (p.min(x1, x2) < 0 || p.min(y1, y2) < 0) return;

        // calculate the slope and distance of the axis to draw along
        const ang = p.atan((y2 > y1 ? y2 - y1 : y1 - y2) / (x2 > x1 ? x2 - x1 : x1 - x2)),
              line_d = p.sqrt(p.pow(x2 - x1, 2) + p.pow(y2 - y1, 2));

        // add points in sine wave formation along axis
        let ps = [ ];
        for (let t = 0; t < 2 * p.PI; t += 0.1) {

            // calculate where along / off axis point should appear
            let along_axis = p.map(t, 0, 2 * p.PI, 0, line_d),
                off_axis = amp * p.sin(t * wave_len + offset);

            // calculate x and y position using these calculations and known angle
            let x_aa = p.cos(ang) * along_axis,
                x_oa = p.sin(ang) * off_axis
                x = p.min(x1, x2) + x_aa + x_oa * (x2 > x1 ? 1 : -1),
                y_aa = p.sin(ang) * along_axis,
                y_oa = p.cos(ang) * off_axis,
                y = p.min(y1, y2) + y_aa + y_oa * (y2 > y1 ? -1 : 1);

            // add position to list
            ps.push([x, y]);
        }

        // plot lines
        for (let i = 1; i < ps.length; i++) {
            let p0 = ps[i - 1],
                p1 = ps[i];

            p.stroke("black");
            p.strokeWeight(2);
            if (outline) p.line(p0[0], p0[1], p1[0], p1[1]);
        }

        for (let i = 0; i < ps.length; i++) {
            let p0 = ps[i]

            p.stroke("black");
            p.fill("white");
            p.circle(p0[0], p0[1], 5);
        }
    }

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(width, height);
        p.frameRate(30);
    };

    p.draw = function() {

        // clear background
        p.background("white");

        for (let i = 0.1; i <= 1; i += 0.1) {
            draw_squiggle(0, 0, p.max(1, width * 2 * p.cos(theta * i)), height * 2 * p.sin(theta * i), 30, 5, offset, true);
        }

        // increment position variables
        offset += d_offset;
        theta += d_theta;
        if (theta > p.PI * 0.5) theta = 0;
    };

}

new p5(sketch, 'p5-container');

</script>