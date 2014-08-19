
InboxController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 } };
	},
	waitOn : function() {[Meteor.subscribe('All_QOLL_PUBLISHER', this.findOptions()), Meteor.subscribe('QOLL_REG_PUBLISHER'),
		Meteor.subscribe('categories'),
    	Meteor.subscribe('Settings'),
    	Meteor.subscribe('currentUser')];
	},
	data : function() {
		return {qolls: AllQolls.find()};
	}
});

SentController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 } };
	},
	waitOn : function() {[Meteor.subscribe('SENT_QUESTIONAIRE_PUBLISHER', this.findOptions()),];
	},
	data : function() {
		return {qolls: ISentQuestionaire.find()};
	}
});

DraftController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 } };
	},
	waitOn : function() {[Meteor.subscribe('STORED_QUESTIONAIRE_PUBLISHER', this.findOptions()),];
	},
	data : function() {
		return {qolls: IStoredQuestionaire.find()};
	}
});

QollstionnaireController = RouteController.extend({
	template : 'qolls',

	findOptions : function() {
		return {
			sort : {
				submittedOn : -1
			},
			parentId : this.params.quesid 
		};
	},
	waitOn : function() {[Meteor.subscribe('All_QOLL_PUBLISHER', this.findOptions()), Meteor.subscribe('RECIPIENTS_PUBLISHER')];
	},
	allqollsfun : function() {
		return AllQolls.find({}, this.findOptions());
	},
	data : function() {

		return {
			qollList : this.allqollsfun(),
			nextPath : null // no pagination
		};
	}
});


QollstGroupController = FastRender.RouteController.extend({
	waitOn : function() {[Meteor.subscribe('QOLL_GROUP_PUBLISHER')];},
	data : function() {
		return { 'groups' : QollGps.find()};
	}
});

QollstPerformanceController = FastRender.RouteController.extend({
	waitOn : function() {[Meteor.subscribe('GROUP_STATS_PUBLISHER', this.params.name), Meteor.subscribe('QOLL_GROUP_PUBLISHER')];},
	data : function() {
		var dt = GroupStats.find(this.params.name);
		var stats = dt.collection.docs;
		qlog.info('Stats are - ' + JSON.stringify(dt) + ', name - ' + this.params.name);
		//AllQolls.find({}, this.findOptions());
		return { 
			group_stats : GroupStats.find({}, this.params.name),
			groups : QollGps.find(),
			groupName : this.params.name,
		};
	}
});

Router.map(function() {
	this.route('qid', {
		template : 'qolls',
		path : '/qid/:quesid',
		controller : QollstionnaireController,
	});

	this.route('view_qollbank', {
		template : 'view_qollbank',
		path : '/view_qollbank'
	});

	this.route('view_inbox', {
		template : 'view_inbox',
		path : '/inbox',
		controller : InboxController,
	});

	this.route('view_sent', {
		template : 'view_sent',
		path : '/sent',
		controller : SentController,
	});

	this.route('view_draft', {
		template : 'view_draft',
		path : '/draft',
		controller : DraftController,
	});

	this.route('all_qolls', {
		template : 'all_qolls',
		path : '/all_qolls',
		controller : QbankController,
	});

	this.route('view_my_groups', {
		template : 'my_groups',
		path : '/view_my_groups',
		controller : QollstGroupController,
	});

	this.route('groupPerformance', {
		template : 'group_performance',
		path : '/group_performance/:name',
		controller : QollstPerformanceController,
	});

});
