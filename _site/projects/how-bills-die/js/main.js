/* 
TO DO:
4. make x scale unique for house vs. senate?
5. to include resolving differences/president bills?
6. add tooltips? to axis labels to explain meaning; to bars?
7. add data labels
8. make vote bucket all blue
*/

/*********************/
/*** INIT VARIABLE ***/
/*********************/

let hbd_svg = d3.select('#d3-how-bills-die');

let hbd_margin = {top: 30, right: 20, bottom: 10, left: 225, middle_x: 100, middle_y: 10},
    hbd_width  = $('#d3-how-bills-die').width() - hbd_margin.left - hbd_margin.right - hbd_margin.middle_x,
    hbd_height = $('#d3-how-bills-die').height() - hbd_margin.top - hbd_margin.bottom - hbd_margin.middle_y * 4;

let data = [ ];

let n_buckets = 5,
    n_scroll_stops = 10;

let curr_date;

let x = d3.scaleLinear().range([0, hbd_width / 2]),
    y = d3.scaleOrdinal().range([...Array(n_buckets).keys()].map((i) => i * (hbd_height / n_buckets + hbd_margin.middle_y))),
    date = d3.scaleTime().domain([1, n_scroll_stops]);

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

function wrap(text) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            ww = 100,
            dy = 0,
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
            console.log(x)
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > ww) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

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
        .attr("height", hbd_height / n_buckets);

    hbd_svg.selectAll("rect.bar.front")
        .data(data.filter((d) => d.date === date & d.chamber_curr != "b")).enter()
        .append("rect")
        .classed("bar", true)
        .classed("front", true)
        .attr("id", (d) => d.chamber_curr + "_" + d.status_bucket.substr(0, 1))
        .attr("x", (d) => hbd_margin.left + (d.chamber_curr === "hr" ? 0 : hbd_margin.middle_x) + (hbd_width / 2) - (d.chamber_curr === "hr" ? x(d.N - d.N_curr) : 0))
        .attr("y", (d) => hbd_margin.top + y(d.status_bucket))
        .attr("width", (d) => x(d.N - d.N_curr))
        .attr("height", hbd_height / n_buckets);

    let labels = hbd_svg.selectAll("text.bar-label")
        .data(data.filter((d) => d.date === date & d.chamber_curr != "b")).enter()
        .append("text")
        .classed("bar-label", true)
        .classed("right-align", (d) => d.chamber_curr === "s")
        .attr("id", (d) => d.chamber_curr + "_" + d.status_bucket.substr(0, 1))

    labels.selectAll("tspan.upper-label")
        .data((d) => [d]).enter()
        .append("tspan")
        .classed("upper-label", true)
        .classed("invisible", (d) => d.N == 0)
        .attr("x", (d) => hbd_margin.left + (d.chamber_curr === "hr" ? 0 : hbd_margin.middle_x) + (hbd_width / 2) - (d.chamber_curr === "hr" ? 1 : -1) * (x(d.N) + 2))
        .attr("y", (d) => hbd_margin.top + y(d.status_bucket) + (hbd_height / n_buckets) / 2)
        .text((d) => d.N_curr + " bills (" + (d.N_curr / d.N_chamber * 100).toFixed(1) + "%)" + (d.chamber_curr === "hr" & d.status_bucket === "A. INTRODUCTION" ? " are still here" : ""));

    labels.selectAll("tspan.lower-label")
        .data((d) => [d]).enter()
        .append("tspan")
        .classed("lower-label", true)
        .classed("invisible", (d) => d.N == 0)
        .attr("x", (d) => hbd_margin.left + (d.chamber_curr === "hr" ? 0 : hbd_margin.middle_x) + (hbd_width / 2) - (d.chamber_curr === "hr" ? 1 : -1) * (x(d.N) + 2))
        .attr("y", (d) => hbd_margin.top + y(d.status_bucket) + (hbd_height / n_buckets) / 2)
        .attr("dy", "14px")
        .text((d) => (d.N - d.N_curr) + " bills" + (d.chamber_curr === "hr" & d.status_bucket === "A. INTRODUCTION" ? " have progressed" : ""));
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

    let labels = hbd_svg.selectAll("text.bar-label")
        .data(data.filter((d) => d.date === date & d.chamber_curr != "b"));

    labels.selectAll("tspan.upper-label")
        .data((d) => [d])
        .classed("invisible", (d) => d.N == 0)
        .transition().duration(duration)
        .attr("x", (d) => hbd_margin.left + (d.chamber_curr === "hr" ? 0 : hbd_margin.middle_x) + (hbd_width / 2) - (d.chamber_curr === "hr" ? 1 : -1) * (x(d.N) + 2))
        .text((d) => d.N_curr + " bills (" + (d.N_curr / d.N_chamber * 100).toFixed(1) + "%)" + (d.chamber_curr === "hr" & d.status_bucket === "A. INTRODUCTION" ? " are still here" : ""))

    labels.selectAll("tspan.lower-label")
        .data((d) => [d])
        .classed("invisible", (d) => d.N == 0)
        .transition().duration(duration)
        .attr("x", (d) => hbd_margin.left + (d.chamber_curr === "hr" ? 0 : hbd_margin.middle_x) + (hbd_width / 2) - (d.chamber_curr === "hr" ? 1 : -1) * (x(d.N) + 2))
        .text((d) => (d.N - d.N_curr) + " bills" + (d.chamber_curr === "hr" & d.status_bucket === "A. INTRODUCTION" ? " have progressed" : ""));
}

