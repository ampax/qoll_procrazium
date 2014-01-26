var filename = 'client/lib/meteor/RoutAddQoll.js';

Router.map(function(){
	this.route('addqoll', {
		template: 'newqoll',
		path: '/newqoll',
		waitOn: function(){
			Meteor.subscribe('OPEN_QOLL_PUBLISHER');
		},
		before: [function(){
			qlog.info('Subscribing to OPEN_QOLL_PUBLISHER ...', filename);
			Meteor.subscribe('OPEN_QOLL_PUBLISHER');
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		after: function(){
			//TODO
		}
	});
});