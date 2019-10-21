---
layout: post
title:  "Training for a Half Marathon, Visualized"
date:   2019-09-27 15:05:41
categories: project data running hidden
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error qui debitis accusantium, quaerat sed consectetur odit quasi facere animi modi molestias nostrum tenetur dolor officiis commodi corporis, laudantium natus asperiores.

<style>
</style>

<script>
d3.csv("/assets/data/running-data-20190925.csv", d => {
    d.avg_pace_min = +d.avg_pace_min;
    d.mile = +d.mile;
    d.pace_min = +d.pace_min;
    d.total_dist = +d.total_dist;
    d.total_time_min = +d.total_time_min;
    return d;
}, (e, d) => {
    console.table(d);
});
</script>


