
/*********************/
/*** INIT VARIABLE ***/
/*********************/

let margin = {top: 10, right: 0, bottom: 0, left: 150, cell: 1, state: 4},
    width  = $("#elfun2020-viz").width() - margin.left - margin.right,
    height = $("#elfun2020-viz").height() - margin.top - margin.bottom;

let row_height = 50;

// create empty list to store data
let call_data = [ ],
    scenario_data = [ ],
    map_data = [ ];

// create svg
let svg = d3.select("#elfun2020-svg");

// create scales
let x = d3.scaleLinear().domain([0, 100]).range([0, width]);

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

// format readable date
function format_datetime(timestamp, format) {
    return d3.timeFormat(format)(d3.timeParse("%Q")(timestamp * 1000));
}

function draw_labels(is_compact) {
    // for each call, get GeoJSON feature from map_data and draw state (if window sufficiently large)
    if (!is_compact) {
        for (let i = 0; i < call_data.length; i++) {
            const feat = map_data.filter(s => s['properties']['name'] === call_data[i]['state_abbrev'].substr(0, 2))[0];
            draw_state(feat, 
                       [[margin.state, margin.top + i * row_height + margin.state], 
                        [margin.left / 2 - margin.state, margin.top + (i + 1) * row_height - margin.state]],
                       call_data[i]['winner']);
        }

        // draw label with time of call (if window is sufficiently large)
        svg.selectAll(".state-calltime-label")
            .data(call_data).enter()
            .append("text")
            .classed("state-calltime-label", true)
            .attr("id", d => d.state_abbrev)
            .attr("x", margin.left * 3 / 4)
            .attr("y", d => margin.top + (d.nth_state_called - 1) * row_height + row_height * 0.7)
            .text(d => format_datetime(d.called_at, "%I:%M %p"));
    }

    // draw main state name label
    svg.selectAll(".state-label")
        .data(call_data).enter()
        .append("text")
        .classed("state-label", true)
        .classed("Trump", d => d.winner === "Trump")
        .classed("Biden", d => d.winner === "Biden")
        .classed("colored-text", is_compact)
        .attr("id", d => d.state_abbrev)
        .attr("x", margin.left * (is_compact ? 1 / 2 : 3 / 4))
        .attr("y", d => margin.top + (d.nth_state_called - 1) * row_height + row_height * (is_compact ? 0.5 : 0.3))
        .text(d => d.state_abbrev);   

    // draw check marks and Xs to show if path is correct
    svg.selectAll(".state-callcorrect-label.wrong")
        .data(call_data).enter()
        .append("text")
        .classed("state-callcorrect-label", true)
        .classed("wrong", true)
        .attr("x", is_compact ? 5 : margin.left * 0.58)
        .attr("y", d => margin.top + (d.nth_state_called - 1) * row_height + row_height * (is_compact ? 0.5 : 0.3))
        .text("✗");

    svg.selectAll(".state-callcorrect-label.right")
        .data(call_data).enter()
        .append("text")
        .classed("state-callcorrect-label", true)
        .classed("right", true)
        .attr("x", is_compact ? 5 : margin.left * 0.58)
        .attr("y", d => margin.top + (d.nth_state_called - 1) * row_height + row_height * (is_compact ? 0.5 : 0.3))
        .text("✓"); 
}

// given a GeoJSON feature object for a state 
// and the bounding box for its location ([[x_min, y_min], [x_max, y_max]])
// draw that state
function draw_state(feature, bbox, addl_class) {
    const projection = d3.geoAlbers().fitExtent(bbox, feature),
          path = d3.geoPath().projection(projection);
    svg.append("path")
        .classed("state-icon", true)
        .classed(addl_class, true)
        .attr("d", path(feature));
}

