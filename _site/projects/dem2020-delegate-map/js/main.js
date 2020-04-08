
/*********************/
/*** INIT VARIABLE ***/
/*********************/

let margin = {top: 30, right: 130, bottom: 0, left: 0},
    width  = $("#dem2020-container").width() - margin.left - margin.right;

// define box and label dimensions
// and determine which set of sizes to use
const dimensions = {
    canvas_width: [440, 295, 270],
    canvas_height: [3200, 2125, 2000],
    box_size: [15, 10, 10],
    box_padding: [3, 2, 1],
    font_size: [16, 12, 11],
    tooltip_y_offset: [20, 15, 13]
};
let dimension_ix = (width < dimensions.canvas_width[0] ? 1 : 0) + (width < dimensions.canvas_width[1] ? 1 : 0);

// set height of container based on width of container
$("#dem2020-container").height(dimensions.canvas_height[dimension_ix] + margin.top + margin.bottom);

// create canvas and svg
let canvas = d3.select("#dem2020-container").append("canvas")
        .attr("id", "dem2020-canvas")
        .attr("width", dimensions.canvas_width[dimension_ix])
        .attr("height", dimensions.canvas_height[0])
        .style("padding", `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`);
    context = canvas.node().getContext("2d"),
    svg = d3.select("#dem2020-container").append("svg")
        .attr("id", "dem2020-svg")
        .attr("width", margin.left + width + margin.right)
        .attr("height", margin.top + dimensions.canvas_height[0] + margin.bottom);


// set domains: b = box position, c = color of box
let pos = d3.scaleLinear(),
    color = d3.scaleOrdinal(["#ea39bc", "#51b5c9", "#8C8CA0", "#7F96FF"]);

// define line function for borders
// and curve function for annotations
let line = d3.line()
    .x(d => margin.left + pos(d.x) + dimensions.box_padding[dimension_ix] / 2)
    .y(d => margin.top + pos(d.y) + dimensions.box_padding[dimension_ix] / 2),
    curve = d3.line().curve(d3.curveBasis)
    .x(d => margin.left + pos(d.x) + dimensions.box_padding[dimension_ix] / 2)
    .y(d => margin.top + pos(d.y) + dimensions.box_padding[dimension_ix] / 2);

// create empty list to store data
let data = [ ],
    data_agg, candidates, states;

// show when last updated
const update_date = "2020-04-08";

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

// format readable date
function format_date(date) {
    const month_str = d3.timeFormat("%b")(new Date(date.substr(0, 8) + "10"));
    return month_str + " " + date.substr(8, 2) + ", " + date.substr(0, 4);
}

// convert name to id/selector friendly
function make_id(str) {
    return str.replace(/ /g, "-").toLowerCase();
}

// check if a given box is in the perimeter of a state's data
function box_on_perimeter_check(state_data, box) {
    const c = box["col"],
          r = box["row"];

    // on perimeter if box surrounding boxes not found in state data
    return {"col": c,
            "row": r,
            "left": state_data.find(d => d.col == c - 1 & d.row == r) == null,
            "right": state_data.find(d => d.col == c + 1 & d.row == r) == null,
            "top": state_data.find(d => d.col == c & d.row == r - 1) == null,
            "bottom": state_data.find(d => d.col == c & d.row == r + 1) == null};
}

function get_state_boundary(state) {

    // limit to state data
    const state_data = data.filter(d => d["state"] === state);

    // convert each box to perimeter check data (tells if box is on perimeter and maintains row/column)
    const state_perimeter_data = state_data.map(d => box_on_perimeter_check(state_data, d));

    // limit to boxes in perimeter of state
    // and then convert perimeter boxes to segment data based on different scenarios (15 scenarios!)
    const segment_data = state_perimeter_data.filter(d => d["left"] | d["right"] | d["top"] | d["bottom"])
        .map(d => {
            const c = d["col"],
                  r = d["row"];
            
            // based on location in perimeter, add segments to list (to later be flattened together)
            let segments = [ ];
            if (d["top"])    segments.push({x0: c, y0: r, x1: c + 1, y1: r});
            if (d["bottom"]) segments.push({x0: c + 1, y0: r + 1, x1: c, y1: r + 1});
            if (d["left"])   segments.push({x0: c, y0: r + 1, x1: c, y1: r});
            if (d["right"])  segments.push({x0: c + 1, y0: r, x1: c + 1, y1: r + 1});
            return segments;
        }).flat();

    // loop through segment_data and add segments in order such that they form a continuous path
    // by looking for segments with a start point as the last segments end point
    let segment_data_sort = [segment_data[0]];
    while (segment_data_sort.length < segment_data.length) {
        const last_segment = segment_data_sort[segment_data_sort.length - 1];
        segment_data_sort.push(segment_data.find(d => d.x0 == last_segment.x1 & d.y0 == last_segment.y1));
    }

    // convert segments to points in path
    const path_data = [{x: segment_data_sort[0].x0, y: segment_data_sort[0].y0}]
        .concat(segment_data_sort.map(d => [{"x": d.x1, y: d.y1}]).flat());

    return(path_data);
}

