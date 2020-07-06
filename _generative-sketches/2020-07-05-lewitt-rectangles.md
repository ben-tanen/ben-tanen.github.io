---
layout: generative-sketch
title:  "Rectangles"
date:   2020-07-04 10:06:41
thumbnail: /projects/generative-sketchbook/assets/img/thumbnails/lewitt-rectangles.png
---

<script>

let sketch = function(p) {

    /*********************/
    /*** INIT VARIABLE ***/
    /*********************/

    const width = Math.min(500, $("#p5-container").width()),
          height = width;

    // a container for rectangles and lines
    let rectangles = [ ],
        lines = [ ];

    // indicator of how many elements to draw at a given time/frame
    let to_draw = 0;

    // probabilities of connecting to previous rect from top, right, bottom, left
    // depending on which quadrant previous rect was in (top-left, top-right, bottom-left, bottom-right)
    const tang_probs = [
        [0.4, 0.5, 0.6, 1], 
        [0.4, 0.8, 0.9, 1],
        [0.1, 0.2, 0.6, 1],
        [0.1, 0.5, 0.9, 1],
    ];

    /***********************/
    /*** DECLARE CLASSES ***/
    /***********************/

    class Rectangle {
        constructor(x = 0, y = 0, w = 100, h = 100) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.ts = [ ];
        }

        // update the rect's position
        move(x, y) {
            this.x = p.max(0.01 * width, p.min(width * 0.99 - this.w, x));
            this.y = p.max(0.01 * height, p.min(height * 0.99 - this.h, y));
            this.ts = [ ];
        }

        // update the rect's shape
        resize(w, h) {
            this.w = p.max(0.01 * width, p.min(width * 0.99 - this.x, w));
            this.h = p.max(0.01 * height, p.min(height * 0.99 - this.y, h));
            this.ts = [ ];
        }

        // update the rect's position to somewhere tangent to a specific point 
        // (s = side to be tangent [0 = top, 1 = right, 2 = bottom, 3 = left],
        //  x/y describe the point)
        tangent_move(s, x, y) {
            if (s == 0) {
                this.move(x - p.random(this.w), y);
            } else if (s == 1) {
                this.move(x - this.w, y - p.random(this.h));
            } else if (s == 2) {
                this.move(x - p.random(this.w), y - this.h);
            } else if (s == 3) {
                this.move(x, y - p.random(this.h));
            }
            this.ts.push(s);
        }

        // update the rect's position randomly (between range of parameters)
        random_move(x_min = 0.1, x_max = 0.9, y_min = 0.1, y_max = 0.9) {
            this.move(p.random(width * x_min, width * x_max), p.random(height * y_min, height * y_max)); 
        }

        // update the rect's shape randomly (between range of parameters)
        random_resize(w_min = 0.1, w_max = 0.25, h_min = 0.1, h_max = 0.25) {
            this.resize(p.random(width * w_min, width * w_max), p.random(height * h_min, height * h_max));
        }

        // return a random exterior point from given sides (0 = top, 1 = right, 2 = bottom, 3 = left)
        exterior_point(sides = [0, 1, 2, 3], buffer = 0.1) {
            let side = p.random(sides.filter(e => this.ts.indexOf(e) == -1));
            if (side == 0 | side == 2) {
                return [this.x + p.random(this.w * buffer, this.w * (1 - buffer)), this.y + (side == 0 ? 0 : this.h)];
            } else {
                return [this.x + (side == 1 ? this.w : 0), this.y + p.random(this.h * buffer, this.h * (1 - buffer))];
            }
        }

        // draw the rect to the screen
        draw(stroke = "white", fill = "black") {
            p.stroke(stroke);
            p.strokeWeight(2);
            p.fill(fill);
            p.rect(this.x, this.y, this.w, this.h);
        }
    }

    /********************************/
    /*** DECLARE HELPER FUNCTIONS ***/
    /********************************/

    // given two Rectangles, check if they intersect
    function rectangles_intersect(r1, r2) {
        let x_overlap = p.max(0, p.min(r1.x + r1.w, r2.x + r2.w) - p.max(r1.x, r2.x)),
            y_overlap = p.max(0, p.min(r1.y + r1.h, r2.y + r2.h) - p.max(r1.y, r2.y));
        return (x_overlap * y_overlap) > 0;
    }

    // checks all rectanges in rs for intersection
    function any_rectangles_intersect() {
        for (let i = 0; i < rs.length; i++) {
            for (let j = 0; j < rs.length; j++) {
                if (i != j & rectangles_intersect(rs[i], rs[j])) {
                    return true;
                }
            }
        }
        return false;
    }

    // calculate shared edge between two rectangles
    function shared_edge(r1, r2) {
        let x1 = p.min(r1.x + r1.w, r2.x + r2.w),
            x2 = p.max(r1.x, r2.x),
            y1 = p.min(r1.y + r1.h, r2.y + r2.h),
            y2 = p.max(r1.y, r2.y);
        let x_overlap = p.max(0, x1 - x2),
            y_overlap = p.max(0, y1 - y2);

        // share r1's right edge
        if (Math.abs(r1.x + r1.w - r2.x) < 0.0001 & y_overlap > 0) {
            return {'orient': 0, 's': [[r2.x, y2], [r2.x, y1]]};

        // share r1's left side
        } else if (Math.abs(r1.x - r2.x - r2.w) < 0.0001 & y_overlap > 0) {
            return {'orient': 0, 's': [[r1.x, y2], [r1.x, y1]]};

        // share r1's top side
        } else if (Math.abs(r1.y - r2.y - r2.h) < 0.0001 & x_overlap > 0) {
            return {'orient': 1, 's': [[x2, r1.y], [x1, r1.y]]};

        // share r1's top side
        } else if (Math.abs(r1.y + r1.h - r2.y) < 0.0001 & x_overlap > 0) {
            return {'orient': 1, 's': [[x2, r2.y], [x1, r2.y]]};

        // no shared sides
        } else {
            return null;
        }
    }

    // calculate the orientation of three points (each point is [x, y])
    function orientation(p1, p2, p3) {
        let orientation_val = ((p2[1] - p1[1]) * (p3[0] - p2[0])) - ((p2[0] - p1[0]) * (p3[1] - p2[1]));
        if (orientation_val > 0) return 1;
        else if (orientation_val < 0) return 2;
        else return 0;
    }

    // calculate if two line segments intersect
    // segments are lists of two points [[x1, y1], [x2, y2]]
    function segments_intersect(s1, s2) {
        o1 = orientation(s1[0], s1[1], s2[0]);
        o2 = orientation(s1[0], s1[1], s2[1]);
        o3 = orientation(s2[0], s2[1], s1[0]);
        o4 = orientation(s2[0], s2[1], s1[1]);

        if ((o1 != o2) && (o3 != o4)) return true;
        else return false;
    }

    // create series of rectangles (n_rs = # to generate)
    function gen_rs(n_rs) {
        rs = [ ];

        // create the first rectangle
        rs.push(new Rectangle());
        rs[0].random_move(0, 0.1, 0, 0.1);
        rs[0].random_resize();

        // add other rectangles
        for (let i = 1; i < n_rs; i++) {
            rs.push(new Rectangle());
            rs[i].random_resize();

            // get previous rectangle
            // and based on location of previous, get probabilities of being tangent to a given side
            let rp = rs[i - 1],
                quad = (rp.x >= width / 2 ? 1 : 0) + (rp.y >= height / 2 ? 2 : 0),
                tang_prob = tang_probs[quad];

            // move the new rectangle tangent to the previous rectangle
            // (use a random roll to determine which side to be tangent to)
            // give 100 tries to place it without overlap
            for (let j = 0; j < 100; j++) {
                let rand_roll = p.random();
                if (rand_roll < tang_prob[0]) {
                    rs[i].tangent_move(0, rs[i - 1].x + p.random(rs[i - 1].w), rs[i - 1].y + rs[i - 1].h);
                    if (!any_rectangles_intersect()) rs[i - 1].ts.push(2);
                } else if (rand_roll < tang_prob[1]) {
                    rs[i].tangent_move(1, rs[i - 1].x, rs[i - 1].y + p.random(rs[i - 1].h));
                    if (!any_rectangles_intersect()) rs[i - 1].ts.push(3)
                } else if (rand_roll < tang_prob[2]) {
                    rs[i].tangent_move(2, rs[i - 1].x + p.random(rs[i - 1].w), rs[i - 1].y);
                    if (!any_rectangles_intersect()) rs[i - 1].ts.push(0);
                } else if (rand_roll <= tang_prob[3]) {
                    rs[i].tangent_move(3, rs[i - 1].x + rs[i - 1].w, rs[i - 1].y + p.random(rs[i - 1].h));
                    if (!any_rectangles_intersect()) rs[i - 1].ts.push(1);
                }

                // current placement leads to no overlap, done with loop
                if (!any_rectangles_intersect()) break;
            }

            // if after the loop there is still overlap, stop adding new rectangles
            if (any_rectangles_intersect()) {
                rs = rs.slice(0, -1);
                break;
            }
        }

        return rs;
    }

    function gen_ls(rs) {
        // start with initial point
        ls = [rs[0].exterior_point()];

        for (let i = 1; i < rs.length; i++) {
            let edge = shared_edge(rs[i - 1], rs[i]),
                q0 = edge.s[0],
                q1 = edge.s[1],
                p0 = ls[i - 1],
                p1;

            // narrow shared edge portion to check for intersection
            if (Math.abs(q0[0] - q1[0]) < 0.01) {
                let adj = (q1[1] - q0[1]) * 0.1;
                q0 = [q0[0], q0[1] + adj];
                q1 = [q1[0], q1[1] - adj];

            } else if (Math.abs(q0[1] - q1[1]) < 0.01) {
                let adj = (q1[0] - q0[0]) * 0.1;
                q0 = [q0[0] + adj, q0[1]];
                q1 = [q1[0] - adj, q1[1]]; 
            }

            // if previous point doesn't exist (couldn't find match)
            // pick any point and continue to next iteration
            if (p0 == null) {
                ls.push(rs[i].exterior_point());
                continue;
            }

            // attempt to find a point that causes line segment to intersect with shared edge
            for (let j = 0; j < 200; j++) {
                p1 = rs[i].exterior_point();
                if (segments_intersect([q0, q1], [p0, p1])) break;
            }

            // if valid point found, add it to list
            // if not, add empty point
            if (segments_intersect([q0, q1], [p0, p1])) ls.push(p1);
            else ls.push(null);
        }

        return ls;
    }

    /*********************/
    /*** DEFINE SKETCH ***/
    /*********************/

    p.setup = function() {
        p.createCanvas(width, height);
        p.frameRate(5);

        // generate series of rectangles and lines
        rectangles = gen_rs(20);
        lines = gen_ls(rectangles);
    };

    p.draw = function() {

        // clear background
        p.background("white");

        // draw rects
        for (let i = 0; i < p.min(to_draw, rectangles.length); i++) {
            rectangles[i].draw();
        }

        // draw lines
        for (let i = 1; i < p.min(to_draw, lines.length); i++) {
            p.stroke("white");
            let p1 = lines[i - 1],
                p2 = lines[i];
            if (p1 != null & p2 != null) p.line(p1[0], p1[1], p2[0], p2[1]);
        }

        to_draw++;

        if (to_draw > rectangles.length * 1.5) {
            rectangles = gen_rs(20);
            lines = gen_ls(rectangles);
            to_draw = 0;
        }
    };

}

