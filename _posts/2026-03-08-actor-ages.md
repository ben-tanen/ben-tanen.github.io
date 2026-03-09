---
layout: post
title:  "So Are Those \"Teens\" on TV Actually Teens?"
date:   2026-03-08 10:00:00
# thumbnail: /assets/img/post-thumbnails/actor-ages.png
landing-proj: false
new-post-style: true
---

During a recent re-watch of The O.C. with my wife, I repeatedly found myself hearing full-grown adults saying something like, "Ugh, it's so crazy being 15!". As a well-known trope in TV and movies featuring "teens," I always got a chuckle out of these moments, and I am regularly Googling to figure out how old the actor really was at the time an episode or movie aired. This typically means first Googling something like "zack stevens the oc" to find out the actor's name (Michael Cassidy), then Googling them to find out their birthday (March 20, 1983), then heading to IMDb for the specific episode to figure out the airdate (May 12, 2005), and then doing the mental math to figure out that this supposed 16-year-old was actually 22 years old.

While this certainly isn't *hard*, I did find myself wishing there was an easier way to speed up or automate this silly checking. In my searching, I came across [MovieAges.com](https://movieages.com/), which was basically perfect, except for the fact that it was limited to movies and did not include TV shows, which is typically where the worst offenses of "I'm a 32-year-old playing a 16-year-old" occurred. From poking around on Movie Ages, I realized that they get their information via [TMDB](https://www.themoviedb.org/?language=en-US), which *does* include information about TV shows and has [a fairly easy-to-use API](https://developer.themoviedb.org/docs/getting-started), so I decided I would just make my own version of Movie Ages that extends to TV shows as well.

Thus, I now have [**Actor Ages**](/projects/actor-ages/)!

{% include figure.html src="/assets/img/posts/actor-ages1.png" alt='A screenshot of the Actor Ages project showing the actors and their respective ages from the S1E1 Premiere episode of The O.C.' width=500 %}

Using this tool, we can learn such fun details as...

In the premiere episode of The O.C., the core four teens of the show (Ryan, Seth, Summer, and Marissa) are played by a 24-year-old, a 23-year-old, a 21-year-old, and a 7-year-old (an actual teen!).

Kirsten Cohen, mother of Seth Cohen, played by Kelly Rowan, was 37 years old in the premiere, even though her son looked like a 23-year-old Adam Brody. Using Seth's age in the show, this would imply Kirsten had Seth when she was 20; using Brody's actual age, this would imply he was born when she was 14. Neither of these makes sense since in the show's universe it is stated she gives birth to Seth after she has graduated from UC Berkeley.

{% include figure.html src="/assets/img/posts/actor-ages2.png" alt='A screenshot of the Actor Ages project showing search results (including posters and release years) for TV shows matching to the oc' width=500 %}

Obviously, none of this really matters or is especially surprising (actors act!), but I just always get a kick out of identifying instances where adults are supposed to be children or when an obviously middle-aged man is supposed to be married to a younger woman who looks 22. If you ever find yourself interested in these instances, feel free to use [**Actor Ages**](/projects/actor-ages/)!

Anyways, for no reason at all, I'm going to go re-watch *Wet Hot American Summer* now, where they take casting actual teenagers seriously!

{% capture methodology-note %}
All data comes from TMDB, where the ages shown are calculated based on the actor's age at the time of release. This will obviously be delayed from when they actually shot the movie/show, and that delay will vary from production to production, but we can estimate it is 6 to 12 months for TV shows and 1 to 3 years for movies.

An astute eye may be able to quickly recognize that this project was aided heavily by using <a href="https://code.claude.com/docs/en/overview">Claude Code</a>. This side project idea had existed in my backlog for over a year and after being <i>heavily encouraged</i> to utilize Claude Code more and more for work, I opted to use it to help me make this idea into a reality in an evening. As a longtime coder along for the ride (sometimes forcefully) as these AI tools become more and more prevalent, I have complex feelings about this whole situation. Feel free to reach out if you'd like to discuss some of your own feelings.
{% endcapture %}
{% include methodology-note.html content=methodology-note break='yes' %}






