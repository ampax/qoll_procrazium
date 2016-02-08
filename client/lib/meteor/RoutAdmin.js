var filename = 'client/lib/meteor/RoutAdmin.js';


AdminController = RouteController.extend({
	waitOn : function() {
		[Meteor.subscribe('ALL_SHARE_CIRCLES_ASSIGN'), 
		Meteor.subscribe('ALL_SHARE_CIRCLES')];
	},
	data : function() {
		return {qs: AllShareCircle.find(), qsca : AllShareCircleAssign.find()};
	}
});

/**Router.map(function(){
	this.route('admin_qoll', {
		template: 'admin_qoll',
		path: '/admin_qoll',
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
**/

Router.map(function() {
	this.route('admin_qoll', {
		template : 'admin_qoll',
		path : '/admin_qoll',
		controller : AdminController,
	});
});