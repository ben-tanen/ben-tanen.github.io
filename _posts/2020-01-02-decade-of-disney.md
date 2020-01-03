---
layout: post
title:  "The Decade of Disney"
date:   2020-01-02 05:05:41
categories: project data visualization disney movies monopoly
show-on-landing: true
landing-description: monopoly and how the 2010s were the decade of Disney
thumbnail: https://www.yourwdwstore.net/assets/images/1/10000/3000/100/13163-s2.jpg
---

<div class='columns two'>
    <div class='column'>
        <p>Last week, the Verge published <a href="https://www.theverge.com/2019/12/23/21034937/disney-star-wars-box-office-2019-marvel-pixar-star-wars-avengers-lion-king-frozen">an article</a> announcing that, with the release of the latest Star Wars film, Disney had produced 80% of the top box office films in 2019. The general reaction was understandably quite negative, but this news was not particularly surprising as it was just <a href="https://www.washingtonpost.com/news/business/wp/2017/12/14/disney-buys-much-of-fox-in-mega-merger-that-will-shake-world-of-entertainment-and-media/">the latest example</a> of Disney as a definite media giant and possible monopoly holder.</p>
        <p>Given the unprecedented and frankly somewhat scary implications of the Verge’s article, it’s worth exploring the meaning of and context around this 80% figure. This percentage reflects that Disney produced eight of the top ten highest grossing films in 2019, which they were able to secure once <i>Star Wars: The Rise of Skywalker</i> moved into the #10 spot after its big opening week (as of writing this, it has since moved up to the #6 spot). The seven other films included a mix of Marvel movies (<i>Avengers: Endgame</i>, <i>Captain Marvel</i>, <i>Spider-Man: Far From Home</i>), animated pictures (<i>Toy Story 4</i>, <i>Frozen II</i>), and remakes (<i>The Lion King</i>, <i>Aladdin</i>). The two non-Disney films were <i>Joker</i> and <i>It Chapter Two</i>, which came in at the #9 and #10 spots, respectively.</p>
    </div>
    <div class='column'>
        <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Disney produced an unprecedented 80 percent of the top box office hits this year <a href="https://t.co/9XMvqzEtMp">https://t.co/9XMvqzEtMp</a> <a href="https://t.co/rdtS96LRrl">pic.twitter.com/rdtS96LRrl</a></p>&mdash; The Verge (@verge) <a href="https://twitter.com/verge/status/1209312002054742016?ref_src=twsrc%5Etfw">December 24, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    </div>
</div>

Beyond the number of top 10 movies that Disney produced, it is worth considering the share of total box office gross captured by the House of Mouse, especially since those at the top earn quite a bit more than the 9th or 10th biggest movies. *Avengers: Endgame* earned nearly 60% more at the box office than the 2nd highest grossing movie, which was also a Disney movie, and more than four times what *It Chapter Two*, the 10th highest, grossed. So when we look at the total box office revenue, Disney actually captured nearly 90% of the gross among top movies.

| #| Film                             | Domestic Box Office (as of Jan 1, 2020) | Share of Top Box Office |
|--|----------------------------------|-----------------------------------------|-------------------------|
| 1| Avengers: Endgame                | $858,373,000                            | 19.7%                   |
| 2| The Lion King                    | $543,638,043                            | 12.5%                   |
| 3| Toy Story 4                      | $434,038,008                            | 10.0%                   |
| 4| Captain Marvel                   | $426,829,839                            |  9.8%                   |
| 5| Frozen II                        | $426,104,939                            |  9.8%                   |
| 6| Spider-Man: Far from Home        | $390,532,085                            |  9.0%                   |
| 7| Star Wars: The Rise of Skywalker | $377,488,536                            |  8.7%                   |
| 8| Aladdin                          | $355,559,216                            |  8.2%                   |
| 9| Joker                            | $333,494,002                            |  7.7%                   |
|10| It Chapter Two                   | $211,593,228                            |  4.9%                   |

