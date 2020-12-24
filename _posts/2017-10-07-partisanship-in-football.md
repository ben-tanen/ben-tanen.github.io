---
layout: post
title: 'Partisanship and the NFL'
date: 2017-10-07 05:00:00
thumbnail: /assets/img/post-thumbnails/partisan-nfl.png
landing-proj:  true
landing-order: 1
landing-img:   /assets/img/posts/redistricting-sankey-vert.png
landing-large: false
---

A few weeks ago, FiveThirtyEight published [an article](https://fivethirtyeight.com/features/how-every-nfl-teams-fans-lean-politically/) analyzing the political leaning of each NFL team based on results from a poll of 2,290 football fans. They then compared each team's political leaning to the political leaning of the media market that said team covered (ex: Miami Dolphins' market makes up the southern tip of Florida). Reading this article reminded me of [a map from the Facebook Data Science team](https://www.theatlantic.com/technology/archive/2014/09/the-geography-of-nfl-fandom/379729/) that broke down the football fandoms of each county in the United States. For this map, the Facebook team determined each county's top team by seeing which team was the most "liked" among Facebook users from that county. 

Inspired by FiveThirtyEight's piece, I figured that using this map from Facebook and the actual voting results from the 2016 Presidential Election, it might be possible to re-create an analysis similar to FiveThirtyEight's, but with a twist. Instead of using survey results from 2,290 fans, I would be calculating leanings using county-by-county fandom and voting results. The first step was to recreate the Facebook team's map so that each county's voting record could be lined up with their preferred team, which you can see below. You can also click on the map to see it in higher resolution.

<div id='d3-nfl-map-container'>
    <a href="/projects/fivethirtyeight-partisan-nfl/">
    <svg id="d3-nfl-map"></svg>
    </a>
</div>
<link rel="stylesheet" href="/projects/fivethirtyeight-partisan-nfl/css/map.style.css">
<link rel="stylesheet" href="/projects/fivethirtyeight-partisan-nfl/css/small-map.style.css">
<script type="text/javascript" src="/projects/fivethirtyeight-partisan-nfl/js/map.js"></script>

<!-- more -->

This mapping then naturally leads to a proxy of how each team's fans voted in the 2016 Presidential Election. By tallying up the votes cast in each county and aggregating them based on a preferred NFL team, we get a vote share and therefore political lean for each of the 32 NFL teams, which can be broken down based on the number of votes cast or the total population of each county.

<div id='d3-nfl-bar-container'>
    <svg id="d3-nfl-bar"></svg>
    <div id="d3-nfl-bar-buttons">
        <button type="button" id="Vote" class="selected">Votes Cast</button>
        <button type="button" id="Total">Total Population</button>
    </div>
</div>
<link rel="stylesheet" href="/projects/fivethirtyeight-partisan-nfl/css/bar.style.css">
<script type="text/javascript" src="/projects/fivethirtyeight-partisan-nfl/js/bar.js"></script>

Based on this calculation of political leaning, the top five most Democratic teams are the Raiders, the 49ers, the Redskins, the Patriots, and the Giants (or the Eagles, depending on if you look at votes cast or total population). On the other end of the political spectrum, the Titans, the Bengals, the Chiefs, the Colts, and the Saints (or the Jaguars) made up the five most Republican teams.

When comparing these results to FiveThirtyEight's, there do however seem to be some notable differences. FiveThirtyEight categorized five (Raiders, 49ers, Redskins, Giants, Eagles) of our top six Democratic teams as having a more Democratic fan base and similarly categorized five (Titans, Bengals, Chiefs, Colts, Jaguars) of our top six Republican teams as have more Republican fan bases, so we at least got those right. However, the scale of these teams' partisan lean changes quite a bit between analyses. For example, in our analysis, we found that Saints fans had a partisan lean of <span style="color: rgb(239, 64, 86)">R+10.02</span> (when using total population), while FiveThirtyEight found them to have a <span style="color: rgb(91, 155, 213)">D+12.2</span>.

<!-- 
<div id='d3-nfl-compare-container'>
    <svg id="d3-nfl-compare"></svg>
</div>
<link rel="stylesheet" href="/projects/fivethirtyeight-partisan-nfl/css/compare.style.css">
<script type="text/javascript" src="/projects/fivethirtyeight-partisan-nfl/js/compare.js"></script> 
 -->

These varying results are primarily due to clear differences in methodology between these analyses. While our approach uses results from all counties (in comparison to FiveThirtyEight focusing on each teams' relevant TV market), by connecting each county's preferred team (at least according to Facebook) to their 2016 voting results, we were imposing more of a direct connection between these data points than might actually exist. As Paine, Enten, and Jones-Rooy point out in their piece, "not every person in a team's market actually is a fan of football." As a result, FiveThirtyEight's primary approach was instead based on the survey results of actual fans, allowing them to much more clearly tie a person's preferred team to their political leaning (since they were literally asked about it in the survey).

An example of where this difference in approach manifests itself is for the Patriots and their fan base. Based on our county-by-county fandom map, Maine, Vermont, New Hampshire, Massachusetts (duh), and most of Connecticut are all made up of mostly Patriots fans, and in 2016, [all five of these states](https://www.nytimes.com/elections/results/president) went in favor of Clinton. However, while Massachusetts, Vermont, and Connecticut are fairly blue states, Patriots fans from New Hampshire and Maine (and [other pockets of the U.S.](https://fivethirtyeight.com/features/who-hates-the-patriots-the-most/)) may tend to lean quite a bit more conservative and yet may not necessarily be represented as overwhelmingly as their more populated counterparts.

Overall, in a direct comparison, I think FiveThirtyEight's approach is a bit more sound and likely is a more direct reflection of NFL fans' partisan lean. However, while our specific results may vary, our overall trends and takeaways remain consistent. While some teams do tend to favor one political party more than the other, no single team is entirely made up of Democrats or Republicans. Given this mixed political representation, it is interesting to consider and observe how a team's fan base may respond to various [political](https://en.wikipedia.org/wiki/Washington_Redskins_name_controversy) [controversies](https://en.wikipedia.org/wiki/U.S._national_anthem_protests_(2016%E2%80%93present)) and how that response may vary from the nationwide response. Above all though, it's encouraging to think that, at least for now, we can't separate or divide NFL teams into red teams and blue teams, at least as long as we're talking about political leaning and not jersey colors.



