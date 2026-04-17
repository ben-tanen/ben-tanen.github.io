var confederate_svg = d3.select("#d3-confederate-poll");

var margin = {top: 100, right: 15, bottom: 75, left: 15, bar: 8},
    width  = $('#d3-confederate-poll').width() -  margin.left - margin.right,
    height = $('#d3-confederate-poll').height() - margin.top - margin.bottom;

var scale = d3.scaleLinear().range([0, width]).domain([-1,1]).nice();

var data = [ ];

d3.csv("/assets/data/kut-poll-data.csv", function(d) {
    d.leave = +d.leave;
    d.leave_add = +d.leave_add;
    d.remove = +d.remove;
    d.move = +d.move;
    d.unsure = +d.unsure;
    return d;
}).then(function(d) {
    for (var i = 0; i < d.length; i++) data.push(d[i]);

    bar_size = (height - (margin.bar * (data.length - 1))) / data.length;

    for (var i = 0; i < data.length; i++) {
        render_bar(data, i);
    }

    render_axes();
    render_text();
});

// make chart resizable
$(window).resize(function() {
    width  = $('#d3-confederate-poll').width() -  margin.left - margin.right;

    scale.range([0, width]);

    d3.selectAll('text').remove();
    d3.selectAll('rect').remove();
    d3.selectAll('line').remove();
    d3.select('#x-axis').remove();

    for (var i = 0; i < data.length; i++) {
        render_bar(data, i);
    }

    render_axes();
    render_text();
});

function render_bar(data, i) {
    confederate_svg.append('rect')
        .attr('class', 'bar leave-add')
        .attr('width', scale(data[i].leave_add) - scale(0))
        .attr('height', bar_size)
        .attr('x', margin.left + scale(0))
        .attr('y', margin.top + bar_size * i + margin.bar * i + (i > 0 ? margin.bar : 0));

    if (scale(data[i].leave_add) - scale(0) > 25) {
        confederate_svg.append('text')
            .attr('class', 'text pct-label')
            .attr('x', margin.left + scale(0) + (scale(data[i].leave_add) - scale(0)) / 2)
            .attr('y', margin.top + bar_size * (i + 0.65) + margin.bar * i + (i > 0 ? margin.bar : 0))
            .text((data[i].leave_add * 100).toFixed(0) + "%");
    }

    confederate_svg.append('rect')
        .attr('class', 'bar leave')
        .attr('width', scale(data[i].leave) - scale(0))
        .attr('height', bar_size)
        .attr('x', margin.left + scale(data[i].leave_add))
        .attr('y', margin.top + bar_size * i + margin.bar * i + (i > 0 ? margin.bar : 0));

    if (scale(data[i].leave) - scale(0) > 25) {
        confederate_svg.append('text')
            .attr('class', 'pct-label')
            .attr('x', margin.left + scale(data[i].leave_add) + (scale(data[i].leave) - scale(0)) / 2)
            .attr('y', margin.top + bar_size * (i + 0.65) + margin.bar * i + (i > 0 ? margin.bar : 0))
            .text((data[i].leave * 100).toFixed(0) + "%");
    }

    confederate_svg.append('rect')
        .attr('class', 'bar remove')
        .attr('width', scale(data[i].remove) - scale(0))
        .attr('height', bar_size)
        .attr('x', margin.left + scale(-data[i].remove - data[i].move))
        .attr('y', margin.top + bar_size * i + margin.bar * i + (i > 0 ? margin.bar : 0));

    if (scale(data[i].remove) - scale(0) > 25) {
        confederate_svg.append('text')
            .attr('class', 'pct-label')
            .attr('x', margin.left + scale(-data[i].remove - data[i].move) + (scale(data[i].remove) - scale(0)) / 2)
            .attr('y', margin.top + bar_size * (i + 0.65) + margin.bar * i + (i > 0 ? margin.bar : 0))
            .text((data[i].remove * 100).toFixed(0) + "%");
    }

    confederate_svg.append('rect')
        .attr('class', 'bar move')
        .attr('width', scale(data[i].move) - scale(0))
        .attr('height', bar_size)
        .attr('x', margin.left + scale(-data[i].move))
        .attr('y', margin.top + bar_size * i + margin.bar * i + (i > 0 ? margin.bar : 0));

    if (scale(data[i].move) - scale(0) > 25) {
        confederate_svg.append('text')
            .attr('class', 'text pct-label')
            .attr('x', margin.left + scale(-data[i].move) + (scale(data[i].move) - scale(0)) / 2)
            .attr('y', margin.top + bar_size * (i + 0.65) + margin.bar * i + (i > 0 ? margin.bar : 0))
            .text((data[i].move * 100).toFixed(0) + "%");
    }

    confederate_svg.append('text')
        .attr('class', 'text label')
        .attr('x', margin.left + scale(-data[i].remove - data[i].move) - 7)
        .attr('y', margin.top + bar_size * (i + 0.6) + margin.bar * i + (i > 0 ? margin.bar : 0))
        .style('font-size', '11.5px')
        .style('text-anchor', 'end')
        .text(clean_group_name(data[i].group));
}

