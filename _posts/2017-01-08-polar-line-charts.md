---
layout: post
title: 'Polar Line Charts in D3'
date: 2017-01-08 15:05:41
thumbnail: /assets/img/post-thumbnails/d3-polar.gif
---

A few weeks ago, I came across [this very interesting (and very scary) visualization](http://blogs.reading.ac.uk/climate-lab-book/files/2016/05/spiral_optimized.gif){:target="_blank"} of the change in global temperatures over the last two centuries. I was particularly impressed with their choice to use a polar chart to show annual changes as opposed to the traditional chart choices.

Since [D3 and Mike Bostock](https://bost.ocks.org/mike/){:target="_blank"} have generally implemented every type of chart imaginable, I was surprised that I couldn't find anything like this sort of polar line chart that I could use for other data sets. As a result, I decided to code it up myself, which you can see below. What better data to show of the chart than the original climate data so that is what you see below.

<!-- more -->

<div id='d3-polar-container'><svg id="polar-line-chart"></svg></div>
<link rel="stylesheet" href="/projects/random-d3-fun/css/polar-line-charts.style.css" />
<script src='/projects/random-d3-fun/js/polar-line-charts.js'></script>

Now that I have the chart ready to go, I'll keep my eyes open for other data sets that might work well for this sort of radial chart, and as always, I'll post it here.
