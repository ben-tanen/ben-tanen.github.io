/* 
TO DO:
4. make x scale unique for house vs. senate?
5. to include resolving differences/president bills?
6. add tooltips? to axis labels to explain meaning; to bars?
7. make it so you can "update" bars by just relinking data and then hitting "refresh"; does this exist?
8. make a scale for date with domain for scroll position (can you make date ranges?)
*/

/*********************/
/*** INIT VARIABLE ***/
/*********************/

let hbd_svg = d3.select('#d3-how-bills-die');

let hbd_margin = {top: 10, right: 10, bottom: 10, left: 10, middle_x: 100, middle_y: 10},
    hbd_width  = $('#d3-how-bills-die').width() - hbd_margin.left - hbd_margin.right - hbd_margin.middle_x,
    hbd_height = $('#d3-how-bills-die').height() - hbd_margin.top - hbd_margin.bottom - hbd_margin.middle_y * 4;

let data = [ ];

let x = d3.scaleLinear().range([0, hbd_width / 2]),
    y = d3.scaleOrdinal().range([...Array(5).keys()].map((i) => i * (hbd_height / 5 + hbd_margin.middle_y)));

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

function init_bars(date) {
    hbd_svg.selectAll("rect.bar.back")
        .data(data.filter((d) => d.date === date & d.chamber_curr != "b")).enter()
        .append("rect")
        .classed("bar", true)
        .classed("back", true)
        .attr("id", (d) => d.chamber_curr + "_" + d.status_bucket.substr(0, 1))
        .attr("x", (d) => hbd_margin.left + (d.chamber_curr === "hr" ? 0 : hbd_margin.middle_x) + (hbd_width / 2) - (d.chamber_curr === "hr" ? x(d.N) : 0))
        .attr("y", (d) => hbd_margin.top + y(d.status_bucket))
        .attr("width", (d) => x(d.N))
        .attr("height", hbd_height / 5);

    hbd_svg.selectAll("rect.bar.front")
        .data(data.filter((d) => d.date === date & d.chamber_curr != "b")).enter()
        .append("rect")
        .classed("bar", true)
        .classed("front", true)
        .attr("id", (d) => d.chamber_curr + "_" + d.status_bucket.substr(0, 1))
        .attr("x", (d) => hbd_margin.left + (d.chamber_curr === "hr" ? 0 : hbd_margin.middle_x) + (hbd_width / 2) - (d.chamber_curr === "hr" ? x(d.N - d.N_curr) : 0))
        .attr("y", (d) => hbd_margin.top + y(d.status_bucket))
        .attr("width", (d) => x(d.N - d.N_curr))
        .attr("height", hbd_height / 5);
}

function update_bars(date, duration = 0) {
    hbd_svg.selectAll("rect.bar.back")
        .data(data.filter((d) => d.date === date & d.chamber_curr != "b"))
        .transition().duration(duration)
        .attr("x", (d) => hbd_margin.left + (d.chamber_curr === "hr" ? 0 : hbd_margin.middle_x) + (hbd_width / 2) - (d.chamber_curr === "hr" ? x(d.N) : 0))
        .attr("width", (d) => x(d.N));

    hbd_svg.selectAll("rect.bar.front")
        .data(data.filter((d) => d.date === date & d.chamber_curr != "b"))
        .transition().duration(duration)
        .attr("x", (d) => hbd_margin.left + (d.chamber_curr === "hr" ? 0 : hbd_margin.middle_x) + (hbd_width / 2) - (d.chamber_curr === "hr" ? x(d.N - d.N_curr) : 0))
        .attr("width", (d) => x(d.N - d.N_curr));    
}

function draw_axis() {
    hbd_svg.selectAll("text.axis-label")
        .data(y.domain()).enter()
        .append("text")
        .classed("axis-label", true)
        .attr("x", hbd_margin.left + hbd_width / 2 + hbd_margin.middle_x / 2)
        .attr("y", (d) => hbd_margin.top + y(d) + (hbd_height / 5) / 2)
        .text((d) => d);
}

