var filename = 'client/lib/meteor/RoutDashboard.js';

//var AllQolls = new Meteor.Collection("all-qolls");
//var QollDetails = new Meteor.Collection("qoll-details-by-id");
//var QollRegist = new Meteor.Collection("qoll-regs");

QollsController = RouteController.extend({
	template : 'qolls',
	increment : 3,
	limit : function() {
		return parseInt(this.params.qollsLimit) || this.increment;
	},
	findOptions : function() {
		return {
			sort : {
				submittedOn : -1
			},
			limit : this.limit()
		};
	},
	waitOn : function() {

		return [Meteor.subscribe('All_QOLL_PUBLISHER', this.findOptions()), Meteor.subscribe('QOLL_REG_PUBLISHER')];
	},
	allqollsfun : function() {
		return AllQolls.find({}, this.findOptions());
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