function draw_bucket_labels() {
    hbd_svg.selectAll("text.bucket-label")
        .data(y.domain()).enter()
        .append("text")
        .classed("bucket-label", true)
        .attr("x", hbd_margin.left + hbd_width / 2 + hbd_margin.middle_x / 2)
        .attr("y", (d) => hbd_margin.top + y(d) + (hbd_height / n_buckets) / 2)
        .text((d) => d);
}

function draw_chamber_labels() {
    hbd_svg.append("text")
        .classed("chamber-label", true)
        .attr("id", "hr")
        .attr("x", hbd_margin.left + hbd_width * 0.25)
        .attr("y", hbd_margin.top * 0.5)
        .text("House of Reps");

    hbd_svg.append("text")
        .classed("chamber-label", true)
        .attr("id", "s")
        .attr("x", hbd_margin.left + hbd_margin.middle_x + hbd_width * 0.75)
        .attr("y", hbd_margin.top * 0.5)
        .text("Senate");
}

function draw_date_axis_labels() {
    let d3_container_height = $('#d3-how-bills-die').parent().parent().height();
    for (let i = 1; i <= n_scroll_stops; i++) {
        d3.select("#scroll-viz-container").append("text")
            .classed("date-axis-label", true)
            .attr("id", "label-" + date_to_input_str(date(i)))
            .style("top", ((i - 1) * (d3_container_height / n_scroll_stops) + hbd_height / 2 + hbd_margin.top) + "px")
            .text(date_to_input_str(date(i)));
    }
}

function date_to_input_str(date) {
    return date.toISOString().substr(0, 10);
}

function sticky_scroll() {
    let screen_margin = ($(window).height() - $('#d3-how-bills-die').height()) / 2,
        d3_container_top = $('#d3-how-bills-die').parent().offset().top,
        d3_container_height = $('#d3-how-bills-die').parent().parent().height();

    // after focusing on svg, don't move it at bottom of column
    if (d3_container_top + d3_container_height - screen_margin <= $(window).scrollTop() + $('#d3-how-bills-die').height()) {
        let margin_top = d3_container_height - $('#d3-how-bills-die').height();
        $('#d3-how-bills-die').css({
            'position': 'initial',
            'margin-top': margin_top + 'px',
            'width': '100%'
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
        $('#d3-how-bills-die').css({
            'position': 'initial',
            'width': '100%'
        });
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
    for (let i = 0; i < d.length; i++) {
        if (d[i].status_bucket == "E. VOTE") d[i].N_curr = 0;
        data.push(d[i]);
    }

    // adjust scale domain based on data
    x.domain(d3.extent(data, (d) => d.N));
    y.domain(d3.map(data.filter((d) => d.chamber_curr != "b"), (d) => d.status_bucket).keys().sort());
    date.range(d3.extent(data, (d) => new Date(d.date + " ")));
    curr_date = d3.min(data, (d) => d.date);

    draw_chamber_labels();
    draw_bucket_labels();
    draw_date_axis_labels();
    init_bars("2019-01-03");
})

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(document).ready(() => {
    sticky_scroll();
});

$(window).resize(() => {
    // update width variable and update x scale accordingly
    hbd_width = $('#d3-how-bills-die').width() - hbd_margin.left - hbd_margin.right - hbd_margin.middle_x;
    x.range([0, hbd_width / 2]);

    // update bars and labels based on updated x scale
    update_bars(curr_date);
    hbd_svg.selectAll("text.bucket-label")
        .transition().duration(0)
        .attr("x", hbd_margin.left + hbd_width / 2 + hbd_margin.middle_x / 2);

    hbd_svg.select("text.chamber-label#hr")
        .transition().duration(0)
        .attr("x", hbd_margin.left + hbd_width * 0.25);
    hbd_svg.select("text.chamber-label#s")
        .transition().duration(0)
        .attr("x", hbd_margin.left + hbd_margin.middle_x + hbd_width * 0.75);

    // reposition chart if needed
    sticky_scroll();
});

$(window).scroll(() => {

    screen_margin = ($(window).height() - $('#d3-how-bills-die').height()) / 2,
    d3_container_top = $('#d3-how-bills-die').parent().offset().top,
    d3_container_height = $('#d3-how-bills-die').parent().parent().height();

    date_ix = Math.ceil(Math.max(1, $(window).scrollTop() - (d3_container_top - screen_margin)) / (d3_container_height / n_scroll_stops));
    if (date_ix >= 1) {
        if (date_to_input_str(date(date_ix)) != curr_date) {
            curr_date = date_to_input_str(date(date_ix))
            update_bars(curr_date, 250);
            d3.selectAll("text.date-axis-label").classed('focus', false);
            d3.select("text.date-axis-label#label-" + curr_date).classed('focus', true);
        }
    }

    sticky_scroll();
});
