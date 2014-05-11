
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
	waitOn : function() {[Meteor.subscribe('All_QOLL_PUBLISHER', this.findOptions()), Meteor.subscribe('QOLL_REG_PUBLISHER')];
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

Router.map(function() {
	this.route('qid', {
		template : 'qolls',
		path : '/qid/:quesid',
		controller : QollstionnaireController,
	});

});
