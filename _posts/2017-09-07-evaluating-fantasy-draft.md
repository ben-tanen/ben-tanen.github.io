---
layout: post
title: 'Should I Become an NFL Scout?'
date: 2017-09-07 05:00:00
thumbnail: /assets/img/post-thumbnails/ff-draft.png
landing-proj:  true
landing-order: 17
landing-img:   /assets/img/proj-thumbnails/ff-draft.png
landing-large: false
---

Over the years, I've always been interested in the idea of fantasy football but I had never committed to a league. This year, I decided to take the plunge and try out my own fantasy team. While I would consider myself a fan of football, I knew I didn't know enough about the whole league to really stand a chance at putting together a *good* fantasy team. So I decided I would just rely on the advice of the pros.

First, by suggestion of the [New York Times](https://www.nytimes.com/2017/08/24/sports/fantasy-football-draft-guide-beginners.html), I consulted [Fantasy Pros](https://www.fantasypros.com/) and [5th Down Fantasy](https://www.5thdownfantasy.com/). To supplement these fairly reliable yet relatively standard sources, I thought I would try out a little crowd sourcing experiment of my own. Since I would be competing against other humans, I thought it would be interesting to see how the general masses valued certain players. To assess this, I entered a bunch of different mock drafts on ESPN and recorded the picks as the people and auto-draft did their things. I then compiled the data from each of these drafts, along with the Fantasy Pros and 5th Down suggestions, and made a handy little draft guide.

<!-- more -->

{% include figure.html src="/assets/img/posts/ff-spreadsheet.png" width="600px" %}

The point of this guide was to show me if a particular player was a good or bad pick at the time. For example, if I was getting ready to make the 19th overall pick and I see that Jay Ajayi was taken with the 16.9th average pick, that would be a good sign that Ajayi is a worthwhile pick. On the other hand, if its the 44th overall pick and I'm interested in picking up Carlos Hyde, I could see that Fifth Down doesn't think he should go until the 61th pick, prompting me to look into someone else.

During the actual draft, I ended up following the guide's directions for the most part. I made some rushed-for-time panic moves like Jamison Crowder and Kenny Britt but overall, I think I ended up with a solid team - nothing amazing but definitely something to work with.

I was then curious how the rest of my league did at their drafting. Did my league follow conventional expert opinion like me or did some people opt to try out their own strategies? What better way to answer that question than with a nice visualization!

<div id='d3-ff-container'>
    <svg id="d3-ff"></svg>
    <div id="d3-ff-buttons">
        <button type="button" id="fantasy-pros">Fantasy Pros</button>
        <button type="button" id="fifth-down">5th Down Fantasy</button>
        <button type="button" id="mock">ESPN Mock Drafts</button>
    </div>
</div>

This chart looks at where we drafted a particular player relative to where the pros and masses would have drafted them. The <span style="color: rgb(169,169,169)">gray baseline</span> represents how we drafted players and the colored dots represent when the pros and masses would have drafted a specific player. For example, with the 48th pick, Team Silver picked up Emmanuel Sanders. <span style="color: #23ce6b">Fantasy Pros</span> and the <span style="color: #ff4cc8">ESPN mock drafts</span> felt that was a relatively sound pick, thus we see their dots close to the baseline. But <span style="color: #77bdee">5th Down Fantasy</span> didn't think Sanders should go until the 86th pick so we see their dot significantly above the baseline. On the other side, <span style="color: #77bdee">5th Down Fantasy</span> thought Sammy Watkins, who Team Davis took with the 61st pick, should go with the 32nd pick, thus we see their dot significantly below the baseline.

As expected, it looks like my league started out sticking with the conventional wisdom, not really diverging from the experts and masses until the 4th or 5th round (except for <span id="footnote-1" class="footnote">Ezekiel Elliott as the 17th pick</span>). Even from there, the cone of variance grew at a fairly reasonable rate. Beyond this, I see three notable takeaways:

* I picked the most similarly to the pros and masses, which makes sense.
* Our draft overall looks most similar to the average ESPN mock draft, which also makes sense.
* Our draft overall looks least similar to 5th Down Fantasy's suggestions, but I guess those non-traditional picks are what makes them [stand out in a crowd](https://www.fantasypros.com/nfl/accuracy/2009-2015.php?year=2011#overall).

But speculating how good I might have drafted is pointless when I'm comparing it to the speculations of other people. The only way to really see how I did is to see how the upcoming season goes. So 🤞 fingers crossed I somehow picked well and can bring home [the Shiva](http://theleague.wikia.com/wiki/The_Shiva_Bowl_Trophy).

<link rel="stylesheet" href="/projects/fantasy-football/css/pre-season.style.css">
<script src="/projects/fantasy-football/js/pre-season.js"></script>



