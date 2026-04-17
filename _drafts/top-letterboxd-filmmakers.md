---
layout: post
title: Who Are My Top Letterboxd Filmmakers?
date: '2023-11-01T14:00:00.000-06:00'
thumbnail: /assets/img/post-thumbnails/top-letterboxd-filmmakers-a33186d3.jpg
---

I have been a fairly avid user of Letterboxd for nearly five years now - [throw me a follow!](https://letterboxd.com/btanen/) I’ve liked the community aspects of the app but I especially love the data logging aspect, where I know what exactly I watched and when. With that plus Letterboxd’s catalog of film metadata on actors, directors, writers, etc. involved with each movie, I’ve always been a bit curious to know which actors and/or filmmakers I have unknowingly watched a lot from. 

Letterboxd does surface some of this information within their Pro Stats page - as of 11/01/2023, [Samuel L. Jackson](https://letterboxd.com/actor/samuel-l-jackson/) is my most watched actor (22 films), [Steven Spielberg](https://letterboxd.com/director/steven-spielberg/) is most most watched director (12 films), and [Charlie Brooker](https://letterboxd.com/writer/charlie-brooker/) is most watched writer (25 films, since all of Black Mirror is on Letterboxd as singular “films”). You can view my full stats [here](https://letterboxd.com/btanen/stats/).

{% include figure.html src="/assets/img/posts/top-letterboxd-filmmakers-c1a9f994.png" %}

{% include figure.html src="/assets/img/posts/top-letterboxd-filmmakers-64b7317e.png" %}

But this only focuses absolute number of films. Even though I’ve seen 22 of Samuel L. Jackson’s films, that’s only a measly 10% of his total filmography! So that begs the question: are there any actors/filmmakers that I have unknowingly watching most, if not all, of their filmography?

To answer that, I cracked out the ol’ Python scraping code and got to digging. And the results were… ultimately not *super* interesting. I did learn a few minor nuggets of information, but it wasn’t the crazy insightful analysis that I was expecting to warrant a few hours of work. Nevertheless, here are a few nuggets that I learned from this minor project:

- I have watched 100% of the filmographies of 1,738 different actors, writers, directors, etc. 
	- Of those, 95% of those people have only one film, thus making the 100% easy to achieve. 
	- Of the other 5% (88 instances), the most impressive instance is J.J. Abrams, for whom I’ve watched [all 6 of his directed films](https://letterboxd.com/director/jj-abrams/). I’ve also apparently seen [all five films featuring John Morris](https://letterboxd.com/actor/john-morris-3/), who voiced Andy in all four Toy Story films as well as “Santa Boy” in The Nightmare Before Christmas.
- Focusing on filmmakers with 5+ films, I have the highest completion rates for:
	- [J.J. Abrams (director)](https://letterboxd.com/director/jj-abrams/), 100% = 6/6 films
	- [John Morris (actor)](https://letterboxd.com/actor/john-morris-3/), 100% = 5/5 films
	- [Bo Burnham (director)](https://letterboxd.com/director/bo-burnham/), 88.9% = 8/9 films
		- I’ve never watched Chris Rock’s Tamborine, but since Bo is one of my favorites, I guess I should for the 100%.
	- [John Mulaney (writer)](https://letterboxd.com/writer/john-mulaney/), 87.5% = 7/8 films
	- [Jonathan Nolan (writer)](https://letterboxd.com/writer/jonathan-nolan/), 83.3% = 5/6 films
		- I haven’t seen the yet-unreleased Fallout TV series that Jonathan is apparently wrote/directed for.
	- [Joonas Suotamo (actor)](https://letterboxd.com/actor/joonas-suotamo/), 80% = 4/5 films
		- TIL: He apparently played (physically) Chewbacca in the sequel Star Wars saga films.
- Focusing on filmmakers with 10+ films, I have the highest completion rates for:
	- [Oliver Phelps (actor)](https://letterboxd.com/actor/oliver-phelps/), 75% = 9/12 films
		- See Oliver’s brother, James, below, where I get all of my watch credits from their appearances as Fred + George Weasely in Harry Potter
	- [Christopher Nolan (writer)](https://letterboxd.com/writer/christopher-nolan/), 73.3% = 11/15 films
		- I’ve seen 62.5% = 10/16 of [his directing credits](https://letterboxd.com/director/christopher-nolan/)
	- [James Phelps (actor)](https://letterboxd.com/actor/james-phelps/), 64.3% = 9/14 films
	- [Andrew Staton (writer)](https://letterboxd.com/writer/andrew-stanton/), 64.3% = 9/14 films
		- TIL: Apparently a writer on many of my favorite Pixar movies!
	- Jeff Pidgeon (actor), 61.1% = 11/18 films
		- TIL: Apparently a voice actor in many of my favorite Pixar movies, including the Aliens in the Toy Story movies.
- Among all filmmakers, I have the lowest completion rate for Mel Blanc, who is apparently credited with 1,034 different films, primarily from his work as voices of Bugs Bunny, Daffy Duck, Porky Pig, and other Looney Tunes characters during the “Golden Age of American animation.” I have only seen 2, or 0.2%, of his filmography.

So that’s what I learned! Now that I have this information, I might have some directed watching for the next few weeks, including about 1032 films including Mel Blanc!
