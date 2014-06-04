var filename = 'client/lib/meteor/RoutQbank.js';

Router.map(function(){
	this.route('qollbank', {
		template: 'qollbank',
		path: '/qbank',
		waitOn: function(){
			//Meteor.subscribe('QBANK_PUBLISHER');
		},
		before: [function(){
			[Meteor.subscribe('QBANK_PUBLISHER'), Meteor.subscribe('RECIPIENTS_PUBLISHER'), Meteor.subscribe('QOLL_TAG_PUBLISHER')];
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		after: function(){
			//TODO
		},
		data:function(){
			qlog.info('Printing userid - ' + Meteor.userId(), filename);
			return {
				//QBankSumm: QbSummary.find({}),
				QBankData: QbSummary.find({})
			};
		}
	});
});