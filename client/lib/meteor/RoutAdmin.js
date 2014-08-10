var filename = 'client/lib/meteor/RoutAdmin.js';

Router.map(function(){
	this.route('admin', {
		template: 'admin',
		path: '/admin',
		waitOn: function(){
			
		},
		onBeforeAction: [function(){
	
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		onAfterAction: function(){
			//TODO
		}
	});
});