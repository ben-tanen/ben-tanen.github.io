
/*********************/
/*** INIT VARIABLE ***/
/*********************/

let margin = {top: 10, right: 10, bottom: 10, left: 10},
    width  = $("#landing-viz").width() - margin.left - margin.right,
    height = $("#landing-viz").height() - margin.top - margin.bottom;

// create svg
let svg = d3.select("#landing-viz");

// create scales
let x = d3.scaleLinear().domain([0, 100]).range([0, width]),
    y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

// viz 1 - random scrabble graph
var duration  = 5000;
var n_nodes   = 15,
    positions = new Array(n_nodes);
var randWidth  = d3.randomNormal(width / 2,  width  / 4),
    randHeight = d3.randomNormal(height / 2, height / 4),
    randWiggle = d3.randomNormal(0, Math.min(width, height) / 20);

function buildGraph() {
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
            .attr('cx', Math.min(Math.max(randWidth(),  margin.left), width - margin.right))
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

    scrambleGraph()
}

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

// resize chart on page size change
function resize() {
}

/******************/
/*** INIT PLOTS ***/
/******************/

buildGraph();
scrambleInterval = setInterval(function() {
    scrambleGraph();
}, duration);

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

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

/*****************/
/*** menu code ***/
/*****************/

$('#landing-menu img').click(function() {
    $('#site-links').slideToggle();
});
