/*********************/
/*** INIT VARIABLE ***/
/*********************/

var oscars_svg = d3.select('#d3-oscars-popular');

var oscars_margin = {top: 39, right: 12, bottom: 33, left: 40},
    oscars_width  = $('#d3-oscars-popular').width() - oscars_margin.left - oscars_margin.right,
    oscars_height = $('#d3-oscars-popular').height() - oscars_margin.top - oscars_margin.bottom;

var data = [ ];

var showing = {dots: false, dots2018: false, highlight_dots2018: false, svm: false, svm_regions: false, better_svm: false, better_svm_regions: false}

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

function render_chart() {
    // add axes
    oscars_svg.append("g")
        .classed("oscars-axis", true)
        .attr("id", "oscars-x-axis")
        .attr("transform", `translate(${oscars_margin.left}, ${oscars_margin.top + oscars_height})`)
        .call(d3.axisBottom(oscars_x)
                .tickValues([0, 2e8, 4e8, 6e8, 8e8, 1e9])
                .tickFormat(function(d) {
                    var t = d3.format("$.1s")(d);
                    return(t.replace(/G/,"B"));
                }));

    oscars_svg.append("g")
        .classed("oscars-axis", true)
        .attr("id", "oscars-y-axis")
        .attr("transform", `translate(${oscars_margin.left}, ${oscars_margin.top})`)
        .call(d3.axisLeft(oscars_y)
                .ticks(4)
                .tickFormat(d3.format(".0%")));

    // add axes labels
    oscars_svg.append('text')
        .classed("oscars-axis-label", true)
        .attr("id", "oscars-x-axis-label")
        .attr('x', oscars_margin.left + oscars_x(5e8))
        .attr('y', oscars_margin.top + oscars_height + oscars_margin.bottom - 3)
        .text("Box Office");

    oscars_svg.append('text')
        .classed("oscars-axis-label", true)
        .attr("id", "oscars-y-axis-label")
        .attr('x', oscars_margin.left / 2)
        .attr('y', oscars_margin.top - 13)
        .text("Rating");

    // add title
    oscars_svg.append('text')
        .classed('oscars-title', true)
        .attr('id', 'oscars-title1')
        .attr('x', oscars_margin.left + oscars_width / 2)
        .attr('y', oscars_margin.top - (oscars_width < 250 ? 25 : 27))
        .style('font-size', oscars_width < 250 ? '12px' : '16px')
        .text("");

    oscars_svg.append('text')
        .classed('oscars-title', true)
        .attr('id', 'oscars-title2')
        .attr('x', oscars_margin.left + oscars_width / 2)
        .attr('y', oscars_margin.top - 12)
        .style('font-size', oscars_width < 250 ? '12px' : '16px')
        .text("Best Picture Nominees and Top Grossing Films, 2008 - 2017");

    if (oscars_width < 340) {
        oscars_svg.select('#oscars-title1').text("Best Picture Nominees and");
        oscars_svg.select('#oscars-title2').text("Top Grossing Films, 2008 - 2018");
    } else if (oscars_width < 430) {
        oscars_svg.select('#oscars-title1').text("Best Picture Nominees and Top Grossing Films");
        oscars_svg.select('#oscars-title2').text("2008 - 2018");
    }
}

function draw_dots(d) {
    oscars_svg.selectAll('.oscars-dot')
        .data(d)
        .enter().append('circle')
            .classed('oscars-dot', true)
            .classed('best-picture', function(d) { return d.best_picture; })
            .classed('top-grossing', function(d) { return d.top_grossing; })
            .classed('2018', function(d) { return d.release_year == 2018; })
            .attr('data-title', function(d) { return d.title; })
            .attr('data-year', function(d) { return d.release_year; })
            .attr('data-boxoffice', function(d) { return d.box_office; })
            .attr('data-rating', function(d) { return d.mean_rating; })
            .attr('r', 2.5)
            .attr('cx', function(d) { return oscars_margin.left + oscars_x(d.box_office); })
            .attr('cy', function(d) { return oscars_margin.top + oscars_y(d.mean_rating); })
            .style('display', showing.dots ? 'initial' : 'none')
            .style('opacity', function(d) {
                if (showing.dots) {
                    if (showing.highlight_dots2018 & d.release_year == 2018) return 1;
                    else if (showing.highlight_dots2018) return 0.15;
                    else return 1;
                } else {
                    return 0;
                }
            });

    new jBox('Tooltip', {
        attach: '.oscars-dot',
        content: "...",
        offset: {x: 2},
        onOpen: function() {
            var title      = $(this.source).attr('data-title'),
                year       = $(this.source).attr('data-year'),
                box_office = d3.format("$.4s")($(this.source).attr('data-boxoffice')),
                rating     = d3.format(".0%")($(this.source).attr('data-rating'));

            this.setContent(`<p><b>${title} (${year})</b></p><p>Box Office: ${box_office}</p><p>Rating: ${rating}</p>`);
        }
    });
}

