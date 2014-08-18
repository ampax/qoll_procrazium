var filename = 'client/lib/meteor/RoutQbank.js';

QbankController = FastRender.RouteController.extend({
	waitOn: function(){
		//Meteor.subscribe('QBANK_PUBLISHER');
		Meteor.subscribe('QBANK_SUMMARY_PUBLISHER');
	},
	onBeforeAction: [function(){
		[Meteor.subscribe('QBANK_SUMMARY_PUBLISHER', {}), Meteor.subscribe('RECIPIENTS_PUBLISHER'), Meteor.subscribe('QOLL_TAG_PUBLISHER')];
	}, function(){
		//this is next in line to the first subscribe function
		//active_nav();
	}],
	onAfterAction: function(){
		//TODO
	},
	data:function(){
		qlog.info('Printing userid - ' + Meteor.userId(), filename);
		return {qolls: QbSummary.find({})};
	},
});

Router.map(function(){
	this.route('qollbank', {
		template: 'qollbank',
		path: '/qbank',
		controller : QbankController,
		
	});
});