new p5(sketch, 'p5-container');

</script>



<div class="columns two">
    <div class="column">
        <p>This idea/sketch was originally done as a warm-up exercise for <a href="https://github.com/mattdesl/workshop-data-artwork">a creative coding class</a> taught by <a href="https://www.mattdesl.com/">Matt DesLauriers</a>.</p>
        <p>The exercise was inspired by the work of the artist Sol LeWitt. LeWitt was known for producing art in the form of instructions that others would themselves follow to create the final piece of art. This instructions were often simple and left room for interpretation and the final products reflects a combination of LeWitt's artistic vision and the individuals own style.</p>
        <p>To follow in this style, we were tasked to:</p>
        <blockquote>"With pen and pencil, come up with a short set of instructions that produces some graphic output. Keep it simple and minimal, and try to stick with basic shapes and forms like lines, circles, points, squares, etc."</blockquote>
    </div>
    <div class="column">
        <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Stumbled upon this nice Sol LeWitt exercise written in 1972, published in Avalanche Magazine, encouraging the reader to render a &quot;Page Drawing&quot; directly onto the issue. <a href="https://t.co/Thx0Ni6NeP">pic.twitter.com/Thx0Ni6NeP</a></p>&mdash; Matt DesLauriers (@mattdesl) <a href="https://twitter.com/mattdesl/status/1228098931550232581?ref_src=twsrc%5Etfw">February 13, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    </div>
