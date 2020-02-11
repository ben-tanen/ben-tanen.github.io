---
layout: post
title:  "The Best Films That Don't Win Best Picture"
date:   2020-02-09 15:05:41
categories: project data visualization movies oscars
show-on-landing: true
thumbnail: /assets/img/post-thumbnails/oscars-best-picture.png
landing-description: how many great films can be ignored by the Academy of Motion Picture Arts and Sciences
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit. In dicta magnam ullam, repellat, asperiores, rem commodi tempore expedita mollitia impedit consequuntur saepe quod alias nesciunt dignissimos inventore excepturi suscipit blanditiis?

{% include figure.html autolink="yes" src="/assets/img/posts/oscars-best-picture-2019.jpg" alt="A visualization of some of the best movies of 2019, colored based on if they were a Best Picture nominee" %}

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis assumenda asperiores modi deserunt eaque quis saepe delectus. Asperiores, earum qui? Non deleniti ut eum dolorem quam fuga quia laboriosam magni?

<div id="d3-obp-container">
    <div id="d3-obp-title">
        <h3>Best Picture nominees vs. other comparable non-nominated films, 2000 - 2019</h3>
    </div>
    <svg id="d3-obp">
    </svg>
</div>

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, ut. Reiciendis fugiat reprehenderit illum eveniet at dolorem blanditiis, nesciunt ipsam praesentium, consequuntur eligendi ducimus ex corrupti ullam incidunt sunt labore!

{% capture methodology-note %}
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id, sapiente, dolores. Sunt suscipit quia, quisquam earum ipsa adipisci illo eos. Harum ex ipsum, aperiam quaerat dolorum est debitis laboriosam nulla.
{% endcapture %}
{% include methodology-note.html content=methodology-note break='yes' %}

<style>
#d3-obp-container {
    width: 100%;
}

#d3-obp {
    width: 100%;
    height: 4000px;
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

text.stat-line1, text.stat-line2 tspan {
    font-size: 12px;
}

circle.film {
    stroke: #515151;
    stroke-width: 1.5px;
    fill: #D4D4D4;
    cursor: pointer;
}

@media (max-width: 840px) {
    circle.film {
        stroke-width: 1px;
    }
}

circle.film.oscars-nom {
    fill: #E35DEF; 
}

circle.film.oscars-win {
    fill: #FFDD0A;
}
</style>

<script>

/*********************/
/*** INIT VARIABLE ***/
/*********************/

let obp_svg = d3.select("#d3-obp");

let margin = {top: 150, right: 105, bottom: 70, left: 40},
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

    let sl1 = obp_svg.selectAll("text.stat-line1")
        .data(d3.range(y.domain()[0], y.domain()[1] + 1)).enter()
        .append("text")
        .classed("stat-line1", true)
        .attr("y", (d) => margin.top + y(d) - 62);

    sl1.selectAll("tspan")
        .data((d) => `${data.filter((e) => e.year === d & e.oscars_nom === 0).length} non-nominated\nfilms were better\nthan the lowest\nscoring nominee`.split("\n")).enter()
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
        .data((d) => `${data.filter((e) => e.year === d & e.oscars_nom === 0 & e.metacritic_rank < e.oscar_win_rank).length} non-nominated\nfilms were better\nthan the Best\nPicture winner`.split("\n")).enter()
        .append("tspan")
        .text((d) => d)
        .attr("x", margin.left + width + 5)
        .attr("dx", 0)
        .attr("dy", 12);
}

function render_points() {

    // create circles
    obp_svg.selectAll("circle.film")
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
    obp_svg.selectAll("#x-axis, #y-axis, text.axis-label, line.y-axis-line, text.stat-line1, text.stat-line2, circle.film").remove();

    // update width properties and scales
    width = $("#d3-obp").width() - margin.left - margin.right;
    x.range([0, width]);

    // rerender
    render_axes();
    render_points();
}

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

d3.csv("/assets/data/metacritic-topmovies-byyear.csv", (d) => {
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

    // draw axes and initla points
    render_axes();
    render_points();
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(window).resize(resize);

</script>


