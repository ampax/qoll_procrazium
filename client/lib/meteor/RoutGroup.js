var filename = 'client/lib/meteor/RoutGroup.js';

//--------------------------------------------------------------------------------------------------//
//------------------------------------------- Controllers ------------------------------------------//
//--------------------------------------------------------------------------------------------------//
// Controller for group pages

GroupPageController = FastRender.RouteController.extend({
  waitOn: function() {
  	qlog.info('before subscribing to allFriends', filename);
    Meteor.subscribe('allFriends');
  },
  data: function() {
    //Router.go(UserUtil.getProfileUrl(findById), {replaceState: true});
    return {allFriends : AllFriends.find({})};
  }
});


//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Routes ---------------------------------------------//
//--------------------------------------------------------------------------------------------------//


Router.map(function(){
	this.route('managecontacts', {
		template: 'newgroup',
		path: '/newgroup',
		waitOn: function(){
			Meteor.subscribe('RECIPIENTS_PUBLISHER');
		},
		onBeforeAction: [function(){
			Meteor.subscribe('RECIPIENTS_PUBLISHER');
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		onAfterAction: function(){
			//TODO
		}
	});

	this.route('managecontacts_adv', {
		template: 'managecontacts_adv',
		path: '/managecontacts_adv',
		waitOn: function(){
			Meteor.subscribe('QOLLERS_PUBLISHER');
		},
		onBeforeAction: [function(){
			Meteor.subscribe('QOLLERS_PUBLISHER');
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		onAfterAction: function(){
			//TODO
		}
	});

	this.route('contact_tool', {
		template: 'contact_tool',
		path: '/contact_tool',
		waitOn: function(){
			//
		},
		onBeforeAction: [function(){
			//
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		onAfterAction: function(){
			//TODO
		}
	});

	this.route('group_circle', {
		template: 'group_circle',
		path: '/group_circle',
		waitOn: function(){
			//
		},
		onBeforeAction: [function(){
			//
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		onAfterAction: function(){
			//TODO
		}
	});

	this.route('social_circle', {
		template: 'social_circle',
		path: '/social_circle',
		controller: GroupPageController
	});
});