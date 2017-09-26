---
layout: post
title: 'How I Keep Track of All My Shows'
date: 2017-01-24 15:05:41
categories: project tv chrome
thumbnail: /assets/img/post-thumbnails/tv-monitor.gif
---

As I've [previously mentioned]({% post_url 2016-05-08-netflix-history %}), I do enjoy watching TV and Netflix from time to time. However, since I've opted to go cable-less, it's a bit of a struggle to stay on top of when a new episode of one of my shows comes out. As a result, and because I clearly had way too much time on my hands, I decided to make **TV Monitor**, a little Chrome extension that keeps track of all of this for me.

A lot of inspiration for the extension came from the [Feedly Notifier extension](https://chrome.google.com/webstore/detail/feedly-notifier/egikgfbhipinieabdmcpigejkaomgjgb) I use to keep track of my RSS feeds. I found its design to be clean but still provided me all the information and actions I would need. Thus, for my extension, I ended up with something that looked and felt pretty similar.

{% include figure.html src="/assets/img/posts/tv-monitor-demo.gif" width="350px" %}

Overall, building this was easier than expected. It was surprisingly simple to get a basic Chrome extension going and from there it was just web development like any traditional site. The backend is built using a basic Django app that queries IMDB to see if there are any new episodes available of a particular show. If you're interested, feel free to check out [the frontend code](https://github.com/ben-tanen/tv-monitor) (backend maybe to come).

Since I was building this just for me, I took some shortcuts in terms of security, just for my own sanity, so I'm not planning to publish the extension on the Chrome store, at least not in the foreseeable future. Maybe that'll be the project for next Winter Break...




