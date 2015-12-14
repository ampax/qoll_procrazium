var filename = 'client/lib/meteor/RoutDashboard.js';

QollCollections = require('lib/collections/Qolls');
QollContsts = require('lib/QollConstants');
// var qollCollections = QollCollections();

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
		return { sort : { submittedOn : -1 }, limit : this.limit(), context : 'write' };
	},
	waitOn : function() {
		[//Meteor.subscribe('All_QOLL_PUBLISHER', this.findOptions()), 
		Meteor.subscribe('QUICKER_PUBLISHER', this.findOptions()),
	  	Meteor.subscribe('categories'),
    	Meteor.subscribe('Settings'),
    	Meteor.subscribe('currentUser')];
	},
	allqollsfun : function() {
		//return AllQolls.find();
		//return Battleground.find();
	},
	data : function() {
		/** var hasMore = this.allqollsfun().count() === this.limit();
		var nextPath = this.route.path({
			qollsLimit : this.limit() + this.increment
		});
		return {
			qollList : this.allqollsfun(),
			nextPath : hasMore ? nextPath : null
		}; **/

		return { qollList : QuickerQolls};
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


