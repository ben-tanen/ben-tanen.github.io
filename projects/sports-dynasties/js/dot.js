
/*********************/
/*** INIT VARIABLE ***/
/*********************/

var sd_dot_svg = d3.select('#d3-sd-dotchart');

var dot_margin = {top: 38, right: 20, bottom: 0, left: 118, row: 8},
    dot_width  = $('#d3-sd-dotchart').width() - dot_margin.left - dot_margin.right,
    dot_height = $('#d3-sd-dotchart').height() - dot_margin.top - dot_margin.bottom;

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

function format_dotchart_data() {
    var dot_data = [ ];

    for (city in data.cities) {
        dot_data.push(data.cities[city]);
    }

    dot_data.sort(function(x, y) {
        return d3.ascending(x['earliest-win'], y['earliest-win']);
    });

    return dot_data;
}

function find_dynasties(city) {
    var dynasties = [ ],
        in_dynasty = false,
        dynasty_start_year = null,
        valid_wins = 0;

    var all_wins = city['MLB-wins'].concat(city['NBA-wins']).concat(city['NFL-wins']).concat(city['NHL-wins']).sort();

    for (var i = 0; i < all_wins.length; i++) {
        var win_yr = all_wins[i];

        if (!in_dynasty && (all_wins.indexOf(win_yr + 2) >= 0 || all_wins.indexOf(win_yr + 1) >= 0)) {
            in_dynasty = true;
            dynasty_start_year = win_yr;
            valid_wins = 2;
        } else if (in_dynasty && (all_wins.indexOf(win_yr + 2) >= 0 || all_wins.indexOf(win_yr + 1) >= 0)) {
            valid_wins++;
        } else if (in_dynasty && all_wins.indexOf(win_yr + 2) == -1 && all_wins.indexOf(win_yr + 1) == -1) {
            if (valid_wins >= 5) dynasties.push([dynasty_start_year, win_yr]);
            in_dynasty = false;
            dynasty_start_year = null;
            valid_wins = 0;
        }
    }

    return dynasties;
}

function find_dynasty(year, dynasties) {
    for (var i = 0; i < dynasties.length; i++) {
        if (year >= dynasties[i][0] && year <= dynasties[i][1]) return dynasties[i];
    }
    return null;
}

function is_in_dynasty(year, dynasties) {
    if (find_dynasty(year, dynasties)) return true;
    else return false;
}

function render_dotchart() {
    var num_cities = Object.keys(data.cities).length,
        dot_row_height = (dot_height - (dot_margin.row * (num_cities - 1))) / num_cities;

    // format data for barchart
    var dot_data = format_dotchart_data();

    // set scale for bars
    var x = d3.scaleLinear()
        .domain([year_start, year_end])
        .range([0 + 5, dot_width - 5]);

    sd_dot_svg.append("g")
        .attr("id","dot-x-axis")
        .attr("transform", `translate(${dot_margin.left - 1}, ${dot_margin.top - 18})`)
        .call(d3.axisTop(x)
                .tickValues(dot_width >= 275 ? [1903, 1920, 1940, 1960, 1980, 2000, 2017] : [1903, 1930, 1960, 1990, 2017])
                .tickFormat(d3.format("d")));

    for (var i = 0; i < dot_data.length; i++) {
        var city = dot_data[i];

        sd_dot_svg.append('text')
            .classed('dot-city-name', true)
            .attr('x', dot_margin.left - 8)
            .attr('y', dot_margin.top + (dot_row_height + dot_margin.row) * i)
            .text(city.name);

        // compute dynasties
        var dynasties = find_dynasties(city);

        // plot wins
        for (var j = 0; j < leagues.length; j++) {
            var league = leagues[j];

            for (var k = 0; k < city[league + '-wins'].length; k++) {
                var win_year = city[league + '-wins'][k];

                sd_dot_svg.append('circle')
                    .classed('dot-marker', true)
                    .classed('in-dynasty', is_in_dynasty(win_year, dynasties))
                    .classed(league, true)
                    .attr('cx', dot_margin.left + x(win_year))
                    .attr('cy', dot_margin.top + (dot_row_height + dot_margin.row) * i - 4.5)
                    .attr('r', 3)
                    .attr('league', league)
                    .attr('city', city.name)
                    .attr('year', win_year);
            }
        }
    }

    // trigger hover tooltip
    new jBox('Tooltip', {
        attach: '.dot-marker',
        content: "...",
        offset: {x: 2},
        onOpen: function() {
            var league = $(this.source).attr('league'),
                city   = $(this.source).attr('city'),
                year   = $(this.source).attr('year'),
                team   = data.winners[year][league].name;

            if (league == "MLB")      cup = "World Series";
            else if (league == "NBA") cup = "NBA"
            else if (league == "NFL") cup = "Super Bowl";
            else if (league == "NHL") cup = "Stanley Cup";

            // include dynasty information (if applicable)
            var dyn_str = "";
            if (d3.select(this.source[0]).classed('in-dynasty')) {
                var dynasties = find_dynasties(data.cities[city]),
                    match_dyn = find_dynasty(year, dynasties);
                dyn_str = `<p>Part of ${match_dyn[0]} - ${match_dyn[1]} dynasty</p>`;
            }

            this.setContent(`<p><b>${team}</b></p><p>${year} ${cup} champions</p>${dyn_str}`);
        }
    });
}

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

// if page resized
$(window).resize(function() {
    // update page width
    dot_width  = $('#d3-sd-dotchart').width() - dot_margin.left - dot_margin.right;

    // clear existing plot and redraw
    d3.selectAll('.dot-city-name, .dot-marker, .dot-dynasty-marker, #dot-x-axis').remove();
    render_dotchart();
});