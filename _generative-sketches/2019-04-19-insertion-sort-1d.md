---
layout: generative-sketch
title:  "Insertion Sort 1D"
date:   2019-04-19 10:06:41
thumbnail: /projects/generative-sketchbook/assets/img/thumbnails/insertion-sort-1d.png
---

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const w = Math.min(600, $("#p5-container").width()),
          h = 400;

    const n = 200;

    let v = [],
        sort_ix = 0;

    /********************************/
    /*** DECLARE HELPER FUNCTIONS ***/
    /********************************/

    function float_list(start, end, step) {
        let l = [start];
        while (l[l.length - 1] < end) {
            l.push(l[l.length - 1] + step);
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

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(w, h);
        p.frameRate(30);
        p.noStroke();

        v = shuffle_float_array(float_list(0, 1, 1 / n));
    };

    p.draw = function() {
        let v_sort = v.splice(0, sort_ix + 1);
        v_sort.sort();
        v = v_sort.concat(v);
  
        for (let i = 0; i < n; i++) {
            p.fill(p.lerpColor(p.color("#77bdee"), p.color(255, 110, 108), v[i]));
            p.rect(i * w / n, 0, w / n, h);
        }
          
        if (sort_ix < v.length - 1) sort_ix++;
        else {
            sort_ix = 0;
            v = shuffle_float_array(v);
        }
    };

}

new p5(sketch, 'p5-container');

</script>