---
layout: post
title: 'Gamifying the 2018 Olympic Games'
date: 2018-02-06 05:00:00
categories: data project sports olympics visualization
landing-description: making a fantasy sports game for the 2018 Winter Olympics
thumbnail: /assets/img/post-thumbnails/fantasy-olympics.png
excerpt_separator: <!-- more -->
---

I love the Olympics and the upcoming 2018 Games have me fired up. Following my first season in [a fantasy football league this year]({% post_url 2017-09-06-evaluating-fantasy-draft %}), I thought it would be a fun idea to try and make my own fantasy game for the Olympics. So with only a limited amount of knowledge of what makes a good fantasy game, I got to work on my own Fantasy Olympics.

One of the initial problems I foresaw with a game for the Olympics was the average person's familiarity with individual athletes. While everyone knows the big stars (Michael Phelps, Shaun White, etc.), most viewers would probably struggle to name more than a handful of individual athletes. There is the same issue with fantasy football and defenses. In fantasy football, most leagues remedy this by having fantasy players draft whole defenses instead of individual defensemen and I thought a similar scheme would be a good solution for my own Fantasy Olympics problem.

So, instead of drafting a bunch of individual athletes, Fantasy Olympics players pick from teams of athletes by nationality and sport. For example, instead of drafting individual speed skaters, you might draft the speed skating team from the Netherlands (an excellent pick, given that they won 19 total medals at the Sochi games). You would then be awarded points for any medals won by any Dutch speed skaters.

<!-- more -->

The next logical question: how many points are awarded per medal? The quickest and simplest scheme that comes to mind would be to award 3 points per gold, 2 points per silver, and 1 point per bronze. However, while simple, this scheme would offer a significant advantage to teams participating in sports with a large number of events. Using this scoring scheme, players would probably opt to pick a lower-skill alpine skiing team (with 11 total events to participate in) over an all-star hockey team (with only 2 total events to participate in). 

<div class='columns two'>
    <div class='column'>
        <p>In order correct for this, I decided to weight the scoring by how many events a particular sport has. Under my weighted scoring scheme, for each medal, a player is awarded $p = 4p_0 \frac{\sqrt[3]{x}}{x}$ points, where $x$ is the number of events in that particular sport and $p_0$ is either 3 for a gold medal, 2 for a silver medal, and 1 for a bronze medal. For example, if you had drafted the U.S. snowboarding team and Shaun White were to (does) win a gold, you would be awarded $4 * 3 * \frac{\sqrt[3]{10}}{10} = 2.6$ points, since there are 10 total snowboarding events. See below for the full medal breakdown by sport.</p>

        <p>Using this scoring scheme, we get the point distribution seen <span id="fo-chart-loc-text">on the right</span>. As a result, a team that can compete in 3 events is not hugely disadvantaged in comparison to a team that can compete in 6 events. This should (ideally) move the focus away from the number of events a team can participate in and towards the skill of a particular team.</p>
    </div>

    <div class='column'>
        {% include figure.html src="/assets/img/posts/fantasy-olympics-point-dist.png" alt="The non-weighted and weighted point distributions" width=400 %}
    </div>
</div>

<p id="fo-points-table-title">Fantasy Points Won per Medal by Sport</p>

