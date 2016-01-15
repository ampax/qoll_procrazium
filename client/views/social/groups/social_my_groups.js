var filename='client/views/social/social_my_groups.js';

var GroupSubscribeHooks = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        var group_name_str = insertDoc.group_name;
        
        console.log(group_name_str);

        var groups = [];

        group_name_str.forEach(function(gn){
        	var matches = QollRegEx.groupForAuthor.exec(gn);
        	//groups.push({'group_name' : matches[1], 'author' : matches[2]});
        	var group_name = matches[1], author_email = matches[2];
        	qlog.info('**'+group_name+'**'+author_email+'**', filename);

        	Meteor.call('subscribeToGroup', group_name, author_email, function(err, message) {
        		console.log(err);
        		console.log(message);
				var cls = '.scs-msg';
				var msg;
				if (err) {
					cls = '.err-msg';
					msg = 'Failed subscribing to the group: ' + group_name + '('+ author_email +') ...';
					qlog.error('Failed subscribing to the group: ' + group_name + '('+ author_email +')' + err, filename);
				} else {
					if(HashUtil.checkHash(message, 'err_msg')) {
						//Display the error message
						cls = '.err-msg';
						msg = message.err_msg;
					} else if(HashUtil.checkHash(message, 'scs_msg')) {
						//Display the success message
						cls = '.scs-msg';
						msg = message.scs_msg;
						$("#group_search").val('');
					} else {
						//Display some blah blah to say they succeded
						cls = '.scs-msg';
						msg = 'Subscribed to the group - ' + group_name + ','+ author_email +' ...';
						$("#group_search").val('');
					}
					qlog.info('Subscribed to the group - ' + group_name + ','+ author_email +' ...');
				}
				var saved_target = $(cls);
			    saved_target.html(msg);
			    saved_target.fadeOut( 8400, 'swing', function(){
			    	saved_target.html('');
			    	saved_target.removeAttr("style");
			    });
			});
		});


        this.done();

        AutoForm.resetForm('groupSubscribeForm')

        return true;
    },
};


var GroupCollabAssignHooks = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        var group_names = insertDoc.collab_groups;
        //var group_ref_str = insertDoc.group_ref;
        //var group_id_str = insertDoc.group_id;
        
        console.log(group_names);
        //console.log(group_ref_str);
        //console.log(group_id_str);
        //return;

        Meteor.call('assignDefaultCollabGroup', group_names, function(err, message) {
    		console.log(err);
    		console.log(message);
			var cls = '.scs-msg';
			var msg;
			if (err) {
				cls = '.err-msg';
				msg = 'Failed assigning default collab groups: ' + group_names;
				qlog.error(msg + err, filename);
			} else {
				qlog.info('Subscribed to the group - ' + group_names, filename);
			}
			var saved_target = $(cls);
		    saved_target.html(msg);
		    saved_target.fadeOut( 8400, 'swing', function(){
		    	saved_target.html('');
		    	saved_target.removeAttr("style");
		    });
		});


        this.done();

        // AutoForm.resetForm('groupCollabForm')

        return true;
    },
};

AutoForm.addHooks('groupSubscribeForm', GroupSubscribeHooks);
AutoForm.addHooks('groupCollabForm', GroupCollabAssignHooks);


Template.social_my_groups.rendered = function(){
	//set the background of the selected box.
	$('li#groups').css('background-color', 'firebrick');
};

Template.subsc_templ.helpers({
  customGroupSubscribeSchema: function() {
    return Schemas.custom_group_subscribe;
  },
});

Template.default_collab_templ.helpers({
  customCollabGroupSchema: function() {
    return Schemas.custom_collab_group;
  },
});

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

Template.subsc_templ.helpers({
	mydoc: function() {
	    var doc = {};
	    doc.group_name = new Array();

	    var subsc_grps = UserSubscGroups.find().fetch();
	    qlog.info('-------------> ' + JSON.stringify(subsc_grps), filename);

	    if(subsc_grps && subsc_grps.length > 0){
	    	subsc_grps.forEach(function(qg){
	    		qlog.info('.............................>>>>>>'+JSON.stringify(qg), filename);
	    		// doc.group_name.push(qg.groupDesc);
	    		doc.group_name.push(qg.groupName + '(Author: '+Meteor.user().profile.email+')');
	    	});
	    }

	    qlog.info('----------> '+JSON.stringify(doc), filename);
	    return doc;
	},
});

Template.default_collab_templ.helpers({
	mydoc: function() {
	    var doc = {};
	    doc.collab_groups = new Array();

	    var coll_grps = CollabGroups.find().fetch();
	    qlog.info('-------------> ' + JSON.stringify(coll_grps), filename);

	    if(coll_grps && coll_grps.length > 0){
	    	coll_grps.forEach(function(qg){
	    		qlog.info('.............................>>>>>>'+JSON.stringify(qg), filename);

	    		doc.collab_groups.push(qg.groupDesc);
	    	});
	    }

	    qlog.info('----------> '+JSON.stringify(doc), filename);
	    return doc;
	},
});

renderGroupsNdOwners = function(x) {
    // qlog.info('called render qoll to emails method', filename);
    // console.log(x);
    return Blaze.toHTMLWithData(Template.custom_group_subscribe_to, x);
    // return x.email + x.name;
};


renderCollabGroups = function(x) {
    // qlog.info('called render qoll to emails method', filename);
    // console.log(x);
    return Blaze.toHTMLWithData(Template.custom_group_collab_assign, x);
    // return x.email + x.name;
};