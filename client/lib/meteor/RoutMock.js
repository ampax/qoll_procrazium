var filename = 'client/lib/meteor/RoutMock.js';

Router.map(function(){
	this.route('mock1', {
		template: 'mock1',
		path: '/mock1',
		waitOn: function(){
			//add waiton for qolls from server to handle the latency for user here
			Meteor.subscribe('All_QOLL_PUBLISHER');
		},
		before: [function(){
			Session.set('template', 'qolls');
			qlog.info('Routing mock1', filename);
			Meteor.subscribe('All_QOLL_PUBLISHER');

			Deps.autorun(function(){
				Meteor.subscribe('mock1', Session.get('template'));
			});

		}, function(){
		}],
		after: function(){
			qlog.info('Routed to mock1', filename);
		}
	});

	this.route('mock2', {
		template: 'mock2',
		path: '/mock2',
		before: [function(){
			qlog.info('Routing mock2', filename);
		}, function(){
		}],
		after: function(){
			qlog.info('Routed to mock2', filename);
		}
	});

	this.route('mock3', {
		template: 'mock3',
		path: '/mock3',
		before: [function(){
			qlog.info('Routing mock3', filename);
		}, function(){
		}],
		after: function(){
			qlog.info('Routed to mock3', filename);
		}
	});
});