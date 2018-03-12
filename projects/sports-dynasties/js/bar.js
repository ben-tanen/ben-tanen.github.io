
/*********************/
/*** INIT VARIABLE ***/
/*********************/

var sd_bar_svg = d3.select('#d3-sd-barchart');

var bar_margin = {top: 40, right: 20, bottom: 0, left: 120, row: 8},
    bar_width  = $('#d3-sd-barchart').width() - bar_margin.left - bar_margin.right,
    bar_height = $('#d3-sd-barchart').height() - bar_margin.top - bar_margin.bottom;

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

function format_barchart_data() {
    var bar_data = [ ];

    for (city in data.cities) {
        bar_data.push(data.cities[city]);
    }

    bar_data.sort(function(x, y) {
        return d3.descending(x['total-wins'], y['total-wins']);
    });

    return bar_data;
}

function aggregate_wins_by_league(city, leagues) {
    var total_wins = 0;

    for (var i = 0; i < leagues.length; i++) {
        total_wins += city[leagues[i] + '-wins'].length;
    }

    return total_wins;
}

function render_barchart() {
    var num_cities = Object.keys(data.cities).length,
        bar_row_height = (bar_height - (bar_margin.row * (num_cities - 1))) / num_cities;

    // format data for barchart
    var bar_data = format_barchart_data();

    // set scale for bars
    var x = d3.scaleLinear()
        .domain([0, d3.max(bar_data, function(d) { return d['total-wins']; })])
        .range([0, bar_width]);

    sd_bar_svg.append("g")
        .attr("id","bar-x-axis")
        .attr("transform", `translate(${dot_margin.left + 1}, ${dot_margin.top - 18})`)
        .call(d3.axisTop(x).ticks(5));

    for (var i = 0; i < bar_data.length; i++) {
        var city = bar_data[i];

        sd_bar_svg.append('text')
            .classed('bar-city-name', true)
            .attr('x', bar_margin.left - 8)
            .attr('y', bar_margin.top + (bar_row_height + bar_margin.row) * i)
            .text(city.name);

        sd_bar_svg.append('rect')
            .classed('bar-component', true)
            .classed('MLB', true)
            .attr('x', bar_margin.left)
            .attr('y', bar_margin.top + (bar_row_height + bar_margin.row) * i - 11)
            .attr('width', x(aggregate_wins_by_league(city, ['MLB'])))
            .attr('height', bar_row_height)
            .attr('city', city.name)
            .attr('league', 'MLB')
            .attr('wins', city['MLB-wins']);

        sd_bar_svg.append('rect')
            .classed('bar-component', true)
            .classed('NBA', true)
            .attr('x', bar_margin.left + x(aggregate_wins_by_league(city, ['MLB'])))
            .attr('y', bar_margin.top + (bar_row_height + bar_margin.row) * i - 11)
            .attr('width', x(aggregate_wins_by_league(city, ['NBA'])))
            .attr('height', bar_row_height)
            .attr('city', city.name)
            .attr('league', 'NBA')
            .attr('wins', city['NBA-wins']);

        sd_bar_svg.append('rect')
            .classed('bar-component', true)
            .classed('NFL', true)
            .attr('x', bar_margin.left + x(aggregate_wins_by_league(city, ['MLB', 'NBA'])))
            .attr('y', bar_margin.top + (bar_row_height + bar_margin.row) * i - 11)
            .attr('width', x(aggregate_wins_by_league(city, ['NFL'])))
            .attr('height', bar_row_height)
            .attr('city', city.name)
            .attr('league', 'NFL')
            .attr('wins', city['NFL-wins']);

        sd_bar_svg.append('rect')
            .classed('bar-component', true)
            .classed('NHL', true)
            .attr('x', bar_margin.left + x(aggregate_wins_by_league(city, ['MLB', 'NBA', 'NFL'])))
            .attr('y', bar_margin.top + (bar_row_height + bar_margin.row) * i - 11)
            .attr('width', x(aggregate_wins_by_league(city, ['NHL'])))
            .attr('height', bar_row_height)
            .attr('city', city.name)
            .attr('league', 'NHL')
            .attr('wins', city['NHL-wins']);
    }

    // trigger hover tooltip
    new jBox('Tooltip', {
        attach: '.bar-component',
        content: "...",
        onOpen: function() {
            var city   = $(this.source).attr('city'),
                league = $(this.source).attr('league'),
                wins   = $(this.source).attr('wins').split(',');

            if (league == "MLB")      cup = "World Series championships";
            else if (league == "NBA") cup = "NBA championships"
            else if (league == "NFL") cup = "Super Bowl wins";
            else if (league == "NHL") cup = "Stanley Cups wins";

            this.setContent(`<p><b>${city}</b>: ${wins.length} ${cup}</p><p>(${wins.join(', ')})</p>`);
        }
    });
}

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

// if page resized
$(window).resize(function() {
    // update page width
    bar_width  = $('#d3-sd-barchart').width() - bar_margin.left - bar_margin.right;

    // clear existing plot and redraw
    d3.selectAll('.bar-city-name, .bar-component, #bar-x-axis').remove();
    render_barchart();
});