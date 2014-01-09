var filename = 'client/lib/meteor/RoutAddQoll.js';

Router.map(function(){
	this.route('addqoll', {
		template: 'newqoll',
		path: '/newqoll',
		waitOn: function(){
			//add waiton for qolls for user from server to handle the latency for user here
			Meteor.subscribe('All_QOLL_PUBLISHER');
		},
		before: [function(){
			//subscribe to the dashboard data here
			//Meteor.subscribe('all-qolls').wait();
			qlog.info('Subscribing to All_QOLL_PUBLISHER/ALL_QOLL_TYPE_STANDARD ...', filename);
			Meteor.subscribe('All_QOLL_PUBLISHER');
			//Meteor.subscribe('QOLL_STATS_BY_ID', 'Jk8zMvBt4Wbd58tXA');//passing a dummy id to subscribe to the publish
			Meteor.subscribe('ALL_QOLL_TYPE_STANDARD');
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		after: function(){
			//TODO
		}
	});
});