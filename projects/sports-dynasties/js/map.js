
/*********************/
/*** INIT VARIABLE ***/
/*********************/

var sd_map_svg = d3.select('#d3-sd-map');

var map_width  = $('#d3-sd-map').width(),
    map_height = $('#d3-sd-map').height();

var sd_map_line = d3.line()
    .x(function(d) { return d[0] })
    .y(function(d) { return d[1] });

var width_scale   = d3.scaleLinear().domain([325, 650]).range([325, 550]),
    centerx_scale = d3.scaleLinear().domain([325, 650]).range([-40, -80]),
    centery_scale = d3.scaleLinear().domain([325, 650]).range([ 40,  37]);

var projection = d3.geoMercator()
    .scale(width_scale(map_width))
    .center([centerx_scale(map_width), centery_scale(map_width)]);

var map_year_ix = year_start;

var animate = true,
    movement_duration = 250,
    movement_delay    = 100,
    movement_steps    = 7;

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

function get_city_pos(city) {
    return projection([data.cities[city].location[1], data.cities[city].location[0]]);
}

function animate_map() {
    // update year
    map_year_ix = (map_year_ix >= year_end ? year_start : map_year_ix + 1);
    sd_map_svg.select('.year-text').text(map_year_ix);

    // if back at the start,
    // remove everything and add 1903 boston
    if (map_year_ix == year_start) {

        sd_map_svg.selectAll('.tail-path, .circ').remove();

        sd_map_svg.append('circle')
            .classed('circ', true)
            .classed('MLB', true)
            .attr('cx', get_city_pos('Boston, MA')[0])
            .attr('cy', get_city_pos('Boston, MA')[1])
            .attr('r', 5);

    } else {
        // fade tail paths
        sd_map_svg.selectAll('.tail-path')
            .transition().duration(movement_duration)
            .style('opacity', function() {
                return Math.max(+d3.select(this).style('opacity') - (1 / movement_steps), 0);
            });

        // remove now invisible tail paths
        sd_map_svg.selectAll('.tail-path')
            .filter(function() {
                return +d3.select(this).style('opacity') < 0.0001;
            }).remove();

        var year_a = data.winners[String(map_year_ix - 1)],
            year_b = data.winners[String(map_year_ix)];

        // for each league, update dot and path
        for (var league_ix = 0; league_ix < leagues.length; league_ix++) {
            var league = leagues[league_ix];
            var old_city = null,
                new_city = null;

            // get new city name
            if (year_b[league] && year_b[league].city) {
                new_city = year_b[league].city.name;
            } else {
                continue;
            }

            // get old city name
            // if there are gap years, skip gap
            if (year_a[league] && year_a[league].city) {
                old_city = year_a[league].city.name;
            } else if (data.winners[String(map_year_ix - 2)][league] && data.winners[String(map_year_ix - 2)][league].city) {
                old_city = data.winners[String(map_year_ix - 2)][league].city.name;
            } else {
                continue;
            }

            // if no league dot exists already, make one
            if (sd_map_svg.select('.circ.' + league).size() == 0) {
                sd_map_svg.append('circle')
                    .classed('circ', true)
                    .classed(league, true)
                    .attr('cx', get_city_pos(old_city)[0])
                    .attr('cy', get_city_pos(old_city)[1])
                    .attr('r', 5);
            }

            // move the dots
            sd_map_svg.select('.circ.' + league).transition().duration(movement_duration)
                .attr('cx', get_city_pos(new_city)[0])
                .attr('cy', get_city_pos(new_city)[1]);

            // update tail path to follow
            sd_map_svg.append('path')
                .classed('tail-path', true)
                .classed(league, true)
                .attr('d', sd_map_line([get_city_pos(old_city), get_city_pos(old_city)]))
                .transition().duration(movement_duration)
                .attr('d', sd_map_line([get_city_pos(old_city), get_city_pos(new_city)]));
        }
    }
}

function render_map() {
    // create path variable
    var path = d3.geoPath()
        .projection(projection);

    // generate map
    d3.json("/projects/sports-dynasties/data/maps/usa-and-canada.json", function(error, topo) {
        regions = topojson.feature(topo, topo.objects.collection).features

        // add states from topojson
        sd_map_svg.selectAll("path")
          .data(regions).enter()
          .append("path")
          .attr("class", "feature")
          .attr("d", path);

        // put border around states 
        sd_map_svg.append("path")
          .datum(topojson.mesh(topo, topo.objects.collection, function(a, b) { return a !== b; }))
          .attr("class", "mesh")
          .attr("d", path);

        // initialize first mlb dot
        var c_mlb = sd_map_svg.append('circle')
            .classed('circ', true)
            .classed('MLB', true)
            .attr('cx', get_city_pos('Boston, MA')[0])
            .attr('cy', get_city_pos('Boston, MA')[1])
            .attr('r', 5);

        // set animation
        if (animate) {
            map_interval = setInterval(function() {
                animate_map();
            }, movement_duration + movement_delay);
        }
    });
}

/***********************/
/*** GENERATE LEGEND ***/
/***********************/

sd_map_svg.append('text')
    .classed('year-text', true)
    .attr('x', map_width - 80)
    .attr('y', map_height - 10);

sd_map_svg.append('circle')
    .classed('legend-circ', true)
    .classed('MLB', true)
    .attr('cx', 10)
    .attr('cy', map_height - 70)
    .attr('r', 5);

sd_map_svg.append('text')
    .classed('legend-text', true)
    .classed('MLB', true)
    .attr('x', 22)
    .attr('y', map_height - 66)
    .text('MLB');

sd_map_svg.append('circle')
    .classed('legend-circ', true)
    .classed('NBA', true)
    .attr('cx', 10)
    .attr('cy', map_height - 50)
    .attr('r', 5);

sd_map_svg.append('text')
    .classed('legend-text', true)
    .classed('NBA', true)
    .attr('x', 22)
    .attr('y', map_height - 46)
    .text('NBA');

sd_map_svg.append('circle')
    .classed('legend-circ', true)
    .classed('NFL', true)
    .attr('cx', 10)
    .attr('cy', map_height - 30)
    .attr('r', 5);

sd_map_svg.append('text')
    .classed('legend-text', true)
    .classed('NFL', true)
    .attr('x', 22)
    .attr('y', map_height - 26)
    .text('NFL');

sd_map_svg.append('circle')
    .classed('legend-circ', true)
    .classed('NHL', true)
    .attr('cx', 10)
    .attr('cy', map_height - 10)
    .attr('r', 5);

sd_map_svg.append('text')
    .classed('legend-text', true)
    .classed('NHL', true)
    .attr('x', 22)
    .attr('y', map_height - 6)
    .text('NHL');

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

// reset animation if year is clicked
d3.select('text.year-text').on('click', function() {
    clearInterval(map_interval);

    sd_map_svg.selectAll('.tail-path, .circ').remove();

    map_year_ix = year_start;

    sd_map_svg.append('circle')
        .classed('circ', true)
        .classed('MLB', true)
        .attr('cx', get_city_pos('Boston, MA')[0])
        .attr('cy', get_city_pos('Boston, MA')[1])
        .attr('r', 5);

    if (animate) {
        map_interval = setInterval(function() {
            animate_map();
        }, movement_duration + movement_delay);
    }
});

// if user goes away from page
$(window).blur(function() {
    clearInterval(map_interval);
});

$(window).focus(function() {
    if (animate) {
        map_interval = setInterval(function() {
            animate_map();
        }, movement_duration + movement_delay);
    }
});