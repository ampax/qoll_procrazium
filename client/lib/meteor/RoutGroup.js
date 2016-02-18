var filename = 'client/lib/meteor/RoutGroup.js';

//--------------------------------------------------------------------------------------------------//
//------------------------------------------- Controllers ------------------------------------------//
//--------------------------------------------------------------------------------------------------//
// Controller for group pages

GroupPageController = RouteController.extend({
  waitOn: function() {
  	qlog.info('before subscribing to allFriends', filename);
    Meteor.subscribe('allFriends');
  },
  data: function() {
    //Router.go(UserUtil.getProfileUrl(findById), {replaceState: true});
    return {allFriends : AllFriends.find({})};
  }
});

MyGroupsController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 } };
	},
	waitOn : function() {
		[Meteor.subscribe('QOLL_MY_GROUP_QUERY', this.findOptions()), 
		Meteor.subscribe('USER_SUBSCRIPT_GROUPS', this.findOptions()),
		Meteor.subscribe('GROUP_COLLAB_ASSIGNMENTS', this.findOptions()),
		Meteor.subscribe('MY_PENDING_SUBSCRIPTIONS', this.findOptions()),
		Meteor.subscribe('MY_PENDING_APPROVALS_REQ_GRP'),
		Meteor.subscribe('MY_SHARE_CIRCLES_ASSIGN')];
	},
	data : function() {
		return {
			groups: MyGroups.find(),
			subsc_groups : UserSubscGroups.find(),
			collab_groups : CollabGroups.find(),
			my_pending_subscriptions : MyPendingSubscriptions.find(),
			my_pending_approval_req_group: MyPendingApprovalsReqGroup.find(),
			my_share_circle_assign: MyShareCircleAssign.find()
		};
	}
});

SingleGroupController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 },  _id : this.params._id, ctx : this.params.social_ctx };
	},
	waitOn : function() {
		qlog.info('Waiting on subscriptions for controller - ' + SingleGroupController, filename);
		[Meteor.subscribe('GROUP_FOR_ID_QUERY', this.findOptions()),
		 Meteor.subscribe('MEMBERS_FOR_GROUP_ID', this.findOptions()),
		 Meteor.subscribe('MY_QOLL_CONNECTS', this.findOptions()),];
	},
	data : function() {
		return {
			//group: GroupForId.find(),
			groupName : this.params.groupName,
			groupDesc : this.params.groupDesc,
			groupId   : this.params._id,
			members   : MembersForGroupId.find(),
		};
	}
});

QollConnectsController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 } };
	},
	waitOn : function() {
		qlog.info('Waiting on subscriptions for all-qoll-user controller - connects controller', filename);
		[Meteor.subscribe('ALL_QOLL_USERS', this.findOptions()), 
		Meteor.subscribe('MY_QOLL_CONNECTS', this.findOptions()),
		Meteor.subscribe('MY_QOLL_CONNECTS_OP_REQS', this.findOptions())];
	},
	data : function() {
		return {
			connects: AllQollUsers.find(),
			qoll_connects : MyQollConnects.find(),
			qoll_connects_open_reqs : MyQollConnectsOpenReqs.find(),
			qoll_connects_open_rec_reqs : MyQollConnectsOpenRecReqs.find(),
		};
	}
});

MySocialController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 } };
	},
	waitOn : function() {
		qlog.info('Subscribing to all friends publisher - ALL_FRIENDS', filename);
		[Meteor.subscribe('ALL_FRIENDS', this.findOptions())];
	},
	data : function() {
		return {friends: AllMyFriends.find()};
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



/******************NEW ROUTERS****************/
/** Followings are the latest tabbed routes **/
Router.map(function(){
	this.route('social_my_groups', {
		template: 'social_my_groups',
		path: '/mygroups',
		controller: MyGroupsController
	});

	this.route('ownedGroupView', {
        template : 'view_my_group',
        path : '/view_group/:_id/:groupName/:groupDesc/:social_ctx',
        controller : SingleGroupController,
    });

    this.route('subscGroupView', {
        template : 'view_my_subsc_group',
        path : '/view_subsc_group/:_id/:groupName/:groupDesc/:social_ctx',
        controller : SingleGroupController,
    });

	this.route('social_members', {
		template: 'social_members',
		path: '/members',
		controller : QollConnectsController,
	});

	this.route('my_social', {
		template: 'my_social',
		path: '/mysocial',
		controller: MySocialController
	});
});

