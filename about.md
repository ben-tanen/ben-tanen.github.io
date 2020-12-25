---
layout: page
title:  "About"
---


{% capture about %}
<p>Hi! I'm Ben Tanen. I have a passion for thinking about, working with, and visualizing data of all forms, and I aspire to use data to tell interesting stories. I graduated from Tufts University in 2017 and I currently work in data consulting at Analysis Group. In the past, I've worked as a software developer and analyst at a few different software, finance, and consulting companies.</p>

<p>I'm always looking for great music to add to <a href="http://link.ben-tanen.com/vinyl/">my collection</a> and I love chatting about filmmaking, law, and politics. On occasion, I make <a href="/projects/generative-sketchbook/">generative art sketches</a> and take <a href="http://link.ben-tanen.com/photo/">pictures</a> with my camera.</p>

<p><span id="currently-text">I'm currently listening to <a class="currently hidden" id="currently-music-name" target="_new">...............</a> from <span class="currently hidden" id="currently-music-artist">...............</span> and I'm reading <a class="currently hidden" id="currently-book-name" target="_new">...............</a> by <span class="currently hidden" id="currently-book-author">...............</span>.</span></p>
{% endcapture %}

<div class="columns two">
    <div class="column">{{ about }}</div>
    <div class="column">
        {% include figure.html src="/assets/img/me/face-g.JPG" alt="A picture of me with my dog, Penny" %}
    </div>
</div>

<style>
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

## Resume - [PDF version](http://link.ben-tanen.com/resume/)

#### (Work in progress)