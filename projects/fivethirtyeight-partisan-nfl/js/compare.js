var svg_nfl_compare = d3.select("#d3-nfl-compare");

var compare_margin = {top: 50, right: 50, bottom: 50, left: 10},
    compare_width  = $('#d3-nfl-compare').width() - compare_margin.left - compare_margin.right,
    compare_height = $('#d3-nfl-compare').height() - compare_margin.top - compare_margin.bottom;
	
var compare_x = d3.scaleLinear().range([0, compare_width]),
	compare_y = d3.scaleLinear().range([compare_height,  0]);

var lean_type = "Total"

/* helper functions */
function hexToRGB(hex) {
	return {
		"r": parseInt(hex.substring(1,3), 16),
		"g": parseInt(hex.substring(3,5), 16),
		"b": parseInt(hex.substring(5,7), 16)
	}
}

d3.csv("/projects/fivethirtyeight-partisan-nfl/data/compare-data.csv", function(d) {
    d['Total Lean'] = +(+d['Total Lean'] * 100).toFixed(2);
    d['Vote Lean']  = +(+d['Vote Lean'] * 100).toFixed(2);
    d['FiveThirtyEight Lean'] = +d.fivethirtyeight;
    return d;
}, function(error, data) {
	compare_x.domain(d3.extent(data, function(d) { return d[lean_type + ' Lean']; })).nice();
	compare_y.domain(d3.extent(data, function(d) { return d['FiveThirtyEight Lean']; })).nice();

	svg_nfl_compare.append('line')
		.attr('x1', compare_margin.left)
		.attr('x2', compare_margin.left + compare_width)
		.attr('y1', compare_margin.top + compare_y(0))
		.attr('y2', compare_margin.top + compare_y(0))
		.style('stroke', 'rgba(150,150,150,0.3)');

	svg_nfl_compare.append('line')
		.attr('x1', compare_margin.left + compare_x(0))
		.attr('x2', compare_margin.left + compare_x(0))
		.attr('y1', compare_margin.top)
		.attr('y2', compare_margin.top + compare_height)
		.style('stroke', 'rgba(150,150,150,0.3)');

	svg_nfl_compare.append("g")
	    .attr("id","x-axis")
	    .attr("transform", `translate(${compare_margin.left}, ${compare_margin.top + compare_height})`)
	    .call(d3.axisBottom(compare_x).ticks(4));

	svg_nfl_compare.append("g")
	    .attr("id","y-axis")
	    .attr("transform", `translate(${compare_margin.left + compare_width}, ${compare_margin.top})`)
	    .style('opacity', 0.8)
	    .call(d3.axisRight(compare_y).ticks(4));

	for (let i = 0; i < data.length; i++) {
		svg_nfl_compare.append('circle')
			.attr('class', 'dot-538')
			.attr('id', data[i].Team + '-dot-538')
			.attr('r', 3)
			.attr('cx', compare_margin.left + compare_x(data[i][lean_type + ' Lean']))
			.attr('cy', compare_margin.top  + compare_y(data[i]['FiveThirtyEight Lean']))
			.style('stroke', data[i].color)
			.style('fill', function() {
				var rgb = hexToRGB(data[i].color);
				return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
			});

		svg_nfl_compare.append('text')
			.attr('id', data[i].Team + '-tag')
			.attr('class', 'team-text')
			.attr('x', compare_margin.left + compare_x(data[i][lean_type + ' Lean']) - (8 * (+data[i].left ? 1 : -1)))
			.attr('y', compare_margin.top + compare_y(data[i]['FiveThirtyEight Lean']) + 3)
			.style('font-size', 12 + 'px')
			.style('text-anchor', (+data[i].left ? 'end' : 'start'))
			.text(data[i].Team);
	}
});

svg_nfl_compare.append('text')
	.attr('id', 'compare-title')
	.attr('x', compare_margin.left + compare_width / 2)
	.attr('y', 20)
	.style('font-size', '20px')
	.style('text-anchor', 'middle')
	.style("font-weight", "bold")
	.text("Comparing the FiveThirtyEight and BT analyses")

$('#d3-nfl-compare-buttons button').click(function() {
	if (!$(this).hasClass('selected')) {
		$('#d3-nfl-compare-buttons button').toggleClass('selected');
	}
});

$(window).resize(function() {
	compare_width = $('#d3-nfl-bar').width() - compare_margin.left - compare_margin.right;
	d3.selectAll('#compare-title').attr('x', compare_margin.left + compare_width / 2);
});