// given number of dots, class of dots, ids of bucket 1 + 2, delay, and duration
// animate the transition of these dots between bucket 1 and bucket 2
function animate_bill_dot_transition(n, cl, b1_id, b2_id, de, du) {

    let b1 = hbd_svg.select("#" + b1_id),
        b2 = hbd_svg.select("#" + b2_id);

    let dots = [ ];

    for (let i = 0; i < n; i++) dots.push({
        "i": i,
        "type": "bill-dot",
        "class": cl,
        "x1": +b1.attr("cx") + (Math.random() - 0.5) * +b1.attr("r") * 0.8, 
        "y1": +b1.attr("cy") + (Math.random() - 0.5) * +b1.attr("r") * 0.8,
        "x2": +b2.attr("cx") + (Math.random() - 0.5) * +b2.attr("r") * 0.8,
        "y2": +b2.attr("cy") + (Math.random() - 0.5) * +b2.attr("r") * 0.8
    });

    hbd_svg.selectAll("circle.bill-dot." + cl)
        .data(dots)
        .enter().append("circle")
        .classed("bill-dot", true)
        .classed(cl, true)
        .attr("cx", d => d.x1)
        .attr("cy", d => d.y1)
        .attr("r", 4)
        .transition().delay(d => de + d.i * 10).duration(du)
        .attr("cx", d => d.x2)
        .attr("cy", d => d.y2)
        .remove();

    hbd_svg.selectAll(".bar").raise();
}

function sticky_scroll() {
    var screen_margin = ($(window).height() - $('#d3-how-bills-die').height()) / 2;
    var d3_container_top = $('#d3-how-bills-die').parent().offset().top;
    var d3_container_height = $('#d3-how-bills-die').parent().parent().height();

    // after focusing on svg, don't move it at bottom of column
    if (d3_container_top + d3_container_height - screen_margin <= $(window).scrollTop() + $('#d3-how-bills-die').height()) {
        var margin_top = d3_container_height - $('#d3-how-bills-die').height();
        $('#d3-how-bills-die').css({
            'position': 'initial',
            'margin-top': margin_top + 'px'
        });

    // while focusing on svg, center it
    } else if ($(window).scrollTop() + screen_margin >= d3_container_top) {
        $('#d3-how-bills-die').css({
            'position': 'fixed',
            'top': Math.max(120, screen_margin),
            'left': $('wrapper').css('padding-left'),
            'margin-top': 0,
            'width': $('#scroll-viz-container').width()
        });
    
    // before encountering svg, don't move it at top of column
    } else {
        $('#d3-how-bills-die').css('position', 'initial');
    }
}

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

d3.csv("data/2019-10-21_bill-counts-by-day-long.csv", (d) => {
    d.N = +d.N;
    d.N_chamber = +d.N_chamber;
    d.N_curr = +d.N_curr;
    return d;
}, (error, d) => {
    // store data (necessary?)
    for (var i = 0; i < d.length; i++) data.push(d[i]);

    // adjust scale domain based on data
    x.domain(d3.extent(data, (d) => d.N));
    y.domain(d3.map(data.filter((d) => d.chamber_curr != "b"), (d) => d.status_bucket).keys().sort())

    draw_axis();
    init_bars("2019-10-08");
})

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(document).ready(() => {
    // init size of plot / columns based on page size?
    sticky_scroll();
});

$(window).resize(() => {
    hbd_width = $('#d3-how-bills-die').width() - hbd_margin.left - hbd_margin.right - hbd_margin.middle_x;
    x.range([0, hbd_width / 2]);

    update_bars("2019-10-08");

    hbd_svg.selectAll("text.axis-label")
        .transition().duration(0)
        .attr("x", hbd_margin.left + hbd_width / 2 + hbd_margin.middle_x / 2);
});

$(window).scroll(() => {
    sticky_scroll();
});
