$.ajax({
    type: "GET",
    url: "http://bt-dbs.herokuapp.com/wakeUp",
    dataType: "text",
    success: function(d) {}
});

$.ajax({
    type: "GET",
    url: "http://bt-currently.herokuapp.com/wakeUp",
    dataType: "text",
    success: function(d) {}
});
