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
	}
});