// 
function draw_scenario_cells() {
    svg.selectAll(".scenario-cell")
        .data(scenario_data).enter()
        .append("rect")
        .classed("scenario-cell", true)
        .classed("correct-cell", d => d.correct)
        .classed("colored-cell", d => d.correct)
        .attr("id", d => d.n_states_called + "-" + d.winners)
        .attr("x", d => margin.left + x(d.n_sims_roll - d.n_sims))
        .attr("y", d => margin.top + (d.n_states_called - 1) * row_height)
        .attr("width", d => x(d.n_sims))
        .attr("height", row_height)
        .style("stroke-width", margin.cell + "px");

    svg.selectAll(".scenario-cell-text")
        .data(scenario_data).enter()
        .append("text")
        .classed("scenario-cell-text", true)
        .classed("correct-cell", d => d.correct)
        .classed("colored-cell", d => d.correct)
        .attr("id", d => d.n_states_called + "-" + d.winners)
        .attr("x", d => margin.left + x(d.n_sims_roll - d.n_sims + d.n_sims / 2))
        .attr("y", d => margin.top + (d.n_states_called - 1) * row_height + row_height / 2)
        .text(d => x(d.n_sims) > 60 ? `${d.n_sims}%${d.n_states_called == 1 ? " of scenarios" : ""}` : "");

    svg.selectAll(".scenario-cell.overlay")
        .data(scenario_data).enter()
        .append("rect")
        .classed("scenario-cell", true)
        .classed("overlay", true)
        .attr("id", d => d.n_states_called + "-" + d.winners)
        .attr("x", d => margin.left + x(d.n_sims_roll - d.n_sims))
        .attr("y", d => margin.top + (d.n_states_called - 1) * row_height)
        .attr("width", d => x(d.n_sims))
        .attr("height", row_height)
        .on("mouseenter", function(cell) {
            d3.selectAll(".colored-cell").classed("colored-cell", false);
            d3.selectAll(".scenario-cell")
                .filter(d => cell.winners.substr(0, d.winners.length) === d.winners)
                .classed("colored-cell", true);
            d3.selectAll(".scenario-cell-text")
                .filter(d => cell.winners.substr(0, d.winners.length) === d.winners)
                .classed("colored-cell", true);
            d3.selectAll(".state-callcorrect-label.right")
                .filter(d => d.nth_state_called <= cell.n_states_called && cell.winners[d.nth_state_called - 1] === d.winner[0])
                .classed("visible", true);
            d3.selectAll(".state-callcorrect-label.wrong")
                .filter(d => d.nth_state_called <= cell.n_states_called && cell.winners[d.nth_state_called - 1] != d.winner[0])
                .classed("visible", true);
        })
        .on("mouseleave", function() {
            d3.selectAll(".colored-cell").classed("colored-cell", false);
            d3.selectAll(".correct-cell").classed("colored-cell", true);
            d3.selectAll(".state-callcorrect-label").classed("visible", false);
        });

    // add tooltips for cells
    new jBox("Tooltip", {
        attach: "rect.scenario-cell.overlay",
        content: "...",
        position: {
            x: 'right',
            y: 'center'
        },
        outside: 'x',
        onOpen: function() {
            const d = d3.select(this.source[0]).data()[0],
                  called_states = call_data.filter(e => e.nth_state_called <= d.n_states_called),
                  states_match = called_states.map((e, i) => e.winner[0] == d.winners[i]),
                  incorrect_states = called_states.filter((e, i) => !states_match[i]).map(e => e.state);

            let tooltip_text = `${d.n_sims}% of scenarios went down this ${d.correct ? "" : "incorrect "}path.`;
            if (d.correct) {
                tooltip_text += " Thus far, this path has been totally correct.";
            } else {
                tooltip_text += ` Thus far, this path has been off in ${incorrect_states.length} state${incorrect_states > 1 ? "s" : ""} (${incorrect_states.join(", ")}).`;
            }
            // tooltip_text += ` Along this path and at this point in the night (${format_datetime(d3.max(called_states, d => d.called_at), "%I:%M %p")}), Biden's EV expected range ${d.n_states_called == call_data.length ? "is" : "was"} ${d['ev_rng_biden'].join(" - ")}.`;

            // set content
            this.setContent(tooltip_text);
        }
    });
}

function is_compact() {
    if (d3.selectAll("#elfun2020-view-select li.user").size() == 0) return $("#elfun2020-viz").width() < 500;
    else return d3.selectAll("#elfun2020-view-select li#compact").classed("selected")
}

// resize chart on page size change
function resize() {

    // delete existing elements
    svg.selectAll(".state-icon, .state-label, .state-calltime-label, .scenario-cell, .scenario-cell-text, .state-callcorrect-label").remove();

    // set to compact (if not already selected by user)
    if (d3.selectAll("#elfun2020-view-select li.user").size() == 0) {
        $('#elfun2020-view-select li' + (is_compact() ? "" : "#compact")).removeClass("selected");
        $('#elfun2020-view-select li' + (is_compact() ? "#compact" : ":not(#compact)")).addClass("selected");
    }
    row_height = (is_compact() ? 20 : 50);
    margin.left = (is_compact() ? 60 : 150);

    // update width properties and scales
    width = $("#elfun2020-viz").width() - margin.left - margin.right;
    x.range([0, width]);

    // set height based on number of states called already
    height = margin.top + margin.bottom + call_data.length * row_height;
    $("#elfun2020-viz").height(height);
    svg.attr("height", height);

    // redraw cells
    draw_labels(is_compact());
    draw_scenario_cells();
}

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

d3.json("https://bt-dbs.herokuapp.com/getElectionFunnel2020Data", (d) => {

    d3.select("#elfun2020-loading").style("display", "none");
    d3.selectAll("#elfun2020-title, #elfun2020-viz").style("display", "inline-block");

    // store data for later
    for (let i = 0; i < d["call_data"].length; i++) call_data.push(d["call_data"][i]);
    for (let i = 0; i < d["scenario_data"].length; i++) scenario_data.push(d["scenario_data"][i]);
    for (let i = 0; i < d["map_data"].length; i++) map_data.push(d["map_data"][i]);

    // set "updated at"
    d3.select("#update-datetime").text(format_datetime(d["updated_at"], "%b %d @ %I:%M %p"));

    // set contests called, scenarios remaining, ev range text
    const latest_correct_cell = scenario_data.filter(s => s['n_states_called'] == call_data.length & s['correct'])[0]
    d3.select("#states-called").text(call_data.length);
    d3.select("#scenarios-remaining").text(latest_correct_cell['n_sims']);
    d3.select("#ev-range-biden").text(latest_correct_cell['ev_rng_biden'].join(" - "))
    d3.select("#ev-range-trump").text(latest_correct_cell['ev_rng_trump'].join(" - "))

    // set size (with page loaded) and redraw
    resize();
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(window).resize(resize);

$('#elfun2020-view-select li').click(function() {
    $('#elfun2020-view-select li').removeClass("user").removeClass("selected");
    $(this).addClass("user").addClass("selected");
    resize();
})
