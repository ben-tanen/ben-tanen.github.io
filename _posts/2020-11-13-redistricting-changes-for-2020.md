---
layout: post
title:  "Where the United States Stands on Redistricting for 2021"
date:   2020-11-13 10:05:41
categories: project data visualization politics election 2020
show-on-landing: true
landing-description: where the United States stands on redistricting for 2021
thumbnail: /assets/img/post-thumbnails/redistricting-sankey.png
---

There was a huge number of things on the ballot in 2020: President (i.e., [decency](https://twitter.com/drbiden/status/1321192200584220674) and [kindness](https://twitter.com/DrBiden/status/1321836527123599362) among other things, according to the Biden campaign), control of the U.S. Senate and House, [legalization/decriminalization of marijuana](https://www.cnn.com/2020/11/04/politics/marijuana-legalization-2020-states/index.html) and [other drugs](https://www.cnn.com/2020/11/09/politics/oregon-decriminalize-drugs-trnd/index.html), and potential restrictions on [abortion](https://www.wwltv.com/article/news/politics/elections/what-amendment-1-no-right-to-abortion-means-for-louisiana/289-9ecde885-a475-45eb-af23-20649034fd7d) and [the gig economy](https://thehill.com/opinion/technology/525114-prop-22-just-passed-in-california-now-what). Perhaps one of the most important things, even though it wasn't always covered with much significance, was control for the redistricting process that is set to start following the 2020 Census. The 2020 Election was the last chance for voters across the United States to change the redistricting process in their state by altering the political control of their state's legislature or by passing relevant ballot initiatives. With the redistricting processes and political power dynamics now mostly set, it is worth checking in on this crucial but often underreported process by comparing it to the redistricting dynamics in 2011.

{% include figure.html autolink="yes" src="/assets/img/posts/redistricting-sankey-vert.png" alt="A visualization showing how redistricting control has changed from 2011 to today based on changes in legislative control and ballot initatives changing the process" link="/assets/img/posts/redistricting-sankey-horiz.png" %}

Coming out of the 2010 Election, after it became clear that Republicans had [enacted a plan called REDMAP to take control of the redistricting process](https://www.npr.org/2020/09/23/916290633/redmap-update), Republican-controlled legislatures were responsible for redrawing nearly half of all Congressional districts. Meanwhile, Democrats were responsible for just 13%, leaving the remaining 41% of Congressional districts drawn by bipartisan or independent redistricting commissions (or come from states with only one at-large district). This split lead to [rampant gerrymandering](https://www.wbur.org/hereandnow/2016/07/19/gerrymandering-republicans-redmap) that allowed Republicans to win back majority control [in Congress](https://en.wikipedia.org/wiki/2012_United_States_House_of_Representatives_elections) without a majority of the votes.

In the years following, after the implications of REDMAP had become clear, groups across the country gave new attention to making the redistricting process more fair both by balancing party control in state legislatures and transferring redistricting duties to independent commissions. We can see the latter appear in the chart above as five states (accounting for 70 electoral votes and 60 districts) shifted redistricting power away from partisan legislatures and towards some kind of redistricting commission.

Heading into the 2020 Election, Democrats were hopeful that they could take back some control in state legislatures, ideally shifting redistricting power to Democrat-controlled legislatures or at the very least split governments. However, [Democrats performed poorly](https://www.nytimes.com/2020/11/04/us/election-state-house-legislature-governors.html) in legislative races across the country at both state and federal levels and are actually projected to have lost ground.

So these are the conditions under which the United States will redraw legislative maps, mostly unchanged for the sake of a decade. The fact that Democrats have not gained any majority control and have lost partial control in split governments in the past 10 years is not promising for Democrats hoping to get back at their Republican counterparts for the incredibly gerrymandered maps of the 2010s. But, while voters were not able to balance the scales in states where redistricting is run by the legislature, there has been a substantial increase in the number of states that use independently (or at least bipartisan-ly) commissioned maps, largely due to great work and ballot initiatives from groups across the country that understand the importance of fair maps.

While redistricting is certainly not the *sexiest* topic, if nothing else, the last decade has turned the public's attention to what can go wrong when this process is left unchecked. With our eyes on the process, we can only hope that the maps of the 2020s are more fair than those of the 2010s. Hopefully it doesn't just make for sneakier and more extreme gerrymandering...

{% capture methodology-note %}
Control of the redistricting process was determined based on information from <a href="https://gerrymander.princeton.edu/">The Princeton Gerrymandering Project</a> and <a href="https://redistricting.lls.edu/index.php">Loyola Law School's All About Redistricting</a>. 

The number of electoral votes allocated to each state in 2021 is based on <a href="https://www.electiondataservices.com/wp-content/uploads/2019/12/NR_Appor19wTablesMaps.pdf#page=3">2019 Census Estimates from Election Data Services</a>, which shows AZ, CO, FL, MT, NC, OR, TX gaining seats and AL, CA, IL, MI, MN, NY, OH, PA, RI, WV losing seats. If Montana gains a seat, it will require redistricting (they currently only have one district) but their redistricting will be done by an independent commission. If Rhode Island loses a seat, they will only have one district, therefore not requiring any redistricting.

While many state legislature races are still undecided (as of 11/13/2020), <a href="https://www.nhpr.org/post/new-hampshire-s-was-only-state-legislature-changed-parties-2020-election">most outlets are projecting</a> that New Hampshire is the only state that will see any change in their state legislature, switching from Democratic to Republican control in both chambers.
{% endcapture %}
{% include methodology-note.html content=methodology-note break='yes' %}


