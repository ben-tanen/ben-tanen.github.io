---
layout: post
title:  "Gallery Test"
date:   2015-07-02 15:05:41
categories: test Gallery
gallery_images:
    - caption: "this is a test"
      img_link: "/img/posts/infographics_ex.png"
    - imgcaption: "test #2"
      img_link: "/img/posts/infographics_ex.png"
---

This is a test for a gallery object:

{% for item in page.gallery_images %}
  {{ item.caption }}
  {{ item.img_link }}
{% endfor %}

{% include gallery.html width="800" height="400" %}