var filename='client/views/social/my_social.js';

Template.my_social.rendered = function(){
	//set the background of the selected box.
	$('li#social').css('background-color', 'firebrick');
	Session.set('social_btn_ctx','my_social');
};

Template.my_social.events({
	'click .newgroup' : function() {
		qlog.info('Clicked on the span toggle.');
		//$( "div.form-static" ).slideToggle();
		//$( "div.form-scroll" ).slideToggle();
		//$( "div.form-scroll-info" ).slideToggle();
		$( "div.group_pop" ).show('slow');
	},
	'click .toggle' : function() {
		$( "div.group_pop" ).hide('slow');
	},
	'click .link' : function(event) {
		event.preventDefault();
		var btn = $(event.target);
		qlog.info('Clicked the add button' + this.contact._id + ', class - ' + btn.attr('class') + ', parent class - ' + btn.parent().attr('class'), filename);
		console.log(this);
		var name = this.contact.name;

		//return;

		//QollConnectClient.connectWithQollUser(this.contact._id, this.contact.name);

		QollConnectClient.inviteSocialContactToJoinQoll(this.contact._id, this.contact.name);
		
		
	},
});

var QollConnectClient = {
	
	inviteSocialContactToJoinQoll: function(connect_id, name) {
		
		Meteor.call('inviteSocialContactToJoinQoll', connect_id, function(err, message) {
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