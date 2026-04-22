---
layout: post
title: Why Are Good Captions So Rare On YouTube?
date: '2023-11-01T15:00:00.000-06:00'
thumbnail: /assets/img/post-thumbnails/yt-captions-cc0fe5db.jpg
---

Though I am not hard of hearing, I typically like to have captions on when I watch TV, movies, or YouTube. Unfortunately, I’ve come to find how crappy many different captions are: in TV/movies, the captions can be filled with typos or can be so poorly synced with the audio it becomes distracting; in YouTube videos you’re typically stuck with auto-generated captions.

For YouTube specifically, [there has been a campaign](https://www.wired.com/story/problem-with-youtubes-terrible-closed-craptions/) to improve the coverage and quality of the “crap-tions” on videos. We can see the need for improvement from simply just watching [the video that kicked off the original campaign](https://www.youtube.com/watch?v=2l14XtJwVUc). As of February 2020, the first line of auto-generated captions read “*okay i don't understand anything for this video i know if you think so see if I brought that into this video*” for what should read “*OK, I don't know how to sign anything in this video. I know a few things, so we'll see if I throw that into this video*”. As of November 2023, the captions have been improved to match up with the audio.

When I became aware of this issue in early 2020, I tried to figure out if there was some way to measure the prevalence of human-generated captions on YouTube and determine the overall accuracy of YouTube’s auto-generated captions. This included experimenting with:

- [YouTube’s own Caption API](https://developers.google.com/youtube/v3/guides/implementation/captions), though the API doesn’t seem to give you access to the actual underlying captions for videos you didn’t upload
- [The ](https://github.com/ytdl-org/youtube-dl/)[`youtube-dl`](https://github.com/ytdl-org/youtube-dl/)[ library](https://github.com/ytdl-org/youtube-dl/), which allows you to export caption tracks. However, you can’t control which language/version of the caption track you are exporting if both auto- and human-generated captions exist.
- Custom built `selenium`-based caption scraper (see [here](https://github.com/ben-tanen/yt-captions/blob/master/code/scrape-captions-selenium.py))

The last of these experiments gave me the best results, so I ran with it, using a mixture of YouTube’s own API and my own scraper to identify how often popular videos had captions and when possible, scraping the actual caption tracks from videos with both auto- and human-generated captions. I let these run day after day using Github Actions for more than two years.

For the first part of this process, I was able to analyze the prevalence of human-generated captions across more than 30,000 videos. Overall, only 21% of videos had human-made captions, but the prevalence varies by video type - they’re substantially more common in educational videos and substantially less common in vlogs.

{% include figure.html src="/assets/img/posts/yt-captions-e612a2ca.png" %}

For the latter part of my analysis, I ended up scraping caption tracks from a few thousand different videos that contained both human- and auto-generated captions. I then stitched these captions together so you can see side-by-side how the captions compare. For example, you can view the side-by-side captions for [this video](https://www.youtube.com/watch?v=-a_uyxDEuYk) on from The Verge [here](https://github.com/ben-tanen/yt-captions/blob/master/data/caption_text/caption_text_-a_uyxDEuYk_clean.csv).

With all of this code written and data to analyze, I had planned on turning this project into a fairly substantial project for my website and/or something to publish elsewhere. However, after a few years of collecting the data, it became clear that YouTube’s auto-generated captions had improved quite a bit over time, to the point that their captions were typically within 90+% accuracy of human-generated equivalent captions. 

That being said, while the average video will have auto-generated captions with 90% or greater accuracy, there are many that fall far below this threshold, which may make the videos nearly unwatchable for [estimated 15% of adults](https://www.nidcd.nih.gov/health/statistics/quick-statistics-hearing) that are deaf or hard of hearing.

So while I’m no longer actively working on this project, I may return to it some day. I would also heavily encourage anyone doing research or their own analysis of this problem to utilize the data I collected however it might be useful! You can find all of my code for scraping and analyzing the caption tracks in [this Github repo](https://github.com/ben-tanen/yt-captions).
