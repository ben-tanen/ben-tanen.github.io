---
layout: post
title:  "Up-to-Date Infographics"
date:   2014-11-01 15:05:41
categories: jekyll update
thumbnail: /assets/img/post-thumbnails/infographic.png
---

When I first started working with web design, [Kerem Suer’s](http://www.kerem.co) website had a lot of features that inspired me. One of these features was his use of [infographics](https://web.archive.org/web/20130114231739/http://kerem.co/). It was a clever way to relay fairly insignificant information in an interesting way. I wanted to implement something similar and for the past few years I’ve been taking a (failing) whack at it.

{% include figure.html src="/assets/img/posts/infographics-kerem.png" caption="Examples of Kerem's use of infographics" %}

For my infographics, I was attempting to display what I was currently up to (currently reading, listening to, watching). I never thought that it could be live updates, but more so descriptions of the book, album, and show/movie that I was into that week. However, the struggle with this was it was not easy to update the information. I had hard-coded into my HTML file, and accessing, changing, and uploading this was generally a pain, leaving my information drastically out-of-date.

Fast forward to today, my infographic aspirations remain, and I think I’ve found my solution. Using the services of [IFTTT](http://www.IFTTT.com), Dropbox, and some simple jQuery, I set up a system that allows me to send a quick text and see my online infographic update within a few moments.

{% include figure.html src="/assets/img/posts/infographics-ex.png" caption="My own example infographics" %}

The set-up works like this: I send a text with the category I’m updating (reading, listening to, watching) and the new media (book, movie, album) to IFTTT. IFTTT reads the text, and appends the contents of the message onto a public Dropbox text file. From there, a jQuery script on my page reads this file, determines the book, show/movie, and album that is most recently added, and adds this information to the web page.

It’s a pretty simple system, nothing ground-breaking, but for me, it solves a long standing problem. So if you really care about my daily activities, just know my website is now kind of, sort of up-to-date. 

**Update** - I have since moved onto a different system that is now built on a much more sustainable database. I still use a bit of IFTTT work but no more public Dropbox files. You can find the information on [my about page](/about/).

