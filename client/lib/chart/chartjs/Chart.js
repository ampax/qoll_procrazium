var filename='client/lib/chart/chartjs/Chart.js';

renderChart = function(chartdata, charttype, ctx){
	//TODO
}


var colors = {
    'color1' : '#CC00CC',
    'color2' : '#339933',
    'color3' : '#CCCC00',
    'color4' : '#006699',
    'color5' : '#F38630', 
    'color6' : '#E0E4CC', 
    'color7' : '#D4CCC5', 
    'color8' : '#949FB1',
    'color9' : '#4D5360'
};
var QollStats = new Meteor.Collection("qoll-stats-by-id");

chartStats = function(qoll, ctx){

    var statsStr ='', data=[],count=0;
	qlog.info('CHARTING qoll --------->>>>>'+qoll._id,filename);
	var ix = 0;
	for (var nm in qoll.stats) {
		if (qoll.stats.hasOwnProperty(nm)) {
			statsStr += nm+':'+ qoll.stats[nm] + ' ';
			ix=count%9+1;
            data.push({'value' : qoll.stats[nm], 'color' : colors['color'+ix], 'label' : nm, 'labelColor' : 'black'});
            count++;
		}
	}
	qlog.info('CHARTING qoll step2--------->>>>>'+qoll._id,filename);
	$('div.chartStats').text(statsStr);
    DoughnutChart(data, ctx);
	qlog.info('CHARTING qoll step3--------->>>>>'+qoll._id,filename);
    return 'Generating chart for qoll-id: ' + qoll._id;
}
