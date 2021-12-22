
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

// create x, y scales
let x = d3.scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]),
    y = d3.scaleLinear()
    .domain([0, 1])
    .range([margin.top, height - margin.bottom]);

// keep track of iterations played
let ix = 0;

// create null elements for sim (to be filled if needed)
let sim;

/***************************/
/*** DECLARE HELPER FXNS ***/
/***************************/

distance = ([x1, y1], [x2, y2]) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

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
            svg.selectAll(".node")
                .data(data).enter()
                .append("circle")
                .classed("node", true)
                .attr("cx", d => d.x1)
                .attr("cy", d => d.y1)
                .attr("r", 3);

            svg.selectAll(".edge")
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
    },
    {
        init: (options) => {

            const node_data = [...Array(options.n_nodes)]
                .map(() => ({x: x(Math.min(Math.max(d3.randomNormal(0.5, 0.15)(), 0), 1)), 
                             y: y(Math.min(Math.max(d3.randomNormal(0.5, 0.15)(), 0), 1))
                            }));
            const edge_data = [...Array(node_data.length)]
                .map((d, i) => ({source: i, target: d3.randomInt(node_data.length)() }))
                .filter(d => d.source != d.target);

            sim = d3.forceSimulation(node_data)
                .force("pulse", () => {
                    node_data.forEach((node, ix) => {
                        const node_r = distance([node.x, node.y], [x(0.5), y(0.5)]),
                              theta = Math.atan((node.y - y(0.5)) / (node.x - x(0.5)));
                        node.vx += -1 * Math.cos(theta) * (node.x < x(0.5) ? -1 : 1);
                        node.vy += -1 * Math.sin(theta) * (node.x < x(0.5) ? -1 : 1);
                    });
                })
                .force("orbit", () => {
                    node_data.forEach((node, ix) => {
                        const node_r = distance([node.x, node.y], [x(0.5), y(0.5)]),
                              theta = Math.atan((node.y - y(0.5)) / (node.x - x(0.5))),
                              target_x = x(0.5) + node_r * Math.cos(theta + 0.005) * (node.x < x(0.5) ? -1 : 1),
                              target_y = y(0.5) + node_r * Math.sin(theta + 0.005) * (node.x < x(0.5) ? -1 : 1);
                        node.x = target_x;
                        node.y = target_y;
                    });
                })
                .stop();

            edges = svg.selectAll(".edge")
                .data(edge_data).enter()
                .append("line")
                .classed("edge", true)
                .attr("x1", d => node_data[d.source].x)
                .attr("y1", d => node_data[d.source].y)
                .attr("x2", d => node_data[d.target].x)
                .attr("y2", d => node_data[d.target].y);

            nodes = svg.selectAll(".node")
                .data(node_data).enter()
                .append("circle")
                .classed("node", true)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", 4);

        },
        update: (options) => {

            sim.tick();

            svg.selectAll(".node")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            svg.selectAll(".edge")
                .attr("x1", d => sim.nodes()[d.source].x)
                .attr("y1", d => sim.nodes()[d.source].y)
                .attr("x2", d => sim.nodes()[d.target].x)
                .attr("y2", d => sim.nodes()[d.target].y);

        },
        options: {
            n_nodes: 20,
            duration: 50
        }
    },
    {
        init: (options) => {
            // create list of initial positions (x, y) for each bubble
            data = Array.apply(null, Array(options.n_circ)).map(d => {
                return {cx: Math.min(Math.max(d3.randomNormal(width / 2, width / 7)(), margin.left), width - margin.right), 
                        cy: Math.min(Math.max(d3.randomNormal(height / 2, height / 7)(), margin.top), height - margin.bottom),
                        v: false
                };
            });

            // for each bubble, determine the maximum radius so as not to touch another circle
            data[0].r = Math.max(5, d3.randomNormal(Math.min(height, width) / 15, Math.min(height, width) / 30)());
            for (let i = 1; i < data.length; i++) {
                
                // sort all prev points by radial distance (center + radius) from new circle's point
                // then take closest element
                const closest_circ = data.slice(0, i).sort((x, y) => {
                    const p = data[i],
                          d1 = distance([p.cx, p.cy], [x.cx, x.cy]) - x.r,
                          d2 = distance([p.cx, p.cy], [y.cx, y.cy]) - y.r;
                    return d3.ascending(d1, d2);
                })[0],
                      closest_d = Math.max(0, distance([data[i].cx, data[i].cy], [closest_circ.cx, closest_circ.cy]) - closest_circ.r);

                data[i].r = Math.max(0, Math.min(closest_d, d3.randomNormal(Math.min(height, width) / 15, Math.min(height, width) / 30)()));
            }
        },
        update: (options) => {
            // if all circles not visible, display ~75% of them
            if (data.filter(d => d.v).length == 0) {
                data = data.map(d => Object.assign(d, {v: Math.random() < 0.75}));
                svg.selectAll(".bubble")
                    .data(data.filter(d => d.v & d.r > 0)).enter()
                    .append("circle")
                    .classed("bubble", true)
                    .attr("cx", d => d.cx)
                    .attr("cy", d => d.cy)
                    .attr("r", 0)
                    .transition()
                    .ease(d3.easePolyInOut)
                    .duration(options.duration)
                    .attr("r", d => d.r);

            // 50/50 chance of revealing a new circle
            } else if (Math.random() < 0.5 & data.filter(d => !d.v).length > 0) {
                let hidden_cs = data.filter(d => !d.v & d.r > 0),
                    to_show_c = hidden_cs[d3.randomInt(hidden_cs.length)()];
                to_show_c = Object.assign(to_show_c, {v: true});

                console.log("revealing");
                console.log(to_show_c);

                svg.selectAll(".bubble")
                    .data([to_show_c]).enter()
                    .append("circle")
                    .classed("bubble", true)
                    .attr("cx", d => d.cx)
                    .attr("cy", d => d.cy)
                    .attr("r", 0)
                    .transition()
                    .ease(d3.easePolyInOut)
                    .duration(options.duration)
                    .attr("r", d => d.r);

            // ... or replacing a circle
            } else {
                let visible_cs = data.filter(d => d.v),
                    to_hide_c  = visible_cs[d3.randomInt(visible_cs.length)()];

                svg.selectAll(".bubble")
                    .filter(d => d.cx == to_hide_c.cx & d.cy == to_hide_c.cy)
                    .transition()
                    .ease(d3.easePolyInOut)
                    .duration(options.duration)
                    .attr("r", 0)
                    .delay(options.duration + 500)
                    .remove();

                to_hide_c = Object.assign(to_hide_c, {v: false});
            }
        },
        options: {
            n_circ: 15,
            duration: 500
        }
    }
];

