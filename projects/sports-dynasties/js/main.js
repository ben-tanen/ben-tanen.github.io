/**********************/
/*** INIT VARIABLES ***/
/**********************/

var leagues = ['MLB', 'NBA', 'NFL', 'NHL'];

var data = {
    cities:  { },
    winners: { },
};

var year_start = 1903,
    year_end   = 2017;

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

d3.csv("/projects/sports-dynasties/data/team-data.csv", function(d) {
    return d;
}, function(error, d) {
    for (var i = 0; i < d.length; i++) {
        var di     = d[i],
            league = di.league,
            year   = di.year,
            team   = di.team,
            city   = di.city,
            state  = di.state,
            lat    = +di.lat,
            lng    = +di.lng;

        // load city data
        if (city != "" && state != "" && !data.cities[city + ', ' + state]) {
            data.cities[city + ', ' + state] = {
                name: city + ', ' + state,
                location: [lat, lng]
            };
        }

        // load winner data
        if (!data.winners[year]) data.winners[year] = { }

        data.winners[year][league] = {
            name: team,
            league: league
        };

        if (team != "N/A") {
            data.winners[year][league].city = {
                name: city + ', ' + state,
                location: [lat, lng]
            };              
        } else {
            data.winners[year][league].city = null;
        }
    }

    // calculate league-wins and earliest win per city
    for (city in data.cities) {
        data.cities[city]['earliest-win'] = 2017;
        for (ix in leagues) {
            var league = leagues[ix];
            data.cities[city][league + '-wins'] = [ ];
            for (year in data.winners) {
                if (data.winners[year][league] && data.winners[year][league].city) {
                    if (data.winners[year][league].city.name == city) data.cities[city][league + '-wins'].push(+year);
                }
            }
            if (data.cities[city][league + '-wins'].length > 0 && data.cities[city][league + '-wins'][0] < data.cities[city]['earliest-win']) data.cities[city]['earliest-win'] = data.cities[city][league + '-wins'][0];
        }
        data.cities[city]['total-wins'] = data.cities[city]['MLB-wins'].length + data.cities[city]['NHL-wins'].length + data.cities[city]['NBA-wins'].length + data.cities[city]['NFL-wins'].length;
    }

    render_barchart();
    render_dotchart();
    render_map();
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

// init footnote
new jBox('Tooltip', {
    attach: '#sd-footnote-1',
    offset: {y: 5},
    content: "Totally random sidenote: it's really annoying how the NHL, MLB, and NFL all have special names for their championships / trophies, but the NBA just has <i>the NBA championship</i>. Just seems silly to me."
});

new jBox('Tooltip', {
    attach: '#sd-footnote-2',
    offset: {y: 5},
    content: "A question not commonly asked by anyone from NYC or Boston."
});

new jBox('Tooltip', {
    attach: '#sd-footnote-3',
    offset: {y: 5},
    content: "We're coming for you New York!"
});