---
layout: post
title:  "Retro Post: Game Theory, The Game"
date:   2015-06-26 15:05:41
categories: game_theory economics model game
gallery:
    - caption: "this is a test"
      img_link: "heyyy"
    - caption: "test #2"
      img_link: "heoje;kele"
---

This is a test for a gallery object:

{% for item in page.gallery %}
  <p>{{ item.caption }} | {{ item.img_link }}</p>
{% endfor %}