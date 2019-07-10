---
layout: post
title: 'Visualizing Cities with Sports Dynasties'
date: 2018-01-28 05:00:00
categories: project data visualization
thumbnail: /assets/img/post-thumbnails/sports-dynasties.gif
excerpt_separator: <!-- more -->
---

Last year, after the Pittsburgh Penguins won the Stanley Cup for the second year in a row, I was very interested in the idea of existing or emerging sports dynasties. At the time, of the four major (American) sports, the winners of three of the four league champions had also previously won in the prior two years. The Patriots won the Super Bowl in 2015 and 2017, Pittsburgh won the Stanley Cup in 2016 and 2017, and the Warriors <span id="sd-footnote-1" class="footnote">won in</span> 2015 and 2017. This seemed kind of incredible to me and at the time, I was curious if this was a common occurrence and if so, if it manifested itself in any interesting ways. I got started on some visualizations to explore this but never really got anywhere.

Fast-forward to today: the Patriots are again going back to the Super Bowl and again this question of sport dynasties has been floating around in my head. It's obvious the Patriots are in the midst of a dynasty and a sixth Super Bowl win in 17 years would just be a cherry on top. But the Patriots aren't alone - this level of excellence seems to be a trend for Boston sports in general. Since 2001, Boston has [won nine championship titles](https://www.pressherald.com/2017/01/30/tom-caron-bostons-had-nine-sports-titles-since-2001-and-patriots-look-to-make-it-10-on-sunday/), so beyond just the Patriots, it seems like Boston as a city is in the midst of a sports dynasty. So I decided to expand my original quandary and instead ask: when and where have their been other city-wide sports dynasties?

<!-- more -->

To get a lay for the land, I was first curious about the number of total championships each city had won. I knew New York and Boston would be at the top, but <span id="sd-footnote-2" class="footnote">what about everyone else</span>?

<p id="d3-sd-barchart-title">Total Championships by City (1903 - 2017)</p>
<div id="d3-sd-barchart-container">
    <svg id="d3-sd-barchart"></svg>
</div>

As expected, New York dominated, primarily driven by their World Series wins. I was pretty shocked that Montreal, with only a single team, came in third. In fact, when accounting for the number of teams per city, Canadian cities reign supreme, with Montreal and Toronto coming in first and second respectively. As a Bostonian, I do have to point out that while New York does have more championships than Boston, this is largely because of all the teams New York has. On a per team basis, Boston has 6.2 championships per team, beating out New York's measly 5.6 per team.

Yet pure number of wins doesn’t necessarily indicate dynasties. For a dynasty, it’s all about sustained excellence, but that is hard to define algorithmically; you kind of [know it when you see it](https://en.wikipedia.org/wiki/I_know_it_when_I_see_it). For my purposes, I defined a dynasty as any span when a city won five championships with no more than a year gap between wins. For example, Boston from 2002 - 2008 would be a dynasty with their three Super Bowl, 2007 World Series, and 2008 NBA championship wins. Boston has also won four championships since 2011, but because of the three year gap from 2008 to 2011, the dynasty (by my defintion) wouldn't include these four most recent wins. However, a Patriots win on Sunday would make for a new ongoing dynasty including the four wins since 2011.

So, based on that definition, when and where were there dynasties?

<p id="d3-sd-barchart-title">Championships Over Time by City (1903 - 2017)</p>
<div id="d3-sd-dotchart-container">
    <svg id="d3-sd-dotchart"></svg>
</div>

Since 1903, there have been 15 dynasties across New York (4), Boston (3), Montreal (2), San Francisco (2), Toronto (1), Minneapolis (1), Los Angeles (1), and Edmonton (1). The longest dynasty was Boston's 15 championship run from 1957 - 1976, pretty much entirely driven by Celtics during [the Bill Russell era](https://en.wikipedia.org/wiki/Boston_Celtics#1957%E2%80%931969:_The_Bill_Russell_era). The most recent dynasty is in San Francisco, which is ongoing, and given [the Warriors' performance thus far this season](https://projects.fivethirtyeight.com/2018-nba-predictions/), it's possible it may continue. As I mentioned, if the Patriots beat the Eagles, that would also make <span id="sd-footnote-3" class="footnote">another Boston dynasty</span>.

<table id="dynasties-table">
    <thead>
    <tr>
        <th>City</th><th>Dynasty</th><th>Years</th><th>Wins</th>
    </tr>
    </thead>
    <tbody>
        <tr><td>Boston, MA</td><td>1912 - 1918</td><td>7</td><td>5</td></tr>
        <tr><td>New York, NY</td><td>1936 - 1943</td><td>8</td><td>7</td></tr>
        <tr><td>Toronto, CAN</td><td>1945 - 1951</td><td>7</td><td>5</td></tr>
        <tr><td>New York, NY</td><td>1947 - 1958</td><td>12</td><td>10</td></tr>
        <tr><td>Minneapolis, MN</td><td>1949 - 1954</td><td>6</td><td>5</td></tr>
        <tr><td>Montreal, CAN</td><td>1956 - 1960</td><td>5</td><td>5</td></tr>
        <tr><td>Boston, MA</td><td>1957 - 1976</td><td>20</td><td>15</td></tr>
        <tr><td>Montreal, CAN</td><td>1965 - 1973</td><td>9</td><td>6</td></tr>
        <tr><td>San Francisco, CA</td><td>1972 - 1977</td><td>6</td><td>5</td></tr>
        <tr><td>New York, NY</td><td>1977 - 1983</td><td>7</td><td>6</td></tr>
        <tr><td>Los Angeles, CA</td><td>1980 - 1988</td><td>9</td><td>8</td></tr>
        <tr><td>Edmonton, CAN</td><td>1984 - 1990</td><td>7</td><td>5</td></tr>
        <tr><td>New York, NY</td><td>1994 - 2000</td><td>7</td><td>5</td></tr>
        <tr><td>Boston, MA</td><td>2002 - 2008</td><td>7</td><td>6</td></tr>
        <tr><td>San Francisco, CA</td><td>2010 - 2017</td><td>8</td><td>5</td></tr>
    </tbody>
</table>

What is and is not a dynasty is obviously very subjective based on any given definition, so obviously this analysis can vary. I tried to take an objective approach but as with all things in sports, it should always be a discussion.

As a bit of a post-script, I also wanted to include one of the original visualizations I made when I first started looking into sports dynasties. I was curious if there was any sort of pattern to be seen from plotting each league's champions by location. I was hoping / expecting to see some sort of cycle when championships go back and forth between a few cities. As far as I can see, no such patterns emerged, but it made a cool looking chart so I thought I'd share.

<div id="d3-sd-map-container">
    <svg id="d3-sd-map"></svg>
</div>

<link rel="stylesheet" href="/projects/sports-dynasties/css/style.css">

<script type="text/javascript" src='/projects/sports-dynasties/js/bar.js'></script>
<script type="text/javascript" src='/projects/sports-dynasties/js/dot.js'></script>
<script type="text/javascript" src='/projects/sports-dynasties/js/map.js'></script>
<script type="text/javascript" src='/projects/sports-dynasties/js/main.js'></script>

