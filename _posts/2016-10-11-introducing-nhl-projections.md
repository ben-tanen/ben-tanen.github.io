---
layout: post
title: Introducing 2016-17 NHL Projections
date: '2016-10-11 12:00:00'
thumbnail: /assets/img/post-thumbnails/introducing-nhl-projections-d6e8401c.gif
---

Last year as the 2015-16 NHL season came to a close, I built a fairly simplistic MATLAB model in an effort to (hopefully accurately) simulate the season. The model was built to take in some amount of past game data and use this to predict game-by-game performances over the entire season, resulting in season-long performances for each team. If you're interested, you can read [the original model report](/projects/nhl-projections/files/NHL_Projections-Full_Report.pdf) as well as check out [the code](https://github.com/ben-tanen/nhl-playoff-projections/).

Originally, this model was to be used in the early Spring (March / April 2016) simply to predict the last month or so of the 2015-16 regular season, but the model appeared to work fairly well going as far back as the first weeks of the season. Given this, I decided I would put my model to the test with the new 2016-17 NHL season (starting tomorrow!).

{% include figure.html src="/assets/img/posts/introducing-nhl-projections-b85930bb.png" alt="The initial projections for VAN, NYR, and WSH" autolink="yes" width="650px" %}

So, over the course of the next few months, I'll be comparing each team's expected performance (as speculated by the model) to their actual performance. I'll also be tweaking the model and using it to run other predictions and analyses, just to see what I can come up with. For more on the project, as well as the most up-to-date projections, check out [the new project site here](/projects/nhl-projections/).

For a little sneak peak, to start off the season, the model is only working with game data from the 2015-16 season and the handful of pre-season games so I don't have the highest expectations for these predictions. See below for the top 8 projected teams, all of who (with the exception of Boston) made the playoffs last season.

<table>
    <thead>
        <tr>
            <th></th>
            <th width="50px">Team</th>
            <th width="150px">Projected Points (2016-17)</th>
            <th width="100px">Actual Points (2015-16)</th>
        </tr>
    </thead>
    <tbody>
    {% for team in site.data.nhl-projects-sample-2016 %}
        <tr>
            <td><img class="nhl-projection-tbl-logo" src="https://a.espncdn.com/i/teamlogos/nhl/500/{{ team.photo_name }}.png"></td>
            <td>{{ team.name }}</td>
            <td>{{ team.projected_pts }}</td>
            <td>{{ team.actual_pts }}</td>
        </tr>
    {% endfor %}
</tbody>
</table>
<style>
    img.nhl-projection-tbl-logo {
        width: 30px; 
        padding-bottom: 8px; 
        padding-left: 7px; 
        padding-top: 7px; 
        margin: auto; 
        vertical-align: center;
    } 
</style>

Here's to an exciting 2016-17 season and [#LGR](https://twitter.com/search?q=lgr)!