<div class="columns two">
    <div class="column">
        <p style="padding-top: 20px;">While 2019 has been a standout year for Disney, they have always had a solid footing among top grossing films and their dominance has only increased over this past decade. In fact, the 2010s were really the decade for Disney. Of the top 50 grossing movies released from 2010 - 2019, Disney produced 56% (28) and accounted for 62% of the total domestic box office. In comparison, the studio that accounted for the second largest amount (Warner Bros.) produced 18% of the top 50 movies from the 2010s and accounted for 15% of the domestic box office from the decade. The fact that handfuls of other major studios can't even come close to the power of Disney is pretty remarkable and potentially alarming.</p>
        {% include figure.html autolink="yes" src="/assets/img/posts/disney-top-box-office-share.png" alt="A chart showing Disney's increasing box office share over time" %}
        <p>It hasn't always been this way. In the decades prior to the 2010s, Disney averaged just 15% of the top grossing films, which was much more comparable to other major studios like Warner Bros. and Universal. In fact, prior to the 2010s, Disney was the top studio in only the 1990s, which was a period known as <a href="https://en.wikipedia.org/wiki/Disney_Renaissance">the Disney Renaissance</a>. And still, even during the booming years of Disney classics like <i>The Lion King</i>, <i>Toy Story</i>, and <i>Beauty and the Beast</i>, Disney only captured 25% of the top box office.</p>
    </div>
    <div class="column">
        <div id="d3-dod-container">
            <div id="d3-dod-title">
                <h3>Top <span id="title-n-movies">50</span> Domestic Box Office Grosses for Movies Released Between 2010 and 2019</h3>
            </div>
            <svg id="d3-dod">
            </svg>
        </div>
    </div>
</div>

So what is there to be done about Disney? Should we even care? From a pure economics perspective, it feels like Disney is verging on attaining a somewhat obvious monopoly in the movie market, and as we all know, monopolies are bad! "But hold on," you might say, "more Disney means more of my favorites from Marvel and Pixar!" And while I love Captain America, Buzz Lightyear, and the whole gang as much as the next guy, this kind of monopolistic hold from Disney has some severe implications for the quality of all the other non-Disney movies that I also love.

In the 1940s, after years of anti-competitive behavior on the part of major movie studios, [the U.S. Supreme Court ruled to break up the "old Hollywood system"](https://en.wikipedia.org/wiki/United_States_v._Paramount_Pictures,_Inc.) since it was seen to limit choice for consumers and in turn stifle the creativity of the industry. While the current Disney dilemma is structurally very different from the cases of the 1940s, the implications and detrimental effects on the film industry are quite similar. In a world captivated by giant superhero epics and blockbuster live-action remakes, there may be a diminishing opening for novelty, weirdness, and outside-the-box film-making, especially as original film concepts are becoming riskier and riskier in the era of streaming. 

The film industry is a better place for the sake of (profitable!) movies like *Knives Out*, *Ad Astra*, and *Booksmart*. So while we wait for any actual government or industry intervention, I implore you to go see these kind of movies while you still can.

<style>
#d3-dod-container {
    width: 100%;
}

#d3-dod {
    width: 100%;
    height: 875px;
}

#d3-dod-title h3 {
    text-align: center;
    color: #77bdee;
}

text.axis-label {
    text-anchor: middle;
    font-size: 13px;
    font-weight: bold;
}

text#y-axis-label {
    text-anchor: start;
}

rect.bar {
    fill: #dadada;
}

rect.bar.disney {
    fill: #77bdee;
}

rect.bar-overlay {
    fill: rgba(0, 0, 0, 0);
}

text.bar-label {
    font-size: 12px;
    text-anchor: end;
    fill: #a9a9a9;
}

text.bar-label.disney {
    fill: white;
}

img.tooltip-logo {
    width: 120px;
}

</style>

<script>

/*********************/
/*** INIT VARIABLE ***/
/*********************/

let dod_svg = d3.select("#d3-dod");

let margin = {top: 25, right: 10, bottom: 10, left: 25},
    width  = $("#d3-dod").width() - margin.left - margin.right,
    height = $("#d3-dod").height() - margin.top - margin.bottom,
    is_mobile = (width >= 470 ? false : true);

// create empty list to store data
let data = [ ];

let n_movies = 50;

// set domains: x = box office gross, y = rank
let x = d3.scaleLinear().domain([0, 1e9]).range([0, width]),
    y = d3.scaleLinear().domain([0.5, n_movies + 0.5]).range([0, height]);

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

function strip_title(title) {
    return title.replace(/[^a-z0-9]/gmi, "");
}

function render_axis() {
    dod_svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisTop(x).ticks(5).tickFormat((d) => d3.format("$.0s")(d).replace("G", "B")));

    dod_svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(y).ticks(10).tickSizeOuter(0));

    /*
    dod_svg.append('text')
        .classed("axis-label", true)
        .attr("id", "x-axis-label")
        .attr("transform", `translate(${margin.left + width / 2}, ${margin.top - 25})`)
        .text("Domestic Box Office Gross");
    */

    dod_svg.append('text')
        .classed("axis-label", true)
        .attr("id", "y-axis-label")
        .attr("transform", `translate(${margin.left - 15}, ${margin.top}), rotate(90)`)
        .text("Rank");
}

