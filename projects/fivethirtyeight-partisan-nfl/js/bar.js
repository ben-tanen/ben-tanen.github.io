var svg_nfl_bar = d3.select("#d3-nfl-bar");

var bar_margin = {top: 70, right: 100, bottom: 5, left: 100, bar: 5},
    bar_width  = $('#d3-nfl-bar').width() - bar_margin.left - bar_margin.right,
    bar_height = $('#d3-nfl-bar').height() - bar_margin.top - bar_margin.bottom,
    bar_size   = bar_height - (bar_margin.bar * 31) / 32;

var bar_selector = "Vote";

d3.csv("/projects/fivethirtyeight-partisan-nfl/data/bar-data.csv", function(error, data) {

	bar_size = (bar_height - (bar_margin.bar * (data.length - 1))) / data.length;

	for (var i = 0; i < data.length; i++) {
		svg_nfl_bar.append('rect')
			.attr('id', data[i].Team + "-N")
			.attr('class', 'bar-N')
			.attr('vote-order',  +data[i]["Vote Lean Order"])
			.attr('total-order', +data[i]["Total Lean Order"])
			.attr('x', bar_margin.left)
			.attr('y', bar_margin.top + bar_size * i + bar_margin.bar * i)
			.attr('width', bar_width)
			.attr('height', bar_size)
			.style('fill', 'rgb(191,191,191)');

		svg_nfl_bar.append('rect')
			.attr('class', 'bar-D')
			.attr('vote-share',  +data[i]["Clinton Share of Vote"])
			.attr('total-share', +data[i]["Clinton Share of Total"])
			.attr('vote-order',  +data[i]["Vote Lean Order"])
			.attr('total-order', +data[i]["Total Lean Order"])
			.attr('id', data[i].Team + "-D")
			.attr('x', bar_margin.left)
			.attr('y', bar_margin.top + bar_size * i + bar_margin.bar * i)
			.attr('width', bar_width * +data[i]["Clinton Share of " + bar_selector])
			.attr('height', bar_size)
			.style('fill', 'rgb(91,155,213)');

		svg_nfl_bar.append('rect')
			.attr('id', data[i].Team + "-R")
			.attr('class', 'bar-R')
			.attr('vote-share',  +data[i]["Trump Share of Vote"])
			.attr('total-share', +data[i]["Trump Share of Total"])
			.attr('vote-order',  +data[i]["Vote Lean Order"])
			.attr('total-order', +data[i]["Total Lean Order"])
			.attr('x', bar_margin.left + bar_width - bar_width * +data[i]["Trump Share of " + bar_selector])
			.attr('y', bar_margin.top + bar_size * i + bar_margin.bar * i)
			.attr('width', bar_width * +data[i]["Trump Share of " + bar_selector])
			.attr('height', bar_size)
			.style('fill', 'rgb(239,64,86)');

		svg_nfl_bar.append('text')
			.attr('id', data[i].Team + '-tag')
			.attr('class', 'bar-team-text')
			.attr('vote-order',  +data[i]["Vote Lean Order"])
			.attr('total-order', +data[i]["Total Lean Order"])
			.attr('x', bar_margin.left - bar_margin.bar - 2)
			.attr('y', bar_margin.top + bar_size * i + bar_margin.bar * i + bar_size - 2)
			.style('font-size', 12 * (bar_size / 10.32) + 'px')
			.style('text-anchor', 'end')
			.text(data[i].Team);

		svg_nfl_bar.append('text')
			.attr('id', data[i].Team + "-lean")
			.attr('class', 'bar-lean-text')
			.attr('vote-lean', +data[i]["Vote Lean"])
			.attr('total-lean', +data[i]["Total Lean"])
			.attr('vote-order',  +data[i]["Vote Lean Order"])
			.attr('total-order', +data[i]["Total Lean Order"])
			.attr('x', bar_margin.left + bar_width + bar_margin.bar + 38)
			.attr('y', bar_margin.top + bar_size * i + bar_margin.bar * i + bar_size - 2)
			.style('font-size', 12 * (bar_size / 10.32) + 'px')
			.style('text-anchor', 'end')
			.style('fill', (+data[i][bar_selector + ' Lean'] < 0 ? 'rgb(239,64,86)' : 'rgb(91,155,213)'))
			.text("+" + (+data[i][bar_selector + ' Lean'] * 100 * (+data[i][bar_selector + ' Lean'] < 0 ? -1 : 1)).toFixed(2));
	}
});