function render_state_boundaries() {
    for (let i = 0; i < states.length; i++) {

        // draw the boundary of a given state's region
        svg.append("path")
            .data([get_state_boundary(states[i])])
            .classed("outline-path", true)
            .attr("id", make_id(states[i]))
            .attr("d", line)
            .style("stroke-width", dimensions.box_padding[dimension_ix] + "px")
            .on("mouseenter", function() {
                d3.select(this).classed("hover", true);
                d3.select(".state-label#" + make_id(d3.select(this).attr("id"))).classed("hover", true);
            })
            .on("mouseleave", function() {
                d3.select(this).classed("hover", false);
                d3.select(".state-label#" + make_id(d3.select(this).attr("id"))).classed("hover", false);
            });

        // define tooltip using state information (date, # of delegates, etc.) to appear when hovering over state region
        const state_info = data_agg.find(d => d.key == states[i]).value,
              unassigned_delegates = state_info.total_delegates - (state_info.biden_delegates + state_info.sanders_delegates + state_info.other_delegates);
        new jBox("Tooltip", {
            theme: "state-label",
            attach: ".outline-path#" + make_id(states[i]) + ", .state-label#" + make_id(states[i]),
            content: `<p>${state_info.state_abb}'s ${state_info.primary ? "primary" : "caucus"} ${state_info.date <= update_date ? "occurred" : "will occur"} on ${format_date(state_info.date)}</p>
                      <p>Biden ${state_info.date < update_date ? "won" : "is projected to win"} <span class="biden-count">${state_info.biden_delegates} delegates</span> of ${state_info.total_delegates} total.</p>
                      <p>Sanders ${state_info.date < update_date ? "won" : "is projected to win"} <span class="sanders-count">${state_info.sanders_delegates} delegates</span>.</p>
                      ${state_info.other_delegates > 0 ? `<p>Other candidates ${state_info.date < update_date ? "won" : "are projected to win"} <span class="other-count">${state_info.other_delegates} delegates</span>.<p>` : ""}
                      ${unassigned_delegates > 0 ? `<p><span class="unassigned-count">${unassigned_delegates} delegates</span> are still not yet assigned.</p>` : ""}`,
            target: $(".state-label#" + make_id(states[i])),
            position: {
                x: 'left',
                y: 'bottom'
            },
            pointer: false,
            offset: {
                x: -2,
                y: dimensions.tooltip_y_offset[dimension_ix] 
            },
            outside: "y"
        });

    }
}

function render_canvas_grid() {

    const box_size = dimensions.box_size[dimension_ix],
          box_padding = dimensions.box_padding[dimension_ix];
    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        if (d['candidate'] === "Split") {
            context.fillStyle = color(candidates.indexOf("Biden"));
            context.fillRect(box_padding + pos(d['col']), box_padding + pos(d['row']), box_size * d['biden_share'], box_size);
            context.fillStyle = color(candidates.indexOf("Sanders"));
            context.fillRect(box_padding + pos(d['col']) + box_size * d['biden_share'], box_padding + pos(d['row']), box_size * d['sanders_share'], box_size);
            context.fillStyle = color(candidates.indexOf("Other"));
            context.fillRect(box_padding + pos(d['col']) + box_size * (1 - d['other_share']), box_padding + pos(d['row']), box_size * d['other_share'], box_size);
        } else {
            context.fillStyle = color(candidates.indexOf(d['candidate']));
            context.fillRect(box_padding + pos(d['col']), box_padding + pos(d['row']), box_size, box_size);
        }
    }

}

