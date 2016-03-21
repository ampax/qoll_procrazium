var filename='client/views/q/sent/add_subscribers_to_quest.js';

var AddGroupToQuestionnaireHooks = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        
        var questionnaire_id = Router.current().params._id;

        var group_name_str = insertDoc.group_name;
        
        console.log(group_name_str);

        var groups = [];

        group_name_str.forEach(function(gn){
        	var matches = QollRegEx.groupNameNdDesc.exec(gn);
        	//groups.push({'group_name' : matches[1], 'author' : matches[2]});
        	var group_str = matches[0], group_name = matches[1], group_desc = matches[2], group_id = matches[3];
        	qlog.info('**'+group_name+'**'+group_desc+'**'+group_id+'**'+questionnaire_id, filename);
        	groups.push(group_id);
        });

        Meteor.call('addGroupToQuestionnaire', groups, questionnaire_id, function(err, message) {
    		console.log(err);
    		console.log(message);
			if (err) {
				qlog.error('Failed subscribing to the group: ' + group_name + '('+ author_email +')' + err, filename);
			} else {
				qlog.info('Added groups - ' + groups + ' to the questionnaire ...', filename);
			}

		});

        return;

        group_name_str.forEach(function(gn){
        	var matches = QollRegEx.groupNameNdDesc.exec(gn);
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

        AutoForm.resetForm('AddGroupToQuestionnaireForm')

        return true;
    },
};

AutoForm.addHooks('AddGroupToQuestionnaireForm', AddGroupToQuestionnaireHooks);

Template.add_subscribers_to_quest.helpers({
	sent_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
	sent_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
	questionaire : function() {
		return QuestionaireForId.findOne();
	},
	is_quicker : function(category) {
		return category === 'quicker';
	},
	is_not_quicker : function(category) {
		return !(category === 'quicker');
	},
	qoll_list : function() {
		return QollForQuestionaireId.find({_id : Session.get('questionnaire_id')}).fetch()[0];
	},
	can_close : function(questionnaire) {
		console.log('================================' + (questionnaire && questionnaire.qollstionnaire_closed === 'closed'));
		console.log(questionnaire);
		console.log('================================' + (questionnaire && questionnaire.qollstionnaire_closed != 'closed'));
		if(questionnaire && questionnaire.qollstionnaire_closed === 'closed') {
			return 'is-invisible';
		}
	},
	is_closed : function(questionnaire) {
		if(questionnaire && questionnaire.qollstionnaire_closed != 'closed') {
			return 'is-invisible';
		}
	},
	closed_on : function(questionnaire) {
		if(questionnaire && questionnaire.qollstionnaire_closed === 'closed') {
			// return qollstionnaireSubmittedOn;
			return "(Closed On: "+moment(questionnaire.qollstionnaire_closed_on).format('MMM Do YYYY, h:mm a')+")";
		}
	},

	
});

Template.questionnaire_preview.helpers({
	sent_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
	sent_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
	questionaire : function() {
		return QuestionaireForId.findOne();
	},
	is_quicker : function(category) {
		return category === 'quicker';
	},
	is_not_quicker : function(category) {
		return !(category === 'quicker');
	},
	qoll_list : function() {
		return QollForQuestionaireId.find({_id : Session.get('questionnaire_id')}).fetch()[0];
	},
	can_close : function(questionnaire) {
		console.log('================================' + (questionnaire && questionnaire.qollstionnaire_closed === 'closed'));
		console.log(questionnaire);
		console.log('================================' + (questionnaire && questionnaire.qollstionnaire_closed != 'closed'));
		if(questionnaire && questionnaire.qollstionnaire_closed === 'closed') {
			return 'is-invisible';
		}
	},
	is_closed : function(questionnaire) {
		if(questionnaire && questionnaire.qollstionnaire_closed != 'closed') {
			return 'is-invisible';
		}
	},
	closed_on : function(questionnaire) {
		if(questionnaire && questionnaire.qollstionnaire_closed === 'closed') {
			// return qollstionnaireSubmittedOn;
			return "(Closed On: "+moment(questionnaire.qollstionnaire_closed_on).format('MMM Do YYYY, h:mm a')+")";
		}
	},

	
});

Template.add_subscriber.helpers({
	customGroupSubscribeSchema : function() {
		return Schemas.custom_group_subscribe_1;
	},
	mydoc: function() {
	    var doc = {};
	    
	    return doc;
	},
});


Template.current_group_subscriptions.helpers({
	my_groups : function() {
		var grps = GroupsForQuestionnaireId.find().fetch();

		grps.forEach(function(gr){
			qlog.info('==================>' + JSON.stringify(gr), filename);
		});

		qlog.info(JSON.stringify(grps), filename);


		var qls = QollForQuestionaireId.find().fetch();
		console.log(qls[0].groups);
		return qls[0].groups;
	},
});

//leave
Template.current_group_subscriptions.events({
	'click button#leave' : function(e, t) {
		e.preventDefault();

		var questionnaire_id = Router.current().params._id;
		qlog.info('leaving the group ...' + this._id + '/' + questionnaire_id, filename);

		Meteor.call('removeGroupFromQuestionnaire', this._id, questionnaire_id, function(err, message) {
    		console.log(err);
    		console.log(message);
			if (err) {
				qlog.error('Failed removing the group: ' + this._id + '('+ questionnaire_id +')' + err, filename);
			} else {
				qlog.info('Removed the groups - ' + this._id + ' from the questionnaire ... ' + questionnaire_id, filename);
			}

		});
	}
});

Template.add_subscribers_to_quest.events({
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        qlog.info('togggggggggggggled ......', filename);
	},
	'click button#close_questionnaire' : function(e, l) {
		e.preventDefault();

		var btn = $(e.target);

		var quest_id = btn.data('questionaire_id');
		var user_id = Meteor.userId();

		qlog.info('------------------------ closing ------- ' + quest_id+ '/' + user_id, filename);

		Meteor.call('close_questionnaire', quest_id, user_id, function(err, res){
			if(err) {
				qlog.error('Error happened while submitting the questionnaire ... ' + quest_id, filename);
				qlog.error(err, filename);
			} else {
				alert(res.msg);
			}
		});
	},
	'click button#bkButton' : function(e,t){
		e.preventDefault();
		qlog.info('Navigating to sent-qolls now', filename);
		Router.go('view_sent');
	},
});

Template.add_subscribers_to_quest.rendered = function(){
	//set the background of the selected box
	$('li#sent').css('background-color', 'firebrick');
};


renderAddGroupsToQuestionnaire = function(x) {
    return Blaze.toHTMLWithData(Template.add_groups_to_questionnaire, x);
};