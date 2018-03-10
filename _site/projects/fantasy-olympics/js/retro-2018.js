
/*********************/
/*** INIT VARIABLE ***/
/*********************/

var for_svg = d3.select("#d3-fantasy-olympics-retro");

var margin = {top: 10, right: 0, bottom: 25, left: 23},
    width  = $('#d3-fantasy-olympics-retro').width() -  margin.left - margin.right,
    height = $('#d3-fantasy-olympics-retro').height() - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

var data = [ ],
    group_by = null;

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

// function to plot data (already grouped)
function render_plot(d, transition) {
    var yaxis_offset = (d.length < 50 ? 20 : 5);

    for (var i = 0; i < d.length; i++) {
        var di_actual = group_by == null ? d[i].Actual : d[i].value.Actual,
            di_proj   = group_by == null ? d[i].Projected : d[i].value.Projected,
            di_diff   = group_by == null ? d[i].Difference : d[i].value.Difference;

        var x_pos = margin.left + i / d.length * (width - yaxis_offset) + yaxis_offset;

        if (transition) {
            for_svg.append("line")
                .classed('marker-drop-line', true)
                .attr("x1", x_pos)
                .attr("y1", margin.top + y(0))
                .attr("x2", x_pos)
                .attr("y2", margin.top + y(0))
                .style('stroke-width', (d.length < 50 ? 1 : 0.75))
                .transition().duration(300)
                .attr("y2", margin.top + y(di_diff))

            for_svg.append("circle")
                .classed('marker', true)
                .attr("r", (d.length < 50 ? 3.5 : 2))
                .attr("cx", x_pos)
                .attr("cy", margin.top + y(0))
                .attr("Actual", di_actual)
                .attr("Projected", di_proj)
                .attr("Difference", di_diff)
                .attr("Country", group_by == null ? d[i].Full_Country : (group_by == "Country" ? d[i].key : null))
                .attr("Sport", group_by == null ? d[i].Sport : (group_by == "Sport" ? d[i].key : null))
                .style('stroke-width', (d.length < 50 ? 2 : 1))
                .transition().duration(300)
                .attr("cy", margin.top + y(di_diff));
        } else {
            for_svg.append("line")
                .classed('marker-drop-line', true)
                .attr("x1", x_pos)
                .attr("y1", margin.top + y(0))
                .attr("x2", x_pos)
                .attr("y2", margin.top + y(di_diff))
                .style('stroke-width', (d.length < 50 ? 1 : 0.75));

            for_svg.append("circle")
                .classed('marker', true)
                .attr("r", (d.length < 50 ? 3.5 : 2))
                .attr("cx", x_pos)
                .attr("cy", margin.top + y(di_diff))
                .attr("Actual", di_actual)
                .attr("Projected", di_proj)
                .attr("Difference", di_diff)
                .attr("Country", group_by == null ? d[i].Full_Country : (group_by == "Country" ? d[i].key : null))
                .attr("Sport", group_by == null ? d[i].Sport : (group_by == "Sport" ? d[i].key : null))
                .style('stroke-width', (d.length < 50 ? 2 : 1));
        }
    }

    $('circle.marker').mouseenter(function() {
        var country       = d3.select(this).attr("Country"),
            sport         = d3.select(this).attr("Sport"),
            country_sport = (country != null ? country : "") + (country != null && sport != null ? ", " : "") + (sport != null ? sport : ""),
            pt_proj       = parseFloat(d3.select(this).attr('Projected')).toFixed(2),
            pt_actual     = parseFloat(d3.select(this).attr('Actual')).toFixed(2);
            pt_diff       = parseFloat(d3.select(this).attr('Difference')).toFixed(2);

        d3.select(this).classed('highlight', true);
        d3.selectAll('.tooltip-text').style('display', 'initial');
        
        d3.select('#tooltip-text1').text(country_sport);
        d3.select('#tooltip-text2').text('Actual: ' + pt_actual);
        d3.select('#tooltip-text3').text('Projected: ' + pt_proj);
        d3.select('#tooltip-text4').text('Difference: ' + (pt_diff > 0 ? "+" : "") + pt_diff);
    });

    $('circle.marker').mouseleave(function() {
        d3.selectAll('.tooltip-text').style('display', 'none');
        d3.select(this).classed('highlight', false);
    })
}

