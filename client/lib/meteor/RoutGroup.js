var filename = 'client/lib/meteor/RoutGroup.js';

Router.map(function(){
	this.route('managecontacts', {
		template: 'managecontacts',
		path: '/managecontacts',
		waitOn: function(){
			
		},
		before: [function(){
	
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		after: function(){
			//TODO
		}
	});
});