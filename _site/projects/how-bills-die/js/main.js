/*********************/
/*** INIT VARIABLE ***/
/*********************/

let hbd_svg = d3.select('#d3-how-bills-die');

let hbd_margin = {top: 10, right: 10, bottom: 10, left: 10},
    hbd_width  = $('#d3-how-bills-die').width() - hbd_margin.left - hbd_margin.right,
    hbd_height = $('#d3-how-bills-die').height() - hbd_margin.top - hbd_margin.bottom;

let data = { };

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

// given id, position (list of x + y), radius, color, and label
// render a bucket
function render_bucket(id, p, r, c, l) {
    hbd_svg.append("circle")
        .classed("status-bucket", true)
        .attr("id", id)
        .attr("cx", hbd_margin.left + p[0])
        .attr("cy", hbd_margin.top + p[1])
        .attr("r", r)
        .style("fill", c);
}

// given id, new radius, delay, and duration
// transition the bucket radius
function update_bucket_radius(id, r, de, du) {
    hbd_svg.select(".status-bucket#" + id)
        .transition().delay(de).duration(du)
        .attr("r", r);
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

    hbd_svg.selectAll(".status-bucket").raise();
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

d3.csv("data/2019-10-21_bill-counts-by-day.csv", function(d) {
    d.hr_A = +d.hr_A;
    d.hr_B = +d.hr_B;
    d.hr_C = +d.hr_C;
    d.hr_D = +d.hr_D;
    d.hr_E = +d.hr_E;
    d.s_A = +d.s_A;
    d.s_B = +d.s_B;
    d.s_C = +d.s_C;
    d.s_D = +d.s_D;
    d.s_E = +d.s_E;
    d.b_F = +d.b_F;
    d.b_G = +d.b_G;
    return d;
}, function(error, d) {
    // store data
    for (var i = 0; i < d.length; i++) data[d[i].date] = d[i];

    render_bucket("b1", [hbd_width / 2, 50], 50, "#77bdee", "label1");
    render_bucket("b2", [hbd_width / 2, 200], 50, "#77bdee", "label2");
    render_bucket("b3", [hbd_width / 2, 350], 50, "#77bdee", "label3");

    animate_bill_dot_transition(10, "t1", "b1", "b2", 500, 1000);
    update_bucket_radius("b1", 40, 500, 500);
    update_bucket_radius("b2", 60, 1000, 500);
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(document).ready(function() {
    // init size of plot / columns based on page size?
});

$(window).resize(function() {
    // resize();
});

$(window).scroll(function() {
    sticky_scroll();
});