/*******************************/
/*** DECLARE REORDERING FXNS ***/
/*******************************/

reorder = () => {
    const cells = d3.selectAll(".proj-cell"),
          cellOrder = cells.nodes()
            .map((d, i) => ({ ix: i, lo: d.dataset.landing_order}))
            .map((d) => Object.assign(d, { 
                loc3: +d.lo.split("|")[0], 
                loc2: +d.lo.split("|")[1], 
                loc1: +d.lo.split("|")[2] 
            }));

    const cellWidth = +cells.style("width").replace("px", ""),
          containerWidth = +d3.select("#proj-container").style("width").replace("px", ""),
          nCols = Math.round(containerWidth / cellWidth);

    const cellIxs = cellOrder.sort((a, b) => d3.descending(a["loc" + nCols], b["loc" + nCols])).map(d => d.ix);
    for (let i = 0; i < cellIxs.length; i++) {
        d3.select(cells.nodes()[cellIxs[i]]).lower();
    }
}

reorder();

/******************/
/*** INIT PLOTS ***/
/******************/

let viz = vs[0];

viz.init(viz.options);
viz.update(viz.options);
ix++;
vizInterval = setInterval(function() {
    viz.update(viz.options);
    ix++;
}, viz.options.duration);

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

// upon resize, potentially re-order project cells
$(window).resize(function() {
    console.log("resizing");
    reorder();
});

// upon leaving page, clear animation
$(window).blur(function() {
    clearInterval(vizInterval);
});

// upon entering page, restart animation
$(window).focus(function() {
    viz.update(viz.options);
    ix++;
    vizInterval = setInterval(function() {
        viz.update(viz.options);
        ix++;
    }, viz.options.duration);
});

/*****************/
/*** menu code ***/
/*****************/

$('#landing-menu img').click(function() {
    $('#site-links').slideToggle();
});
