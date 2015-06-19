---
layout: post
title:  "Gallery Test"
date:   2015-07-02 15:05:41
categories: test Gallery
gallery:
    - caption: "this is a test"
      img_link: "heyyy"
    - caption: "test #2"
      img_link: "heoje;kele"
---

This is a test for a gallery object:

<div class='gallery-name'>
{% for item in page.gallery %}
  <div><p>{{ item.caption }} | {{ item.img_link }}</p></div>
{% endfor %}
</div>

<script>
$(document).ready(function(){
  $('.gallery-name').slick();
});
</script>