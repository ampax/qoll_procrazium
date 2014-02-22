var filename='client/lib/meteor/RoutDashboard.js';
Router.map(function(){
	this.route('dashboard', {
		template: 'qolls',
		path: '/dashboard',
		waitOn: function(){
			//add waiton for qolls from server to handle the latency for user here
			Meteor.subscribe('All_QOLL_PUBLISHER');
			//Meteor.subscribe('USR_QOLL_TYPE_VAL');
		},
		before: [function(){
			//subscribe to the dashboard data here
			//Meteor.subscribe('all-qolls').wait();
			qlog.info('Subscribing to All_QOLL_PUBLISHER/QOLL_STATS_BY_ID/USR_QOLL_TYPE_VAL ...', filename);
			Meteor.subscribe('All_QOLL_PUBLISHER');
			Meteor.subscribe('QOLL_REG_PUBLISHER');
			//Meteor.subscribe('QOLL_STATS_BY_ID', 'Jk8zMvBt4Wbd58tXA');//passing a dummy id to subscribe to the publish
		}, function(){
			//active_nav();
		}],
		after: function(){}
	});

	this.route('dashboard_new', {
		template: 'dashboard',
		path: '/dashboard_new',
		waitOn: function(){
			//add waiton for qolls from server to handle the latency for user here
			//Meteor.subscribe('USR_QOLL_TYPE_VAL');
		},
		before: [function(){
			//subscribe to the dashboard data here
			//Meteor.subscribe('all-qolls').wait();
			//Meteor.subscribe('QOLL_STATS_BY_ID', 'Jk8zMvBt4Wbd58tXA');//passing a dummy id to subscribe to the publish
		}, function(){
			//active_nav();
		}],
		after: function(){}
	});
});