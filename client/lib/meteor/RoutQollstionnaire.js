IReceivedQuestionaire = new Meteor.Collection("recvd-questionaire");

InboxController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 }, context : QollConstants.CONTEXT.WRITE };
	},
	waitOn : function() {
		[Meteor.subscribe('RECVD_QUESTIONAIRE_PUBLISHER', this.findOptions()), 
		Meteor.subscribe('QOLL_REG_PUBLISHER'),
		Meteor.subscribe('categories'),
    	Meteor.subscribe('Settings'),
    	Meteor.subscribe('currentUser')];
	},
	data : function() {
		return {qolls: IReceivedQuestionaire.find()};
	}
});

SentController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 }, context : QollConstants.CONTEXT.READ };
	},
	waitOn : function() {[Meteor.subscribe('SENT_QUESTIONAIRE_PUBLISHER', this.findOptions()),];
	},
	data : function() {
		return {qolls: ISentQuestionaire.find()};
	}
});

DraftController = RouteController.extend({
	findOptions : function() {
		return { sort : { submittedOn : -1 }, context : QollConstants.CONTEXT.READ };
	},
	waitOn : function() {[Meteor.subscribe('STORED_QUESTIONAIRE_PUBLISHER', this.findOptions()),];
	},
	data : function() {
		return {qolls: IStoredQuestionaire.find()};
	}
});

QollstionnaireController = RouteController.extend({
	template : 'qolls',

	findOptions : function() {
		return {
			sort : {
				submittedOn : -1
			},
			parentId : this.params.quesid,
			context : QollConstants.CONTEXT.READ
		};
	},
	waitOn : function() {[Meteor.subscribe('All_QOLL_PUBLISHER', this.findOptions()), Meteor.subscribe('RECIPIENTS_PUBLISHER')];
	},
	allqollsfun : function() {
		return AllQolls.find({}, this.findOptions());
	},
	data : function() {

		return {
			qollList : this.allqollsfun(),
			nextPath : null // no pagination
		};
	}
});

IdLookUpInboxController = RouteController.extend({
	findOptions : function() {
		console.log("looking for  id "+this.params._id );
		return { sort : { submittedOn : -1 }, _id : this.params._id,
					context : QollConstants.CONTEXT.WRITE  };
	},
	waitOn : function() {return [Meteor.subscribe('QOLL_FOR_QUESTIONAIRE_ID_PUBLISHER', this.findOptions()),
								// Meteor.subscribe('QUESTIONAIRE_PROGRESS_PUBLISHER', this.findOptions()), 
								Meteor.subscribe('RECIPIENTS_PUBLISHER'),
								Meteor.subscribe('QUESTIONAIRE_FOR_ID_PUBLISHER', this.findOptions())];
	},
	data : function() {
		return { qollList : QollForQuestionaireId};
	}
});

IdLookUpDraftController = RouteController.extend({
	findOptions : function() {
		console.log("looking for  id "+this.params._id );
		return { sort : { submittedOn : -1 }, _id : this.params._id,
					context : QollConstants.CONTEXT.READ  };
	},
	waitOn : function() {return [Meteor.subscribe('QOLL_FOR_QUESTIONAIRE_ID_PUBLISHER', this.findOptions()),
								// Meteor.subscribe('QUESTIONAIRE_PROGRESS_PUBLISHER', this.findOptions()), 
								Meteor.subscribe('RECIPIENTS_PUBLISHER'),
								Meteor.subscribe('QUESTIONAIRE_FOR_ID_PUBLISHER', this.findOptions())];
	},
	data : function() {
		return { qollList : QollForQuestionaireId};
	}
});

IdLookUpSentController = RouteController.extend({
	findOptions : function() {
		console.log("looking for  id "+this.params._id );
		return { sort : { submittedOn : -1 }, _id : this.params._id, stats : "yes",
					context : QollConstants.CONTEXT.READ };
	},
	waitOn : function() {
		Session.set('questionnaire_id', this.params._id);

		return [Meteor.subscribe('QOLL_FOR_QUESTIONAIRE_ID_PUBLISHER', this.findOptions()),
				Meteor.subscribe('QUESTIONAIRE_FOR_ID_PUBLISHER', this.findOptions())];
	},
	data : function() {
		return { qollList : QollForQuestionaireId, qollResultList : QollForQuestionaireId.find().fetch()};
	}
});

QollController = RouteController.extend({
    findOptions : function() {
        console.log("looking for  id "+this.params._id );
        return { sort : { submittedOn : -1 }, singleId : this.params._id, context : QollConstants.CONTEXT.READ };
    },
    waitOn : function() {return [Meteor.subscribe('All_QOLL_PUBLISHER', this.findOptions())];
    },
    data : function() {
        return { qollList : AllQolls };
    }
});

QollstGroupController = RouteController.extend({
	waitOn : function() {[Meteor.subscribe('QOLL_GROUP_PUBLISHER')];},
	data : function() {
		return { 'groups' : QollGps.find()};
	}
});

