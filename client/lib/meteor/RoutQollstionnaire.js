
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
