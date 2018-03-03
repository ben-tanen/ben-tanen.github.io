---
layout: post
title: 'Gamifying the 2018 Olympic Games'
date: 2018-02-01 05:00:00
categories: data project sports olympics visualization hidden
landing-description: making a fantasy sports game for the 2018 Winter Olympics
thumbnail: /assets/img/post-thumbnails/fantasy-olympics.png
excerpt_separator: <!-- more -->
---

I love the Olympics. ... 

I had a lot of fun [playing in a fantasy football league this year]({% post_url 2017-09-06-evaluating-fantasy-draft %}).

One of the initial problems I foresaw with a fantasy game for the Olympics was the average person's familiarity with individual athletes. While everyone know the big stars (Michael Phelps, Shaun White, etc.), most viewers would probably struggle to name more than a handful of individual athletes. There is the same issue with fantasy football and defenses. In fantasy football, most leagues remedy this by having fantasy players draft whole defenses instead of individual defensemen and I thought a similar scheme would be a good solution for my own fantasy Olympics problem.

<!-- more -->

So, instead of drafting a bunch of individual athletes, players pick from teams of athletes by nationality and sport. For example, instead of drafting individual speed skaters, you might draft the speed skating team from the Netherlands (an excellent pick, given that they won 19 total medals at the Sochi games). You would then be awarded points for any medals won by any Dutch speed skaters.

The next logical question: how many points are awarded per medal? The quickest and simplest scheme that comes to mind would be to award 3 points per gold, 2 points per silver, and 1 point per bronze. However, while simple, this scheme would offer a significant advantage to teams participating in sports with a large number of events. Using this scoring scheme, players would opt to pick a lower-skill speed alpine skiing team (with 11 total events to participate in) over an all-star hockey team (with only 2 total events to participate in). 



<div class='columns two'>
    <div class='column'>
        <p>In order correct for this, I decided to weight the scoring by how many events a particular sport has. Under my weighted scoring scheme, for each medal, a player is awarded $p = 4p_0 \frac{\sqrt[3]{x}}{x}$ points, where $x$ is the number of events in that particular sport and $p_0$ is either 3 for a gold medal, 2 for a silver medal, and 1 for a bronze medal. For example, if you had drafted the U.S. snowboarding team and Shaun White were to (does) win a gold, you would be awareded $4 * 3 * \frac{\sqrt[3]{10}}{10} = 2.6$ points, since there are 10 total snowboarding events. See below for the full medal breakdown by sport.</p>

        <p>Using this scoring scheme, we get the point distribution seen on the right. As a result, a team that can compete in 3 events is not hugely disadvantaged in comparison to a team that can compete in 6 events. This should (ideally) move the focus away from the number of events a team can participate in and towards the skill of a particular team.</p>
    </div>

    <div class='column'>
        {% include figure.html src="/assets/img/posts/fantasy-olympics-point-dist.png" alt="A quick remake of the Confederate statue graphic" width=550 %}
    </div>
</div>

|Sport | Number of events | Points per gold | Points per silver | Points per bronze | Total points awarded |
|------|------------------|-----------------|-------------------|-------------------|----------------------|
| Biathlon                  | 11 | 2.4 | 1.6 | 0.8 | 53.4 |
| Bobsleigh                 | 3  | 5.8 | 3.9 | 1.9 | 34.6 |
| Skeleton                  | 2  | 7.6 | 5.0 | 2.5 | 30.2 |
| Curling                   | 3  | 5.8 | 3.9 | 1.9 | 34.6 |
| Ice Hockey                | 2  | 7.6 | 5.0 | 2.5 | 30.2 |
| Luge                      | 4  | 4.8 | 3.2 | 1.6 | 38.1 |
| Speed Skating             | 14 | 2.1 | 1.3 | 0.7 | 57.8 |
| Short Track Speed Skating | 8  | 3.0 | 2.0 | 1.0 | 48.0 |
| Figure Skating            | 5  | 4.1 | 2.7 | 1.4 | 41.0 |
| Cross-Country Skiing      | 12 | 2.3 | 1.5 | 0.8 | 55.0 |
| Ski Jumping               | 4  | 4.8 | 3.2 | 1.6 | 38.1 |
| Nordic Combined           | 3  | 5.8 | 3.9 | 1.9 | 34.6 |
| Alpine Skiing             | 11 | 2.4 | 1.6 | 0.8 | 53.4 |
| Freestyle Skiing          | 10 | 2.6 | 1.7 | 0.7 | 51.7 |
| Snowboard                 | 10 | 2.6 | 1.7 | 0.7 | 51.7 |


TODO:

<!-- more -->

- add tooltip information on what team, what sport, country's history at event
- add table to explain medal breakdown
- write up
- figure out how to lock header on prediction table

<div id="fo-prediction-table-container-container">
<div id="fo-prediction-table-container">
    <table id="fo-prediction-table">
        <thead>
        <tr>
            <th width="80px">Country</th>
            <th>Alpine Skiing</th>
            <th>Biathlon</th>
            <th>Bobsleigh</th>
            <th>Cross-Country Skiing</th>
            <th>Curling</th>
            <th>Figure Skating</th>
            <th>Freestyle Skiing</th>
            <th>Ice Hockey</th>
            <th>Luge</th>
            <th>Nordic Combined</th>
            <th>Skeleton</th>
            <th>Ski Jumping</th>
            <th>Snowboard</th>
            <th>Speed Skating</th>
            <th>Short Track Speed Skating</th>
            <th>Total</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
<p id="scroll-hint1">&larr; Scroll &rarr;</p>
<p id="scroll-hint2">&larr; Scroll &rarr;</p>
<div id="jbox-content-grab" style="display: none;">
    <h2 style="font-size: 15px; color: #77bdee;"><span id="jbox-content-team">United States</span>, <span id="jbox-content-sport">Speed Skating</span></h2>
    <p><b>Historical performance (1998 - 2014):</b></p>
    <ul id="jbox-content-history">
    </ul>
</div>
</div>

top results:

- Germany, Luge
- Netherlands, Speed Skating
- Canada, Freestyle Skiing
- Norway, Curling
- Korea, Skeleton
- Austria, Alpine Skiing

<link rel="stylesheet" href="/projects/fantasy-olympics/css/style.css">
<script type="text/javascript" src="/projects/fantasy-olympics/js/main.js"></script>

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


