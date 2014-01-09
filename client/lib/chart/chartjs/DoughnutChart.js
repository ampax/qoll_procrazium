var filename='client/lib/chart/chartjs/DoughnutChart.js';

sampleDoughnutChart = function(id, ctx){
    var data = [
		{
			value: 30,
			color:"#F7464A"
		},
		{
			value : 50,
			color : "#E2EAE9"
		},
		{
			value : 100,
			color : "#D4CCC5"
		},
		{
			value : 40,
			color : "#949FB1"
		},
		{
			value : 120,
			color : "#4D5360"
		}

	];

    //Get context with jQuery - using jQuery's .get() method.
    //var ctx = $("#charts").get(0).getContext("2d");
    //This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx);

    new Chart(ctx).Doughnut(data);
}

DoughnutChart = function(data, ctx){
	var chart = new Chart(ctx).Doughnut(data);

    /**chart.Doughnut.defaults = {
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 2,
        percentageInnerCutout : 50,
        animation : true,
        animationSteps : 100,
        animationEasing : "easeOutBounce",
        animateRotate : true,
        animateScale : false,
        onAnimationComplete : null,
        labelFontFamily : "Arial",
        labelFontStyle : "normal",
        labelFontSize : 24,
        labelFontColor : "#666"
    };**/
}