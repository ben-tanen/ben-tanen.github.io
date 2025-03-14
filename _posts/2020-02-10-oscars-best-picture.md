---
layout: post
title:  "The Best Films That Don't Win Best Picture"
date:   2020-02-10 15:05:41
thumbnail: /assets/img/post-thumbnails/oscars-best-picture.png
landing-proj:  true
landing-order: 13|9|16
landing-img:   /assets/img/proj-thumbnails/oscars-best-picture.png
landing-large: false
new-post-style: true
---



On Sunday, *Parasite* made history as the first foreign language film to win the highly coveted Best Picture award at this year’s Academy Awards. The film is a magnificent achievement and was, in my opinion, the right choice. However, in the weeks leading up to the ceremony, it was highly speculated that *Parasite* would lose to [*1917*](https://www.nytimes.com/2020/02/06/movies/oscars-2020-nominations-predictions.html), even though [most critics believed](https://www.cnet.com/news/oscars-2020-predictions-1917-parasite-joker-once-upon-a-time-in-hollywood/) *Parasite* was the superior movie. All of this was also coming a year after [*Green Book* won](https://www.vox.com/culture/2019/2/25/18239309/oscars-2019-green-book-best-picture) over (believed to be) superior films like *Roma*, *The Favourite*, and *BlackKlansman*. Needless to say, before *Parasite* actually won, there were low hopes that the Academy would make the best choice.

{% include figure.html autolink="yes" src="/assets/img/posts/oscars-best-picture-2019-new.jpg" alt="A visualization of some of the best movies of 2019, colored based on if they were a Best Picture nominee" width="700px" %}

Beyond the discussion of which Best Picture nominee was most deserving of the prize, many have pointed out that the Academy’s shortlist of films did not even include some of the best films of the year. Films like *Uncut Gems*, *The Farewell*, and *Dolemite Is My Name* were all [notoriously snubbed this year](https://ew.com/oscars/2020/01/13/oscar-nominations-2020-snubs-surprises/), though this has become somewhat of the norm at the Oscars.

In an attempt to quantify all of this and mentally prepare myself for what I expected was going to be a loss for *Parasite*, midway through the Awards, I [tweeted a series of charts](https://twitter.com/ben_tanen/status/1226683722277191680) showing the Best Picture nominees from the past few years stacked up against other comparable non-nominated films. These showed how many great films the Academy had overlooked when they made their nominations and how the eventual winners compared to those overlooked films. Though never perfect, it was clear that the Academy does a better job in some years than others. In 2016, though some of the nominees were worse than other non-nominated films, *Moonlight* was considered the best of the best and won the prize to prove it. On the other hand, in 2018, nominees like *Bohemian Rhapsody* and *Vice* were far inferior to many, many other non-nominees, which was only made worse by the fact that *Green Book* was generally considered one of the worst nominees that year.

Now that we have the benefit of knowing who won Best Picture, this year’s Best Picture category looked a bit like a mix of 2016 and 2018 - the best film won the big prize but many great films weren’t nominated. Most people can now rest easy knowing a worthy movie won but it's worth remembering all those great movies that did not get the recognition they deserved, this year and in years past. For those curious, see below for a full breakdown of the Best Picture nominees and other (often better) non-nominated films from the past 20 years as well as a few of my top (mildly data-driven, mildly personal) picks. See you all again in 11 months when the rage cycle starts all over again!

***Update (Feb 8, 2024):** I decided to revisit this and update the graphic to include data for 2020 - 2023. I also re-wrote my code, which should allow me to more easily refresh this for many years to come!*

***Update (Mar 3, 2025):** Just pushed an update for the 2024 Oscars - congrats to Anora for the win!*

<div id="d3-obp-container">
    <div id="d3-obp-title">
        <h3>Best Picture nominees vs. other comparable non-nominated films, <span id="d3-obp-title-min-year">2000</span> - <span id="d3-obp-title-max-year">2024</span></h3>
    </div>
    <svg id="d3-obp">
    </svg>
</div>

<h3 style='padding-left: 30px; margin-bottom: 5px; color: #77bdee;'>BT's Picks: Great Films Not Nominated for Best Picture</h3>

- 2019: *Uncut Gems*, *The Farewell*, *Dolemite Is My Name*, *I Lost My Body*, *Ad Astra*, *Midsommar*, *Booksmart*, *Knives Out*, *Luce*
- 2018: *Eighth Grade*, *Sorry to Bother You*, *Minding the Gap*, *Beautiful Boy*
- 2017: *The Florida Project*, *The Meyerowitz Stories (New and Selected)*
- 2016: *The Nice Guys*, *The Lobster*
- 2015: *Ex Machina*
- 2014: *Nightcrawler*
- 2013: *Fruitvale Station*
- 2012: *Moonrise Kingdom*
- 2011: *Drive*
- 2008: *WALL-E*
- 2007: *The King of Kong: A Fistful of Quarters*
- 2006: *Children of Men*, *Borat*
- 2002: *Spirited Away*, *Adaptation.*

{% capture methodology-note %}
Best Picture nominees were taken from <a href="http://awardsdatabase.oscars.org/">the Official Academy Awards Database</a> and then matched to their respective titles on <a href="https://www.metacritic.com/">Metacritic</a>. All films that were ranked higher than the lowest scoring Best Picture nominee (based on <a href="https://www.metacritic.com/browse/movies/score/metascore/year/filtered?year_selected=2019&sort=desc">Metacritic's Best Movies By Year list</a>) were included (as of Feb 20, 2025).

Some films on Metacritic's list likely did not qualify for Best Picture nominations (e.g., <i>Apocalypse Now: Final Cut</i>, an extended version of the 1979 film, was released in 2019 but likely would not qualify). However, the Academy's qualifications have changed over time and <a href="https://www.liveabout.com/qualifying-for-best-picture-oscar-4071766">generally require information submitted by studios directly to the Academy</a>, which can be difficult to find online. Therefore, for the sake of completeness, all films listed on Metacritic were included.

The film's year indicates the year of release, not the year of the Oscars ceremony associated with the film.
{% endcapture %}
{% include methodology-note.html content=methodology-note break='yes' %}

<style>
#d3-obp-container {
    width: 100%;
}

#d3-obp {
    width: 100%;
    height: 4800px;
}

#d3-obp-title h3 {
    text-align: center;
    color: #77bdee;
}

#d3-obp-title p {
    text-align: center;
}

