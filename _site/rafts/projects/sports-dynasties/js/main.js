/* INIT PAGE */
var width  = 650,
    height = 400;

var sd_svg = d3.select('.sd-svg-container').append('svg')
    .attr('width', width)
    .attr('height', height);

/* POLY BASICS */
var sd_line = d3.line()
    .x(function(d) { return d[0] })
    .y(function(d) { return d[1] });

var projection = d3.geoMercator()
    .scale(550)
    .center([-80,37]);

/* INIT LEGEND */
var year_ix = 1903;

sd_svg.append('text')
    .classed('year-text', true)
    .attr('x', width - 80)
    .attr('y', height - 10);

sd_svg.append('circle')
    .classed('legend-circ', true)
    .attr('id', 'MLB')
    .attr('cx', 10)
    .attr('cy', height - 70)
    .attr('r', 5);

sd_svg.append('text')
    .classed('legend-text', true)
    .attr('id', 'MLB')
    .attr('x', 22)
    .attr('y', height - 66)
    .text('MLB');

sd_svg.append('circle')
    .classed('legend-circ', true)
    .attr('id', 'NBA')
    .attr('cx', 10)
    .attr('cy', height - 50)
    .attr('r', 5);

sd_svg.append('text')
    .classed('legend-text', true)
    .attr('id', 'NBA')
    .attr('x', 22)
    .attr('y', height - 46)
    .text('NBA');

sd_svg.append('circle')
    .classed('legend-circ', true)
    .attr('id', 'NFL')
    .attr('cx', 10)
    .attr('cy', height - 30)
    .attr('r', 5);

sd_svg.append('text')
    .classed('legend-text', true)
    .attr('id', 'NFL')
    .attr('x', 22)
    .attr('y', height - 26)
    .text('NFL');

sd_svg.append('circle')
    .classed('legend-circ', true)
    .attr('id', 'NHL')
    .attr('cx', 10)
    .attr('cy', height - 10)
    .attr('r', 5);

sd_svg.append('text')
    .classed('legend-text', true)
    .attr('id', 'NHL')
    .attr('x', 22)
    .attr('y', height - 6)
    .text('NHL');

/* INIT DATA */
var data = {
    cities:  { },
    winners: { },
};

var leagues = ['MLB', 'NBA', 'NFL', 'NHL'];

/* LOAD DATA */
load_data();