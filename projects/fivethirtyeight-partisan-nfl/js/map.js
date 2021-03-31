var svg_nfl_map = d3.select("#d3-nfl-map");

var map_tooltip = d3.select("#d3-nfl-map-container").append('div')
    .attr("id", "nfl-map-tooltip")
    .style("opacity", 0);

function scale (scaleFactor) {
    return d3.geoTransform({
        point: function(x, y) {
            this.stream.point(x * scaleFactor, y  * scaleFactor);
        }
    });
}

var map_view_width = $("#d3-nfl-map").parent().width();
var scale_factor = (map_view_width >= 960 ? 1 : map_view_width / 960);
var map_path = d3.geoPath().projection(scale(scale_factor));
$('#d3-nfl-map-container').height(600 * scale_factor);

d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
    if (error) throw error;

    d3.csv("/projects/fivethirtyeight-partisan-nfl/data/map-data.csv", function(error, data) {
        if (error) throw error;

        var data_map = { };
        for (var i = 0; i < data.length; i++) {
            data_map[(data[i]['State FIPS'] < 10 ? "0" : "") + data[i].FIPS] = {
                'county': data[i].County,
                'state':  data[i].State,
                'color':  data[i].Color,
                'team':   data[i].Team,
                'votes_clinton': +data[i].Clinton,
                'votes_trump':   +data[i].Trump,
                'pct_clinton':   +data[i]['% Clinton'],
                'pct_trump':     +data[i]['% Trump']
            }
        }

        svg_nfl_map.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter().append("path")
            .attr("d", map_path)
            .style("fill", function(d) {
                return data_map[d.id].color;
            }).on("mouseover", function(d) {
                var datum = data_map[d.id];
                map_tooltip.html(`<p><b>${datum.county}, ${datum.state}${datum.state == "Alaska" ? "*" : ""}</b></p>
                                  <p>Voted for ${datum.pct_clinton > datum.pct_trump ? "Clinton" : "Trump"} with 
                                               ${(Math.max(datum.pct_clinton, datum.pct_trump) * 100).toFixed(2)}% of the vote</p>
                                  <p>${datum.team} Fans</p>`)
                    .transition().duration(100)
                    .style("opacity", 1);
            }).on("mouseout", function(d) {
                map_tooltip.transition().duration(100)
                    .style("opacity", 0)
            })

        svg_nfl_map.append("path")
            .attr("class", "state-borders")
            .attr("d", map_path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
        
        svg_nfl_map.append("path")
            .attr("class", "county-borders")
            .attr("d", map_path(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b; })));

        });
});