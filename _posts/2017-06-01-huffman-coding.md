---
layout: post
title: 'Explaining Adaptive Huffman Coding with Scrollytelling'
date: 2017-06-01 15:05:41
thumbnail: /assets/img/post-thumbnails/huffman.gif
landing-proj:  true
landing-order: 6
landing-img:   /assets/img/posts/huffman-coding.gif
landing-large: false
---

After months of reading and being impressed by the [very](https://pudding.cool/2017/04/beer/){:target="_blank"} [cool](https://pudding.cool/2017/01/making-it-big/){:target="_blank"} [visual](https://pudding.cool/2017/02/vocabulary/){:target="_blank"} [essays](https://pudding.cool/2017/05/song-repetition/){:target="_blank"} put out by [The Pudding](https://pudding.cool/){:target="_blank"}, I decided I would take a crack at a project using what they call "scrollytelling." For my final final project of my undergraduate career, I constructed a visual walk-through to explain and compare [traditional Huffman Coding](https://en.wikipedia.org/wiki/Huffman_coding){:target="_blank"} to [adaptive Huffman Coding](https://en.wikipedia.org/wiki/Adaptive_Huffman_coding){:target="_blank"}.

{% include figure.html src="/assets/img/posts/huffman-coding.gif" alt="A screen capture of the scrollytelling visualization" %}

<!-- more -->

To give a quick preview, Huffman Coding is a lossless data compression algorithm, which means we can reduce the size of any dataset by 15 - 30% without corrupting any of our data. However, in order to do this, Huffman Coding requires some prior knowledge of our dataset, which means we will be slowed down if we don't already have this information. To improve upon this, we can instead use Adaptive Huffman Coding, which enables us to get comparable compression efficiency in a fraction of the time. Intrigued? You can check out [the full explanation](http://link.ben-tanen.com/adaptive-huffman/){:target="_blank"} for more.

If you're interested in the code, that can be found [here](https://github.com/ben-tanen/adaptive-huffman/){:target="_blank"}. If you're interested in trying out your own scrollytelling project, I would definitely suggest checking out The Pudding's work as well as [this tutorial](https://pudding.cool/process/how-to-implement-scrollytelling/){:target="_blank"} they put together - it was a huge help for me.

*Usability Note*: I have noticed some rendering issues when viewing the second half of the site in Safari and Firefox <span style="font-size: 9px">(sorry)</span>. I'm trying to figure out the issue, but for now, I would suggest viewing the site in Chrome.