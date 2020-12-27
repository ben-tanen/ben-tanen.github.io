
/*********************/
/*** INIT VARIABLE ***/
/*********************/

let margin = {top: 10, right: 10, bottom: 10, left: 10},
    width  = $("#landing-viz").width() - margin.left - margin.right,
    height = $("#landing-viz").height() - margin.top - margin.bottom;

// create empty list for data (to be filled based on viz to use)
let data = [ ];

// create svg
let svg = d3.select("#landing-viz");

/**********************************/
/*** DECLARE VISUALIZATION FXNS ***/
/**********************************/

let vs = [
    {
        init: (options) => {
            // create list of initial positions (x, y) and connections (n) for nodes
            data = Array.apply(null, Array(options.n_nodes)).map(d => {
                return {x1: Math.min(Math.max(d3.randomNormal(width / 2, width / 4)(), margin.left), width - margin.right), 
                        y1: Math.min(Math.max(d3.randomNormal(height / 2, height / 4)(), margin.top), height - margin.bottom),
                        n: d3.randomInt(options.n_nodes)()
                };
            });
            data = data.map(d => Object.assign(d, {x2: data[d.n].x1, y2: data[d.n].y1}));

            // draw graph initially
            svg.selectAll("circle")
                .data(data).enter()
                .append("circle")
                .classed("node", true)
                .attr("cx", d => d.x1)
                .attr("cy", d => d.y1)
                .attr("r", 3);

            svg.selectAll("line")
                .data(data).enter()
                .append("line")
                .classed("edge", true)
                .attr("x1", d => d.x1)
                .attr("y1", d => d.y1)
                .attr("x2", d => d.x2)
                .attr("y2", d => d.y2);
        },
        update: (options) => {
            // jiggle each point slightly and then update connections
            data = data.map(d => Object.assign(d, {
                x1: Math.min(Math.max(d.x1 + d3.randomNormal(0, width / 20)(), margin.left), width - margin.right),
                y1: Math.min(Math.max(d.y1 + d3.randomNormal(0, height / 20)(), margin.top), height - margin.bottom)
            }));
            data = data.map(d => Object.assign(d, {x2: data[d.n].x1, y2: data[d.n].y1}));

            // transition nodes + edges
            svg.selectAll(".node")
                .transition()
                .ease(d3.easeLinear)
                .duration(options.duration)
                .attr("cx", d => d.x1)
                .attr("cy", d => d.y1);

            svg.selectAll(".edge")
            .transition()
                .ease(d3.easeLinear)
                .duration(options.duration)
                .attr("x1", d => d.x1)
                .attr("y1", d => d.y1)
                .attr("x2", d => d.x2)
                .attr("y2", d => d.y2);
        },
        options: {
            n_nodes: 15,
            duration: 5000
        }
    }
];

/******************/
/*** INIT PLOTS ***/
/******************/

let viz = vs[0];

viz.init(viz.options);
viz.update(viz.options);
vizInterval = setInterval(function() {
    viz.update(viz.options);
}, viz.options.duration);

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

// upon leaving page, clear animation
$(window).blur(function() {
    clearInterval(vizInterval);
});

// upon entering page, restart animation
$(window).focus(function() {
    viz.update(viz.options);
    vizInterval = setInterval(function() {
        viz.update(viz.options);
    }, viz.options.duration);
});

/*****************/
/*** menu code ***/
/*****************/

$('#landing-menu img').click(function() {
    $('#site-links').slideToggle();
});