<div id="fo-points-table-container">
    <table id="fo-points-table">
        <thead>
            <tr> <th>Sport</th> <th>Number of events</th> <th>Points per gold</th> <th>Points per silver</th> <th>Points per bronze</th> <th>Total points awarded</th> </tr> 
        </thead>
        <tbody>
            <tr> <td>Alpine Skiing</td> <td>11</td> <td>2.4</td> <td>1.6</td> <td>0.8</td> <td>53.4</td> </tr>
            <tr> <td>Biathlon</td> <td>11</td> <td>2.4</td> <td>1.6</td> <td>0.8</td> <td>53.4</td></tr>
            <tr> <td>Bobsleigh</td> <td>3</td> <td>5.8</td> <td>3.9</td> <td>1.9</td> <td>34.6</td> </tr>
            <tr> <td>Cross-Country Skiing</td> <td>12</td> <td>2.3</td> <td>1.5</td> <td>0.8</td> <td>55.0</td> </tr>
            <tr> <td>Curling</td> <td>3</td> <td>5.8</td> <td>3.9</td> <td>1.9</td> <td>34.6</td> </tr>
            <tr> <td>Freestyle Skiing</td> <td>10</td> <td>2.6</td> <td>1.7</td> <td>0.7</td> <td>51.7</td> </tr>
            <tr> <td>Figure Skating</td> <td>5</td> <td>4.1</td> <td>2.7</td> <td>1.4</td> <td>41.0</td> </tr>
            <tr> <td>Ice Hockey</td> <td>2</td> <td>7.6</td> <td>5.0</td> <td>2.5</td> <td>30.2</td> </tr>
            <tr> <td>Luge</td> <td>4</td> <td>4.8</td> <td>3.2</td> <td>1.6</td> <td>38.1</td> </tr>
            <tr> <td>Nordic Combined</td> <td>3</td> <td>5.8</td> <td>3.9</td> <td>1.9</td> <td>34.6</td> </tr>
            <tr> <td>Skeleton</td> <td>2</td> <td>7.6</td> <td>5.0</td> <td>2.5</td> <td>30.2</td> </tr>
            <tr> <td>Ski Jumping</td> <td>4</td> <td>4.8</td> <td>3.2</td> <td>1.6</td> <td>38.1</td> </tr>
            <tr> <td>Speed Skating</td> <td>14</td> <td>2.1</td> <td>1.3</td> <td>0.7</td> <td>57.8</td> </tr>
            <tr> <td>Short Track Speed Skating</td> <td>8</td> <td>3.0</td> <td>2.0</td> <td>1.0</td> <td>48.0</td> </tr>
            <tr> <td>Snowboarding</td> <td>10</td> <td>2.6</td> <td>1.7</td> <td>0.7</td> <td>51.7</td> </tr>
      </tbody>
    </table>
</div>

With these questions answered, Fantasy Olympics was ready to be played! But besides just setting the rules of the game, I was curious to see how accurate of projections I could make. Everyone's trying to come up the perfect fantasy football predictions so I thought I'd get a head start on the projection game for when Fantasy Olympics inevitably blows up.

For my projections, I went with a fairly straight forward regression based on each team's historical performances. Since there is a long gap between each of the Games, I had to consider how much historical data to include or not include in my regression. I opted to use a mean regression based on the five previous games (meaning data back to 1998 to predict the 2018 Games). This model seemed to fare best when testing against previous Games, but we shall see how it fares for these Games. See below for my full projections by country and sport.

<p id="fo-points-table-title">Projected Fantasy Points by Country and Sport</p>

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

<link rel="stylesheet" href="/projects/fantasy-olympics/css/project-2018.style.css">
<script type="text/javascript" src="/projects/fantasy-olympics/js/project-2018.js"></script>

Based on these 182 total projections, the top five picks would be the German Luge team (16.14 points), the Dutch Speed Skating team (15.89 points), the Canadian Ice Hockey teams (13.41 points), the Norwegian Cross-Country Skiing team (13.08 points), and the Korean Short Track Speed Skating team (12.64 points). Based purely on my knowledge from past Olympics, these projections seem fairly accurate, which is a good sign. The Dutch speed skaters crushed in Sochi, Germany is [always a top luge contender](https://www.usatoday.com/story/sports/olympics/2018/01/10/germany-again-will-be-the-team-to-catch-in-olympic-luge/109334518/){:target="_new"}, and, I mean, [it's](https://www.youtube.com/watch?v=allADNXAAMA){:target="_new"} [Canada](https://www.youtube.com/watch?v=G7DeQbTzPE8){:target="_new"} [and](https://www.youtube.com/watch?v=NqBHav5puKA){:target="_new"} [hockey](https://www.youtube.com/watch?v=MB-5_bgqRZU){:target="_new"}.

The United States is the top overall projected country, but we shall see if that proves to be correct. Sochi was a bit of a disappointment for the U.S. team, coming in fourth for overall medals, though Vancouver was a bit better. Let's hope they can pull it out in South Korea.

Regardless of who wins and how accurate these projections end up being, I'm excited to watch two weeks of the best in sport. But also, go USA!


