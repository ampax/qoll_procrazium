var filename='client/lib/chart/chartjs/PieChart.js';

samplePieChart = function(id, ctx){
    var data = [
        {
            value: 30,
            color:"#F38630"
        },
        {
            value : 50,
            color : "#E0E4CC"
        },
        {
            value : 100,
            color : "#69D2E7"
        }           
    ];

    //Get context with jQuery - using jQuery's .get() method.
    //var ctx = $("#charts").get(0).getContext("2d");
    //This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx);

    new Chart(ctx).Pie(data);
}

PieChart = function(id, ctx){
    var data = [
        {
            value: 30,
            color:"#F38630"
        },
        {
            value : 50,
            color : "#E0E4CC"
        },
        {
            value : 100,
            color : "#69D2E7"
        }           
    ];

    //Get context with jQuery - using jQuery's .get() method.
    //var ctx = $("#charts").get(0).getContext("2d");
    //This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx);

    new Chart(ctx).Pie(data);
}