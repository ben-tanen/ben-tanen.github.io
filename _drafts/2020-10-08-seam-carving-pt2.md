---
layout: post
title:  "Improving Twitter's Image Previews"
date:   2020-10-08 10:05:41
categories: project image cropping algorithm
show-on-landing: true
landing-description: experimenting with seam carving and the Twitter's image preview algorithm
thumbnail: /assets/img/post-thumbnails/seam-carving-pt2.jpg
---

*Note: I started this post/project two weeks before it became clear that there were issues with Twitter’s image algorithm. My original plan was to jokingly propose the seam carving algorithm as an alternative to Twitter’s current system as a fix for trivial issues, but with the more recent news, I would also like to earnestly address the larger systemic issues that people have noticed. While I do think seam carving could be a useful tool for Twitter as they address these larger issues, this post is only intended to highlight how things can go very poorly if we knowingly or unknowingly use algorithms incorrectly.*

*Also, if you don't know what seam carving is and would like a primer, you can read [this explanation]({% post_url 2020-10-08-seam-carving-pt1 %}).*

For pretty much as long as we’ve had digital images, we’ve also run into the problem of trying to show pictures in non-optimal spaces. We scale images to make images bigger and often get blurry images; we crop images to fit in different shapes and end up losing part of the image. When we’re talking about a single image, we can make manual adjustments to salvage as much as possible, but when we have to do this for millions of images, we’ve got to turn to algorithms to do the job for us. 

This is what social media sites like Facebook and Twitter have to do when they display images on our timelines. Most uploaded images are not anywhere close to the right dimensions to fit neatly into the boxes that Facebook and Twitter use to give users a quick preview of an image before they open it, so these sites have to figure out how to scale and crop images algorithmically. Most of the time, this works fine, but as with all algorithms, sometimes they run into issues, and some are worse than others.

<div class="columns two">
    <div class="column" style="width: calc(60% - 15px);">
        <p>This is what social media sites like Facebook and Twitter have to do when they display images on our timelines. Most uploaded images are not anywhere close to the right dimensions to fit neatly into the boxes that Facebook and Twitter use to give users a quick preview of an image before they open it, so these sites have to figure out how to scale and crop images algorithmically. Most of the time, this works fine, but as with all algorithms, sometimes they run into issues, and some are worse than others.</p>
        <p>For a while, Twitter users have been jokingly taking advantage of the platform’s flawed image preview algorithm <a href="https://knowyourmeme.com/memes/open-for-a-surprise">by hiding “surprises” that are only revealed after you “open for a surprise.”</a> Most reveals are focused on cute animals, but there is really no telling what you’ll get until you actually open the image. Aside from the always present internet trolls, Twitter’s constrained image preview makes this gag is mostly harmless. But, as with all things algorithms and the internet, there are far more harmful instances as well.</p>
    </div>
    <div class="column" style="width: calc(40% - 15px);">
        {% include figure.html autolink="yes" src="/assets/img/posts/open-for-surprise-giraffe.png" alt="An image of a giraffe sticking it's tongue out" width=500 caption="An example of what 'open for surprise' might reveal" %}
    </div>
</div>

A few weeks ago, Twitter users started running experiments to see if Twitter’s algorithm had any preference for certain faces, or rather, certain skin tones or apparent genders. After many different examples tested all different combinations, it became clear that there was something very off with Twitter’s algorithmic approach for picking image previews. Folks at Twitter eventually responded and said that they had not previously found any racial or gender bias, but noted that “it’s clear that we’ve got more analysis to do.”

<div style="max-width: 400px; margin: auto; margin-bottom: 15px;">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Trying a horrible experiment...<br><br>Which will the Twitter algorithm pick: Mitch McConnell or Barack Obama? <a href="https://t.co/bR1GRyCkia">pic.twitter.com/bR1GRyCkia</a></p>&mdash; Tony “Abolish (Pol)ICE” Arcieri 🦀 (@bascule) <a href="https://twitter.com/bascule/status/1307440596668182528?ref_src=twsrc%5Etfw">September 19, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
</div>

This is hardly the first example--and will surely not be the last--of algorithmic bias creeping into tech unexpectedly. We know some of the steps to combat it and this is hopefully where Twitter will start. The key question behind image preview is deciding what is the most “important” part of the image, which is extremely subjective. Some will likely be inclined to say “let the computer figure it out,” but as we’ve seen time and time again, unchecked algorithms generally lead to bad and/or biased algorithms.

[Original example](https://twitter.com/bascule/status/1307440596668182528)

[Racist example #2](https://twitter.com/sina_rawayama/status/1307506452786016257)

[Real world example, comparison to Zoom](https://twitter.com/colinmadland/status/1307111816250748933)

[Algo is sexist as well as racist](https://twitter.com/neilcastle/status/1307597309862125568)

[Meme version](https://twitter.com/therourke/status/1307711835836219394)

[Response from Twitter](https://twitter.com/lizkelley/status/1307742267193532416)

[Book recommendations](https://twitter.com/_theghettomonk/status/1307686197934854147)


