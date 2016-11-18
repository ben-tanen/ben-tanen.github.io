var map;
var markers = [ ];
var paths   = [ ];
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
    "F15": "#ff4cc8", // green
    "S16": "#FF6E6C", // orange-red
    "F16": "#23CE6B", // magenta
};

function init_map() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: init_lat, lng: init_lng},
        zoom: 16,
        disableDefaultUI: true,
        styles: [{"featureType":"all","elementType":"geometry.fill","stylers":[{"color":"#323232"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"color":"#4e4e4e"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.country","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":"-100"},{"lightness":"30"}]},{"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"gamma":"0.00"},{"lightness":"74"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"3"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
    });

    map.controls[google.maps.ControlPosition.LEFT_TOP].push($('#legend')[0]);

    draw_paths(get_checked_semesters());

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
    for (var i = 0; i < markers.length; i++) markers[i].setMap(null);
    for (var i = 0; i < paths.length; i++) paths[i].setMap(null);
    markers = [ ];
    paths = [ ];


    // update includes
    var boxes = $(".check.activity");
    for (var i = 0; i < boxes.length; i++) {
        if ($(boxes[i]).hasClass('on')) includes[$(boxes[i]).attr('id')] = true;
        else includes[$(boxes[i]).attr('id')] = false;
    }

    draw_paths(get_checked_semesters());
}

function draw_paths(semesters) {
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
            schedule_coordinates.push({"lat": location["lat"] + rnd_dlat, "lng": location["lng"] + rnd_dlng});
        }

        if (schedule_coordinates.length > 0) {
            schedule_coordinates.push({"lat": schedule_coordinates[0]["lat"], "lng": schedule_coordinates[0]["lng"]});
        
            schedule_path = new google.maps.Polyline({
                path: schedule_coordinates,
                geodesic: true,
                strokeColor: color,
                strokeOpacity: 0.5,
                strokeWeight: 1
            });

            schedule_path.setMap(map);

            paths.push(schedule_path);
        }
    }

    if (semesters.length > 0 && markers.length == 0) $('#legend h4').html('<i style="font-size: 15px;">An error appears to have occurred, please refresh the page</i>');
}

function add_marker(location, dlat, dlng, color) {
    var latlng = new google.maps.LatLng(location['lat'] + dlat, location['lng'] + dlng);

    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: .7,
            scale: 5,
            strokeColor: 'white',
            strokeWeight: .3
        },
    });

    markers.push(marker);

    marker.addListener('mouseover', function() {
        $('#legend h4').html('<i style="font-size: 15px;">' + location['name'] + '</i><br />' + location['description']);
    });

    marker.addListener('mouseout', function() {
        $('#legend h4').html('');
    })


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