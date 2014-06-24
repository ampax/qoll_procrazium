var filename = 'lib/db/QollRegisterDb.js';

Meteor.methods({
	registerQoll: function(qollId, qollTypeVal){
        qlog.info('In register qoll: ' + qollId + ', ' + qollTypeVal + ', Meteor.userId ' + Meteor.userId(), filename);
        var existQollReg = QollRegister.find({qollId: qollId, submittedBy: userId}).fetch();
        qlog.debug(existQollReg, filename);

	    var qollRegId = QollRegister.insert({
			'qollId' : qollId,
			'qollTypeVal' : qollTypeVal,
			'submittedOn' : new Date(),
			'submittedBy' : Meteor.userId()
            });

	    ReactiveDataSource.refresh('qollstat'+ qollId);
		return qollRegId;
	},
	registerQollCustom: function(qollId, qollTypeVal, qollTypeIx){
		var userId= Meteor.userId();
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
			
				if(qollFound.submittedToGroup.length>0){
		        var gpsraw= QollGroups.find({'userEmails':user.emails[0].address,'submittedBy':qollFound.submittedBy,'groupName':{$in:qollFound.submittedToGroup}},{fields:{"_id": 0,'groupName':1,'submittedBy':2}},{reactive:false});
				qlog.info('Custom one two three ' + user.emails[0].address + ', ' + qollFound.submittedBy + ', ' + Meteor.userId(), filename);
		        var allUserGroups = [];
		        gpsraw.forEach(function (grpEntry){
					canans=true;
					});
				}
				if(qollFound.submittedTo.indexOf(user.emails[0].address)>-1)
				{
					canans=true;
					qlog.info('In register custom qoll: can publish '+ user.emails[0].address, filename);
				}	
				if(canans){
					//ansCount[qollFound.qollTypes.ind1exOf(qollTypeVal)]= ansCount[qollFound.qollTypes.indexOf(qollTypeVal)]?ansCount[qollFound.qollTypes.indexOf(qollTypeVal)]+1:1;
					var statsFilter ={};
					var qolltypkey = qollTypeIx;//qollTypeVal.replace(/\./g,"_");
					statsFilter["stats."+ qolltypkey +""] = 1;
					
					qlog.info('adding one to '+ "stats."+ qolltypkey, filename);
					if(existQollReg.length > 0){
						if("stats."+ qolltypkey !="stats."+existQollReg[0].qollTypeIndex ){
							
							statsFilter["stats."+existQollReg[0].qollTypeIndex] = -1;
							
							qlog.info('subt one to '+ "stats."+existQollReg[0].qollTypeIndex , filename);
						}else{
							statsFilter["stats."+ qolltypkey ] = 0;
							qlog.info('no change to '+ "stats."+ qolltypkey, filename);
						}

						//reset the qollType for single choice, and modify/add it for multiple choice
						qlog.info('yyyyyyyyyyyyyyyyyyyyyyyySetting registers for multiple qoll', filename);
						var qollTypeReg = undefined;
						if(qollFound.isMultiple == true) {
							qlog.info('xxxxxxxxxxxxxxxxxxxxxxxSetting registers for multiple qoll ' +qollFound.isMultiple, filename);
							if(existQollReg.qollTypeReg != undefined && existQollReg.qollTypeReg != null) 
								qollTypeReg = existQollReg.qollTypeReg;
							else 
								qollTypeReg = CoreUtils.getUint8Array(QollConstants.MAX_SUPPORTED_QOLL_TYPES);
								qollTypeReg[qollTypeIx] = 1;
						} else {
							qlog.info('yyyyyyyyyyyyyyyyyyyyyyyySetting registers for multiple qoll '+qollFound.isMultiple, filename);
							//qollTypeReg = CoreUtils.getUint8Array(QollConstants.MAX_SUPPORTED_QOLL_TYPES);
							//qollTypeReg[qollTypeIx] = 1;
						}

						QollRegister.update({_id : existQollReg[0]._id}, 
											{ $set: {qollTypeVal : qollTypeVal,qollTypeIndex:qollTypeIx, qollTypeReg:qollTypeReg ,'submittedOn' : new Date()}});
						Qoll.update({_id:qollId},{ $inc: statsFilter } );//hopefully atomic so thread safe
						return existQollReg[0]._id;
					} else {

						qlog.info('zzzzzzzzzzzzzzzzzzzzzzzzSetting registers for multiple qoll', filename);

						qollTypeReg = CoreUtils.getUint8Array(QollConstants.MAX_SUPPORTED_QOLL_TYPES);
						qollTypeReg[qollTypeIx] = 1;

						var qollRegId = QollRegister.insert({
									'qollId' 		: qollId,
									'qollTypeVal' 	: qollTypeVal,
									'qollTypeIndex' : qollTypeIx,
									'qollTypeReg' 	: qollTypeReg,
									'submittedOn' 	: new Date(),
									'submittedBy' 	: Meteor.userId()
									});
						Qoll.update({_id:qollId},{ $inc: statsFilter } );//hopefully atomic so thread safe
						return qollRegId;
					}
				
				}
				
			}
		}
        qlog.info('OUTOF register custom qoll: ' +qollRegId + ' canans: ' + canans, filename);
		return qollRegId;
	},
	findQollRegisters: function(submittedBy, qollId){
		var q = QollRegister.findOne({'submittedBy':submittedBy,'qollId':qollId});
		if(q != undefined) {
			return {
    			'qollTypeVal' 	: q.qollTypeVal,
    			'qollTypeReg' 	: q.qollTypeReg,
    			'unitSelected' 	: q.unitSelected,
    			'submittedOn' 	: q.submittedOn
    		};
		} else {
			return CoreUtils.getUint8Array(0);
		}
	},
	registerQollBlankResponse: function(qollId, qollBlankResponse, unitSelected, attributes){
		var userId= Meteor.userId();
		var qollRegId;
        qlog.info('In register custom qoll: ' + qollId + ', ' + qollBlankResponse + ', Meteor.userId ' + Meteor.userId(), filename);
        var existQollReg = QollRegister.find({qollId: qollId, submittedBy: userId}).fetch();
        
        if(this.userId) {
        	if(existQollReg.length > 0) {
        		qlog.debug('Size and object - ' + existQollReg.length, filename);
        		//Update the existing one
        		var existingQollTypeReg = existQollReg[0].qollTypeReg;
        		var qollTypeReg = [qollBlankResponse];
        		existingQollTypeReg.map(function(t){
        			qollTypeReg.push(t);
        		});
        		qlog.info('Existing existingQollTypeReg =========>' + existingQollTypeReg + '/' + qollTypeReg,filename);
        		QollRegister.update({_id : existQollReg[0]._id}, 
        			{ $set: {qollTypeVal : qollBlankResponse, unitSelected : unitSelected, qollTypeReg : qollTypeReg ,'submittedOn' : new Date()}});
        		qollRegId = existQollReg[0]._id;
        	} else {
        		//Insert the new one
        		qollRegId = QollRegister.insert({
					'qollId' 		: qollId,
					'qollTypeVal' 	: qollBlankResponse,
					'qollTypeReg' 	: [qollBlankResponse],
					'unitSelected'  : unitSelected,
					'submittedOn' 	: new Date(),
					'submittedBy' 	: Meteor.userId()
				});
        	}
        }
        return qollRegId;
	},
	
});
