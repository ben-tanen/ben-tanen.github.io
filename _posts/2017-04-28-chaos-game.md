---
layout: post
title: 'The Chaos Game'
date: 2017-04-28 15:05:41
thumbnail: /assets/img/post-thumbnails/chaos-game.gif
---

After watching [this recent video from Numberphile](https://www.youtube.com/watch?v=kbKtFN71Lfs), I decided to throw together my own little visualizer of [the chaos game](https://en.wikipedia.org/wiki/Chaos_game).

To briefly explain the game, we basically start by randomly placing some "bases" on our board and a single starting point that is within those bases. We then randomly select one of our bases and move our point half way closer to our chosen base. We can repeat this operation endlessly, or until something starts to form. The cool part of this game is what forms when we mark our moves. Our seemingly random behavior actually begins to form a [fractal](https://en.wikipedia.org/wiki/Fractal)!

<!-- more -->

{% include_file /projects/random-d3-fun/html/chaos-game-viz.html %}
<link rel="stylesheet" href="/projects/random-d3-fun/css/chaos-game.style.css" />
<script src='/projects/random-d3-fun/js/chaos-game.js'></script>

I always enjoy funky little phenomena like this so I decided to make my own representation of it in D3. I also decided to include colors for each of the bases and then colored each new point based on which base it was moving closer to. I found it interesting that the colors become so strongly clustered immediately.

I'm in the works of implementing it for four, five, etc. bases, but for now, here is the triangular chaos game!