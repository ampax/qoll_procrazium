Router.map(function(){
	this.route('home', {
		template : 'dashboard',
		path: '/',
		waitOn: function(){
			//add waiton for qolls from server to handle the latency for user here
		},
		data: {
			dashboard: function(){
				return 'xyz';
			}
		},
		before: [function(){
			//subscribe to the dashboard data here
			//Meteor.subscribe('all-qolls').wait();
			qlog.info('Subscribing to All_QOLL_PUBLISHER/QOLL_STATS_BY_ID ...', filename);
			Meteor.subscribe('All_QOLL_PUBLISHER');
			//Meteor.subscribe('QOLL_STATS_BY_ID', 'ZLfMenrHEEAYNtW3M');//passing a dummy id to subscribe to the publish
		}, function(){
			//Remove the active link and make this active
			//active_brand_nav();
		}],
		after: function () {
			// do post unloading of the page stuff here
		}
	});
});