---
layout: post
title: 'Visualizing Cities with Sports Dynasties'
date: 2018-01-28 05:00:00
categories: project data visualization hidden
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

As expected, New York dominated, primarily driven by their World Series wins. I was pretty shocked that Montreal, with only a single team, came in third. In fact, when accounting for the number of teams per city, Canadian teams reign supreme, with Montreal and Toronto coming in first and second respectively. As a Bostonian, I do have to point out that while New York does have more championships than Boston, this is largely because of all the teams New York has. On a per team basis, Boston has 6.2 championships per team, beating out New York's measly 5.6 per team.

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita fuga neque ipsa voluptas ullam quam impedit provident deserunt doloremque repellendus veritatis soluta, nulla nesciunt nostrum consectetur, eaque iure, aspernatur earum.

<p id="d3-sd-barchart-title">Championships Over Time by City (1903 - 2017)</p>
<div id="d3-sd-dotchart-container">
    <svg id="d3-sd-dotchart"></svg>
</div>

<table id="dynasties-table">
    <thead>
    <tr>
        <th>City</th><th>Dynasty</th><th>Years</th><th>Wins</th>
    </tr>
    </thead>
    <tbody>
        <tr><td>Boston, MA</td><td>1912 - 1918</td><td>7</td><td>5</td></tr>
        <tr><td>Boston, MA</td><td>1957 - 1976</td><td></td><td>15 wins</td></tr>
        <tr><td>Boston, MA</td><td>2002 - 2008</td><td></td><td>6 wins</td></tr>
        <tr><td>New York, NY</td><td>1936 - 1943</td><td></td><td>7 wins</td></tr>
        <tr><td>New York, NY</td><td>1947 - 1958</td><td></td><td>10 wins</td></tr>
        <tr><td>New York, NY</td><td>1977 - 1983</td><td></td><td>6 wins</td></tr>
        <tr><td>New York, NY</td><td>1994 - 2000</td><td></td><td>5 wins</td></tr>
        <tr><td>Montreal, CAN</td><td>1956 - 1960</td><td></td><td>5 wins</td></tr>
    </tbody>
</table>

- Boston, MA 1912-1918, 5 wins

- Montreal, CAN 1965-1973, 6 wins
- Toronto, CAN 1945-1951, 5 wins
- Minneapolis, MN 1949-1954, 5 wins
- Los Angeles, CA 1980-1988, 8 wins
- San Francisco, CA 1972-1977, 5 wins
- San Francisco, CA 2010-2017, 5 wins
- Edmonton, CAN 1984-1990, 5 wins

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem voluptates, minus commodi harum sit. Numquam reprehenderit qui eveniet, ea praesentium at voluptate doloremque quia temporibus! Molestiae pariatur, sapiente quo inventore!

<div id="d3-sd-map-container">
    <svg id="d3-sd-map"></svg>
</div>

<link rel="stylesheet" href="/projects/sports-dynasties/css/style.css">

<script type="text/javascript" src='/projects/sports-dynasties/js/main.js'></script>
<script type="text/javascript" src='/projects/sports-dynasties/js/bar.js'></script>
<script type="text/javascript" src='/projects/sports-dynasties/js/dot.js'></script>
<script type="text/javascript" src='/projects/sports-dynasties/js/map.js'></script>

