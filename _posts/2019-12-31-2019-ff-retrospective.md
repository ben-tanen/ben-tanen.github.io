---
layout: post
title:  "How A Subpar Football Fan Succeeds in Fantasy Football"
date:   2019-12-31 15:05:41
thumbnail: /assets/img/post-thumbnails/ff-retro-2019.png
landing-proj:  true
landing-order: 7|11|21
landing-img:   /assets/img/proj-thumbnails/2019-ff-retro.png
landing-large: false
---

This weekend marked the end of the NFL’s regular season and with it, the end of many fantasy football league seasons. This was my third year in a fantasy football league and quite shockingly, I ended up winning my league, which was a vast improvement on my past performances. In the past, I’ve [visualized my effectiveness as a fantasy football drafter]({% post_url 2017-09-06-evaluating-fantasy-draft %}) so to cap off this winning season, I wanted to explore what factors might have led to my success, as always, with data.

*Before getting started, if you know nothing about fantasy football but are for some reason still interested in reading this, you can find a brief primer on how it works [here](http://www.nfl.com/fantasyfootball/story/0ap3000000692955/article/how-to-play-fantasy-football-a-beginners-guide). On the other hand, if you know a lot about fantasy football and are curious, I was in a 12-person half PPR league with lineups of 1QB, 2RB, 2WR, 1TE, 1RB/WR/TE Flex, 1K, 1DST, and 7 bench spots.*

### A well-balanced team

The first and probably the most important factor of any successful fantasy football run is your team. Each person will have a different strategy on how to stack their teams, but the general consensus seems to be that you want to have at least somewhat decent players available in each position so you aren’t too reliant on one player or position. To measure how strong and balanced each of my league’s 12 teams were, I calculated the average points scored by each position over the course of the season and then compared each team to the league. This resulted in the radar charts below.

What these show is a visual representation of how strong each team was in a particular position and, as a whole, how well-balanced their team was. For example, if we look at Slick Rick, we see that he had the best RBs in the league (he generally played Christian McCaffery and Mark Ingram, who both had knockout seasons). However, he was somewhat weaker (relatively) in terms of defenses, though this is obviously one of the least significant positions. If we measure how strong each team is across all of these positions relative to the rest of the league, we can get a numerical measure of the overall team. For example, if we look at Slick Rick, strong RBs, WRs, and TE + medium QB + weak K and DST comes out to a team score of 6.86.

<ul id="radar-chart-container">
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/1-slick-rick.png" alt="" class="radar-chart-img"></li>
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/2-team-silverhart.png" alt="" class="radar-chart-img"></li>
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/3-team-cadow.png" alt="" class="radar-chart-img"></li>
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/4-team-halvorsen.png" alt="" class="radar-chart-img"></li>
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/5-team-tanen.png" alt="" class="radar-chart-img"></li>
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/6-team-ario.png" alt="" class="radar-chart-img"></li>
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/7-rookie-of-the-year.png" alt="" class="radar-chart-img"></li>
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/8-i-am-for-real.png" alt="" class="radar-chart-img"></li>
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/9-nuke-city.png" alt="" class="radar-chart-img"></li>
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/10-ags-reckoning.png" alt="" class="radar-chart-img"></li>
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/11-stickshift-rick.png" alt="" class="radar-chart-img"></li>
    <li><img src="/projects/fantasy-football/img/2019-radar-charts/12-revenge-tour.png" alt="" class="radar-chart-img"></li>
</ul>

What these show is that these measures of team strength align relatively closely to each team’s ultimate performance in the league. While not exact, those with higher team scores ended near the top of the rankings while those with lower scores ended near the bottom. There are obviously some exceptions and other factors that play into a season’s performance (some discussed below), but a strong and well-rounded team seems to be a substantial part.

When we look at my specific team/chart (Team Tanen) in comparison to others, we can see that while I didn’t have the strongest team in absolute measures (that would be Slick Rick’s team), I had one of the most evenly balanced teams, as seen by my more even hexagon. Some may argue that it’s better to have a few all-stars in exchange for a super evenly balanced team, but given my relatively even team and my ultimate win, I would say it certainly didn’t hurt.

### Setting optimal line-ups

A crucial question that will rack the brains of most fantasy football owners is how to set the optimal line-up on any given week. It is difficult to predict if and when certain players will go off, which makes it nearly impossible to consistently set your best line-up. Regardless, it still hurts when someone on your bench far outscores someone you played, possibly making the difference between winning and losing a given week. If this happens frequently enough, it might make for a difficult season for even the strongest teams.

Given this, I was curious how I did throughout the season when it came to setting my line-ups. How close to ideal were my line-ups? How many times did I lose because I benched the wrong players? Were there any players that I consistently played but should have benched or vice versa?

{% include figure.html autolink="yes" src="/projects/fantasy-football/img/2019-optimal-lineup.jpg" alt="A visualization of how my actual vs. ideal line-ups compares" %}

Looking back on the season, I did relatively well when it came to setting my line-ups. I set the best possible line-up twice and for 10 of the 16 weeks, I set line-ups that scored at least 90% of the ideal maximum score for a given week. More importantly, setting the ideal line-up in a given week would have only made a difference between winning or losing twice (Week 3 and Week 7), which means I set optimal *enough* of line-ups.

Diving into specifics, I was curious if there were any players that I consistently overplayed (played even if they weren’t the best) or underplayed (players that deserved to be played more than they did). When it comes to overplayed players, I played Tom Brady (QB) ten times throughout the season, which was a mistake 40% of the time. As a Patriots fan, I obviously am slightly biased towards TB12, but Tom also had a tough season that made it hard to predict when he’d make a good starter. On the other end of the spectrum, I definitely underplayed both Latavius Murray (RB) and Ronald Jones II (RB), who sat on my bench 13 and 12 weeks respectively even though they should have played in 40% of those weeks. Sorry Latavius and Ronald...

Want to know who was never a mistake to play? Julio Jones. I played him 14 times and even though he didn’t have as killer of a season as in past years, he was worth the start each and every time. Absolute all-star.


### Effective waiver wire activity

This year, I made frequent use of our league’s waiver wire, thinking I could successfully [stream](http://www.fantasywired.com/daily-fantasy-sports-faq/what-is-streaming-in-fantasy-football-14565.htm) players or pluck a soon-to-be superstar before anyone else takes notice. In fact, I did this the most among anyone else in my league with 37 waiver wire transactions. Some absolutely paid off (go Ryan Tannehill!) and some did not (\*cough\* [Chris Herndon](https://www.reddit.com/r/DynastyFF/comments/bl08ph/discussion_chris_herndon_hype_train/)), so I wondered if all of this waiver wire activity did in fact produce well-timed picks.

{% include figure.html autolink="yes" src="/projects/fantasy-football/img/2019-waiver-wire.jpg" alt="A visualization showing the average points earned from a player on my roster vs. not on my roster" %}

If I look at the average performance of these players when they were on my roster vs. not rostered (either on the waiver wire or on another team), it seems like I was generally making good pick ups. Many of these are kickers and defenses since I generally subscribed to the streaming strategy (pick up a player for a week based on their upcoming matchup). Overall, their rostered averages were generally higher so it seems like I was able to properly time these pick-ups and the strategy was a general success. Many thanks to [Fantasy Pros](https://www.fantasypros.com/nfl/) for their insights.

A few additional notable callouts:

- I luckily implemented the streaming strategy and picked up the Ravens DST in Week 10 when they scored 23 points, much better than their rest-of-season average of 7.20 points.
- The one DST that I picked up during an off-week was the 49ers DST, who scored *only* 8 points in comparison to their rest-of-season average of 10.4 points. They had a pretty remarkable season (3rd best defense in the league), so it might have been worth holding onto them a bit longer.
- While I generally streamed kickers week-to-week, I did pick up and hold onto Younghoe Koo (K) for a few weeks leading into the fantasy playoffs, which certainly helped me cement my spot in the playoffs.
- I was generally able to time my defensive and kicker acquisitions, but I struggled a bit more on positional players. For example, Frank Gore (RB), Jack Doyle (TE), and Rex Burkhead (RB) were all players that I picked up early on but unfortunately dropped before they hit their strides this season.

### An easy schedule

Finally and perhaps most importantly, we have something that has absolutely nothing to do with my skill and everything to do with luck: the strength of my opponents. Over the course of the 16 week season, I played each team at least once (three teams twice, one team three times) and as noted above there were some pretty strong teams in our league. However, the discussion above about team strength was based on their *average* performance for the season and everyone has off weeks from time to time. Fortunate for me, it seems like I was lucky enough to play against most teams in these off weeks.

Before even diving too much into the data, the ease of my schedule was pretty apparent from simply looking at the total points scored for and against by each team. Overall, I ranked 8th in our league for total points scored, which along with the above discussions indicates I had a fine but not knock-out team. However, I ranked 1st in our league for total points scored against, which means that my opponents on average generally underperformed.

{% include figure.html autolink="yes" src="/projects/fantasy-football/img/2019-easy-schedule.jpg" alt="A visualization showing the matchups and performances for each team against Team Tanen" %}

When we delve into the weekly data and look at each team’s weekly scores relative to their season average, we can see that I played teams on worse than average weeks 63% (10 / 16) of the time. In fact, 31% (5 / 16) of my games were played against teams in their worst three weeks for the season. If we rank each team’s weekly scores and then take an average of those weeks that I played them, I played teams on their 10th best week, which isn't great for them.

All these numbers tell a pretty consistent story - I got quite lucky with my schedule for the season. And obviously I’d like to claim that my winning season was due entirely to my strong team or my well-timed waiver wire pick-ups, but I won’t deny that an easy schedule helped out quite a bit. It’s impossible to say if that ended up being **the** reason I ultimately won, but just in case, I’ll be sure to thank my league mates for going easy on me. 

{% include section-break.html %}

So how does a subpar football fan end up winning their fantasy football league? All it takes is a solid team, well-informed waiver wire pick-ups, near ideal rosters, and a hefty helping of luck. It also doesn’t hurt to have Julio Jones and Derrick Henry.

<style>
h3 {
    color: #77bdee;
}

#radar-chart-container {
    width: 100%;
    padding: 0;
}

#radar-chart-container li {
    list-style: none;
    display: inline-block;
    margin-right: 10px;
    width: calc(33% - 13px);
}

.radar-chart-img {
    width: 100%;
    margin: 0;
}

@media (max-width: 950px) {
    #radar-chart-container li {
        width: calc(50% - 13px);
    }
}

@media (max-width: 475px) {
    #radar-chart-container li {
        width: 100%;
    }
}

</style>


