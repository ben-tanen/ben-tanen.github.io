locations = { }
schedule  = { }

// pull in location data from CSV file
$.ajax({
    type: "GET",
    url: "/projects/schedule-map/data/locations.csv",
    dataType: "text",
    success: function(data) {
        var lines = data.split(/\r\n|\n/);
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].split(',');
            var name = line[0];
            var lat  = line[1];
            var lng  = line[2];
            var desc = line[3];
            locations[name] = {"name": name, "lat": +lat, "lng": +lng, "description": desc};
        }
    }
});

// pull in schedule data from CSV file
$.ajax({
    type: "GET",
    url: "/projects/schedule-map/data/schedule.csv",
    dataType: "text",
    success: function(data) {
        var lines = data.split(/\r\n|\n/);
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].split(',');
            var semester = line[3];

            if (!schedule[semester]) schedule[semester] = [ ];

            schedule[semester].push({"description": line[0],
                                     "location":    line[1],
                                     "type":        line[2],
                                     "dayofweek":   line[3],
                                     "starttime":   new Date("01/01/2016 " + line[4]),
                                     "endtime":     new Date("01/01/2016 " + line[5]),
                                     "length":      +line[6]
            });
        }

        init_checkboxes();
        init_map();
    }
});