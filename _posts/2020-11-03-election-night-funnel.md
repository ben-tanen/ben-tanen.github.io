---
layout: post
title:  "Where Is Election Night 2020 Heading?"
date:   2020-11-03 10:05:41
thumbnail: /assets/img/post-thumbnails/election-funnel2.png
landing-proj:  true
landing-order: 13
landing-img:   /assets/img/proj-thumbnails/election-night-funnel.png
landing-large: false
new-post-style: true
---

Well, today is the day! After weeks of voting (and [weeks of challenges](https://www.axios.com/texas-harris-county-drive-thru-voting-5a874c81-b927-48e7-8dcb-3bc1d5d76f6b.html) [to how](https://www.cnn.com/2020/10/26/politics/wisconsin-mail-in-voting-deadline-supreme-court/index.html) [people can vote](https://www.reuters.com/article/us-usa-election-court-pennsylvania/u-s-supreme-court-deals-blow-to-republicans-in-pennsylvania-north-carolina-vote-by-mail-fights-idUSKBN27D37H)), we have finally arrived at the beginning of the end. As of writing this, polls on the East Coast are beginning to close and shortly after, we will start getting calls from various states about winners and losers. 

As of right now, most election forecasts very much favor Biden to beat Trump (FiveThirtyEight froze [their model](https://projects.fivethirtyeight.com/2020-election-forecast/) at 89% for Biden), but who knows if these models will be right! Heading into Election Night 2016, it seemed like Clinton had it on lock based on the models, but we all know how that turned out. Many folks started Novemeber 8, 2016 feeling excited and then over the course of the night, the realization crept in that Clinton was not actually going to win. And, speaking personally, when that realization hits you, it hits you like a ton of bricks.

As a means of preparing for said ton of bricks again, I decided to make a visualization to see how closely FiveThirtyEight's model was able to predict reality. Their forecast highlights {% include footnote-body.html id="footnote-1" content="<a href='https://twitter.com/natesilver538/status/1300825856072454145'>100 possible scenarios</a>" %} that they believe are possible. Each scenario will be a little different (some will have Texas going blue, some will have Trump winning Pennsylvania, etc.) and as the calls come in throughout the night (week? month?), we will be able to see how many of those scenarios are actually holding up. The thing to watch for will be the percent of scenarios that are still viable at any given point. So if after a majority of states are called and a majority of FiveThirtyEight's scenarios remain possible, we might say that things are going okay for their model. But if we reach a point where basically all of their scenarios are no longer viable, we might say things are going off the rails, though that doesn't necessarily mean we are heading towards a Trump or Biden win, just an "unpredicted reality."

{% include footnote-script.html id="footnote-1" content="It is worth noting that these 100 scenarios are not necessarily the 100 most likely scenarios. In fact, FiveThirtyEight hasn't explicitly mentioned how they choose the 100 scenarios shown on the site, though Nate Silver briefly discusses it in this Twitter thread." %}

Let's see how this all goes! It is very unlikely that we'll know much on Election Day, but again, who knows. I'll try and keep this updated throughout the whole process and we can prepare for an incoming ton of bricks together. I'm also planning on tweeting any significant updates so keep an eye out for stuff [over there](https://twitter.com/ben_tanen/). Though, to be frank, I'm really hoping there are no big updates or surprises... I would really like to say that [I have learned to trust FiveThirtyEight and polls again.](https://www.mcsweeneys.net/articles/im-back-in-a-relationship-with-fivethirtyeights-elections-forecast-model-but-this-time-i-swear-hes-changed)

*Update: see [this Twitter thread](https://twitter.com/ben_tanen/status/1323788861340700672) for my live analysis as the Election unfolded.*

{% include section-break.html %}

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

{% capture methodology-note %}
State calls come from <a href="https://twitter.com/AP_Politics">the Associated Press</a>, including when the calls are made, and are ordered by time of the call. These calls are compared against the 100 scenarios that FiveThirtyEight has highlighted on <a href="https://projects.fivethirtyeight.com/2020-election-forecast/">its (now frozen) Presidential Election Forecast</a> and each scenario is marked as viable if it includes the same state-by-state calls as the AP. Electoral vote ranges are calculated based on the remaining viable scenarios.
{% endcapture %}
{% include methodology-note.html content=methodology-note break='yes' %}

<link rel="stylesheet" href="/projects/election-night2020-funnel/css/main.style.css" />
<script src="https://d3js.org/d3-time-format.v2.min.js"></script>
<script src='/projects/election-night2020-funnel/js/main.js'></script>


