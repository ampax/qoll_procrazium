var filename = 'client/lib/meteor/RoutDashboard.js';

QollsController = RouteController.extend({
	template : 'qolls',
	increment : 10,
	limit : function() {
		return parseInt(this.params.qollsLimit) || this.increment;
	},
	findOptions : function() {
		return { sort : { submittedOn : -1 }, limit : this.limit(), context : QollConstants.CONTEXT.WRITE };
	},
	waitOn : function() {
		[//Meteor.subscribe('All_QOLL_PUBLISHER', this.findOptions()), 
		Meteor.subscribe('BATTLEG_QUESTIONAIRE_PUBLISHER', this.findOptions()),
		Meteor.subscribe('QOLL_REG_PUBLISHER'),
	  	Meteor.subscribe('categories'),
    	Meteor.subscribe('Settings'),
    	Meteor.subscribe('currentUser')];
	},
	allqollsfun : function() {
		//return AllQolls.find();
		return Battleground.find();
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


QuickerQollsController = RouteController.extend({
	template : 'quicker',
	increment : 10,
	limit : function() {
		return parseInt(this.params.qollsLimit) || this.increment;
	},
	findOptions : function() {
		return { sort : { submittedOn : -1 }, limit : this.limit(), context : QollConstants.CONTEXT.WRITE };
	},
	waitOn : function() {
		[//Meteor.subscribe('All_QOLL_PUBLISHER', this.findOptions()), 
		Meteor.subscribe('QUICKER_PUBLISHER', this.findOptions()),
	  	Meteor.subscribe('categories'),
    	Meteor.subscribe('Settings'),
    	Meteor.subscribe('currentUser')];
	},
	allqollsfun : function() {
	},
	data : function() {
		return { qollList : QuickerQolls};
	}
});

TopicsShareCircleController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 }, circle : 'ChemWiki', parent_id: this.params._id };
	},
	waitOn : function() {
		[Meteor.subscribe('QOLL_TOPICS_FOR_CIRCLE_PUBLISHER', this.findOptions()),
		Meteor.subscribe('categories'),
    	Meteor.subscribe('Settings'),
    	Meteor.subscribe('currentUser')];
	},
	data : function() {
		return {topics: TopicsForShareCircle.find()};
	}
});

TopicsForIdController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 }, circle : 'ChemWiki', 
					_id: this.params._id, context : QollConstants.CONTEXT.READ };
	},
	waitOn : function() {
		[Meteor.subscribe('QOLL_TOPICS_FOR_ID_PUBLISHER', this.findOptions()),
		Meteor.subscribe('QOLLS_FOR_TOPIC_ID', this.findOptions()),
		Meteor.subscribe('categories'),
    	Meteor.subscribe('Settings'),
    	Meteor.subscribe('currentUser')];
	},
	data : function() {
		return {topics: TopicsForId.find(), qolls: QollsForTopicId.find({})};
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
		controller : TopicsShareCircleController,
	});

	this.route('edu_dashboard_forid', {
		template : 'edu_dashboard',
		path : '/edu_dashboard/:_id',
		controller : TopicsShareCircleController,
	});

	this.route('edu_dashboard_qoll', {
		template : 'edu_dashboard_qoll',
		path : '/edu_dashboard_qoll/:_id',
		controller : TopicsForIdController,
	});

	this.route('edu_dashboard_set', {
		template : 'edu_dashboard_set',
		path : '/edu_dashboard_set/:_id',
		controller : TopicsShareCircleController,
	});

});

Router.map(function() {
	this.route('quicker', {
		template : 'quicker',
		path : '/quicker',
		controller : QuickerQollsController,
	});

	this.route('howto', {
		template : 'howto',
		path : '/howto'
	});

	this.route('contact_us', {
		template : 'contact_us',
		path : '/contact_us'
	});

});


