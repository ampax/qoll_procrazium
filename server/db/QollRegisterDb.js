var filename = 'lib/db/QollRegisterDb.js';
QollRegister = new Meteor.Collection("QOLL_REGISTER");

Meteor.methods({
	registerQoll: function(qollId, qollTypeVal){
            qlog.info('In register qoll: ' + qollId + ', ' + qollTypeVal + ', Meteor.userId ' + Meteor.userId(), filename);
            var existQollReg = QollRegister.find({qollId: qollId, submittedBy: userId}).fetch();
            qlog.debug(existQollReg, filename);
            /**if(existQollReg.length > 0){
				QollRegister.update({_id : existQollReg[0]._id}, { $set: {qollTypeVal : qollTypeVal}});
				return existQollReg[0]._id;
	        } else {
				var qollRegId = QollRegister.insert({
					'qollId' : qollId,
					'qollTypeVal' : qollTypeVal,
					'submittedOn' : new Date(),
					'submittedBy' : Meteor.userId()
		            });
				return qollRegId;
		    }**/

		    var qollRegId = QollRegister.insert({
				'qollId' : qollId,
				'qollTypeVal' : qollTypeVal,
				'submittedOn' : new Date(),
				'submittedBy' : Meteor.userId()
	            });

		    ReactiveDataSource.refresh('qollstat'+ qollId);
			return qollRegId;
	},
		registerQollCustom: function(qollId, qollTypeVal,qollTypeIx){
            qlog.info('In register custom qoll: ' + qollId + ', ' + qollTypeVal + ', Meteor.userId ' + Meteor.userId(), filename);
            var existQollReg = QollRegister.find({qollId: qollId, submittedBy: userId}).fetch();
            qlog.debug(existQollReg, filename);
            //step 1  verify publish access
            if(this.userId) {//first publish specialized qolls to this user
			//	qlog.info('MY  USERID --------->>>>>'+this.userId, filename);
				var ufound = Meteor.users.find({"_id":this.userId}).fetch();
				if (ufound.length>0){
					var user= ufound[0];
					//step 1.1 verify qoll's group/user is valid for this user
					var qollFound = Qoll.find({'_id':qollId}).fetch()[0];
					var canans =false;
					qlog.info('checking '+ user.emails[0].address, filename);
				//	for (var i=0;i<(qollFound.submittedTo||[]).length;i++){
				//		qlog.info('qoll  USERID --------->>>>>'+qollFound.submittedTo[i], filename);
				//		}
					if(qollFound.submittedTo.indexOf(user.emails[0].address)>-1){
						canans=true;
						qlog.info('In register custom qoll: can publish '+ user.emails[0].address, filename);
					}
					
					for (var i = 0; i < (user.groups||[]).length; i++) {
						if(qollFound.submittedToGroup.indexOf(user.groups[i])>-1){
							canans=true;
							qlog.info('In register custom qoll: can publish '+ user.groups[i], filename);
					
						}
					}
					if(canans){
						if(existQollReg.length > 0){
							QollRegister.update({_id : existQollReg[0]._id}, { $set: {qollTypeVal : qollTypeVal,'submittedOn' : new Date()}});
							return existQollReg[0]._id;
						} else {
							var qollRegId = QollRegister.insert({
										'qollId' : qollId,
										'qollTypeVal' : qollTypeVal,
										'qollTypeIndex':qollTypeIx,
										'submittedOn' : new Date(),
										'submittedBy' : Meteor.userId()
										});
							return qollRegId;
					}

		    ReactiveDataSource.refresh('qollstat'+ qollId);
					}
					
				}
			}
            qlog.info('OUTOF register custom qoll', filename);
			return qollRegId;
	}
	
});
