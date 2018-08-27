// define scrolly steps
var scroll_fxns = [
    {
        enter: function() { toggle_dots(true); },
        exit: function() { toggle_dots(true); }
    },
    {
        enter: function() { 
            toggle_svm(true); 
            setTimeout(function() {
                toggle_svm_regions(true);
            }, 500)
        },
        exit: function() { 
            toggle_svm(true);
            toggle_svm_regions(true);
        }
    },
    {
        enter: function() {
            toggle_dots2018(true);
            toggle_highlight_dots2018(true);
        },
        exit: function() { 
            toggle_dots2018(true); 
            toggle_highlight_dots2018(true);
        }
    },
    {
        enter: function() {
            toggle_highlight_dots2018(true);
            toggle_svm_regions(true);
            toggle_better_svm(true);
            toggle_better_svm_regions(true);
        },
        exit: function() {
            toggle_highlight_dots2018(true);
            toggle_svm_regions(true);
            toggle_better_svm(true);
            toggle_better_svm_regions(true);
        }
    }
]

// set up scrolly triggering
enterView({
    selector: '.step-trigger',
    enter: function(el) {
        scroll_fxns[$(el).attr('data-step')].enter()
    },
    exit: function(el) {
        scroll_fxns[$(el).attr('data-step')].exit()
    },
    offset: 0.6
});