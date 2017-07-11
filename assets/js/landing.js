
/**********************/
/*** init variables ***/
/**********************/

var svg    = d3.select("svg"),
    width  = $('svg').width(),
    height = $('svg').height(),
    margin = {
        'top':    10,
        'left':   10,
        'right':  10,
        'bottom': 10
    };

var duration  = 5000;

var n_nodes   = 15,
    positions = new Array(n_nodes);

var randWidth  = d3.randomNormal(width / 2,  width  / 4),
    randHeight = d3.randomNormal(height / 2, height / 4),
    randWiggle = d3.randomNormal(0, Math.min(width, height) / 20);

/*******************/
/*** build graph ***/
/*******************/

for (var i = 0; i < n_nodes; i++) {
    // if there is a node already, find random pair for new node
    if (i > 0) {
        var t_i = Math.floor(Math.random() * svg.selectAll('circle').size()),
            t   = d3.select(svg.selectAll('circle')._groups[0][t_i]);
    }

    // add node at random position
    var s = svg.append('circle')
        .attr('class', 'node')
        .attr('id', i)
        .attr('r', 3)
        .attr('cx', Math.min(Math.max(randWidth(),  margin.left), width  - margin.right))
        .attr('cy', Math.min(Math.max(randHeight(), margin.top), height - margin.bottom));

    // connect source to target
    if (t) {
        svg.append('line')
            .attr('class', 'edge')
            .attr("x1", +s.attr("cx"))
            .attr("y1", +s.attr("cy"))
            .attr("x2", +t.attr("cx"))
            .attr("y2", +t.attr("cy"))
            .attr("s", i)
            .attr("t", t_i);
    }

    // keep log of positions
    positions[i] = [+s.attr("cx"), +s.attr("cy")];
}

/*******************************/
/*** randomly scramble graph ***/
/*******************************/

function scrambleGraph() {
    // for each node: move to new x + y position, based on randWiggle()
    for (var i = 0; i < n_nodes; i++) {
        var n = d3.select(svg.selectAll('circle')._groups[0][i]);

        var x = Math.min(Math.max(positions[i][0] + randWiggle(), margin.left), width  - margin.right),
            y = Math.min(Math.max(positions[i][1] + randWiggle(), margin.top), height - margin.bottom);

        positions[i] = [x, y];

        n.transition().ease(d3.easeLinear).duration(duration)
            .attr('cx', x)
            .attr('cy', y);
    }

    // for each edge: update based on positions
    svg.selectAll('line')
        .transition().ease(d3.easeLinear).duration(duration)
        .attr("x1", function() { return +positions[+d3.select(this).attr('s')][0]; })
        .attr("y1", function() { return +positions[+d3.select(this).attr('s')][1]; })
        .attr("x2", function() { return +positions[+d3.select(this).attr('t')][0]; })
        .attr("y2", function() { return +positions[+d3.select(this).attr('t')][1]; });
}

// initial scramble + subsequent interval
scrambleGraph();
scrambleInterval = setInterval(function() {
    scrambleGraph();
}, duration);

/********************************/
/*** page resize + focus code ***/
/********************************/

// upon leaving page, clear animation
$(window).blur(function() {
    clearInterval(scrambleInterval);
});

// upon entering page, restart animation
$(window).focus(function() {
    scrambleGraph();
    scrambleInterval = setInterval(function() {
        scrambleGraph();
    }, duration);
});

$(window).resize(function() {
    // update width, height, and related fxns
    width  = $('svg').width();
    height = $('svg').height();

    randWidth  = d3.randomNormal(width / 2,  width  / 4);
    randHeight = d3.randomNormal(height / 2, height / 4);
    randWiggle = d3.randomNormal(0, Math.min(width, height) / 20);

    // calculate center and spread of nodes
    var sum_x = 0,
        sum_y = 0,
        min_x = width,
        max_x = 0,
        min_y = height,
        max_y = 0;

    for (var i = 0; i < n_nodes; i++) {
        sum_x += positions[i][0],
        sum_y += positions[i][1];

        if      (positions[i][0] < min_x) min_x = positions[i][0];
        else if (positions[i][0] > max_x) max_x = positions[i][0];
        if      (positions[i][1] < min_y) min_y = positions[i][1];
        else if (positions[i][1] > max_y) max_y = positions[i][1];
    }

    // if node spread is significantly smaller than screen size, re-randomize node positions
    if (max_x - min_x < width * 0.6 || max_y - min_x < height * 0.6) {
        for (var i = 0; i < n_nodes; i++) {
            positions[i] = [randWidth(), randHeight()];
        }

    // otherwise, center nodes
    } else {
        var d_x = width / 2 - sum_x / n_nodes,
            d_y = height / 2 - sum_y / n_nodes;

        for (var i = 0; i < n_nodes; i++) {
            positions[i] = [positions[i][0] + d_x, positions[i][1] + d_y];
        }
    }
});

/**********************/
/*** currently code ***/
/**********************/

$(document).ready(function() {
    // get and update listening data
    $.ajax({
        url: "http://bt-currently.herokuapp.com/getListening"
    }).done(function(data) {
        if (Object.keys(data).length >= 1 && data.song_artist != "") {

            if (data.song_name == null || data.song_name == "" && data.song_album != null) {
                $('#currently-music-name').html(data.song_album).attr('href', data.song_url);
            } else {
                $('#currently-music-name').html(data.song_name).attr('href', data.song_url);
            }

            $('#currently-music-artist').html(data.song_artist);

            if ($('#currently-book-name').html() != "...") {
                $('#currently-text').css('opacity', 1);
            }
        }
    });

    // get and update reading data
    $.ajax({
        url: "http://bt-currently.herokuapp.com/getReading"
    }).done(function(data) {
        if (Object.keys(data).length >= 1 && data.book_name != "") {

            $('#currently-book-name').html(data.book_name).attr('href', data.book_url);
            $('#currently-book-author').html(data.book_author);

            if ($('#currently-music-name').html() != "...") {
                $('#currently-text').css('opacity', 1);
            }
        }
    });
});