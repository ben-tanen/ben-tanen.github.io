---
layout: post
title:  "Where Is Election Night 2020 Heading?"
date:   2020-08-24 10:05:41
categories: project data visualization politics election 2020
show-on-landing: true
landing-description: the many paths Election Night 2020 could have taken
thumbnail: /assets/img/post-thumbnails/election-funnel2.png
---

[Nate Silver Twitter thread about 100 scenarios](https://twitter.com/natesilver538/status/1300825856072454145)

[McSweeny's "Swear It's Changed"](https://www.mcsweeneys.net/articles/im-back-in-a-relationship-with-fivethirtyeights-elections-forecast-model-but-this-time-i-swear-hes-changed)

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<div id="elfun2020-container">
    <div id="elfun2020-loading">
        <img id="loading-spinner" src='/assets/img/loading.gif' />
    </div>
    <div class="columns two" id="elfun2020-title">
        <div class="column" style="width: calc(75% - 15px);">
            <h3><b>Contests called:</b> <span id="states-called">...</span> of 56</h3>
            <h3><b>Scenarios remaining:</b> <span id="scenarios-remaining">...</span> of 100</h3>
            <h3><b>EV range remaining:</b> <span style="color: #77bdee">Biden <span id="ev-range-biden">...</span></span>, <span style="color: #ff6e6c">Trump <span id="ev-range-trump">...</span></span></h3>
            <p style="margin-top: 5px"><i>Last updated: <span id="update-datetime">...</span></i></p>
        </div>
        <div class="column" style="width: calc(25% - 5px);">
            <ul id="elfun2020-view-select">
                <li class="selected">Full view</li>
                <li id="compact">Compact view</li>
            </ul>
        </div>
    </div>
    <div id="elfun2020-viz">
        <svg id="elfun2020-svg"></svg>
    </div>
</div>

<link rel="stylesheet" href="/projects/election-night2020-funnel/css/main.style.css" />
<script src="https://d3js.org/d3-time-format.v2.min.js"></script>
<script src='/projects/election-night2020-funnel/js/main.js'></script>