function render_state_labels() {

    // parse out row ranges for each state
    let state_rngs = [ ];
    for (let i = 0; i < states.length; i++) {
        const state = states[i],
              state_data = data.filter(d => d.state == state),
              max_col = d3.max(state_data, d => d.col),
              row_rng = d3.extent(state_data.filter(d => d.col == max_col), d => d.row);
        state_rngs.push({
            state: state,
            state_abb: data_agg.find(d => d.key == state).value.state_abb,
            min_row: row_rng[0],
            max_row: row_rng[1],
            mean_row: Math.floor(d3.sum(state_data.filter(d => d.col == max_col), d => d.row) / state_data.filter(d => d.col == max_col).length)
        });
    }

    // sort it by min row first and then max row to figure out order to place labels
    // state_rngs.sort((a, b) => d3.ascending(a.min_row, b.min_row) || d3.ascending(a.max_row, b.max_row));
    state_rngs.sort((a, b) => d3.ascending(a.mean_row, b.mean_row));

    // for states that share the same min row offset
    for (let i = 0; i < state_rngs.length; i++) {
        // state_rngs[i].row = state_rngs[i].min_row + state_rngs.filter(d => d.row >= state_rngs[i].min_row).length;
        state_rngs[i].row = state_rngs[i].mean_row + state_rngs.filter(d => d.row >= state_rngs[i].mean_row).length;
    }

    // draw labels
    svg.selectAll(".state-label")
        .data(state_rngs).enter()
        .append("text")
        .classed("state-label", true)
        .attr("id", d => make_id(d.state))
        .attr("x", margin.left + pos(d3.max(data, d => d.col) + 1.5))
        .attr("y", d => margin.top + pos(d.row) + dimensions.box_size[dimension_ix])
        .style("font-size", dimensions.font_size[dimension_ix] + "px")
        .text(d => d.state)
        .on("mouseenter", function() {
            d3.select(this).classed("hover", true);
            d3.select(".outline-path#" + make_id(d3.select(this).attr("id"))).classed("hover", true);
        })
        .on("mouseleave", function() {
            d3.select(this).classed("hover", false);
            d3.select(".outline-path#" + make_id(d3.select(this).attr("id"))).classed("hover", false);
        });  
}

function draw_annotation_arrow(x0, y0, x1, y1) {

    svg.append("path")
        .data([[{x: x0, y: y0}, {x: x1, y: y0}, {x: x1, y: y1}]])
        .classed("annotation-path", true)
        .attr("d", curve)
        .style("stroke-width", dimensions.box_padding[dimension_ix] + "px");

}

function render_annotations() {

    // add annotation explaining one box = one delegate
    svg.append("text")
        .classed("annotation", true)
        .attr("id", "one-del")
        .attr("x", margin.left + pos(2.2))
        .attr("y", margin.top - pos(1.5))
        .style("font-size", dimensions.font_size[dimension_ix] + "px")
        .text("One square is equivalent to one delegate");
    draw_annotation_arrow(2, 0.1, 1.5, 1.4);

    // add annotation for line between actual results and projections
    const split_height = (d3.max(data.filter(d => d.actual), d => d.row) + 1 + d3.min(data.filter(d => !d.actual), d => d.row)) / 2;
    svg.append("line")
        .classed("annotation", true)
        .attr("id", "split-line")
        .attr("x1", margin.left)
        .attr("y1", margin.top + pos(split_height))
        .attr("x2", margin.left + dimensions.canvas_width[dimension_ix])
        .attr("y2", margin.top + pos(split_height))
        .style("stroke", "black")
        .style("stroke-dasharray", "2 2")
        .style("stroke-width", "2px");
    svg.append("text")
        .classed("annotation", true)
        .attr("id", "split-text1")
        .attr("x", margin.left)
        .attr("y", margin.top + pos(split_height) - dimensions.font_size[dimension_ix] / 2)
        .style("font-size", dimensions.font_size[dimension_ix] + "px")
        .text("↑ Above based on actual results from past primaries");
    svg.append("text")
        .classed("annotation", true)
        .attr("id", "split-text2")
        .attr("x", margin.left)
        .attr("y", margin.top + pos(split_height) + dimensions.font_size[dimension_ix] * 1.15)
        .style("font-size", dimensions.font_size[dimension_ix] + "px")
        .text("↓ Below based on projected results for future primaries");

    // add annotation pointing out winning delegate
    // const winning_del = data.find(d => d.nth_del == 1991),
    //       winning_del_annotation = svg.append("text")
    //     .classed("annotation", true)
    //     .attr("id", "winning-del")
    //     .attr("x", margin.left + pos(winning_del.col - 1.2))
    //     .attr("y", margin.top + pos(winning_del.row - 1.5))
    //     .style("font-size", dimensions.font_size[dimension_ix] + "px")
    //     .style("text-anchor", "end")
    //     .text("Biden's winning delegate");
    // svg.append("rect")
    //     .classed("annotation", true)
    //     .attr("x", winning_del_annotation.attr("x") - winning_del_annotation.node().getComputedTextLength() * 1.02)
    //     .attr("y", winning_del_annotation.attr("y") - dimensions.font_size[dimension_ix] * 1.01)
    //     .attr("width", winning_del_annotation.node().getComputedTextLength() * 1.04)
    //     .attr("height", dimensions.font_size[dimension_ix] * 1.3).style("fill", "rgba(255, 255, 255, 0.8)");
    // svg.append("text")
    //     .classed("annotation", true)
    //     .attr("id", "winning-del")
    //     .attr("x", margin.left + pos(winning_del.col - 1.2))
    //     .attr("y", margin.top + pos(winning_del.row - 1.5))
    //     .style("font-size", dimensions.font_size[dimension_ix] + "px")
    //     .style("text-anchor", "end")
    //     .text("Biden's winning delegate");
    // winning_del_annotation.remove();
    // draw_annotation_arrow(winning_del.col - 1.1, winning_del.row - 1.9, winning_del.col + 0.55, winning_del.row + 0.4);

}

