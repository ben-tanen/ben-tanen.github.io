---
layout: post
title:  "Gallery Test"
date:   2015-07-02 15:05:41
categories: test Gallery
gallery:
    - caption: "this is a test"
      img_link: "/img/posts/infographics_ex.png"
    - caption: "test #2"
      img_link: "/img/posts/infographics_ex.png"
---

This is a test for a gallery object:

<div class='gallery-name'>
{% for item in page.gallery %}
  <div><img src={{ item.img_link }} /></div>
{% endfor %}
</div>

<script>
$(document).ready(function(){
  $('.gallery-name').slick({
    arrows: true
  });
});
</script>