QollstPerformanceController = RouteController.extend({
	waitOn : function() {[Meteor.subscribe('GROUP_STATS_PUBLISHER', this.params.name), Meteor.subscribe('QOLL_GROUP_PUBLISHER')];},
	data : function() {
		var dt = GroupStats.find(this.params.name);
		var stats = dt.collection.docs;
		qlog.info('Stats are - ' + JSON.stringify(dt) + ', name - ' + this.params.name);
		//AllQolls.find({}, this.findOptions());
		return { 
			group_stats : GroupStats.find({}, this.params.name),
			groups : QollGps.find(),
			groupName : this.params.name,
		};
	}
});

QbankController = RouteController.extend({
	waitOn: function(){
		//Meteor.subscribe('QBANK_PUBLISHER');
		return [ Meteor.subscribe('QBANK_SUMMARY_PUBLISHER', {}), 
			Meteor.subscribe('RECIPIENTS_PUBLISHER'), 
			Meteor.subscribe('QOLL_TAG_PUBLISHER'),
			Meteor.subscribe('Settings'),
		];
		//Meteor.subscribe('QBANK_SUMMARY_PUBLISHER');
	},
	onAfterAction: function(){
		//TODO
	},
	data:function(){
		qlog.info('Printing userid - ' + Meteor.userId(), filename);
		return {qolls: QbSummary.find({})};
	},
});

IdLookUpEmailPreviewController = RouteController.extend({
	findOptions : function() {
		console.log("looking for  id "+this.params._id );
		return { sort : { submittedOn : -1 }, _id : this.params._id,
					context : QollConstants.CONTEXT.WRITE  };
	},
	waitOn : function() {return [Meteor.subscribe('QOLL_FOR_QUESTIONAIRE_ID_PUBLISHER', this.findOptions()),
								// Meteor.subscribe('QUESTIONAIRE_PROGRESS_PUBLISHER', this.findOptions()), 
								Meteor.subscribe('RECIPIENTS_PUBLISHER'),
								Meteor.subscribe('QUESTIONAIRE_FOR_ID_PUBLISHER', this.findOptions())];
	},
	data : function() {
		return { qollList : QollForQuestionaireId};
	}
});

Router.map(function() {
	if (Meteor.isCordova) {
		this.route('view_inbox_cordova', {
			template : 'view_inbox_cordova',
			path : '/inbox_cordova',
			controller : InboxController,
		});
		this.route('add_qolls_cordova', {
			template : 'add_qolls_cordova',
			path : '/add_qolls_cordova',
			controller : InboxController,
		});
		this.route('all_qolls_cordova', {
        template : 'all_qolls_cordova',
        path : '/all_qolls_cordova',
        controller : QbankController,

       });
	  }

	  if (Meteor.isClient) {
	    this.route('view_inbox', {
			template : 'view_inbox',
			path : '/inbox',
			controller : InboxController,
		});
	  }





	this.route('qid', {
		template : 'qolls',
		path : '/qid/:quesid',
		controller : QollstionnaireController,
	});

	this.route('view_qollbank', {
		template : 'view_qollbank',
		path : '/view_qollbank'
	});

	//inbox page and board templates/path
	this.route('inboxView', {
		template : 'view_inbox_board',
		path : '/inbox_board/:_id',
		controller: IdLookUpInboxController
	});

	

	//sent page and board templates/path
	this.route('sentView', {
		template : 'view_sent_board',
		path : '/sent_board/:_id',
		controller: IdLookUpSentController,
	});

	this.route('view_sent', {
		template : 'view_sent',
		path : '/sent',
		controller : SentController,
	});

	//draft page and board templates/path
	this.route('draftView', {
		template : 'view_draft_board',
		path : '/draft_board/:_id',
		controller: IdLookUpDraftController,
	});
	
	this.route('view_draft', {
		template : 'view_draft',
		path : '/draft',
		controller : DraftController,
	});

	//prepare the quiz template
    this.route('all_qolls', {
        template : 'all_qolls',
        path : '/all_qolls',
        controller : QbankController,
    });

    this.route('qollView', {
        template : 'view_qoll',
        path : '/qoll_board/:_id',
        controller : QollController,
    });

	this.route('view_my_groups', {
		template : 'my_groups',
		path : '/view_my_groups',
		controller : QollstGroupController,
	});

	this.route('groupPerformance', {
		template : 'group_performance',
		path : '/group_performance/:name',
		controller : QollstPerformanceController,
	});

	this.route('qollbank', {
		template: 'qollbank',
		path: '/qbank',
		controller : QbankController,
		
	});

	this.route('email_questionnaire_preview', {
	    path: '/email_questionnaire_preview/:_id',
	    template: 'email_questionnaire',
	    controller : IdLookUpEmailPreviewController,
	});

});
