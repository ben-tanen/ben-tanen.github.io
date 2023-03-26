---
layout: page
title:  "About"
---

{% capture about %}
<p>Hi! I’m Ben Tanen. I have a passion for thinking about, working with, and visualizing data of all forms. I’m a data scientist and data journalist looking for looking to use interesting data to tell more interesting stories.</p>

<p>I graduated from Tufts University in 2017, where I studied computer science and math, and since then I’ve worked in a number of roles in data science and data analytics consulting. Through my work, I’ve dealt with projects about patent infringement in cars, grassroots political campaigns, foreign exchange trading, streaming music editorial, healthcare economics, television showrunning, podcasts, cryptocurrencies, and the (over)prescribing of opiods. I currently focus on music and talk content as a data scientist and visualization specialist at Spotify. Prior to that, I worked at <a href="https://www.analysisgroup.com/">Analysis Group</a> and <a href="https://www.data2thepeople.org/">Data 2 The People</a>.</p>

If you're interested, you can find more info on my work experience via [LinkedIn](https://www.linkedin.com/in/bentanen/) or my resume [here](/resume/Resume - Benjamin Tanen.pdf).

<p>I currently live in Utah with my fiancée and our dog. I love to cook and am trying to get my skills up to match my enthusiasm. I’m a huge fan of live music and I’m always looking for great new stuff to add to my <a href="https://www.last.fm/user/ben-tanen">digital</a> or <a href="https://www.notion.so/btnotion/4e61be4d03ce487b857c60681029c3d9?v=9a4eb9452a984763b46455fc8c867d54">vinyl collections</a>. I love movies (catch me at Sundance and <a href="https://letterboxd.com/btanen/">on Letterboxd</a>) and am always down to chat about law and politics. When possible (i.e., pre- and post-COVID), I rock climb, ski and snowboard, and play a little pick up hockey. On occasion, I also make <a href="/projects/generative-sketchbook/">generative art sketches</a> and <a href="/photography">take pictures with my camera</a>.</p>

<p>If you're interested in knowing <b>even more</b> about me, I have a bit more on <a href="https://btnotion.notion.site/btnotion/Welcome-to-BT-Notion-23406746c8f64abaa8108e4bc75bf51f">this personal Notion site</a>. You can also find a bit more on <a href="https://twitter.com/ben_tanen/">Twitter</a>.</p>
{% endcapture %}

<div id="face-container">
    <img src="/assets/img/me/face-j.JPG" alt="A picture of me sitting on a rock, wearing a hoodie and overalls" />
    <img src="/assets/img/me/face-k.JPG" alt="A picture of me sitting close with my fiancée on a bench outside on a porch" />
    <img src="/assets/img/me/face-l.JPG" alt="A picture of my dog Penny, a small cava-poo-chon" />
</div>

{{ about }}

<style>

.post-header {
    display: none;
}

.main p {
    text-align: left;
    line-height: 1.5;
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