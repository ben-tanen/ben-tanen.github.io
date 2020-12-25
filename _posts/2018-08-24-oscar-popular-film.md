---
layout: post
minimal: yes
title: "Popular Movies vs. Great Films at the Oscars"
date: 2018-08-24 05:00:00
thumbnail: /assets/img/post-thumbnails/oscars-popular.png
landing-proj:  true
landing-order: 17
landing-img:   /assets/img/proj-thumbnails/oscar-popular-film.png
landing-large: false
---


<link rel="stylesheet" href="/projects/oscars-popular-film/css/main.style.css">

<p>In August 2018, the Academy of Motion Picture Arts and Sciences <a href="https://www.hollywoodreporter.com/race/academy-plans-three-hour-oscars-telecast-adds-popular-film-category-1133138">announced</a> the addition of a new category for “outstanding achievement in popular film” for the 2019 Oscars. Dubbed as the “Popcorn Oscar,” the category is one of a few efforts the Academy is trying to rally more interest in their annual awards show, which has been losing viewership in recent years. This year’s category will likely feature <i>Black Panther</i>, <i>Mission: Impossible - Fallout</i>, and <i>Avengers: Infinity Wars</i>, some of the years highest grossing films.</p>

<p>However, the inclusion of the new category insinuates certain things about popular films. By creating a category with the explicit intention of celebrating “popular film” when there is already the highly sought after Best Picture category, the Academy seems to be implying that achievement for popular movies is different than achievement for other films. Obviously popular movies need not be quality - there is no shortage of <a href="https://www.thewrap.com/emoji-movie-summers-worst-reviewed-film-dunkirk-box-office/">crappy</a> <a href="http://fortune.com/2017/06/26/transformers-last-knight-box-office/">yet</a> <a href="https://deadline.com/2018/02/fifty-shades-freed-crosses-300-million-worldwide-box-office-1202302086/">popular</a> movies - but there certainly are films that are both popular and good. Including this additional category seemingly makes the statement that there are popular movies, those that will be considered for the Popcorn Oscar, and there are great films, those that will be considered for the Best Picture category.  </p>

