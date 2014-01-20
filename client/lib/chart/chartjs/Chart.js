var filename='client/lib/chart/chartjs/Chart.js';

renderChart = function(chartdata, charttype, ctx){
	//TODO
}



var QollStats = new Meteor.Collection("qoll-stats-by-id");

chartStats = function(qoll, ctx, stat_ctx){

    var statsStr ='', data=[],count=0;
	qlog.info('CHARTING qoll --------->>>>>'+qoll._id,filename);
	var ix = 0;
	for (var nm in qoll.stats) {
		if (qoll.stats.hasOwnProperty(nm)) {
			statsStr += alphabetical[count]+':'+ qoll.stats[nm] + ' ';
			ix=count%9;
            data.push({'value' : qoll.stats[nm], 'color' : colors_numer[count], 'label' : nm, 'labelColor' : 'black'});
            count++;
		}
	}
	qlog.info('CHARTING qoll step2--------->>>>>'+qoll._id,filename);
	$(stat_ctx).text(statsStr);
    DoughnutChart(data, ctx);
	qlog.info('CHARTING qoll step3--------->>>>>'+qoll._id,filename);
    return 'Generating chart for qoll-id: ' + qoll._id;
}
