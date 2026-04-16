---
layout: post
title:  'United States vs. the World in Rio 2016'
date:   2016-08-22 15:05:41
thumbnail: /assets/img/post-thumbnails/usa-rio-2016.png
---

The 2016 Summer Olympics finished last night after two spectacular weeks of competition. For anyone watching, it was fairly apparent that the United States did quite will during the Games, taking home the most medals with 121 total medals and 46 gold medals (51 total and 20 gold medals more than second place China). While this isn't a particularly surprising result (the United States is consistently a top contender in the Olympics), it is interesting to wonder why the U.S. is able to perform so well.

I've heard a few people refer to the size of the United States' Olympic team as a likely contributor. It would make sense that the U.S. would get more medals if they had more athletes participating in each event. However, on the surface, this doesn't quite explain it since most events have a cap on the number of athletes that each country can send. For example, each country is only allowed to send three athletes per track & field event. If there is a limit on the number of athletes per event then there must be further explanation of the United States' success.

Another major factor that should be considered is the number of sports that the U.S. competes in. Of the 31 total sports, the U.S. fields athletes in 30 while China and Great Britain (the next top contenders after the U.S.) field only 26 and 25 respectively. This means there are purely more chances for the U.S. to win medals even without skill as a consideration.

| Country | Athletes | Sports | Medals | Golds | Medals per Event | Golds per Event | Medals per Athlete | Golds per Athlete |
|---------|---- -----|--------|--------|-------|------------------|-----------------|--------------------|-------------------|
{%- for team in site.data.rio-2016-medal-avgs.overall_tbl %}
| {{ team.team }} <img src='https://ssl.gstatic.com/onebox/media/sports/logos/{{ team.photo }}_48x48.png' width='25px' style='margin-top:0px;'/> | {{ team.athletes }} | {{ team.sports }} | {{ team.medals }} | {{ team.golds }} | {{ team.medals_per_event }} | {{ team.golds_per_event }} | {{ team.medals_per_athlete }} | {{ team.golds_per_athlete }} |
{%- endfor %}

However, we can see that athletes from the U.S. do seem to actually perform better. By comparing the number of medals each athlete pulls in (on average) from each country, we can see that the U.S. stands on top with 0.218 medals, compared to 0.183 and 0.163 medals from Great Britain and China respectively. While this differential isn't absurd, this apparent performance difference would factor in for the USA medal dominance.

So what about if we actually drill down into different sports and see how the United States' performances compare. Let's look at a few of the sports with the most medals given.

### Swimming\*

| Country | Athletes | Medals | Golds | Medals per Athlete | Golds per Athlete | Golds per Medal |
|---------|----------|--------|-------|--------------------|-------------------|-----------------|
{%- for team in site.data.rio-2016-medal-avgs.swimming_tbl %}
| {{ team.team }} <img src='https://ssl.gstatic.com/onebox/media/sports/logos/{{ team.photo }}_48x48.png' width='25px' style='margin-top:0px;'/> | {{ team.athletes }} | {{ team.medals }} | {{ team.golds }} | {{ team.medals_per_athlete }} | {{ team.golds_per_athlete }} | {{ team.golds_per_medal }} |
{%- endfor %}

Swimming might be what the U.S. is most known to dominate in. Of course when we consider USA Swimming and their dominance, one might think that these numbers are unfairly slanted due to superstar performances from swimmers like Michael Phelps and Katie Ledecky. But if we remove Michael Phelps and Katie Ledecky with their 6 total individual medals, the U.S. still stands on top with 0.628 medals per athlete (double either Australia's or Hungary's performance) and 0.256 golds per athlete (triple either Australia's or Hungary's performance). It seems like the United States really is just *that* good at swimming. But does this apply in other sports?

### Track & Field

| Country | Athletes | Medals | Golds | Medals per Athlete | Golds per Athlete | Golds per Medal |
|---------|----------|--------|-------|--------------------|-------------------|-----------------|
{%- for team in site.data.rio-2016-medal-avgs.track_tbl %}
| {{ team.team }} <img src='https://ssl.gstatic.com/onebox/media/sports/logos/{{ team.photo }}_48x48.png' width='25px' style='margin-top:0px;'/> | {{ team.athletes }} | {{ team.medals }} | {{ team.golds }} | {{ team.medals_per_athlete }} | {{ team.golds_per_athlete }} | {{ team.golds_per_medal }} |
{%- endfor %}

So when we look at track & field, one thing that immediately pops out is the high number of athletes the U.S. had competing. I did mention how there is a cap on the number of athletes that can be sent for each individual event (men's 100-meter, women's 200-meter, etc.) but there are *many* different track & field events, leaving a lot of room for the U.S. to send almost 130 athletes. However, if we look at *average* performance (which should account for different sized teams), we can still see the U.S. did fair well, especially against strong running teams like Kenya and Jamaica. They did not seem to dominate the field in the same way that the U.S. Swimming team did but the 32 medals and 13 golds certain helps the U.S. overall medal win.

### Gymnastics\*\*

| Country | Athletes | Medals | Golds | Medals per Athlete | Golds per Athlete | Golds per Medal |
|---------|----------|--------|-------|--------------------|-------------------|-----------------|
{%- for team in site.data.rio-2016-medal-avgs.gymnastics_tbl %}
| {{ team.team }} <img src='https://ssl.gstatic.com/onebox/media/sports/logos/{{ team.photo }}_48x48.png' width='25px' style='margin-top:0px;'/> | {{ team.athletes }} | {{ team.medals }} | {{ team.golds }} | {{ team.medals_per_athlete }} | {{ team.golds_per_athlete }} | {{ team.golds_per_medal }} |
{%- endfor %}

Finally, we can end by looking at the interesting sport of gymnastics. Gymnastics is interesting because of how fews events there are, how few athletes each country can send, and how there is a mix of individual and team events. Because of the number of events, the averages from team-to-team vary a lot and indicate that we should perhaps better understand the context of these medals. For example, five of the 13 medals won by the U.S. are the individual medals given out to the five members of the U.S. women's team when they won the team all-around. Four additional medals (three gold, one bronze) were won by Simon Biles. As a result, we can learn a little less from the averages above because they can be so swayed by individual events and athletes. However, there is still a lot of anecdotal evidence (specifically the exceptional stories of Simon Biles) to show that the U.S. was a dominating force.

So the numbers seem to indicate that the U.S. maybe does birth some very successful athletes. We will see how this might continue in Pyeongchang, Tokyo, and beyond.

**\*** These numbers do not include marathon swimming <br /> **\*\*** These numbers do not include rhythmic or trampoline gymnastics