function render_axes() {
    confederate_svg.append('line')
        .attr('id', 'midline')
        .attr('x1', margin.left + scale(0) + 0.5)
        .attr('x2', margin.left + scale(0) + 0.5)
        .attr('y1', margin.top)
        .attr('y2', margin.top + height + margin.bar * 2)
        .attr('stroke', 'black');

    confederate_svg.append('line')
        .attr('id', 'breakline')
        .attr('x1', margin.left)
        .attr('x2', margin.left + width)
        .attr('y1', margin.top + bar_size + margin.bar)
        .attr('y2', margin.top + bar_size + margin.bar)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.75)
        .attr('stroke-dasharray', '5, 5');

    confederate_svg.append("g")
        .attr("id","x-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top + height + margin.bar * 2})`)
        .call(d3.axisBottom(scale).ticks(5).tickFormat(function (d) {
            if (d < 0) d = -d; // No nagative labels
            return d3.format(".0%")(d);
        }));
}

function render_text() {
    if (width <= 450) {
        confederate_svg.append("text")
            .attr('id', 'title1')
            .attr('id', 'title2')
            .attr("transform", `translate(${margin.left + width / 2}, 16)`)
            .style('font-size', '16px')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text("What to do with");

        confederate_svg.append("text")
            .attr('id', 'title1')
            .attr('id', 'title2')
            .attr("transform", `translate(${margin.left + width / 2}, 32)`)
            .style('font-size', '16px')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text("Confederate monuments?");
    } else {
        confederate_svg.append("text")
            .attr('id', 'title')
            .attr("transform", `translate(${margin.left + width / 2}, 27.5)`)
            .style('font-size', '18px')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text("What to do with Confederate monuments?");
    }

    /* legend */
    confederate_svg.append("rect")
        .attr('class', 'legend remove')
        .attr("x", margin.left + width / 2 - 20)
        .attr("y", 42.5);

    confederate_svg.append("text")
        .attr("transform", `translate(${margin.left + width / 2 - 25}, 55)`)
        .style('font-size', '12px')
        .style('text-anchor', 'end')
        .text("Remove them");

    confederate_svg.append("rect")
        .attr('class', 'legend move')
        .attr("x", margin.left + width / 2 - 20)
        .attr("y", 67.5);

    confederate_svg.append("text")
        .attr("transform", `translate(${margin.left + width / 2 - 25}, 80)`)
        .style('font-size', '12px')
        .style('text-anchor', 'end')
        .text("Move to museums");

    confederate_svg.append("rect")
        .attr('class', 'legend leave-add')
        .attr("x", margin.left + width / 2 + 5)
        .attr("y", 67.5);

    confederate_svg.append("text")
        .attr("transform", `translate(${margin.left + width / 2 + 25}, 80)`)
        .style('font-size', '12px')
        .style('text-anchor', 'start')
        .text(`${width <= 300 ? "A" : "Leave them, a"}dd ${width <= 400 ? " " : "historical "}context`);

    confederate_svg.append("rect")
        .attr('class', 'legend leave')
        .attr("x", margin.left + width / 2 + 5)
        .attr("y", 42.5);

    confederate_svg.append("text")
        .attr("transform", `translate(${margin.left + width / 2 + 25}, 55)`)
        .style('font-size', '12px')
        .style('text-anchor', 'start')
        .text("Leave them as is");

    /* source */
    confederate_svg.append("text")
        .attr("transform", `translate(${margin.left + width}, ${margin.top + height + 55})`)
        .style('font-size', '11px')
        .style('text-anchor', 'end')
        .style('fill', '#989c9e')
        .text("Source: UT/TT Poll, KUT 90.5");
}

function clean_group_name(group) {
    if (width <= 450) {
        if (group == "independents") return "Indep.";
        else if (group == "all") return "All";
        else return group[0].toUpperCase() + group.substring(1,3) + ".";
    }
    else {
        return group[0].toUpperCase() + group.substring(1,group.length);
    }
}
