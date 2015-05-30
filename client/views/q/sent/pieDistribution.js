function builtPieDistribution(data) {

    $('#container-pie').highcharts({
        
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        
        title: {
            text: ''
        },
        
        credits: {
            enabled: false
        },
        
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        
        series: [{
            type: 'pie',
            name: 'Response',
            data: data
        }]
    });
};

Template.pieDistribution.rendered = function() {
    var q = QuestionaireForId.findOne();
    var stats = q.stats;

    var data_hash = {};

    stats.forEach(function(s){
        var resp = s.responses[0];
        console.log(resp.response);
        if(data_hash[resp.response]  == undefined) {
            data_hash[resp.response] = 1;
        } else {
            data_hash[resp.response] += 1;
        }
    });

    var counter = 0;
    var data = new Array();
    var data_hash_keys = _.keys(data_hash);
    data_hash_keys.map(function(ky){
        data.push({
            name: ky,
            y: data_hash[ky],
            color: chart_colors[counter]//#55BF3B'
        });
        
        counter++;
        if(counter == chart_colors.length) counter = 0;
    });

    console.log('========================');
    console.log(data);
    console.log(data_hash);
    console.log('========================');

    builtPieDistribution(data);
};