function render_bars(n = n_movies, animate = false) {

    // limit data
    let data_lim = data.filter((d) => d.decaderank <= n);

    // create bars
    let bars = dod_svg.selectAll("rect.bar")
        .data(data_lim).enter()
        .append("rect")
        .classed("bar", true)
        .classed("disney", (d) => d.disney === 1)
        .attr("id", (d) => "bar" + strip_title(d.title))
        .attr("x", margin.left + 1)
        .attr("y", (d) => margin.top + y(d.decaderank - 0.5) + 1)
        .attr("width", 0)
        .attr("height", y(2) - y(1) - 1);

    // animate (if desired)
    if (animate) bars.transition().duration(200).attr("width", (d) => x(d.gross));
    else bars.attr("width", (d) => x(d.gross));

    // add text
    dod_svg.selectAll("text.bar-label")
        .data(data_lim).enter()
        .append("text")
        .classed("bar-label", true)
        .classed("disney", (d) => d.disney === 1)
        .attr("id", (d) => "label" + strip_title(d.title))
        .attr("x", (d) => margin.left + x(d.gross) - 5)
        .attr("y", (d) => margin.top + y(d.decaderank - 0.5) + 1)
        .attr("dy", (y(2) - y(1)) / 2 + 3)
        .text((d) => d.title);

    // if text is too long, shorten it
    dod_svg.selectAll("text.bar-label")
        .each(function(d) {
            if (this.getComputedTextLength() > x(d.gross) * 0.8) {
                let scale_factor = (x(d.gross) * 0.8) / this.getComputedTextLength();
                d3.select(this).text(d.title.substring(0, Math.floor(d.title.length * scale_factor) - 3) + "...");
            }
        })

    // create bar overlays for tooltips
    dod_svg.selectAll("rect.bar-overlay")
        .data(data_lim).enter()
        .append("rect")
        .classed("bar-overlay", true)
        .attr("id", (d) => "bar" + strip_title(d.title))
        .attr("x", margin.left + 1)
        .attr("y", (d) => margin.top + y(d.decaderank - 0.5) + 1)
        .attr("width", (d) => x(d.gross))
        .attr("height", y(2) - y(1) - 1);

    // add tooltips for bars
    new jBox("Tooltip", {
        attach: "rect.bar-overlay",
        content: "...",
        position: {
            x: 'right',
            y: 'center'
        },
        outside: 'x',
        onOpen: function() {
            let d = d3.select(this.source[0]).data()[0];

            // add logo to tooltip
            if (d.disney === 1 & d.marvel === 1) img_str = "<p><img class='tooltip-logo' src='/assets/img/posts/disney-marvel-logo.png' /></p>";
            else if (d.disney === 1 & d.starwars === 1) img_str = "<p><img class='tooltip-logo' src='/assets/img/posts/disney-star-wars-logo.png' /></p>";
            else if (d.disney === 1 & d.pixar === 1) img_str = "<p><img class='tooltip-logo' src='/assets/img/posts/disney-pixar-logo.png' /></p>";
            else if (d.disney === 1) img_str = "<p><img class='tooltip-logo' src='/assets/img/posts/disney-logo.png' /></p>";
            else img_str = ""; 

            // set content
            this.setContent(`${img_str}<p>${d.title} (${d.year}): ${d3.format("$,d")(d.gross)}</p>`);
        }
    });
}

function resize() {

    // delete existing elements
    dod_svg.selectAll("#x-axis, #y-axis, text.axis-label, rect.bar, text.bar-label, rect.bar-overlay").remove();

    // update width properties and scales
    width = $("#d3-dod").width() - margin.left - margin.right;
    x.range([0, width]);

    // rerender
    render_axis();
    render_bars();
}

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

d3.csv("/assets/data/top-movies-from-2010s.csv", (d) => {
    d.year = +d.year;
    d.yearrank = +d.yearrank;
    d.decaderank = +d.decaderank;
    d.gross = +d.gross;
    d.disney = +d.disney;
    d.marvel = +d.marvel;
    d.starwars = +d.starwars;
    d.pixar = +d.pixar;
    return d;
}, (e, d) => {
    if (e) throw e;

    // store data for later
    for (let i = 0; i < d.length; i++) data.push(d[i]);

    // update chart title if necessary
    d3.select("#title-n-movies").text(n_movies);

    // draw axis and bars
    render_axis();
    render_bars();
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(window).resize(resize);

</script>


