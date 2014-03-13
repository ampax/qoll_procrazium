var filename='client/lib/meteor/RoutDashboard.js';
Router.map(function(){
	this.route('dashboard', {
		template: 'qolls',
		path: '/dashboard',
		waitOn: function(){
			//add waiton for qolls from server to handle the latency for user here
			return [Meteor.subscribe('All_QOLL_PUBLISHER',{limit:3}),
			Meteor.subscribe('QOLL_REG_PUBLISHER')];
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
});