#x-axis-label {
    text-anchor: middle;
    font-size: 12px;
}

line.y-axis-line {
    stroke: #dadada;
}

#y-axis g.tick text {
    font-size: 14px;
}

#y-axis path.domain {
    stroke: none;
}

text.legend {
    font-size: 12px;
}

text.stat-line1, text.stat-line2 tspan {
    font-size: 12px;
}

circle.film {
    stroke: #C3C3C3;
    stroke-width: 1.5px;
    fill: #D4D4D4;
    cursor: pointer;
}

@media (max-width: 840px) {
    circle.film {
        stroke-width: 0.5px;
    }
}

circle.film.oscars-nom {
    fill: #E35DEF;
    stroke: #515151;
}

circle.film.oscars-win {
    fill: #FFDD0A;
    stroke: #515151;
}
</style>

<script>

/*********************/
/*** INIT VARIABLE ***/
/*********************/

let obp_svg = d3.select("#d3-obp");

let margin = {top: 200, right: 105, bottom: 65, left: 40},
    width  = $("#d3-obp").width() - margin.left - margin.right,
    height = $("#d3-obp").height() - margin.top - margin.bottom,
    is_mobile = (width >= 470 ? false : true);

// set domains: x = projected probability, y = actual probability
let x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

// create empty list to store data
let data = [ ];

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