<div class="columns two" id="oscars-popular-columns">
    <div class="column" id="oscars-popular-text-column">
        <p class="step-trigger" data-step=0>While I disagree with this premise, I was curious to know if there was any notable way to distinguish the movies that might fall into these two categories. Without <a href="https://www.vox.com/culture/2018/8/8/17664682/oscars-popular-film-category-2019">any concrete definition</a> of what the Academy considers a “popular” film, the best proxy for popularity (and likely something that the Academy will heavily, if not entirely, consider) is a film’s box office gross. So to compare the great films and the popular movies, I took a look at <span style="color: rgb(244, 196, 4)">the Best Picture nominees</span> and <span id="footnote-1" style="color: rgb(35, 206, 107)">other top grossing films</span> from the last 10 years.</p>
        <div class="text-cell">
            <p>Right off the bat, it does seem relatively easy to separate the Best Picture nominees from the rest of the pack. For the most part, films nominated for Best Picture are highly rated and generally make less than $200 million, with a few exceptions including <span class="intext-title">Avatar</span> and <span class="intext-title">Toy Story 3</span>. There is a bit of mixing in with the other top grossing films, but it seems like we could relatively easily draw a straight line that would for the most part separate these two categories of films.</p>
            <p>In fact, to get such a dividing line, we could use a <a href="https://medium.com/machine-learning-101/chapter-2-svm-support-vector-machine-theory-f0812effc72">support vector machine</a>, or SVM, which is a supervised learning method used for the classification of data. The goal of an SVM is to find and draw a hyperplane (in our case, read this as “line”) that can most accurately divide our data into two sets. After we compute our best fitting SVM, we can <span class="step-trigger" data-step=1>plot it</span> and use the dividing line to see how our data becomes partitioned. Since we’re hoping to divide past Best Picture nominees from popular non-nominated movies, these partioned sets might indicate which films would be considered for the Best Picture category and which would be considered for the popular film category.</p>
        </div>
        <div class="text-cell">
            <p>It seems like our SVM actually does a pretty good job. On the <span style="color: rgb(244, 196, 4)">Best Picture</span> side, the only non-nominated film that we incorrectly categorized was <span class="intext-title">WALL-E</span>, which to be honest is more of a mistake by the Academy than by our SVM since that movie is superb.</p>
            <p>On the <span style="color: rgb(35, 206, 107)">Popular Movies</span> side, there is a smattering of Best Picture nominees like <span class="intext-title">Inception</span> and <span class="intext-title">Gravity</span> who also grossed a decent amount, which distinguishes them from a traditional Best Picture nominee. Though these mischaracterized Best Picture nominees actually lead to an interesting question about this new category: if the Popcorn Oscar was around at the time, would these films still have been nominated for Best Picture? Would they have been nominated for both? For the films that straddle this dividing line like <span class="intext-title">The Revenant</span>, the answer is probably yes. But if the category existed at the time, the Academy may have nominated bigger blockbusters like <span class="intext-title">Avatar</span> for the popular film category instead of Best Picture.</p>
        </div>
        <div class="text-cell">
            <p>Beyond using our SVM to retroactively classify movies, we can also use it to predict how the Academy may categorize and nominate movies for the upcoming 2019 Oscars. For this, we can consider some of the most popular and thus far highest grossing films of 2018 as well as some films that have been getting early buzz as likely Oscar contenders.</p>
            <p class="step-trigger" data-step=2>On the popular side, let's consider <span class="intext-title">Black Panther</span>, <span class="intext-title">Mission: Impossible - Fallout</span>, <span class="intext-title">Avengers: Infinity Wars</span>, <span class="intext-title">Incredibles 2</span>, and <span class="intext-title">Jurassic World: Fallen Kingdom</span>. Based on <a href="https://www.indiewire.com/2018/04/2019-oscars-best-picture-predictions-1201954918/">picks from "the experts"</a>, let's consider <span class="intext-title">Leave No Trace</span> and <span class="intext-title">BlacKkKlansman</span>, though most of the likely contenders have not yet come out and thus their box office pull is unknown.</p>
        </div>
        <p>Our 2018 films primarily fall where we would expect, with all of our likely Best Picture picks in the top left and the top grossing scattered more to the right. The one exception is <span class="intext-title">Mission: Impossible - Fallout</span>, which falls cleanly in <span style="color: rgb(244, 196, 4)">Best Picture</span> territory. However, while our SVM predicts it might be a Best Picture nominee, I would be <b>shocked</b> if the Academy nominated the action-heavy Tom Cruise film for Best Picture.</p>
        <p>On the other side, while it is safely outside of the <span style="color: rgb(244, 196, 4)">Best Picture</span> segment due to its high box office gross, <span class="intext-title">Black Panther</span> has obviously gotten a lot of buzz and has been heavily discussed as a likely Best Picture nominee. The cultural significance and phenomenon behind the film (plus the Academy's desire to not have another #OscarsSoWhite) does make it likely for Black Panther to overcome the norm of this divide.</p>
        <p class="step-trigger" data-step=3>At the end of the day, this has been more of an exercise in data science than in film studies. I admit that it’s a relatively silly exercise for me to separate these movies into popular vs. great, but I think more importantly, it would be even more ridiculous for the Academy to do the same. The Academy Awards should be about celebrating achievement in film, regardless of popularity, and acknowledging the best pictures as such, even if they were box office hits. In an ideal world, the dividing line between Best Picture nominees and other films should be based on quality, transitioning the focus from the upper left corner of our plot to simply those at the top.</p>
    </div>
    <div class="column" id="oscars-popular-viz-column">
        <svg id="d3-oscars-popular">
        </svg>
    </div>
</div>

<p style="margin-bottom: 5px">P.S. As I mentioned, this was more of a data-driven exercise and discussion from an avid fan of film, but also from someone who is not a film expert by any stretch of the imagination. For more articulate and/or nuanced discussions on this matter, consider checking out these pieces:</p>

<ul style="margin-bottom: 25px">
    <li><a href="https://www.youtube.com/watch?v=SnLscTKCavY">From Karsten Runquist</a></li>
    <li><a href="https://www.vox.com/culture/2018/8/8/17664682/oscars-popular-film-category-2019">From Todd VanDerWerff at Vox</a></li>
    <li><a href="https://www.vox.com/culture/2018/8/9/17665634/oscars-new-categories">From Todd VanDerWerff, Genevieve Koski, Alissa Wilkinson, and Aja Romano from Vox</a></li>
    <li><a href="https://www.newyorker.com/culture/the-front-row/what-the-oscars-new-popular-film-category-says-about-the-artand-businessof-the-movies">From Richard Brody at the New Yorker</a></li>
</ul>

<p style="margin-bottom: 35vh">P.P.S. Since writing this, <a href="https://www.nytimes.com/2018/09/06/business/media/academy-awards-popular-film.html">the Academy decided</a> to ditch their plan for the Popcorn Oscar, at least temporarily. There was a pretty prompt and outspoken negative reaction from the public when the Academy announced their original plan for the new category, which may have contributed to their later decision to scrap the idea, but they may have also come to their senses after reading this very piece. Who's really to say...</p>

<script type="text/javascript" src="/projects/oscars-popular-film/js/story.js"></script>
<script type="text/javascript" src="/projects/oscars-popular-film/js/main.js"></script>
