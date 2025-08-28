---
layout: post
title: 'Understanding the Kirkpatrick-Seidel Algorithm'
date: 2017-01-02 15:05:41
thumbnail: /assets/img/post-thumbnails/ultimate-ch.gif
landing-proj:  true
landing-order: 22
landing-img:   /assets/img/posts/ultimate_ch.png
landing-large: false
---

After [posting the final project]({% post_url 2016-12-21-drunken-world %}){:target="_blank"} for my visualization course, I thought I'd share the final project for my computational geometry class as well. The course was an extended algorithms class focused on different multi-dimensional geometric problems. One of the main problems of the course deals with finding the [convex hull](https://en.wikipedia.org/wiki/Convex_hull){:target="_blank"} of a set of points. There are [a number ways](https://www.youtube.com/watch?v=ZnTiWcIznEQ){:target="_blank"} to tackle the problem but one of the best approaches is the Kirkpatrick-Seidel Ultimate Planar Convex Hull Algorithm. In order to help teach the algorithm, I made [a visualization tool](/ultimate-convex-hull/){:target="_blank"} to walk-through the steps.

{% include figure.html autolink="yes" src="/assets/img/posts/ultimate_ch.png" alt="A screenshot of the visualization" width='600px' %}

The algorithm is a bit on the complicated side but I hope that this offers some help in figuring out what exactly goes into it. While the walk-through is complete, I plan on adding a bit more detail to explain the algorithmic time complexity that allows it to work in ***O(n log n)*** time so keep an eye out for that.

Feel free to check it out and let me know what you think. If anything seems confusing, unclear, or (heaven forbid) incorrect, feel free to shoot me a message. Also, if you are interested, you can find the code for the visualization [here on GitHub](https://github.com/ben-tanen/ultimate-convex-hull/).




