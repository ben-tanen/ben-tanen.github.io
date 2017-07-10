function load_data() {
    $.ajax({
        type: "GET",
        url: "/projects/sports-dynasties/data/team-data.csv",
        dataType: "text",
        success: function(d) {
            var lines = d.split(/\r\n|\n/);
            for (var i = 1; i < lines.length; i++) {
                var line   = lines[i].split(',')
                    league = line[0],
                    year   = line[1],
                    team   = line[2],
                    city   = line[3],
                    state  = line[4],
                    lat    = line[5],
                    lng    = line[6];

                /* load city data */
                if (!data.cities[city + ', ' + state]) {
                    data.cities[city + ', ' + state] = {
                        name: city + ', ' + state,
                        location: [+lat, +lng]
                    };
                }

                /* load winner data */
                if (!data.winners[year]) data.winners[year] = { }

                data.winners[year][league] = {
                    name: team,
                    league: league
                };

                if (team != "N/A") {
                    data.winners[year][league].city = {
                        name: city + ', ' + state,
                        location: [+lat, +lng]
                    };              
                } else {
                    data.winners[year][league].city = null;
                }

            }

            render_map();
        }
    });

}