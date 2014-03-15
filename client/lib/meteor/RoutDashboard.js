var filename='client/lib/meteor/RoutDashboard.js';

//var AllQolls = new Meteor.Collection("all-qolls");
//var QollDetails = new Meteor.Collection("qoll-details-by-id");
//var QollRegist = new Meteor.Collection("qoll-regs");
QollsController = RouteController.extend({
	template: 'qolls',
	increment : 3,
	limit : function() {
		return parseInt(this.params.qollsLimit) || this.increment;
	},
	findOptions : function() {
		return {
			sort : {
				submittedOn : -1
			},
			limit : this.limit()
		};
	},
	waitOn : function() {
		return [Meteor.subscribe('All_QOLL_PUBLISHER', this.findOptions()),
			Meteor.subscribe('QOLL_REG_PUBLISHER')];
	},
	allqollsfun : function() {
		return AllQolls.find({}, this.findOptions());
	},
	data : function() {
		var hasMore = this.allqollsfun().count()  === this.limit();
		//qlog.info('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Counts '+this.allqollsfun().count() + "also "+ this.limit(), filename);
		var nextPath = this.route.path({
			qollsLimit : this.limit() + this.increment
		});
		return {
			qollList : this.allqollsfun(),
			nextPath : hasMore ? nextPath : null
		};
	}
}); 

Router.map(function(){
	this.route('dashboard', {
		template: 'qolls',
		path: '/dashboard/:qollsLimit?',
		controller: QollsController,
	});
});
/*
Router.map(function(){
	this.route('dashboard', {
		template: 'qolls',
		path: '/dashboard/:qollsLimit?',
		
		waitOn: function(){
			//add waiton for qolls from server to handle the latency for user here
			var lim = parseInt(this.params.qollsLimit) || 3;
			return [Meteor.subscribe('All_QOLL_PUBLISHER',{limit:lim}),
			Meteor.subscribe('QOLL_REG_PUBLISHER')];
		},
		before: [function(){
			//subscribe to the dashboard data here
			//Meteor.subscribe('all-qolls').wait();
			//qlog.info('Subscribing to All_QOLL_PUBLISHER/QOLL_STATS_BY_ID/USR_QOLL_TYPE_VAL ...', filename);
			//probably not needed Meteor.subscribe('All_QOLL_PUBLISHER');
			//probably not needed Meteor.subscribe('QOLL_REG_PUBLISHER');
			//Meteor.subscribe('QOLL_STATS_BY_ID', 'Jk8zMvBt4Wbd58tXA');//passing a dummy id to subscribe to the publish
		}, function(){
			//active_nav();
		}],
		after: function(){}
	});
});*/