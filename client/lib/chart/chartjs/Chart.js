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

chartStats = function(id, ctx){

    var stats;
    //Deps.flush();
    var comp = Deps.autorun(function(){
        ReactiveDataSource.depend('qollstat' + id);


        qlog.info('Generating chart for qoll-id: ' + id);
        Meteor.subscribe('QOLL_DETAILS_BY_ID', id, function(){
            qlog.info('QOLL_DETAILS_BY_ID subscription complete', filename);
        });
        var h = Meteor.subscribe('QOLL_STATS_BY_ID', id, function(){
            qlog.info('QOLL_STATS_BY_ID subscription complete', filename);
        });
        if(h.ready()) {
            stats = QollStats.find({qollId : id}, {reactive:true});

            /**stats.observe({
                added: function(doc){
                    qlog.info('Added document: ' + doc, filename);
                },
                changed: function(doc){
                    qlog.info('Changed the document: ' + doc, filename);
                }
            });**/

            //qlog.info("found the qoll-stat for id: " + JSON.stringify(stats.find({_id : id})));
            //qlog.info("Found stats in autorun: " + JSON.stringify(stats) + ', length: ' + stats.length, filename);
            qlog.info('Printing the item ---->>>> ' + JSON.stringify(stats.collection.docs[id].data), filename);
            var statsStr = ' ';
            var count = 1;
            var data = new Array();
            _.each(stats.collection.docs[id].data, function(val, item) {
                qlog.info('Printing the item ---->>>> ' + item + ':' + val, filename);
                if(item != '_id') {
                    count += 1;
                    statsStr += item+':'+val + ' ';
                    data.push({'value' : val, 'color' : colors['color'+count], 'label' : item, 'labelColor' : 'black'});
                }
            });
            //new Chart(ctx).Doughnut(data);
            $('div.chartStats').text(statsStr);
            DoughnutChart(data, ctx);
            //var ctx = $("#charts").get(0).getContext("2d");
            qlog.info('Printing data: ' + data, filename);
            return statsStr;
        }
    });

    //var stats = QollStats.find({qollId : id}, {reactive:true});
    //qlog.info("Found stats: " + JSON.stringify(stats) + ', length: ' + stats.length, filename);

    /**for(item in stats){
        qlog.info('item--------------->: ' + JSON.stringify(item));
    }

    stats.forEach(function(item){
        qlog.info('item--------------->>>>: ' + JSON.stringify(item));
    });**/

    //qlog.info('Generating chart for qoll-id: ' + id + ', stats: ' + JSON.stringify(stats));

    return 'Generating chart for qoll-id: ' + id + ', stats: ' + JSON.stringify(stats);
}