function draw_svm() {
    // draw svm line
    oscars_svg.append('line')
        .attr('id', 'oscars-svm')
        .attr('x1', oscars_margin.left)
        .attr('x2', oscars_margin.left + oscars_x(2.75e8))
        .attr('y1', oscars_margin.top + oscars_y(0.44))
        .attr('y2', oscars_margin.top)
        .style('display', showing.svm ? 'initial' : 'none')
        .style('opacity', showing.svm ? 1 : 0);

    // add svm label
    oscars_svg.append('text')
        .attr('id', 'oscars-svm-label')
        .attr('x', oscars_margin.left + oscars_x(2.75e8))
        .attr('y', oscars_margin.top + 15)
        .text('SVM Line')
        .style('display', showing.svm ? 'initial' : 'none')
        .style('opacity', showing.svm ? 1 : 0);

    // draw svm regions 
    var polygons = [[{x: 0, y: 1}, {x: 0, y: 0.44}, {x: 2.75e8, y: 1}],
                    [{x: 0, y: 0.2}, {x: 0, y: 0.44}, {x: 2.75e8, y: 1}, {x: 1e9, y: 1}, {x: 1e9, y: 0.2}]]; 

    oscars_svg.selectAll(".oscars-svm-region")
        .data(polygons)
        .enter().append("polygon")
            .classed('oscars-svm-region', true)
            .attr('id', function(d) { return d.length == 3 ? 'oscars-svm-region-bp' : 'oscars-svm-region-tg'; })
            .attr("points", function(d) { 
                return d.map(function(d) {
                    var pts = [oscars_margin.left + oscars_x(d.x), oscars_margin.top + oscars_y(d.y)];
                    return pts.join(",");
                }).join(" ");
            })
            .style('display', showing.svm_regions ? 'initial' : 'none')
            .style('opacity', showing.svm_regions ? 1 : 0);
}

function draw_better_svm() {
    // draw svm line
    oscars_svg.append('line')
        .attr('id', 'oscars-better-svm')
        .attr('x1', oscars_margin.left)
        .attr('x2', oscars_margin.left + oscars_width)
        .attr('y1', oscars_margin.top + oscars_y(0.8))
        .attr('y2', oscars_margin.top + oscars_y(0.8))
        .style('display', showing.better_svm ? 'initial' : 'none')
        .style('opacity', showing.better_svm ? 1 : 0);

    // add svm label
    oscars_svg.append('text')
        .attr('id', 'oscars-better-svm-label')
        .attr('x', oscars_margin.left + oscars_width - 5)
        .attr('y', oscars_margin.top + oscars_y(0.8) + 15)
        .text('Ideal Dividing Line')
        .style('display', showing.better_svm ? 'initial' : 'none')
        .style('opacity', showing.better_svm ? 1 : 0);

    // draw svm regions 
    var polygons = [[{x: 0, y: 1}, {x: 1e9, y: 1}, {x: 1e9, y: 0.8}, {x: 0, y: 0.8}],
                    [{x: 0, y: 0.2}, {x: 1e9, y: 0.2}, {x: 1e9, y: 0.8}, {x: 0, y: 0.8}]]; 

    oscars_svg.selectAll('.oscars-better-svm-region')
        .data(polygons)
        .enter().append("polygon")
            .classed('oscars-better-svm-region', true)
            .attr('id', function(d) { return d[0].y == 1 ? 'oscars-better-svm-region-bp' : 'oscars-better-svm-region-tg'; })
            .attr("points", function(d) { 
                return d.map(function(d) {
                    var pts = [oscars_margin.left + oscars_x(d.x), oscars_margin.top + oscars_y(d.y)];
                    return pts.join(",");
                }).join(" ");
            })
            .style('display', showing.better_svm_regions ? 'initial' : 'none')
            .style('opacity', showing.better_svm_regions ? 1 : 0);
}

function animate_toggle_object(obj, showing, animate, duration) {
    if (showing) obj.style('display', 'initial');

    obj.transition()
        .duration(animate ? duration : 0)
        .style('opacity', showing ? 1 : 0);

    if (!showing) obj.transition().delay(duration).style('display', 'none');
}

function toggle_dots(animate) {
    showing.dots = !showing.dots;
    animate_toggle_object(oscars_svg.selectAll('.oscars-dot').filter(function() { return !d3.select(this).classed('2018'); }), showing.dots, animate, 500);
}

function toggle_dots2018(animate) {
    showing.dots2018 = !showing.dots2018;
    animate_toggle_object(oscars_svg.selectAll('.oscars-dot').filter(function() { return  d3.select(this).classed('2018'); }), showing.dots2018, animate, 500);
}

function toggle_svm(animate) {
    showing.svm = !showing.svm;
    animate_toggle_object(oscars_svg.selectAll('#oscars-svm, #oscars-svm-label'), showing.svm, animate, 500);
}

