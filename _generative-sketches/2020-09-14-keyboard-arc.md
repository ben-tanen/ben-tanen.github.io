---
layout: generative-sketch
title:  "Key Arc"
date:   2020-09-14 10:06:41
thumbnail: /projects/generative-sketchbook/assets/img/thumbnails/key-arc.png
---

Inspired by [this design](https://twitter.com/DesignReviewed/status/1304805797696806912).

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const width = Math.min(500, $("#p5-container").width()),
          height = width;

    const key_size = [width * 0.9 / 10, height * 0.9 / 10];

    let phrase = "bezier",
        phrase_ix = 0,
        letters = [ ],
        arcs = [ ];

    let button, input;

    let cx = width * 0.42,
        cy = height * 0.8;

    /********************************/
    /*** DECLARE HELPER FUNCTIONS ***/
    /********************************/

    function get_letter_pos(l) {
        const pos = {
            "A": [-4.166,  0],
            "B": [ 0.333,  1],
            "C": [-1.666,  1],
            "D": [-2.166,  0],
            "E": [-2.500, -1],
            "F": [-1.166,  0],
            "G": [-0.166,  0],
            "H": [ 0.833,  0],
            "I": [ 2.500, -1],
            "J": [ 1.833,  0],
            "K": [ 2.833,  0],
            "L": [ 3.833,  0],
            "M": [ 2.333,  1],
            "N": [ 1.333,  1],
            "O": [ 3.500, -1],
            "P": [ 4.500, -1],
            "Q": [-4.500, -1],
            "R": [-1.500, -1],
            "S": [-3.166,  0],
            "T": [-0.500, -1],
            "U": [ 1.500, -1],
            "V": [-0.666,  1],
            "W": [-3.500, -1],
            "X": [-2.666,  1],
            "Y": [ 0.500, -1],
            "Z": [-3.666,  1]
        },
        l_pos = pos[l.toUpperCase()];
        return [l_pos[0] * key_size[0], l_pos[1] * key_size[1]];
    }

    function draw_keyboard(cx, cy) {
        p.stroke("#E9E9E9");
        p.strokeWeight(1);
        for (let i = 1; i <= 26; i++) {
            let l = String.fromCharCode(64 + i),
                l_pos = get_letter_pos(l);
            p.noFill();
            p.rect(cx + l_pos[0], cy + l_pos[1], key_size[0], key_size[1]);
            p.fill("#E9E9E9");
            // p.text(l, cx + l_pos[0] + key_size[0] / 2, cy + l_pos[1] + key_size[1] / 2)
        }
    }

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(width, height);
        p.textAlign(p.CENTER, p.CENTER);
        p.frameRate(4);

        p.createP('');
        input = p.createInput("bezier");
        button = p.createButton("draw phrase");
        button.mouseClicked(() => {
            phrase = input.value();
            p.loop();
        });
    };

    p.draw = function() {

        const letter = phrase[phrase_ix],
              letter_pos = get_letter_pos(letter);

        letters.push({
            "letter": letter,
            "x": cx + letter_pos[0] + key_size[0] / 2,
            "y": cy + letter_pos[1] + key_size[1] / 2
        });

        if (phrase_ix > 0) {
            arcs.push({
                "letters": letters[phrase_ix - 1].letter + "-" + letters[phrase_ix].letter,
                "x0": letters[phrase_ix - 1].x,
                "y0": letters[phrase_ix - 1].y,
                "x1": (letters[phrase_ix - 1].x + letters[phrase_ix].x) / 2,
                "y1": cy - height * 0.25,
                "x2": letters[phrase_ix].x,
                "y2": letters[phrase_ix].y,
            })
        }

        // clear background
        p.background("white");

        // draw_keyboard(cx, cy);

        for (let i = 0; i < letters.length; i++) {
            
            if (i >= 1) {
                let arc = arcs[i - 1];
                p.fill(0, 0);
                p.stroke("white");
                p.strokeWeight(Math.min(key_size[0], key_size[1]) * 0.4);
                p.bezier(arc.x0, arc.y0, arc.x0, arc.y0,
                         arc.x0, arc.y1, arc.x1, arc.y1);
                p.bezier(arc.x1, arc.y1, arc.x2, arc.y1,
                         arc.x2, arc.y2, arc.x2, arc.y2);
                p.stroke("#77BDEE");
                p.strokeWeight(Math.min(key_size[0], key_size[1]) * 0.35);
                p.bezier(arc.x0, arc.y0, arc.x0, arc.y0,
                         arc.x0, arc.y1, arc.x1, arc.y1);
                p.bezier(arc.x1, arc.y1, arc.x2, arc.y1,
                         arc.x2, arc.y2, arc.x2, arc.y2);

                p.noStroke();
                p.fill("black");
                p.circle(arc.x0, arc.y0, Math.min(key_size[0], key_size[1]) * 0.4);
                p.circle(arc.x2, arc.y2, Math.min(key_size[0], key_size[1]) * 0.4);

                p.fill("white");
                p.text(arc.letters[0], arc.x0, arc.y0);
                p.text(arc.letters[2], arc.x2, arc.y2);

            } else {
                let l = letters[i];
                p.noStroke();
                p.fill("black");
                p.circle(l.x, l.y, Math.min(key_size[0], key_size[1]) * 0.4);
                p.fill("white");
                p.text(l.letter, l.x, l.y);
            }

        }

        if (phrase_ix >= phrase.length - 1) {
            phrase_ix = 0;
            letters = [ ];
            arcs = [ ];
            p.noLoop();
        } else {
            phrase_ix++;
        }
        // if (phrase_ix < phrase.length - 1) phrase_ix++;
        cy = height * p.map(phrase_ix, 0, phrase.length - 1, 0.8, 0.4);
        cx = width * p.map(phrase_ix, 0, phrase.length - 1, 0.42, 0.50);
    };

}

new p5(sketch, 'p5-container');

</script>