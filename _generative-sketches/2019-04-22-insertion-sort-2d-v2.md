---
layout: generative-sketch
title:  "Insertion Sort 2D, V2"
date:   2019-04-22 10:06:41
thumbnail: /projects/generative-sketchbook/assets/img/thumbnails/insertion-sort-2d-v2.png
---

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const w = Math.min(600, $("#p5-container").width()),
          h = 400;

    const n_w = 50,
          n_h = 30;

    let v = [],
        sort_ix = 1;

    /********************************/
    /*** DECLARE HELPER FUNCTIONS ***/
    /********************************/

    function draw_grid() {
        for (let i = 0; i < n_h; i++) {
            for (let j = 0; j < n_w; j++) {
                p.fill(p.lerpColor(p.color("#ff5d7b"), p.color("#ff91a6"), v[i * n_w + j]));
                p.rect(j * w / n_w, i * h / n_h, w / n_w, h / n_h);
            }
        }
    }

    function float_list(start, end, n_step) {
        let l = [];
        let step = (end - start) / (n_step - 1);
        for (let i = 0; i < n_step; i++) {
            l.push(+(start + step * i).toFixed(5));
        }
        return l;
    }

    function float_list_2d(start, end, n_w, n_h) {
        let l = [];
        for (let i = 0; i < n_h; i++) {
            li = float_list(start, end, n_w);
            l = l.concat(li);
        }
        return l;
    }

    function shuffle_float_array(array) {
        for (let i = 0; i < array.length; i++) {
            let j = Math.floor(Math.random() * (i + 1));
            let v = array[j];
            array[j] = array[i];
            array[i] = v;
        }
        return array;
    }

    function shuffle_float_array_2d(array, n_w, n_h) {
        if (n_w * n_h > array.length) return array;
        for (let i = 0; i < n_h; i++) {
            vi = array.slice(i * n_w, (i + 1) * n_w);
            vi = shuffle_float_array(vi);
            for (let j = 0; j < n_w; j++) {
                array[i * n_w + j] = vi[j];
            }
        }
        return array;
    }

    function sort_float_array_2d(array, n_w, n_h, count) {
        if (n_w * n_h > array.length) return array;
        for (let i = 0; i < n_h; i++) {
            vi = array.slice(i * n_w, i * n_w + count);
            vi.sort();
            for (let j = 0; j < count; j++) {
                array[i * n_w + j] = vi[j];
            }
        }
        return array;
    }

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(w, h);
        p.frameRate(15);
        p.noStroke();

        v = float_list_2d(0, 1, n_w, n_h);
        v = shuffle_float_array_2d(v, n_w, n_h);
    };

    p.draw = function() {
        if (sort_ix <= n_w) {
            v = sort_float_array_2d(v, n_w, n_h, sort_ix++);
        } else {
            v = shuffle_float_array_2d(v, n_w, n_h);
            sort_ix = 1;
        }
        draw_grid();
    };

}

new p5(sketch, 'p5-container');

</script>