function toggle_svm_regions(animate) {
    showing.svm_regions = !showing.svm_regions;
    animate_toggle_object(oscars_svg.selectAll('.oscars-svm-region'), showing.svm_regions, animate, 500);
}

function toggle_better_svm(animate) {
    showing.better_svm = !showing.better_svm;
    animate_toggle_object(oscars_svg.selectAll('#oscars-better-svm, #oscars-better-svm-label'), showing.better_svm, animate, 500);
}

function toggle_better_svm_regions(animate) {
    showing.better_svm_regions = !showing.better_svm_regions;
    animate_toggle_object(oscars_svg.selectAll('.oscars-better-svm-region'), showing.better_svm_regions, animate, 500);
}

function toggle_highlight_dots2018(animate) {
    showing.highlight_dots2018 = !showing.highlight_dots2018;

    oscars_svg.selectAll('.oscars-dot')
        .filter(function() { return !d3.select(this).classed('2018'); })
        .transition()
        .duration(animate ? 500 : 0)
        .style('opacity', function() { return showing.highlight_dots2018 ? 0.15 : 1; });
}

function resize() {
    // resize column and svg
    $('#oscars-popular-viz-column').height($('#oscars-popular-text-column').height());
    $('#d3-oscars-popular').width($('.column#oscars-popular-viz-column').width());

    // delete exisiting plot
    d3.selectAll('.oscars-title').remove();
    d3.selectAll('.oscars-axis, .oscars-axis-label').remove();
    d3.selectAll('.oscars-dot').remove()
    d3.selectAll('#oscars-svm, #oscars-svm-label').remove()
    d3.selectAll('.oscars-svm-region').remove();
    d3.selectAll('#oscars-better-svm, #oscars-better-svm-label').remove()
    d3.selectAll('.oscars-better-svm-region').remove();

    // reset d3 width / height vars
    oscars_width  = $('#d3-oscars-popular').width() - oscars_margin.left - oscars_margin.right;
    oscars_height = $('#d3-oscars-popular').height() - oscars_margin.top - oscars_margin.bottom;

    // rescale plot
    oscars_x.range([0, oscars_width]);

    render_chart();
    draw_svm();
    draw_better_svm();
    draw_dots(data);
}

function sticky_scroll() {
    var screen_margin = ($(window).height() - $('#d3-oscars-popular').height()) / 2;
    var d3_container_top = $('#d3-oscars-popular').parent().offset().top;
    var d3_container_height = $('#d3-oscars-popular').parent().parent().height();

    // after focusing on svg, don't move it at bottom of column
    if (d3_container_top + d3_container_height - screen_margin <= $(window).scrollTop() + $('#d3-oscars-popular').height()) {
        var margin_top = d3_container_height - $('#d3-oscars-popular').height();
        $('#d3-oscars-popular').css({
            'position': 'initial',
            'margin-top': margin_top + 'px'
        });

    // while focusing on svg, center it
    } else if ($(window).scrollTop() + screen_margin >= d3_container_top) {
        $('#d3-oscars-popular').css({
            'position': 'fixed',
            'top': Math.max(120, screen_margin),
            'left': $('wrapper').css('padding-left'),
            'margin-top': 0,
            'width': $('.column#oscars-popular-viz-column').width()
        });
    
    // before encountering svg, don't move it at top of column
    } else {
        $('#d3-oscars-popular').css('position', 'initial');
    }
}

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

d3.csv("/projects/oscars-popular-film/data/movies.csv", function(d) {
    d.release_year = +d.release_year;
    d.best_picture = (+d.best_picture == 1 ? true : false);
    d.top_grossing = (+d.top_grossing == 1 ? true : false);
    d.box_office = +d.box_office;
    d.imdb_rating = +d.imdb_rating;
    d.rt_rating = +d.rt_rating;
    d.metacritic_rating = +d.metacritic_rating;
    d.mean_rating = +d.mean_rating;
    return d;
}, function(error, d) {
    for (var i = 0; i < d.length; i++) data.push(d[i]);

    oscars_x = d3.scaleLinear()
        .domain([0, 1e9])
        .range([0, oscars_width]);

    oscars_y = d3.scaleLinear()
        .domain([1, 0.2])
        .range([0, oscars_height]);

    render_chart();
    draw_svm();
    draw_better_svm();
    draw_dots(data);
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(document).ready(function() {
    // set height of viz column based on height of text column
    $('#oscars-popular-viz-column').height($('#oscars-popular-text-column').height());
});

$(window).resize(function() {
    resize();
});

$(window).scroll(function() {
    sticky_scroll();
});

$('span.intext-title').mouseenter(function() {
    var title = $(this).html();
    d3.select(`.oscars-dot[data-title='${title}']`).attr('r', 5);
});

$('span.intext-title').mouseleave(function() {
    var title = $(this).html();
    d3.select(`.oscars-dot[data-title='${title}']`).attr('r', 2.5);
});

