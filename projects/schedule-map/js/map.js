var map;
var markers  = [ ];
var paths    = [ ];
var hitboxes = [ ];
var init_lat =  42.40590729507824;
var init_lng = -71.11821966743469;
var exclude_meals = true;
var exclude_home  = true;

includes = {
    "Athletics": false,
    "Clubs": false,
    "Food": true,
    "Home": true,
    "School": true,
    "Work": false,
}

colors = {
    "F13": "#872f9c", // purple
    "S14": "#ffa83c", // light pink
    "F14": "#328DDF", // darker blue
    "S15": "#49E9E7", // teal
    "F15": "#ff4cc8", // magenta
    "S16": "#FF6E6C", // orange-red
    "F16": "#ffe565", // yellow
    "S17": "#23CE6B", // green
};

function init_map() {
    map = L.map('map', {
        center: [init_lat, init_lng],
        zoom: 16,
        zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    var LegendControl = L.Control.extend({
        options: { position: 'topleft' },
        onAdd: function() { return document.getElementById('legend'); }
    });
    map.addControl(new LegendControl());

    add_hitboxes();
    draw_paths(get_checked_semesters());
    bring_hitboxes_to_front();
}

function add_hitboxes() {
    for (var name in locations) {
        (function(location) {
            var hitbox = L.circleMarker([location['lat'], location['lng']], {
                radius: 20,
                fillOpacity: 0,
                opacity: 0,
                weight: 0
            }).addTo(map);

            // default SVG pointer-events is visiblePainted, which ignores
            // fully-transparent shapes — force fill so the invisible hitbox
            // still catches mouse events
            hitbox.getElement().style.pointerEvents = 'fill';

            hitbox.on('mouseover', function() {
                $('#legend h4').html('<i style="font-size: 15px;">' + location['name'] + '</i><br />' + location['description']);
            });
            hitbox.on('mouseout', function() {
                $('#legend h4').html('');
            });

            hitboxes.push(hitbox);
        })(locations[name]);
    }
}

function bring_hitboxes_to_front() {
    for (var i = 0; i < hitboxes.length; i++) hitboxes[i].bringToFront();
}

function get_checked_semesters() {
    var checks = $('#checks .check.semester');
    var semesters = [ ];

    for (var i = 0; i < checks.length; i++) {
        if ($(checks[i]).hasClass('on')) semesters.push($(checks[i]).attr('id'));
    }

    return semesters;
}

function update_paths() {
    // clear existing paths and markers
    for (var i = 0; i < markers.length; i++) map.removeLayer(markers[i]);
    for (var i = 0; i < paths.length; i++) map.removeLayer(paths[i]);
    markers = [ ];
    paths = [ ];


    // update includes
    var boxes = $(".check.activity");
    for (var i = 0; i < boxes.length; i++) {
        if ($(boxes[i]).hasClass('on')) includes[$(boxes[i]).attr('id')] = true;
        else includes[$(boxes[i]).attr('id')] = false;
    }

    draw_paths(get_checked_semesters());
    bring_hitboxes_to_front();
}

function draw_paths(semesters) {
    $('#legend h4').html('');

    for (var j = 0; j < semesters.length; j++){
        var semester = semesters[j];
        var color    = colors[semester];
        var schedule_coordinates = [ ];

        for (var i = 0; i < schedule[semester].length; i++) {
            var event_type = schedule[semester][i]["type"];
            var location   = locations[schedule[semester][i]["location"]];

            // skip certain event types
            if (!includes[event_type] || !location) continue;

            // add some randomness to locations
            var rnd_rng   = 0.00003;
            var rnd_dlat  = Math.random() * (rnd_rng + rnd_rng) - rnd_rng;
            var rnd_dlng  = Math.random() * (rnd_rng + rnd_rng) - rnd_rng;

            // add positions for marker and path
            add_marker(location, rnd_dlat, rnd_dlng, color);
            schedule_coordinates.push([location["lat"] + rnd_dlat, location["lng"] + rnd_dlng]);
        }

        if (schedule_coordinates.length > 0) {
            schedule_coordinates.push([schedule_coordinates[0][0], schedule_coordinates[0][1]]);

            var schedule_path = L.polyline(schedule_coordinates, {
                color: color,
                opacity: 0.5,
                weight: 1
            }).addTo(map);

            paths.push(schedule_path);
        }
    }

    if (semesters.length > 0 && markers.length == 0 && (function() { for (k in includes) { if (includes[k] == true) return true; }})()) $('#legend h4').html('<i style="font-size: 15px;">An error appears to have occurred, please refresh the page</i>');
}

function add_marker(location, dlat, dlng, color) {
    var marker = L.circleMarker([location['lat'] + dlat, location['lng'] + dlng], {
        radius: 5,
        fillColor: color,
        fillOpacity: 0.7,
        color: 'white',
        weight: 0.3
    }).addTo(map);

    markers.push(marker);
}

function init_checkboxes() {
    var checks = $('#checks .check');

    $(checks).click(function() {
        $(this).toggleClass('on');
        update_paths();
    });

    for (var i = 0; i < checks.length; i++) {
        if ($(checks[i]).hasClass('semester')) {
            var semester = $(checks[i]).attr('id');
            $(checks[i]).css({'background-color': colors[semester]});
        } else if ($(checks[i]).hasClass('activity')) {
            $(checks[i]).css({'background-color': 'grey'});
        }

    }
}