function update_takeaway_text() {
    d3.selectAll("#update-date").text(format_date(update_date));

    // candidate totals
    d3.selectAll("#biden-total-del").text(d3.sum(data, d => d.biden_share).toFixed(0));
    d3.selectAll("#sanders-total-del").text(d3.sum(data, d => d.sanders_share).toFixed(0));

    // largest remaining state
    const largest_dels = d3.max(data_agg.filter(d => d.value.date > update_date), d => d.value.total_delegates),
          largest_state = data_agg.filter(d => d.value.date > update_date).find(d => d.value.total_delegates == largest_dels);
    d3.selectAll("#largest-remaining-state").text(largest_state.key);
    d3.selectAll("#biden-largest-remaining-state-del").text(largest_state.value.biden_delegates.toFixed(0));
    d3.selectAll("#largest-remaining-state-total-del").text(largest_state.value.total_delegates);

    // winning delegate state
    const winning_del = data.find(d => d.nth_del == 1991);
    d3.selectAll("#winning-del-state").text(winning_del.state);
    d3.selectAll("#winning-del-state-days").text(((new Date(winning_del.date) - new Date) / (1000 * 60 * 60 * 24)).toFixed(0));
}

function resize() {

    // update width properties and scales
    width = $("#dem2020-container").width() - margin.left - margin.right;
    svg.attr("width", margin.left + width + margin.right);

    // determine dimensions to use
    dimension_ix = (width < dimensions.canvas_width[0] ? 1 : 0) + (width < dimensions.canvas_width[1] ? 1 : 0);

    // if need to switch dimensions, set canvas size appropriately and redraw
    if (canvas.attr("width") != dimensions.canvas_width[dimension_ix]) {
        $("#dem2020-container").height(dimensions.canvas_height[dimension_ix] + margin.top + margin.bottom);
        canvas.attr("width", dimensions.canvas_width[dimension_ix]);

        pos.range([0, (dimensions.box_size[dimension_ix] + dimensions.box_padding[dimension_ix]) * d3.max(data, d => Math.max(d.col, d.row))]);

        context.clearRect(0, 0, canvas.width, canvas.height);
        render_canvas_grid();

        svg.selectAll(".state-label, .outline-path, .annotation, .annotation-path").remove();
        render_state_labels();
        render_state_boundaries();
        render_annotations();
    }
}

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

d3.csv("/projects/dem2020-delegate-map/data/delegate-map_" + update_date + ".csv", (d) => {
    d.col = +d.col;
    d.row = +d.row;
    d.biden_share = +d.biden_share;
    d.sanders_share = +d.sanders_share;
    d.other_share = +d.other_share;
    d.actual = d.actual === "TRUE";
    d.primary = d.primary === "TRUE";
    d.nth_del = +d.nth_del;
    return d;
}, (e, d) => {
    if (e) throw e;

    // store data for later
    for (let i = 0; i < d.length; i++) data.push(d[i]);

    // aggregate data for use in labels
    data_agg = d3.nest()
        .key(d => d.state)
        .rollup(d => { 
            return {
                state_abb: d3.max(d, d => d.state_abb),
                date: d3.max(d, d => d.date),
                primary: d3.max(d, d => d.primary),
                biden_delegates: Math.round(d3.sum(d, d => d.biden_share) * 10) / 10, 
                sanders_delegates: Math.round(d3.sum(d, d => d.sanders_share) * 10) / 10,
                other_delegates: Math.round(d3.sum(d, d => d.other_share) * 10) / 10,
                total_delegates: d.length
            } 
        })
        .entries(data);

    // set domain for scales
    pos.domain([1, d3.max(data, d => Math.max(d.col, d.row))])
        .range([0, (dimensions.box_size[dimension_ix] + dimensions.box_padding[dimension_ix]) * d3.max(data, d => Math.max(d.col, d.row))]);

    // get unique values for candidates and states
    candidates = d3.set(data.map(d => d.candidate)).values();
    states = d3.set(data.map(d => d.state)).values();

    // draw elements
    render_canvas_grid();
    render_state_labels();
    render_state_boundaries();
    render_annotations();

    // update text on takeaways
    update_takeaway_text();
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(window).resize(resize);
