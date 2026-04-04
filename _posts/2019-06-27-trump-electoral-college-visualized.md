---
layout: post
title: "Visualizing Trump's Narrow Path to Victory"
date: 2019-06-27 04:00:00
thumbnail: /assets/img/post-thumbnails/electoral-college-viz.png
related-proj:  trump-electoral-college-visualized
---

*Okay, I know...the 2016 election happened nearly 1,000 days ago and at this point re-litigating it just feels like beating a dead horse that died from beating another dead horse. But this idea was inspired by 2020 Democratic Debate coverage, and you can't always decide when inspiration strikes.*

During [commercial breaks between coverage](https://www.youtube.com/watch?v=cX7hni-zGD8&t=1192) of the second night of Democratic debates, Steve Kornacki discussed how the 2020 Electoral College race was shaping up by looking back at the 2016 results. While Hillary Clinton won the popular vote by nearly 3 million more votes, Donald Trump was able to eke out the 2016 win by clinching a number of crucial battleground state like Florida and Michigan. In the end, this helped propel him well past the necessary 270 electoral votes. However, as Kornacki noted, Trump's path to victory was exceptionally narrow, driven by razor thin margins of a few thousand votes in the states that mattered.

I wanted to try to contextualize just how narrow Trump's victory truly was, especially in comparison to the electoral significance of winning these battleground states. We generally see the Electoral College breakdown shown as [a race to 270 electoral votes along one dimension](https://www.politico.com/2016-election/results/map/president/), where each state, regardless of the win margin, contributes. This makes sense for election night coverage since each state is winner-take-all. But, if we want to understand how narrowly a candidate might have won, or more importantly, contextualize how easy it might be for the same candidate to lose future elections, we need to also consider the margin of victory in each state.

To do so, let's imagine the presidential election is like a tower building contest, where the person who can build the taller tower (of at least 270 votes) wins. As with any tower, you want to start with a candidate's base—their go-to states where they crushed the competition. Once we've put down these sturdy bases, we continue to stack each candidate's wins in order of how strong the win was, with bigger states really helping to pad the height. But as a candidate's margins get narrower and therefore the building blocks get slimmer, they'll have to be careful about the ease of one of those big important blocks falling over and onto the other side's tower (either in this or future elections).

{% include_file /projects/trump-ec-tower/html/viz.html %}
<link rel="stylesheet" href="/projects/trump-ec-tower/css/main.style.css" />
<script src='/projects/trump-ec-tower/js/main.js'></script>

By building these towers, we get another view of Trump's decisive yet narrow win. At the top of Trump's tower (pun half intended), we see four states - Florida, Wisconsin, Pennsylvania, and Michigan - that he clinched with less than a 2% margin, yet they accounted for nearly 25% of his total electoral votes. On the other side, Clinton won Minnesota and New Hampshire by less than 2%, yet those only accounted for 6% of her total electoral votes. By playing around with these battleground states (see the sliders above), we can see that all it takes is a bit of nudging to flip just two of these narrow-win states and swing the election for Clinton.

These narrow wins helped push Trump toward victory, so they're worth considering now. The window of 2% margin puts 25% of Trump's electoral votes easily within [a normal polling error](https://fivethirtyeight.com/features/trump-is-just-a-normal-polling-error-behind-clinton/){:target="_blank"}, which doesn't inspire much confidence when it comes to building a strong win. You wouldn't want a building to be constructed so that 25% of it could topple over with the slightest gust, so the same should go for your electoral politics. This may be something for the Biden/Sanders/Harris/Warren/... team to consider.
