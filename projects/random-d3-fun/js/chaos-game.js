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
        var mp = midpoint(p_curr, [+b.attr("cx"), +b.attr("cy")]);

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

    $('#num-bases').change(function() {
        // clear current circles
        chaos_svg.selectAll("circle").remove();
        a_bases = [ ];

        // regenerate bases
        generate_bases(parseInt($("input:radio[name='num-bases']:checked").val()) - 3);
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
        p_curr = [+c1.attr("cx"), +c1.attr("cy")];

        for (var i = 0; i < 2500; i++) {
            setTimeout(function() {
                place_new_point();
                $('#chaos-game-i').html(chaos_svg.selectAll("circle").size() - 4);
            }, i * 3)

        }
    });
