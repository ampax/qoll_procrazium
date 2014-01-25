var filename = 'client/lib/meteor/RoutAddQoll.js';

Router.map(function(){
	this.route('addqoll', {
		template: 'newqoll',
		path: '/newqoll',
		waitOn: function(){
			Meteor.subscribe('QOLL_GROUP_PUBLISHER');
		},
		before: [function(){
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
			Meteor.subscribe('QOLL_GROUP_PUBLISHER');
		}],
		after: function(){
			//TODO
		}
	});
});