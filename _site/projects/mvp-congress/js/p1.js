
/*********************/
/*** INIT VARIABLE ***/
/*********************/

// var mvp_btl_svg = d3.select('#d3-bill-timeline');

var mvp_btl_margin = {top: 5, right: 5, bottom: 5, left: 5},
    mvp_btl_width  = $('#d3-bill-timeline').width() -  mvp_btl_margin.left - mvp_btl_margin.right,
    mvp_btl_height = $('#d3-bill-timeline').width() - mvp_btl_margin.top - mvp_btl_margin.bottom;

var width,height;
var chartWidth, chartHeight;
var margin;
var svg = d3.select("#d3-bill-timeline");
var chartLayer = svg.append("g").classed("chartLayer", true);

/**********************************/
/*** DECLARE MECHANIC FUNCTIONS ***/
/**********************************/

main();

function main() {
    var range = 100;
    var data = {
        nodes: d3.range(0, range).map(function(d) { return { label: "l" + d,
                                                             r: ~~d3.randomUniform(8, 28)(),
                                                             x: d3.randomUniform(0, mvp_btl_width)(),
                                                             y: d3.randomUniform(0, mvp_btl_height)()
                                                           }
                                                  })
    }

    // console.log(data.nodes);
    
    // setSize(data)
    drawChart(data);
}

// function setSize(data) {
//     width = document.querySelector("#d3-bill-timeline").clientWidth
//     height = document.querySelector("#d3-bill-timeline").clientHeight

//     margin = {top:0, left:0, bottom:0, right:0 }
    
//     chartWidth = width - (margin.left+margin.right)
//     chartHeight = height - (margin.top+margin.bottom)
    
//     svg.attr("width", width).attr("height", height)
    
//     chartLayer
//         .attr("width", chartWidth)
//         .attr("height", chartHeight)
//         .attr("transform", "translate("+[margin.left, margin.top]+")")  
// }

function drawChart(data) {

    console.log(data);
    
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.index }))
        .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
        .force("y", d3.forceY(0))
        .force("x", d3.forceX(0))
    
    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", function(d){  return d.r })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));    
    
    
    var ticked = function() {
        // link
        //     .attr("x1", function(d) { return d.source.x; })
        //     .attr("y1", function(d) { return d.source.y; })
        //     .attr("x2", function(d) { return d.target.x; })
        //     .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { // console.log(d); 
                                      return d.x; })
            .attr("cy", function(d) { return d.y; });
    }  
    
    simulation
        .nodes(data.nodes)
        .on("tick", ticked);
    
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    } 
            
}

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

/******************************/
/*** IMPORT DATA AND RENDER ***/
/******************************/

// move dots (for running example)
setInterval(function() {
    // add a node
    // move nodes
}, 1000);

d3.csv("/projects/mvp-congress/data/sample-mvp-congress.csv", function(d) {
    d.bill_id = +d.bill_id;
    d.day = +d.day;
    d.month = +d.month;
    d.year = +d.year;
    d.status = +d.status;
    return d;
}, function(error, d) {
    // console.log(d);
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

// on resize
$(window).resize(function() {
    // do the resize stuff
});
