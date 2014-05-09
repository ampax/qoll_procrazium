var filename = 'client/lib/meteor/RoutQbank.js';

Router.map(function(){
	this.route('qollbank', {
		template: 'qollbank',
		path: '/qbank',
		waitOn: function(){
			Meteor.subscribe('QBANK_SUMMARY_PUBLISHER');
		},
		before: [function(){
			Meteor.subscribe('QBANK_SUMMARY_PUBLISHER');
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		after: function(){
			//TODO
		},
		data:function(){
			return {QBankSumm: QbSummary.find({})};
		}
	});
});