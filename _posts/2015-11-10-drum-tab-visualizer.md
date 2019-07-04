---
layout: post
title:  'Building a "Rock Band" Visualizer for Drum Tab'
date:   2015-11-10 15:05:41
categories: project python drums music
thumbnail: /assets/img/post-thumbnails/drum-tab-visualizer.gif
---

Growing up, I *absolutely loved* playing Rock Band, especially on the drums. RB was my first introduction to playing the drums, and my hours upon hours of gameplay inspired me to eventually pick up some real sticks and learn the actual drums. As helpful and accessible as [drum tab](https://en.wikipedia.org/wiki/Drum_tablature) generally is, I found myself wishing for some way to turn this drum tab into a Rock Band/Guitar Hero-style visualization (vertical scrolling notes timed up to the music) to help make sight-reading tab a bit easier. Across a number of years, I tried a variety of approaches—at one point I made a flash game where I could play along with manually transcribed drum tab using the actual RB drum kit—but was never super successful.

<div class="columns two">
    <div class="column">
        <p>This project idea resurfaced for me after I finished <a href="https://github.com/ben-tanen/sim-fishy">a project for my introductory CS course</a> where we were asked to build a object-oriented simulator to animate fish sprites. The structure of the code allowed a user to input pretty much any kind of sprites (not just limited to fish) so I realized I could use this simulation code to help run my Rock Band-style drum tab visualization.</p>
    </div>
    <div class="column">{% include figure.html src="/assets/img/posts/sim-fishy-ex.gif" alt="Fish animation via the command-line" width="400px" %}</div>
</div>

With this simulation engine pretty much ready to go already, I just had to write some code that would convert drum tab into a valid input for the simulation. This primarily involves just reading drum tab and spacing out the corresponding notes/dots based on timing and which drum/cymbal is to be played. There are a lot of variations in styling for drum tab, so initially I've just made it work on [a specific sample style](https://github.com/ben-tanen/drumtab-visualizer/blob/master/maps-tab.txt) with the intention of expanding this in the future.

Putting this all together finally gave me something similar to what I had been dreaming of for so long. Yes, the use of a fish simulator is maybe a little janky, and yes, the tab interpreter/converter works on a limited set of drum tabs, but this is a big step. This has been a dream project for awhile so I imagine there will be some continued work and improvements as I use the tool more over time. For now, I'm just happy to have a custom animation for [my favorite song to play on the drums](https://www.youtube.com/watch?v=oIIxlgcuQRU).

{% include figure.html src="https://github.com/ben-tanen/drumtab-visualizer/raw/master/images/demo.gif" alt="Demo GIF of the drum tab visualizer" %}

You can check out the code for this project [here](https://github.com/ben-tanen/drumtab-visualizer).

