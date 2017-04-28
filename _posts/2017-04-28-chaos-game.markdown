---
layout: post
title: 'The Chaos Game'
date: 2017-04-28 15:05:41
categories: project data visualization math
---

<style>
#chaos-game-container {
    width: 300px;
    margin: auto;
    cursor: pointer;
}

#chaos-game-options {
    width: 300px;
    margin: auto;
}

#chaos-game-options form {
    width: 205px;
    margin: auto;
    padding-top: 5px;
}

#chaos-game-options form input {
    cursor: pointer;
}

#chaos-game-options form input:nth-of-type(n+2) {
    margin-left: 20px;
}

#chaos-game-options p {
    font-size: 20px;
    text-align: center;
}

#chaos-game-start {
    color: #77bdee;
    cursor: pointer;
}

#chaos-game-start:hover {
    text-decoration: underline;
}
</style>

After watching [this recent video from Numberphile](https://www.youtube.com/watch?v=kbKtFN71Lfs), I decided to throw together my own little visualizer of [the chaos game](https://en.wikipedia.org/wiki/Chaos_game).

To briefly explain the game, we basically start by randomly place some "bases" on our board and a single starting point that is within those bases. We then randomly select one of our bases and move our point half way closer to our chosen base. We can repeat this operation endlessly, or until something starts to form. The cool part of this game is what forms when we mark our moves. Our seemingly random behavior actually begins to form a [fractal](https://en.wikipedia.org/wiki/Fractal)!

<div id='chaos-game-container'>
</div>

<div id='chaos-game-options'>
    <!-- <form action="" id="num_bases">
        <input type="radio" name="num_bases" value="3" checked> Tri
        <input type="radio" name="num_bases" value="4"> Quad
        <input type="radio" name="num_bases" value="5"> Penta
    </form> -->
    <p><span id='chaos-game-start'>Start</span>, i = <span id='chaos-game-i'>0</span></p>
</div>

I always enjoy funky little phenomenon like this so I decided to make my own representation of it in D3. I also decided to include colors for each of the bases and then colored each new point based on which base it was moving closer to. I found it interesting that the colors become so strongly clustered immediately.

I'm in the works of implementing it for four, five, etc. bases, but for now, here is the triangular chaos game!

<script>
    /* make that d3 svg canvas */
    var dimension = 300;
    var chaos_svg = d3.select('#chaos-game-container').append('svg')
        .attr('width', dimension)
        .attr('height', dimension);

    /* declare some helper functions */
    var randomize_pos = function() {
        return Math.random() * (dimension / 10) - (dimension / 20);
    }

    var generate_bases = function(ix) {
        for (var i = 0; i < bases[ix].length; i++) {
            var cx  = bases[ix][i][0] + randomize_pos();
            var cy  = bases[ix][i][1] + randomize_pos();
            var c_i = chaos_svg.append("circle")
                         .attr("cx", cx)
                         .attr("cy", cy)
                         .attr("r",  5)
                         .attr("fill", base_colors[i]);
            a_bases.push(c_i);
        }
    }

    var pick_rand_base = function(bases) {
        var scale = d3.scaleQuantize().domain([0, 1]).range(bases);
        return scale(Math.random());
    }

    var midpoint = function(p1, p2) {
        return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    }

    var place_new_point = function() {
        var b  = pick_rand_base(a_bases);
        var bi = a_bases.indexOf(b);
        var mp = midpoint(p_curr, [parseFloat(b.attr("cx")), parseFloat(b.attr("cy"))]);
        
        chaos_svg.append("circle")
            .attr("cx", mp[0])
            .attr("cy", mp[1])
            .attr("r", 2)
            .attr("fill", base_colors[bi]);
        p_curr = mp;
    }


    /* initialize some vars */
    var bases = [
        [[dimension * (1/2), dimension * (1/10)], [dimension * (1/10), dimension * (9/10)], [dimension * (9/10), dimension * (9/10)]], // triangle
        [[dimension * (2/10), dimension * (2/10)], [dimension * (2/10), dimension * (8/10)], [dimension * (8/10), dimension * (2/10)], [dimension * (8/10), dimension * (8/10)]], // square
    ];
    var a_bases = [ ];
    var base_colors = ["#49E9E7", "#FF4CC8", "#23CE6B", "#872F9C", "#328DDF"]

    /* generate bases */
    generate_bases(0);

    $('#num_bases').change(function() {
        // clear current circles
        chaos_svg.selectAll("circle").remove();
        a_bases = [ ];

        // regenerate bases
        generate_bases(parseInt($("input:radio[name='num_bases']:checked").val()) - 3);
    });

    $('#chaos-game-start').click(function() {
        // clear all points
        chaos_svg.selectAll("circle").filter(function(d) { return d3.select(this).attr("r") < 5 }).remove();

        // draw first point
        var c1 = chaos_svg.append("circle")
            .attr("cx", (dimension / 2) + randomize_pos() * 1.25)
            .attr("cy", (dimension / 2) + randomize_pos() * 1.25)
            .attr("r", 2)
            .attr("fill", "#808080");
        p_curr = [parseFloat(c1.attr("cx")), parseFloat(c1.attr("cy"))];

        for (var i = 0; i < 2500; i++) {
            setTimeout(function() {
                place_new_point(); 
                $('#chaos-game-i').html(chaos_svg.selectAll("circle").size() - 4);
            }, i * 3)
            
        }
    });
</script>