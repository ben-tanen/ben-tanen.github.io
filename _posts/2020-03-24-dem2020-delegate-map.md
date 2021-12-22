---
layout: post
title:  "Plotting the 3,979 Delegates of the 2020 Democratic Primary"
date:   2020-03-24 10:05:41
thumbnail: /assets/img/post-thumbnails/dem2020-delegate-map.png
landing-proj:  true
landing-order: 4|6|11
landing-img:   /assets/img/proj-thumbnails/dem2020-delegate-map.png
landing-large: false
new-post-style: true
---

***Update (Apr 08, 2020):** [Bernie Sanders is dropping out of the Democratic Primary](https://www.nytimes.com/2020/04/08/us/politics/bernie-sanders-drops-out.html), leaving Joe Biden as the sole candidate and now the presumptive Democratic nominee. As a result, this project is now no longer relevant, so I'm going to freeze it for now.*

On March 17, Arizona, Florida, and Illinois each held their respective 2020 primaries elections. These state primaries marked the halfway point in this ongoing national primary since now more than 50% of the initial 3,979 delegates have been awarded across 30 different state contests. As of writing this, Joe Biden leads the race with 1,215 delegates while Bernie Sanders trails behind at 909 delegates. Given these current counts and the outlook for upcoming primaries, [many](https://www.economist.com/united-states/2020/03/19/joe-biden-builds-an-insurmountable-lead) [outlets](https://fivethirtyeight.com/features/election-update-bidens-delegate-lead-is-now-nearly-insurmountable/) have called Biden’s lead (nearly) insurmountable. In the lead up to Super Tuesday (March 3), Biden’s path to victory was not so clear and it actually seemed like Sanders might end up winning the nomination after he had relatively strong performances in early states like Nevada and Iowa. But at the end of the day, Biden was able to through in many of the big states that mattered and here we are.

{% include figure.html autolink="yes" src="/projects/dem2020-delegate-map/img/RPlot.jpg" alt="A plot showing where Biden is expected to win relative to their total number of delegates awarded" width="500px" %}

If you have been following this election closely, Biden’s leading position is not all that surprising. But because this primary process is almost unbearably long, it can sometimes be hard to piece together all of the states that brought Biden and Sanders to the delegate totals that they have as well as the states that will likely help Biden secure the nomination. Thus, to help illustrate the bigger picture of these primaries, I present a visualization of all 3,979 of the delegates up for grabs, where they have gone thus far, and where they are projected to go in upcoming states. 

This race is not yet over (though I agree it is almost nearly over) so I will continue to update the below as new results and projections become available. Ongoing developments with Trump and COVID-19 will almost certainly throw some (more) curveballs so we will see how that may change things.

I hope everyone is staying safe and healthy. And remember to wash your hands.

<br />

<div id="dem2020-title">
    <h2>Delegates won (or projected to be won) by <span class="biden-count">Biden</span>, <span class="sanders-count">Sanders</span>, and <span class="other-count">Other Candidates</span></h2>
    <p style="margin-bottom: 10px; margin-left: 0;"><i>Updated on: <span id="update-date">...</span></i></p>
</div>

* Based on current counts and future projections, Biden is expected to win <span id="biden-total-del">...</span> total delegates. Sanders is expected to win <span id="sanders-total-del">...</span> total delegates.
* <span id="largest-remaining-state">...</span> is the largest state to not yet hold their primary election. Biden is expected to win <span id="biden-largest-remaining-state-del">...</span> of the <span id="largest-remaining-state-total-del">...</span> total delegates available in <span id="largest-remaining-state">...</span>.
* Biden is expected to clinch his winning 1991st delegate from <span id="winning-del-state">...</span> in <span id="winning-del-state-days">...</span> days.

<div id="dem2020-container"></div>

{% capture methodology-note %}
States are organized from top to bottom by date of primary/caucus and then alphabetically. Dates for primaries and caucuses come from <a href="https://www.npr.org/2020/02/10/799979293/how-many-delegates-do-the-2020-presidential-democratic-candidates-have">NPR</a>. Due to concerns around the COVID-19, multiple states (e.g., Ohio, Conecticut) have postponed their original dates. The most recent proposed postponement date is shown.

Delegate counts from states that have held primaries/caucuses come from <a href="https://interactives.ap.org/delegate-tracker/">the Associated Press</a>. 

Projected results for upcoming states come from <a href="https://projects.fivethirtyeight.com/2020-primary-forecast/">FiveThirtyEight's 2020 Democratic Primary model</a>, where the average forecasted pleged delegate totals were used. For instances where the combined average number of pleged delegates for each candidate did not equal the total number of delegates available in a state, the remaining unallocated delegates were assigned proportionally.
{% endcapture %}
{% include methodology-note.html content=methodology-note break='yes' %}

<link rel="stylesheet" href="/projects/dem2020-delegate-map/css/main.style.css" />
<script src='/projects/dem2020-delegate-map/js/main.js'></script>


