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
}).then((d) => {

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
