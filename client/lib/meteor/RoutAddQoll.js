var filename = 'client/lib/meteor/RoutAddQoll.js';

EditorXXXController = RouteController.extend({
	waitOn: function(){
		qlog.info('In the controller XXX', filename);
		[Meteor.subscribe('QOLL_GROUP_PUBLISHER'), Meteor.subscribe('Settings')];
	},
	onAfterAction: function(){
		//TODO
	}
});

Router.map(function(){
	this.route('editor', {
		template: 'editor',
		path: '/editor',
		waitOn: function(){
			[Meteor.subscribe('OPEN_QOLL_PUBLISHER'),
			Meteor.subscribe('QOLL_GROUP_PUBLISHER'),
			Meteor.subscribe('Settings')];
		},
		onAfterAction: function(){
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
		/**onBeforeAction: [function(){
			qlog.info('Subscribing to OPEN_QOLL_PUBLISHER ...', filename);
			Meteor.subscribe('OPEN_QOLL_PUBLISHER');
			Meteor.subscribe('QOLL_GROUP_PUBLISHER');
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],**/
		onAfterAction: function(){
			//TODO
		}
	});

	this.route('qolleditor_adv', {
		template: 'qolleditor_adv',
		path: '/qolleditor_adv',
		waitOn: function(){
			Meteor.subscribe('Settings');
		},
		/**onBeforeAction: [function(){
			qlog.info('Before for qoll-editor ...', filename);
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],**/
		onAfterAction: function(){
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
		/**onBeforeAction: [function(){
			qlog.info('Before for qolleditor_adv_edit ...', filename);
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],**/
		onAfterAction: function(){
			Session.set("qollRawId", null);
		}
	});

	this.route('qolleditor', {
		template: 'qolleditor',
		path: '/qolleditor',
		waitOn: function(){
			qlog.info('In the controller code for xxx template', filename);
			Meteor.subscribe('Settings');
		},
		/**onBeforeAction: [function(){
			qlog.info('Before for qoll-editor ...', filename);
		}, function(){
			//this is next in line to the first subscribe function
			//active_nav();
		}],**/
		onAfterAction: function(){
			//TODO
		}
	});
});