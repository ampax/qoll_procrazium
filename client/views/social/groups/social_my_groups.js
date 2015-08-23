var filename='client/views/social/social_my_groups.js';

Template.social_my_groups.rendered = function(){
	//set the background of the selected box.
	$('li#groups').css('background-color', 'firebrick');
};

Template.social_my_groups.events({
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        qlog.info('togggggggggggggled ......', filename);
	},
	'click .newgroup' : function() {
		qlog.info('Clicked on the span toggle.');
		//$( "div.form-static" ).slideToggle();
		//$( "div.form-scroll" ).slideToggle();
		$( "div.group_pop" ).show();
		//$( "div.form-scroll-info" ).slideToggle();
	},
	'click .toggle' : function() {
		$( "div.group_pop" ).hide('slow');
	},
	'click .archive-grp' : function() {
		//call remove group on server side here
		var gid = this._id;
		qlog.info('The id of the group to archive is - ' + gid, filename);

		var choice = confirm("Archive this " + this.groupName + "?");

		if(choice) {
			Meteor.call("removeUserGroup", gid, function(error, gid){
		        if(!error){ 
		            qlog.info("Removed group with group-id: " + gid, filename);
		        } else {
		            qlog.info("Failed to remove group with id: " + gid + '/' + error, filename);
		        }
		        
		    });
		}
	}
});