function builtColumnDistribution(title, data_xAxis, data_series) {

    $('#container-column').highcharts({
        
        chart: {
            type: 'column'
        },
        
        title: {
            text: title
        },
        
        subtitle: {
            text: 'Columner Distribution of Responses'
        },
        
        credits: {
            enabled: false
        },
        
        xAxis: {
            categories: data_xAxis
        },
        
        yAxis: {
            min: 0,
            title: {
                text: 'Answered By (n)'
            }
        },
        
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        
        series: data_series
    });
};


/*
 * Call the function to built the chart when the template is rendered
 */
Template.columnDistribution.rendered = function() {
    var q = QuestionaireForId.findOne();
    var stats = q.stats;

    var data_recipients = [];
    var data_arr_hash = {};

    // initialize the data array
    var data_series = [ {name: 'NA', data: []},
                        {name: 'Correct', data: []}, 
                        {name: 'InCorrect', data: []}];

    var data_xAxis = [];
    var counter=1;
    while(counter <= q.qoll_count) {
        data_xAxis.push('Q'+counter);
        counter++;
        data_series[0].data.push(0);
        data_series[1].data.push(0);
        data_series[2].data.push(0);
    }

    stats.forEach(function(s){
        data_recipients.push(s.name);

        counter = 0;
        s.responses.forEach(function(res){
            console.log(res);
            var idx = undefined;
            if('NA' === res.response) {
                // console.log('Not Answered');
                idx = 0;
            } else if(res.iscorrect) { //iscorrect is defined
                qlog.info('===============> 1 ' + res.iscorrect + '/' + res.cat, filename);
                var iscorct = true;
                if(res.cat === QollConstants.QOLL_TYPE.BLANK) { //this is a fill in the blanks
                    res.iscorrect.forEach(function(isc){
                        iscorct = iscorct && isc; // all fill in the blank answers are correct
                        qlog.info('===============> 1.1 ' + iscorct + '/' + isc, filename);
                    });

                    if(iscorct) idx = 1; // if correct
                    else idx = 2; // else not correct
                } else { // this is a multiple choice question
                    qlog.info('===============> 2 ' + res.iscorrect, filename);
                    if(res.iscorrect) idx = 1; // is correct
                    else idx = 2; // is not correct
                }
            } else {
                qlog.info('===============> 3 ' + res.iscorrect, filename);
                // console.log('InCorrect');
                idx = 2; // it is incorrect
            }

            data_series[idx].data[counter] += 1;
            counter++;
        });
        /** var resp = s.responses[0];
        
        console.log(resp.response);

        if(data_hash[resp.response]  == undefined) {
            data_hash[resp.response] = 1;
        } else {
            data_hash[resp.response] += 1;
        } **/
    });

    //console.log(data_xAxis);
    //console.log(data_series);


    var data = new Array(); 
    builtColumnDistribution(q.title, data_xAxis, data_series); // data
};