svg_nfl_bar.append('text')
	.attr('id', 'title')
	.attr('x', bar_margin.left + bar_width / 2)
	.attr('y', bar_margin.top / 2 - 12)
	.style('font-size', '20px')
	.style('text-anchor', 'middle')
	.style("font-weight", "bold")
	.text("The political leanings of every NFL team's fans")

svg_nfl_bar.append('text')
	.attr('id', 'subtitle1')
	.attr('x', bar_margin.left + bar_width / 2)
	.attr('y', bar_margin.top / 2 + 6)
	.attr('width', bar_width / 2)
	.style('font-size', '15px')
	.style('text-anchor', 'middle')
	.text("Based on votes cast for each party's candidate relative to")

svg_nfl_bar.append('text')
	.attr('id', 'subtitle2')
	.attr('x', bar_margin.left + bar_width / 2)
	.attr('y', bar_margin.top / 2 + 24)
	.attr('width', bar_width / 2)
	.style('font-size', '15px')
	.style('text-anchor', 'start')
	.text("for 2016 Presidential Election")

function rerender_bars(selector, animate) {
	d3.selectAll('rect.bar-N')
		.attr('x', bar_margin.left)
		.transition().duration(animate ? 200 : 0)
		.attr('y', function() {
			var order = +d3.select(this).attr(selector.toLowerCase() + '-order') - 1;
			return bar_margin.top + bar_size * order + bar_margin.bar * order;
		})
		.attr('width', bar_width);

	d3.selectAll('rect.bar-D')
		.attr('x', bar_margin.left)
		.transition().duration(animate ? 200 : 0)
		.attr('y', function() {
			var order = +d3.select(this).attr(selector.toLowerCase() + '-order') - 1;
			return bar_margin.top + bar_size * order + bar_margin.bar * order;
		})
		.attr('width', function() { return bar_width * +d3.select(this).attr(selector.toLowerCase() + '-share') });

	d3.selectAll('rect.bar-R')
		.transition().duration(animate ? 200 : 0)
		.attr('x', function() { return bar_margin.left + bar_width - bar_width * +d3.select(this).attr(selector.toLowerCase() + '-share') })
		.attr('y', function() {
			var order = +d3.select(this).attr(selector.toLowerCase() + '-order') - 1;
			return bar_margin.top + bar_size * order + bar_margin.bar * order;
		})
		.attr('width', function() { return bar_width * +d3.select(this).attr(selector.toLowerCase() + '-share') });

	d3.selectAll('.bar-lean-text')
		.text(function() { return "+" + (+d3.select(this).attr(selector.toLowerCase() + '-lean') * 100 * (+d3.select(this).attr(selector.toLowerCase() + '-lean') < 0 ? -1 : 1)).toFixed(2); })
		.transition().duration(animate ? 200 : 0)
		.attr('x', bar_margin.left + bar_width + bar_margin.bar + 38)
		.attr('y', function() {
			var order = +d3.select(this).attr(selector.toLowerCase() + '-order') - 1;
			return bar_margin.top + bar_size * order + bar_margin.bar * order + bar_size - 2;
		});

	d3.selectAll('.bar-team-text')
		.transition().duration(animate ? 200 : 0)
		.attr('y', function() {
			var order = +d3.select(this).attr(selector.toLowerCase() + '-order') - 1;
			return bar_margin.top + bar_size * order + bar_margin.bar * order + bar_size - 2;
		});
}

$('#d3-nfl-bar-buttons button').click(function() {
	if (!$(this).hasClass('selected')) {
		$('#d3-nfl-bar-buttons button').toggleClass('selected');
		rerender_bars($(this).attr('id'), true);
		bar_selector = $(this).attr('id');
	}
})

$(window).resize(function() {
	bar_width = $('#d3-nfl-bar').width() - bar_margin.left - bar_margin.right;
	rerender_bars(bar_selector, false);
	d3.selectAll('#title, #subtitle1, #subtitle2').attr('x', bar_margin.left + bar_width / 2);
});