var filename = 'client/lib/meteor/RoutGroup.js';

Router.map(function(){
	this.route('managecontacts', {
		template: 'newgroup',
		path: '/newgroup',
		waitOn: function(){
			Meteor.subscribe('RECIPIENTS_PUBLISHER');
		},
		before: [function(){
			Meteor.subscribe('RECIPIENTS_PUBLISHER');
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		after: function(){
			//TODO
		}
	});

	this.route('managecontacts_adv', {
		template: 'managecontacts_adv',
		path: '/managecontacts_adv',
		waitOn: function(){
			Meteor.subscribe('QOLLERS_PUBLISHER');
		},
		before: [function(){
			Meteor.subscribe('QOLLERS_PUBLISHER');
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		after: function(){
			//TODO
		}
	});
});