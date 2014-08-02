var filename = 'client/lib/meteor/RoutDashboard.js';

QollsController = RouteController.extend({
	template : 'qolls',
	increment : 10,
	limit : function() {
		return parseInt(this.params.qollsLimit) || this.increment;
	},
	findOptions : function() {
		return { sort : { submittedOn : -1 }, limit : this.limit() };
	},
	waitOn : function() {[Meteor.subscribe('All_QOLL_PUBLISHER', this.findOptions()), Meteor.subscribe('QOLL_REG_PUBLISHER')];
	},
	allqollsfun : function() {
		return AllQolls.find();
	},
	data : function() {
		var hasMore = this.allqollsfun().count() === this.limit();
		//qlog.info('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Counts '+this.allqollsfun().count() + "also "+ this.limit(), filename);
		var nextPath = this.route.path({
			qollsLimit : this.limit() + this.increment
		});
		return {
			qollList : this.allqollsfun(),
			nextPath : hasMore ? nextPath : null
		};
	}
});

Router.map(function() {
	this.route('dashboard', {
		template : 'qolls',
		path : '/dashboard/:qollsLimit?',
		controller : QollsController,
	});

});

Router.map(function() {
	this.route('edu_dashboard', {
		template : 'edu_dashboard',
		path : '/edu_dashboard',
		controller : QollsController,
	});

});