</div> 

I wrote down:

> Draw a series of rectangles that are connected via their sides but do not touch on their corners. Then draw a series of lines starting from one side of a rectangle and have it pass through to another rectangle's side.

With our instructions defined, we were then told to sketch something that followed our rules. This produced the below sketches.

<div class="columns two">
    <div class="column">
        {% include figure.html autolink="yes" src="/projects/generative-sketchbook/assets/img/lewitt-rectangles-sketch-ex1.png" alt="An initial sketch following my rules above" width=500 %}
    </div>
    <div class="column">
        {% include figure.html autolink="yes" src="/projects/generative-sketchbook/assets/img/lewitt-rectangles-sketch-ex2.png" alt="Another initial sketch following my rules above" width=500 %}
    </div>
</div>

Beyond simply liking how these sketches came out, I found the Sol LeWitt style of art to be a fascinating experiment and jumping off point, especially for talking about generative art. In my previous sketches, I generally had a vision for what I wanted it to look like and I wrote the code/built the system that would create that. Using this alternate approach, I was creating the rules of the system and then letting the computer (or human) do whatever it felt appropriate.

This exercise reminded me of the classic exercise of [explaining how to make a peanut butter and jelly](http://static.zerorobotics.mit.edu/docs/team-activities/ProgrammingPeanutButterAndJelly.pdf). The exercise, which is used stress the importance of providing explicit and clear instructions, helps illustrate how far we can deviate from a plan depending on how descriptive or explicit we are in our instructions. Most of the time, this kind of deviation is a huge pain to fix, but sometimes, we can be [pleasantly surprised](https://aiweirdness.com/post/172894792687/when-algorithms-surprise-us). 

LeWitt's work and this general approach to generative art is deeply connected to the idea of "following the rules" to create personalized and often surprising results, which I find fascinating. I also think it's a great source of inspiration for future generative sketches, so keep an eye out for more results following this exercise.


<style>
    p.fig-paragraph {
        text-align: left !important;
    }
</style>