function render_axes() {
    obp_svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top - height / 40 - 10})`)
        .call(d3.axisTop(x));

    obp_svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(y).ticks(20).tickFormat(d3.format("d")));

    obp_svg.append('text')
        .classed("axis-label", true)
        .attr("id", "x-axis-label")
        .attr("transform", `translate(${margin.left + width / 2}, ${margin.top - height / 40 - 35})`)
        .text("Metacritic Score");

    obp_svg.selectAll('line.y-axis-line')
        .data(d3.range(y.domain()[0], y.domain()[1] + 1)).enter()
        .append("line")
        .classed("y-axis-line", true)
        .attr("id", (d) => "y-axis-line-" + d)
        .attr("x1", margin.left)
        .attr("y1", (d) => margin.top + y(d) + 0.5)
        .attr("x2", margin.left + width)
        .attr("y2", (d) => margin.top + y(d) + 0.5);
}

function render_statlines() {
    let sl1 = obp_svg.selectAll("text.stat-line1")
        .data(d3.range(y.domain()[0], y.domain()[1] + 1)).enter()
        .append("text")
        .classed("stat-line1", true)
        .attr("y", (d) => margin.top + y(d) - 62);

    sl1.selectAll("tspan")
        .data((d) => `${data.filter((e) => e.year === d & e.oscars_nom === 0 & e.metacritic_score > e.min_oscar_nom_metacritic_score).length} non-nominated\nfilms were better\nthan the lowest\nscoring nominee`.split("\n")).enter()
        .append("tspan")
        .text((d) => d)
        .attr("x", margin.left + width + 5)
        .attr("dx", 0)
        .attr("dy", 12);

    let sl2 = obp_svg.selectAll("text.stat-line2")
        .data(d3.range(y.domain()[0], y.domain()[1] + 1)).enter()
        .append("text")
        .classed("stat-line2", true)
        .attr("y", (d) => margin.top + y(d) + 10);

    sl2.selectAll("tspan")
        .data((d) => `${data.filter((e) => e.year === d & e.oscars_nom === 0 & e.metacritic_score > e.oscar_win_metacritic_score).length} non-nominated\nfilms were better\nthan the Best\nPicture winner`.split("\n")).enter()
        .append("tspan")
        .text((d) => d)
        .attr("x", margin.left + width + 5)
        .attr("dx", 0)
        .attr("dy", 12);
}

function render_legend() {

    let mob = width < 250,
        legend_width = mob ? 221 : 337;

    let legend = obp_svg.append("g")
        .classed("legend", true)
        .attr("transform", `translate(${margin.left + (width - legend_width) / 2}, 10)`);

    legend.append("circle")
        .classed("film", true)
        .classed("oscars-win", true)
        .classed("legend", true)
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", 4);

    legend.append("text")
        .classed("legend", true)
        .attr("x", 20)
        .attr("y", 14)
        .text((mob ? "" : "Best Picture ") + "Winner");

    legend.append("circle")
        .classed("film", true)
        .classed("oscars-nom", true)
        .classed("legend", true)
        .attr("cx", (mob ? 72 : 135))
        .attr("cy", 10)
        .attr("r", 4);

    legend.append("text")
        .classed("legend", true)
        .attr("x", (mob ? 82 : 145))
        .attr("y", 14)
        .text((mob ? "" : "Best Picture ") + "Nominee");

    legend.append("circle")
        .classed("film", true)
        .classed("legend", true)
        .attr("cx", (mob ? 144 : 270))
        .attr("cy", 10)
        .attr("r", 4);

    legend.append("text")
        .classed("legend", true)
        .attr("x", (mob ? 154 : 280))
        .attr("y", 14)
        .text("Non-Nominee");
}

function render_points() {

    // create circles
    obp_svg.selectAll("circle.film:not(.legend)")
        .data(data).enter()
        .append("circle")
        .classed("film", true)
        .classed("oscars-nom", (d) => d.oscars_nom === 1)
        .classed("oscars-win", (d) => d.oscars_win === 1)
        .attr("id", (d) => "film" + d.year + "-" + d.metacritic_rank)
        .attr("cx", (d) => margin.left + x(d.metacritic_score))
        .attr("cy", (d) => margin.top + y(d.year) + y_jitter(d.tie_rank) * 10)
        .attr("jitter", (d) => y_jitter(d.tie_rank))
        .attr("r", width > 550 ? 4 : (width > 420 ? 3 : 2));

    // add tooltips for circles
    new jBox("Tooltip", {
        attach: "circle.film",
        content: "...",
        offset: {x: 4},
        onOpen: function() {
            let d = d3.select(this.source[0]).data()[0];

            this.setContent(`<p><b>${d.title} (${d.year})</b></p>
                             <p>Metacritic score: ${d.metacritic_score} (#${d.metacritic_rank} of ${d.year})</p>
                             <p>${d.oscars_nom === 1 ? "Best Picture " + (d.oscars_win === 1 ? "Winner" : "Nominee") : "Not nominated for Best Picture"}</p>`);
        }
    });

}

function y_jitter(r) {
    return((r % 2 === 1 ? 1 : -1) * Math.floor(r / 2));
}

function resize() {

    // delete existing elements
    obp_svg.selectAll("#x-axis, #y-axis, text.axis-label, line.y-axis-line, g.legend, text.stat-line1, text.stat-line2, circle.film").remove();

    // update width properties and scales
    width = $("#d3-obp").width() - margin.left - margin.right;
    x.range([0, width]);

    // rerender
    render_axes();
    render_statlines();
    render_legend();
    render_points();
}

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

d3.csv("/projects/oscars-best-picture/data/metacritic-topmovies-byyear-2000to2024.csv", (d) => {
    d.year = +d.year;
    d.metacritic_score = +d.metacritic_score;
    d.metacritic_rank = +d.metacritic_rank;
    d.oscars_nom = +d.oscars_nom;
    d.oscars_win = +d.oscars_win;
    d.min_oscar_nom_rank = +d.min_oscar_nom_rank;
    d.oscar_win_rank = +d.oscar_win_rank;
    d.tie_rank = +d.tie_rank;
    return d;
}, (e, d) => {
    if (e) throw e;

    // limit to relevant data and store for later
    d = d.filter((d) => d.metacritic_rank <= d.min_oscar_nom_rank);
    for (let i = 0; i < d.length; i++) data.push(d[i]);

    // set domain for scales
    x.domain(d3.extent(data, (d) => d.metacritic_score)).nice();
    y.domain(d3.extent(data, (d) => d.year));

    // draw axes and initial points
    render_axes();
    render_statlines();
    render_legend();
    render_points();

    // update title with latest years
    d3.extent(data, (d) => d.year).map((d, i) => {
        d3.select(`#d3-obp-title-${i == 0 ? "min" : "max"}-year`).text(d);
    })
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(window).resize(resize);

</script>


