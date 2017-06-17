function get_city_pos(city) {
    return projection([data.cities[city].location[1], data.cities[city].location[0]]);
}

function render_map() {
    // create path variable
    var path = d3.geoPath()
        .projection(projection);

    /* GENERATE MAP */
    d3.json("/projects/sports-dynasties/data/maps/usa-and-canada.json", function(error, topo) {
        regions = topojson.feature(topo, topo.objects.collection).features

        // add states from topojson
        sd_svg.selectAll("path")
          .data(regions).enter()
          .append("path")
          .attr("class", "feature")
          .attr("d", path);

        // put border around states 
        sd_svg.append("path")
          .datum(topojson.mesh(topo, topo.objects.collection, function(a, b) { return a !== b; }))
          .attr("class", "mesh")
          .attr("d", path);

        var c_mlb = sd_svg.append('circle')
            .classed('circ', true)
            .attr('id', 'MLB')
            .attr('cx', get_city_pos('Boston, MA')[0])
            .attr('cy', get_city_pos('Boston, MA')[1])
            .attr('r', 5);

        var movement_duration = 250,
            movement_delay    = 25,
            movement_steps    = 5;

        setInterval(function() {
            year_ix = (year_ix >= 2017 ? 1903 : year_ix + 1);

            sd_svg.select('.year-text').transition().text(year_ix);

            if (year_ix == 1903) {

                sd_svg.selectAll('.tail-path').remove();
                sd_svg.selectAll('.circ').remove();

                sd_svg.append('circle')
                    .classed('circ', true)
                    .attr('id', 'MLB')
                    .attr('cx', get_city_pos('Boston, MA')[0])
                    .attr('cy', get_city_pos('Boston, MA')[1])
                    .attr('r', 5);

            } else {
                sd_svg.selectAll('.tail-path')
                    .transition().duration(movement_duration)
                    .style('opacity', function() {
                        return Math.max(parseFloat(d3.select(this).style('opacity')) - (1 / movement_steps), 0);
                    });

                sd_svg.selectAll('.tail-path').filter(function() {
                        return parseFloat(d3.select(this).style('opacity')) < 0.0001;
                    }).remove();

                var year_a = data.winners[String(year_ix - 1)],
                    year_b = data.winners[String(year_ix)];

                for (var league_ix = 0; league_ix < leagues.length; league_ix++) {
                    var league = leagues[league_ix];
                    var old_city = null,
                        new_city = null;

                    if (year_b[league] && year_b[league].city) {
                        new_city = year_b[league].city.name;
                    } else {
                        continue;
                    }

                    if (year_a[league] && year_a[league].city) {
                        old_city = year_a[league].city.name;
                    } else if (data.winners[String(year_ix - 2)][league] && data.winners[String(year_ix - 2)][league].city) {
                        old_city = data.winners[String(year_ix - 2)][league].city.name;
                    } else {
                        continue;
                    }

                    if (sd_svg.select('.circ#' + league).size() == 0) {
                        sd_svg.append('circle')
                            .classed('circ', true)
                            .attr('id', league)
                            .attr('cx', get_city_pos(old_city)[0])
                            .attr('cy', get_city_pos(old_city)[1])
                            .attr('r', 5);
                    }

                    sd_svg.select('.circ#' + league).transition().duration(movement_duration)
                        .attr('cx', get_city_pos(new_city)[0])
                        .attr('cy', get_city_pos(new_city)[1]);

                    sd_svg.append('path')
                        .classed('tail-path', true)
                        .attr('id', league)
                        .attr('d', sd_line([get_city_pos(old_city), get_city_pos(old_city)]))
                        .transition().duration(movement_duration)
                        .attr('d', sd_line([get_city_pos(old_city), get_city_pos(new_city)]));
                }
            }
        }, movement_duration + movement_delay);
    });
}