var filename='client/views/social/social_members.js';

Template.social_members.rendered = function(){
	//set the background of the selected box.
	$('li#members').css('background-color', 'firebrick');
	Session.set('social_btn_ctx','social_connects');
};

Template.social_members.helpers({
	/*connects : function() {
		return AllQollUsers.find().fetch();
	},*/
});

Template.social_members.events({
	'click .newgroup' : function() {
		qlog.info('Clicked on the span toggle.');
		//$( "div.form-static" ).slideToggle();
		//$( "div.form-scroll" ).slideToggle();
		//$( "div.form-scroll-info" ).slideToggle();
		$( "div.group_pop" ).show();
	},
	'click .toggle' : function() {
		$( "div.group_pop" ).hide('slow');
	},
	'click .add' : function(event) {
		event.preventDefault();
		var ctx = this.contact.social_ctx;
		var btn = $(event.target);
		//qlog.info('Clicked the add button' + this.contact._id + ', class - ' + btn.attr('class') + ', parent class - ' + btn.parent().attr('class'), filename);
		qlog.info('Clicked the add button with context - ' + this.contact.social_ctx, filename);
		console.log(this);
		var name = this.contact.name;

		if(ctx === 'social-qoll-user') {
			QollConnectClient.connectWithQollUser(this.contact._id, this.contact.name, btn);
		}
	},
	'click .accept' : function(event) {
		event.preventDefault();
		var ctx = this.contact.social_ctx;
		var btn = $(event.target);
		//qlog.info('Clicked the add button' + this.contact._id + ', class - ' + btn.attr('class') + ', parent class - ' + btn.parent().attr('class'), filename);
		qlog.info('Clicked the accept button with context - ' + this.contact.social_ctx, filename);
		console.log(this);
		var name = this.contact.name;

		if(ctx === 'my-qoll-connects-open-rec-reqs') {
			QollConnectClient.confirmRecQollConnectReq(this.contact._id, this.contact.name);
		}
	},
	'click .remove' : function(event) {
		event.preventDefault();
		var ctx = this.contact.social_ctx;
		qlog.info('Clicked on the remove button. Taking action as per the correct context - ' + ctx, filename);
		console.log(this);

		var name = this.contact.name;
		var contact_id = this.contact._id;

		if(ctx === 'my-social-connects') {
			//call method 1
			QollConnectClient.deleteQollConnection(contact_id, name);
		} else if (ctx === 'my-qoll-connects-open-rec-reqs') {
			//call method 2
			QollConnectClient.declineRecQollConnectReq(contact_id, name);
		} else if (ctx === 'my-qoll-connects-open-reqs') {
			//call method 3
			QollConnectClient.deleteSentQollConnectReq(contact_id, name);
		} else {
			//delete call not recogn
		}
	},
	
	//'click .remove'
});


var QollConnectClient = {
	connectWithQollUser: function(contact_id, name, btn) {
		Meteor.call('connectWithQollUser', contact_id, function(err, message) {
			if(err) {
				qlog.info('Error happened while initiating connection with the Qoll user', filename);
			} else {
				qlog.info('Initiated connection with the Qoll user ' + name, filename);
				btn.parent().removeClass('add');
				btn.removeClass('green');
				btn.addClass('black');
			}
		});
	},
	deleteQollConnection: function(connect_id, name) {
		Meteor.call('deleteQollConnection', connect_id, function(err, message) {
			if(err) {
				qlog.info('Error happened while deleting qoll connection', filename);
			} else {
				qlog.info('Deleted qoll connection ' + name, filename);
			}
		});
	},
	confirmRecQollConnectReq: function(connect_id, name) {
		Meteor.call('confirmRecQollConnectReq', connect_id, function(err, message) {
			if(err) {
				qlog.info('Error happened while confirming qoll connection request', filename);
			} else {
				qlog.info('Confirmed qoll connection request' + name, filename);
			}
		});
	},
	declineRecQollConnectReq: function(connect_id, name) {
		Meteor.call('declineRecQollConnectReq', connect_id, function(err, message) {
			if(err) {
				qlog.info('Error happened while declining qoll connection request', filename);
			} else {
				qlog.info('Declined qoll connection request' + name, filename);
			}
		});
	},
	deleteSentQollConnectReq: function(connect_id, name) {
		Meteor.call('deleteSentQollConnectReq', connect_id, function(err, message) {
			if(err) {
				qlog.info('Error happened while deleting sent qoll connection request', filename);
			} else {
				qlog.info('Deleted sent qoll connection request' + name, filename);
			}
		});
	},
	inviteSocialContactToJoinQoll: function(connect_id, name) {
		
		Meteor.call('inviteSocialContactToJoinQoll', contact_id, function(err, message) {
			if(err) {
				qlog.info('Error happened while inviting friend to join Qoll', filename);
			} else {
				qlog.info('Sent invitation to invite friend to Qoll ' + name, filename);
				btn.parent().removeClass('add');
				btn.removeClass('green');
				btn.addClass('black');
			}
		});

	},
};

