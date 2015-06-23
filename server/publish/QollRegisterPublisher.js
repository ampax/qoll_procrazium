var filename = 'server/publisher/QollRegisterPublisher.js';

/** Publishing to the subscribers method for qolls  **/
Meteor.publish('QOLL_REG_PUBLISHER', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('Fetching all the qoll responses; uuid: ' + uuid, filename);
        //db.QOLL.find({'submittedTo':'usr3322@qoll','action':'send'})
        if(this.userId) {//first publish specialized qolls to this user
			qlog.info('MY  USERID --------->>>>>'+this.userId);
			var ufound = Meteor.users.find({"_id":this.userId}).fetch();
			if (ufound.length>0){
			var user= ufound[0];
			qlog.info('MY  USER --------->>>>>'+user.emails);
			
			//submitted by this user
			var handle = QollRegister.find({'submittedBy':this.userId}, { reactive:true}).observe({
	          added: function(item, idx) {
				  
	              var q = {
	                qollId 			: item.qollId,
	                qollTypeVal 	: item.qollTypeVal,
	                qollTypeIndex	: item.qollTypeIndex,
	                qollTypeReg		: item.qollTypeReg,
	                unitSelected 	: item.unitSelected,
	                submittedBy 	: item.submittedBy,
	                submittedOn 	: item.submittedOn,
	                
	                _id : item._id
	              };
	              self.added('qoll-regs', item._id, q);
	              //qlog.info('Adding another self published qoll --------->>>>>'+item._id,filename);

	          },
	          changed: function(item, idx) {
				  
	            
	              var q = {
	                qollId 			: item.qollId,
	                qollTypeVal 	: item.qollTypeVal,
	                qollTypeIndex	: item.qollTypeIndex,
	                qollTypeReg		: item.qollTypeReg,
	                unitSelected 	: item.unitSelected,
	                submittedBy 	: item.submittedBy,
	                submittedOn 	: item.submittedOn,
	                
	                _id : item._id
	              };
	              self.changed('qoll-regs', item._id, q);
	              //qlog.info('Adding another self published qoll --------->>>>>'+item._id,filename);

	          }
	          /**removed: function(item) {
	            self.removed('all-qolls', item._id);
	            qlog.info('Removed item with id: ' + item._id);
	          }**/
	        });
	     
		}
	    // here we proceed with publishing qolls to group that one is member of
		}
		        qlog.info('Done initializing the publisher: QOLL_REG_PUBLISHER, uuid: ' + uuid, filename);
        initializing = false;
        self.ready();
      

        self.onStop(function(){
        	if(handle)
                handle.stop();
        });
}); 

Meteor.publish('QOLL_FOR_RESPONDENT', function(quest_owner_id, questionaire_id, qid, responder_id, context) {
	var self = this;
	qlog.info('QOLL_FOR_RESPONDENT - ', filename);

	self.added('qoll-for-respondent', responder_id+qid, findQollForRespondend(quest_owner_id, questionaire_id, qid, responder_id, context));
});



var findQollForRespondend = function(quest_owner_id, questionaire_id, qid, responder_id, context) {
		var user_id = this.userId;
		var self = this;
		var uuid = Meteor.uuid();
		var initializing = true;

		if (this.userId || quest_owner_id /* userId coming from ionic app */) {//first publish specialized qolls to this user
			var tuid = this.userId ? this.userId : quest_owner_id;
			var ufound = Meteor.users.find({
				"_id" : tuid
			}).fetch();

			if (ufound.length > 0) { // proceed only if the request comes for a logged in user
				var user = ufound[0];

				qlog.info('Found user-id - ' + JSON.stringify(user), filename);

				var u1 = Meteor.users.find({'emails.address' : responder_id}).fetch();

				if(u1.length > 0) { 
					resp = QollstionnaireResponses.findOne({ qollstionnaireid : questionaire_id, usrid : u1[0]._id });
				} else {
					resp = QollstionnaireResponses.findOne({ qollstionnaireid : questionaire_id, email : responder_id });
				}

				var t = Qolls.QollDb.get({_id : qid});
				var thisresponse; 
				thisresponse = resp && resp.responses[qid]? resp.responses[qid].response:new Array(t.qollTypes?t.qollTypes.length:0) ;
				var response = resp && resp.responses[qid] ? resp.responses[qid] : undefined;
				var used_hint = resp && resp.responses[qid] ? resp.responses[qid].usedHint : undefined;
				
				var q2 = extractQollDetails(t);
				q2.myresponses = thisresponse;
				q2._qollstionnaireid = questionaire_id;
				q2.context = context;
				q2.qoll_response = response;

				if(context === QollConstants.CONTEXT.WRITE) {
					if(response != undefined)
						q2.fib = response.response;
					else q2.fib = [];
				}


				qlog.info('=== === === ===> {'+questionaire_id+'/'+qid+'}' + JSON.stringify(q2), filename);
			}

			return q2;
		}
	}

