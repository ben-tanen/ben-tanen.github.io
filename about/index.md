---
layout: page
title:  "About"
---

{% capture about %}
<p>Hi! I’m Ben Tanen. I have a passion for thinking about, working with, and visualizing data of all forms. I’m a data analytics/science consultant aspiring to become a data journalist.</p>

<p>I studied computer science and math at Tufts University (2013 - 2017) and since then I’ve been working in data analytics and data science consulting for the past few years. Through my work, I’ve dealt with projects about patent infringement in cars, foreign exchange trading, television showrunning, and cryptocurrencies but the majority of my work has focused on healthcare economics with a specific focus on the (over)prescribing and distribution of opioids. During the summer of 2020, I also joined <a href="https://www.data2thepeople.org/">Data 2 The People</a>, a data science consulting group helping to elect down ballot candidates in the 2020 Election and beyond.</p>

<p>I currently live in Utah with my girlfriend and our dog. I love to cook and am trying to get my skills up to match my enthusiasm. I’m a huge fan of live music (I’ve been to over 100 shows) and I’m always looking for great new stuff to add to my <a href="https://www.last.fm/user/ben-tanen">digital</a> or <a href="http://link.ben-tanen.com/vinyl/">vinyl collections</a>. I love movies (catch me at Sundance and <a href="https://letterboxd.com/btanen/">on Letterboxd</a>) and am always down to chat about law and politics. When possible (i.e., pre- and post-COVID), I rock climb, ski and snowboard, and play a little pick up hockey. On occasion, I also make <a href="/projects/generative-sketchbook/">generative art sketches</a> and <a href="http://link.ben-tanen.com/photo/">take pictures with my camera</a>.</p>

<p><span id="currently-text">I'm currently listening to <a class="currently hidden" id="currently-music-name" target="_new">...............</a> from <span class="currently hidden" id="currently-music-artist">...............</span> and I'm reading <a class="currently hidden" id="currently-book-name" target="_new">...............</a> by <span class="currently hidden" id="currently-book-author">...............</span>.</span></p>
{% endcapture %}

<div id="face-container">
    <img src="/assets/img/me/face-g.JPG" alt="A picture of me with my dog, Penny, while riding a bike (Penny is in a basket)" />
    <img src="/assets/img/me/face-i.JPG" alt="A picture of me with my girlfriend while we sit on a couch looking at each other" />
    <img src="/assets/img/me/face-h.JPG" alt="A picture of me on a mountain" />
</div>

{{ about }}

## Resume - [PDF version](http://link.ben-tanen.com/resume/)

#### (Web version is a work in progress)

<style>

.post-header {
    display: none;
}

#face-container {
    width: 95%;
    margin: auto;
    margin-bottom: 8px;
}

#face-container img {
    display: inline-block;
    width: 31.5%;
    padding-right: 1%;
}

#currently-text {
    opacity: 0;
    -webkit-transition: opacity 0.75s ease;
    -moz-transition: opacity 0.75s ease;
    -o-transition: opacity 0.75s ease;
    transition: opacity 0.75s ease;
}

span.currently {
    font-weight: 600; 
}
</style>
<script>
$(document).ready(function() {
    // get and update listening data
    $.ajax({
        url: "http://bt-currently.herokuapp.com/getListening"
    }).done(function(data) {
        if (Object.keys(data).length >= 1 && data.song_artist != "") {

            if (data.song_name == null || data.song_name == "" && data.song_album != null) {
                $('#currently-music-name').html(data.song_album).attr('href', data.song_url).removeClass('hidden');
            } else {
                $('#currently-music-name').html(data.song_name).attr('href', data.song_url).removeClass('hidden');
            }

            $('#currently-music-artist').html(data.song_artist).removeClass('hidden');

            if (!$('#currently-book-name').hasClass('hidden')) {
                $('#currently-text').css('opacity', 1);
            }
        }
    });

    // get and update reading data
    $.ajax({
        url: "http://bt-currently.herokuapp.com/getReading"
    }).done(function(data) {
        if (Object.keys(data).length >= 1 && data.book_name != "") {

            $('#currently-book-name').html(data.book_name).attr('href', data.book_url).removeClass('hidden');
            $('#currently-book-author').html(data.book_author).removeClass('hidden');

            if (!$('#currently-music-name').hasClass('hidden')) {
                $('#currently-text').css('opacity', 1);
            }
        }
    });
});
</script>