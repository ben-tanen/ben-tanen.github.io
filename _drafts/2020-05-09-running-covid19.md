---
layout: post
title:  "Running During A Pandemic"
date:   2020-05-09 08:05:41
categories: project data visualization running covid19 strava
show-on-landing: false
landing-description: the increased popularity of running during the COVID-19 pandemic
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus odio dolor nam. Non accusamus odit alias vero adipisci nostrum recusandae, quam quibusdam sed dicta tenetur optio, reprehenderit cum nam soluta!

<script src="/projects/running-covid19/js/mapbox-polyline.bundle.js"></script>

<script src='https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js'></script>
<link href='https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.css' rel='stylesheet' />

<div id='map' style='width: 100%; height: 500px;'></div>
<script>

let city = "Boston, MA",
    city_pos = {
        "New York, NY": [-74.005974, 40.712776],
        "San Francisco, CA": [-122.419418, 37.774929],
        "Boston, MA": [-71.058884, 42.360081]
    }

mapboxgl.accessToken = 'pk.eyJ1IjoiYnRhbmVuIiwiYSI6ImNrYWVnajN2NTAwYWEzNG83aXQ0bGliYTkifQ.2DrlmefSt_1M3V_Hzn-H2Q';

let map = new mapboxgl.Map({
    'container': 'map',
    'center': city_pos[city],
    'zoom': 10,
    'style': 'mapbox://styles/btanen/ckaeh3eeb10f31iqj63wkan5i'
});


d3.csv("/projects/running-covid19/data/running-segments.csv", (d) => {
    d.year_entries = +d.year_entries;
    d.month_entries = +d.month_entries;
    d.week_entries = +d.week_entries;
    return d;
}, (e, d) => {
    if (e) throw e;

    // re-format data  
    let d_format = d.filter(r => r.city === city).map(r => {
        return {
            'type': 'Feature',
            'properties': {
                'name': r.segment_id,
                'change': (r.month_entries - (r.year_entries / 12)) / (r.year_entries / 12)
            },
            'geometry': polyline.toGeoJSON(r.polyline)
        }
    });
    
    map.on('load', function() {
        map.addSource('routes', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': d_format
            }
        });

        map.addLayer({
            'id': 'routes',
            'type': 'line',
            'source': 'routes',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': {
                    'property': 'change',
                    'stops': [
                        [-1, '#b2182b'],
                        [ 0, '#f7f7f7'],
                        [ 1, '#2166ac']
                    ]
                },
                'line-width': 8
            }
        });

        map.on('click', 'routes', function(e) {
            var coordinates = e.features[0].geometry.coordinates[Math.floor(e.features[0].geometry.coordinates.length / 2)];
            var content = e.features[0].properties.name;
             
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
             
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(content)
                .addTo(map);
        });
         
        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'routes', function() {
            map.getCanvas().style.cursor = 'pointer';
        });
         
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'routes', function() {
            map.getCanvas().style.cursor = '';
        });
    });
});

</script>



