var filename = 'client/lib/meteor/RoutAddQoll.js';

Router.map(function(){
	this.route('editor', {
		template: 'editor',
		path: '/editor',
		waitOn: function(){
			[Meteor.subscribe('OPEN_QOLL_PUBLISHER'),
			Meteor.subscribe('QOLL_GROUP_PUBLISHER'),
			Meteor.subscribe('Settings')];
		},
		after: function(){
			//TODO
		}
	});

	this.route('addqoll', {
		template: 'newqoll',
		path: '/newqoll',
		waitOn: function(){
			Meteor.subscribe('OPEN_QOLL_PUBLISHER');
			Meteor.subscribe('QOLL_GROUP_PUBLISHER');
			Meteor.subscribe('Settings');
		},
		before: [function(){
			qlog.info('Subscribing to OPEN_QOLL_PUBLISHER ...', filename);
			Meteor.subscribe('OPEN_QOLL_PUBLISHER');
			Meteor.subscribe('QOLL_GROUP_PUBLISHER');
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		after: function(){
			//TODO
		}
	});

	this.route('qolleditor_adv', {
		template: 'qolleditor_adv',
		path: '/qolleditor_adv',
		waitOn: function(){
			Meteor.subscribe('Settings');
		},
		before: [function(){
			qlog.info('Before for qoll-editor ...', filename);
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		after: function(){
			//TODO
		}
	});

	this.route('qolleditor_adv_edit', {
		template: 'qolleditor_adv_edit',
		path: '/qolleditor_adv_edit',//:qollRawId
		data: function() {
			qlog.info('Setting session rawqollid' + this.params.qollRawId,filename);
			Session.set("qollRawId", this.params.qollRawId);
		},
		waitOn: function(){

		},
		before: [function(){
			qlog.info('Before for qolleditor_adv_edit ...', filename);
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],
		after: function(){
			Session.set("qollRawId", null);
		}
	});
});