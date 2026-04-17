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
}).then((d) => {

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
