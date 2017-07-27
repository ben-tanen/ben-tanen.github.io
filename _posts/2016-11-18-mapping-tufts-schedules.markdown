---
layout: post
title: 'Mapping My Life at Tufts'
date: 2016-11-18 15:05:41
categories: project data tufts school visualization
thumbnail: /assets/img/post-thumbnails/tufts-map.png
---

Over the last view years, my schedules have varied quite a bit and it has caused me to inhabit certain areas of campus on a weekly basis. As my classes became more specialized, I realized I was spending most of my time between three or four main locations. Wanting to confirm my suspicion, I decided to map out and visualize each of my schedules from semester to semester, which you can see below.

It seems like my suspicion was true - I've become a little hermit holed up at my home, the CS department (my second home), or at 574 Boston Ave. Maybe I should explore some more...

<!-- css and javascript includes -->
<link rel="stylesheet" href="/projects/schedule-map/css/style.css">
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDYYbQJxmT3xqIdpkDwtHi8TyyJPtncbE4" type="text/javascript"></script>
<script src="/projects/schedule-map/js/data.js"></script>
<script src="/projects/schedule-map/js/map.js"></script>

<div id="map-wrapper">
    <div id="map"></div>
    <div id="legend"><h4></h4></div>
</div>

<div id="checks">
    <h4 style='margin-top: 10px; margin-bottom: 5px;'>Choose which data to include:</h4>

    <div id="semester-checks">
        <div class="check semester on" id="F13">
            <p>F13</p>
        </div>

        <div class="check semester" id="S14">
            <p>S14</p>
        </div>

        <div class="check semester on" id="F14">
            <p>F14</p>
        </div>

        <div class="check semester" id="S15">
            <p>S15</p>
        </div>

        <div class="check semester" id="F15">
            <p>F15</p>
        </div>

        <div class="check semester on" id="S16">
            <p>S16</p>
        </div>

        <div class="check semester" id="F16">
            <p>F16</p>
        </div>

        <div class="check semester on" id="S17">
            <p>S17</p>
        </div>
    </div>

    <div id="activity-checks">
        <div class="check activity" id="Athletics">
            <p>Athletics</p>
        </div>

        <div class="check activity" id="Clubs">
            <p>Clubs</p>
        </div>

        <div class="check activity on" id="Food">
            <p>Food</p>
        </div>

        <div class="check activity on" id="Home">
            <p>Home</p>
        </div>

        <div class="check activity on" id="School">
            <p>School</p>
        </div>

        <div class="check activity" id="Work">
            <p>Work</p>
        </div>
    </div>
</div>
