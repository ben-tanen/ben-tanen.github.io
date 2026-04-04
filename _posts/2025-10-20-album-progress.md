---
layout: post
title:  "Album Progress Bar"
date:   2025-10-20 10:05:41
thumbnail: /assets/img/post-thumbnails/album-progress.png
---

A few weeks ago, I decided I wanted to try and fill in some gaps in my musical knowledge, listening to the albums and artists I had always heard about but never had actually given a listen to. My starting list was already fairly long, but because I struggle with a nasty case of "completionisim" (made up word for those of us that feel the need to 100% every video game we play), I've also decided to supplement my list with as many of the "greatest albums of all time" lists as I can find. I'm working on an additional project to try comparing and visualizing those lists, but in the meantime, I'm just working through my ever-growing list of albums and artists.

While I'm making my way through that list, I've encountered some looooooooong albums and I found myself wanting for a progress bar to show how far I was into a given album. I could obviously look at what track I was on in the context of the longer track list, but some songs can be substantially longer than others, so I decided to cook up this little progress bar tool, which should show more scaled progress through an album. Once you've authenticated with Spotify, you can get the information for the album you're currently listening to or for any album by searching with it's album URI.

I recognize this is a fairly dumb and somewhat pointless tool (I probably should just enjoy the music and not worry about my "progress", but alas...), but I made it anyway so here it is for anyone else that suffers from "completionism" and "progress-tracking-ism".

{% include_file /projects/album-progress/html/form.html %}
{% include_file /projects/album-progress/html/viz.html %}
<link rel="stylesheet" href="/projects/album-progress/css/main.style.css">
<script src="/projects/album-progress/js/spotify-auth.js"></script>
<script src="/projects/album-progress/js/spotify-get-album.js"></script>
<script src="/projects/album-progress/js/init.js"></script>