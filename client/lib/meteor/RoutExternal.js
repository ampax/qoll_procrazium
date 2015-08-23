ExtEmailBoardController = RouteController.extend({
	findOptions : function() {
		// Reverses the word array to a readable String
    	console.log('id - ' + this.params.id + ', email_id - ' + this.params.email_id); //id is uuid from questionnaire
		return { sort : { submittedOn : -1 }, _id : this.params._id, 
											user_email_id : this.params.email_id, 
											user_q_uuid	  : this.params.user_q_uuid,
											context : QollConstants.CONTEXT.WRITE };
	},
	waitOn : function() {
		[Meteor.subscribe('EXT_QUESTIONAIRE_PUBLISHER', this.findOptions()), 
		 Meteor.subscribe('QUESTIONAIRE_FOR_ID_PUBLISHER', this.findOptions())];
	},
	data : function() {
		console.log('id : ' + this.params._id + '/email_id : ' + this.params.email_id + '/ qoll_portal : ' + this.params.qoll_portal);
		return { qollList : ExtQollForQuestionaireId, 
				questionnaire_id : this.params._id, 
				user_email_id : this.params.email_id, 
				qoll_portal : this.params.qoll_portal };
	}
});

ExtEmbeddedBoardController = RouteController.extend({
	findOptions : function() {
		// Reverses the word array to a readable String
    	console.log('id - ' + this.params.id + ', email_id - ' + this.params.email_id); //id is uuid from questionnaire
		return { sort : { submittedOn : -1 }, _id : this.params._id, 
											user_email_id : this.params.email_id,
											context : QollConstants.CONTEXT.WRITE };
	},
	waitOn : function() {
		[Meteor.subscribe('EXT_EMBEDDED_QUESTIONAIRE_PUBLISHER', this.findOptions()), 
		 Meteor.subscribe('QUESTIONAIRE_FOR_ID_PUBLISHER', this.findOptions())];
	},
	data : function() {
		console.log('id : ' + this.params._id + '/email_id : ' + this.params.email_id + '/ qoll_portal : ' + this.params.qoll_portal);
		return { qollList : ExtQollEmbedQuestionaireId, 
				questionnaire_id : this.params._id, 
				user_email_id : this.params.email_id, 
				qoll_portal : this.params.qoll_portal };
	}
});

ExtWallBoardController = RouteController.extend({
	findOptions : function() {
		// Reverses the word array to a readable String
    	console.log('id - ' + this.params.id + ', email_id - ' + this.params.email_id); //id is uuid from questionnaire
		return { sort : { submittedOn : -1 }, _id : this.params._id, 
											context : QollConstants.CONTEXT.READ };
	},
	waitOn : function() {
		[Meteor.subscribe('EXT_QUESTIONAIRE_PUBLISHER', this.findOptions()), 
		 Meteor.subscribe('QUESTIONAIRE_FOR_ID_PUBLISHER', this.findOptions())];
	},
	data : function() {
		console.log('id : ' + this.params._id + '/email_id : ' + this.params.email_id + '/ qoll_portal : ' + this.params.qoll_portal);
		return { qollList : ExtQollForQuestionaireId, 
				questionnaire_id : this.params._id, 
				user_email_id : this.params.email_id, 
				qoll_portal : this.params.qoll_portal };
	}
});

/** Routers ::: for all the external requests **/

Router.map(function() {
	this.route('ext_email_board', {
		template : 'qext_email_board',
		path : '/ext_email_board/:user_q_uuid/:_id/:email_id/:qoll_portal',
		controller : ExtEmailBoardController,
	});

	this.route('ext_embed_board', {
		template : 'qext_email_board',
		path : '/ext_embed_board/:_id/:email_id/:qoll_portal',
		controller : ExtEmbeddedBoardController,
	});

	this.route('ext_wall_board', {
		template : 'qext_wall_board',
		path : '/ext_wall_board/:_id/:qoll_portal',
		controller : ExtEmailBoardController,
	});

});