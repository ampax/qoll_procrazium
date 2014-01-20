Router.map(function(){
	this.route('home', {
		template : 'brand_name',
		path: '/',
		waitOn: function(){
			//add waiton for qolls from server to handle the latency for user here
		},
		data: {
			
		},
		before: [function(){
			//subscribe to the dashboard data here
			//Meteor.subscribe('all-qolls').wait();
			//Meteor.subscribe('QOLL_STATS_BY_ID', 'ZLfMenrHEEAYNtW3M');//passing a dummy id to subscribe to the publish
		}, function(){
			//Remove the active link and make this active
			//active_brand_nav();
		}],
		after: function () {
			// do post unloading of the page stuff here
		}
	});


	this.route('home', {
		template : 'brand_name',
		path: '/home',
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