// function groups data based on user choice, passes along to plotting function
function render_group_by_plot(d, transition) {
    render_d = d;

    // group by data accordingly
    if (group_by == "Country") {
        render_d = d3.nest()
            .key(function(d) { return d.Full_Country; })
            .rollup(function(v) { return {
                Difference: d3.sum(v, function(d) { return d.Actual; }) - d3.sum(v, function(d) { return d.Projected; }),
                Actual: d3.sum(v, function(d) { return d.Actual; }),
                Projected: d3.sum(v, function(d) { return d.Projected; })
            }; })
            .entries(data);

    } else if (group_by == "Sport") {
        render_d = d3.nest()
            .key(function(d) { return d.Sport; })
            .rollup(function(v) { return {
                Difference: d3.sum(v, function(d) { return d.Actual; }) - d3.sum(v, function(d) { return d.Projected; }),
                Actual: d3.sum(v, function(d) { return d.Actual; }),
                Projected: d3.sum(v, function(d) { return d.Projected; })
            }; })
            .entries(data);
    }

    // sort grouped data
    render_d.sort(function(x, y){
       if (group_by == null) return d3.ascending(x.Difference, y.Difference);
       else return d3.ascending(x['value'].Difference, y['value'].Difference);
    });

    // adjust y axis
    y.domain(d3.extent(render_d, function(d) { return (group_by == null ? d.Difference : d['value'].Difference); })).nice();
    
    // render axes
    for_svg.append('line')
        .attr('id', "x-axis")
        .attr('x1', margin.left)
        .attr('x2', margin.left + width)
        .attr('y1', margin.top + y(0))
        .attr('y2', margin.top + y(0));

    for_svg.append("g")
        .attr("id","y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(y));

    // plot points
    render_plot(render_d, transition);
}

// function to wrap svg text to make multilines
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            ww = width,
            dy = 0,
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
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

/********************************/
/*** PARSE DATA AND INIT PLOT ***/
/********************************/

d3.csv("/projects/fantasy-olympics/data/2018-results-diff.csv", function(d) {
    d.Difference = +d.Difference;
    d.Projected  = +d.Projected;
    d.Actual     = +d.Actual;
    return d;
}, function(error, d) {
    data = d;
    render_group_by_plot(data, true);

    // render tooltips
    for_svg.append("text")
        .classed('tooltip-text', true)
        .attr("id", "tooltip-text1")
        .attr("x", margin.left + 10)
        .attr("y", margin.top + 12)
        .text("..., ...");

    for_svg.append("text")
        .classed('tooltip-text', true)
        .attr("id", "tooltip-text2")
        .attr("x", margin.left + 10)
        .attr("y", margin.top + 28)
        .text("Actual: ...");

    for_svg.append("text")
        .classed('tooltip-text', true)
        .attr("id", "tooltip-text3")
        .attr("x", margin.left + 10)
        .attr("y", margin.top + 44)
        .text("Projected: ...");

    for_svg.append("text")
        .classed('tooltip-text', true)
        .attr("id", "tooltip-text4")
        .attr("x", margin.left + 10)
        .attr("y", margin.top + 60)
        .text("Difference: ...");

    // render annotations for over/under-performances
    /*
    for_svg.append("text")
        .classed('performance-annotation', true)
        .attr("x", margin.left + width * 6.2/8)
        .attr("y", margin.top + 130)
        .text("Performed better than expected");

    for_svg.append("text")
        .classed('performance-annotation', true)
        .attr("x", margin.left + width * .8/8)
        .attr("y", margin.top + height - 15)
        .text("Performed worse than expected");

    wrap(d3.selectAll('.performance-annotation'), 100);
    */
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

// if group by button clicked
$('#d3-fantasy-olympics-retro-buttons button').click(function() {
    // highlight selected button
    $('#d3-fantasy-olympics-retro-buttons button').removeClass('selected');
    $(this).addClass('selected');

    // set group_by variable to be used in plotting function
    if ($(this).attr('id') == 'sport-button') group_by = "Sport";
    else if ($(this).attr('id') == 'country-button') group_by = "Country";
    else group_by = null;

    d3.selectAll('.marker, .marker-drop-line, #x-axis, #y-axis').remove();
    render_group_by_plot(data, true);
});

// if page resized
$(window).resize(function() {
    // update page width
    width  = $('#d3-fantasy-olympics-retro').width() -  margin.left - margin.right;

    // clear existing plot and redraw
    d3.selectAll('.marker, .marker-drop-line, #x-axis, #y-axis').remove();
    render_group_by_plot(data, false);
});

// init footnote
new jBox('Tooltip', {
    attach: '#footnote-1',
    content: "This analysis includes teams that were projected to earn points or who did earn points. Thus if a team was not projected to win and they did not win, they are not included."
});
