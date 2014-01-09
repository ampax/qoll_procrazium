var filename = "client/views/qoll/qolls.js";

var AllQolls = new Meteor.Collection("all-qolls");
var QollDetails = new Meteor.Collection("qoll-details-by-id");

Template.qolls.helpers({
    allQolls: function(event){
        qlog.debug("Getting all the qolls ......", filename);                                                                                                                
        var q = AllQolls.find({}, {sort:{'submittedOn':-1}, reactive:true});
        qlog.info("Found qoll: " + JSON.stringify(q.fetch()), filename);
        return q;
    },
    iif: function(qollType){
        //qlog.info("Getting all the qollslkjhadkhaskf ......", filename);
        //qlog.info('iif(qollType):  ' + qollType, filename);
        if(qollType == 'yesno'){
            return Template['yesno']();
        }else if(qollType == 'yesnomaybe'){
            return Template['yesnomaybe']();
        }else{
            return Template['default']();
        }

        return Template['default']();
    },
    iif_yesno: function(qollType){
        //qlog.info('iif_yesno(qollType): ' + qollType, filename);
        if(qollType == 'yesno')
            return qollType;
    },
    iif_yesnomaybe: function(qollType){
        //qlog.info('iif_yesnomaybe(qollType): ' + qollType, filename);
        if(qollType == 'yesnomaybe')
            return qollType;
    },
    iif_likedislike: function(qollType){
        //qlog.info('iif_likedislike(qollType): ' + qollType, filename);
        if(qollType == 'likedislike')
            return qollType;
    },
    iif_likedislikeindiff: function(qollType){
        //qlog.info('iif_likedislikeindiff(qollType): ' + qollType, filename);
        if(qollType == 'likedislikeindiff')
            return qollType;
    },
    iif_default: function(qollType){
        //qlog.info('iif_default(qollType): ' + qollType, filename);
        if(qollType != 'yesno' && qollType != 'yesnomaybe' && qollType != 'likedislike' && qollType != 'likedislikeindiff')
            return 'default';
    }
});


Template.qolls.events({
    /**'click': function(){
        qlog.info('Selected to qoll: ' + this._id + ', qollText: ' + qollText, filename);                                                                                     
        Session.set('selected_qoll_id', this._id);
        Session.set('qollId', this._id);
    },**/

    'click a.yes': function(event){
        event.preventDefault();
        if(Meteor.userId()){
            var qollId = this._id;//Session.get('selected_qoll_id');
            qlog.info('Registering qoll for: ' + qollId+'/yes', filename);                                                                                                    
	        Meteor.call('registerQoll', qollId, 'yes', function(err, qollRegId){
                qlog.info('Registered qoll with id: ' + qollRegId+'/yes', filename);
            });
            ReactiveDataSource.refresh('qollstat'+ qollId);
        }
    },

    'click a.no': function(event){
        event.preventDefault();
        if(Meteor.userId()){
            var qollId = this._id;
            qlog.info('Registering qoll for: ' + qollId+'/no', filename);                                                                                                     
            Meteor.call('registerQoll', qollId, 'no', function(err, qollRegId){
                qlog.info('Registered qoll with id: ' + qollRegId+'/no', filename);
            });
        }
    },

    'click a.maybe': function(event){
        event.preventDefault();
        if(Meteor.userId()){
            var qollId = this._id;
            qlog.info('Registering qoll for: ' + qollId+'/maybe' + event, filename);                                                                                                     
            Meteor.call('registerQoll', qollId, 'maybe', function(err, qollRegId){
                qlog.info('Registered qoll with id: ' + qollRegId+'/maybe', filename);
            });
        }
    },

    'click .qoll-text': function(event) {
        event.preventDefault();
        qlog.info('clicked to fetch stats for qoll with id: ' + this._id, filename);
        //var handle = QollStats.find(this._id);
        //chartStats();
        //qlog.info('Recieved qlog register data: ' + this._id + ', value: ' + $("div.charts").html(), filename);
        //$("#chart").highcharts(handle);
        //$("#charts").html(chartStats(this._id));

        var ctx = $("#charts").get(0).getContext("2d");

        qlog.info('Generating chart now', filename);
        var str = chartStats(this._id,ctx);
        //LineChart(this._id, ctx);
        //PieChart(this._id, ctx);
        //DoughnutChart(this._id, ctx);
        return;
    }
});