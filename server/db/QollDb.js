var filename = 'server/db/QollDb.js';

Qoll = new Meteor.Collection("QOLL");

/** Database insert method for qolls  **/
Meteor.methods({
        addQoll: function(qollText, qollType){
            qlog.info("BAD Add qoll: " + qollText, filename);
            var qollId = Qoll.insert({
                    'qollText' : qollText,
                    'submittedOn' : new Date(),
                    'submittedBy' : Meteor.userId(),
                    'submittedByEmail' : getCurrentEmail,
                    'submittedTo' : [],
                    'qollType' : qollType
                });
            
            return qollId;
        },

        addQoll: function(action, qollText, qollTypes, emails){
            qlog.info("GOOD Add qoll: " +qollText, filename);
            var newQtype = {};
            var i =0, actualmails=[],actualgroups=[];
            
            for (i=0;i<(emails||[]).length ; i++){
				if(emails[i].indexOf('@')>-1){
					actualmails.push(emails[i]);
				}else{
					actualgroups.push(emails[i]);
				}
			}
            var stats = qollTypes.map(function (qtype){newQtype[qtype.replace(/\./g,"_")]=0;});
            var qollId = Qoll.insert({
                    'action' : action,
                    'qollText' : qollText,
                    'qollTypes' : qollTypes,
                    'stats': newQtype,
                    'submittedToGroup' : actualgroups,
                    'submittedOn' : new Date(),
                    'submittedBy' : Meteor.userId(),
                    'submittedByEmail' : getCurrentEmail,
                    'submittedTo' : actualmails
                });
            
            return qollId;
        },
        modifyQollId: function (qollId, newAction){
			var userId= Meteor.userId();
			if(userId) {
				var ufound = Meteor.users.find({"_id":this.userId}).fetch();
				if (ufound.length>0){
					var user= ufound[0];
					//step 1.1 verify qoll's group/user is valid for this user
					var qollFound = Qoll.find({'_id':qollId}).fetch()[0];
					var canModify =false;
					qlog.info('checking '+ user.emails[0].address, filename);
					if(qollFound.submittedBy === userId){
						canModify =true;
					}
					Qoll.update({'_id':qollId}, {$set:{action :  newAction,submittedOn : new Date()}});
				}
		
			}
		},
        updateQoll: function(qollText, qollTypes, emails, qollId){
            var userId= Meteor.userId();
            var i =0, actualmails=[],actualgroups=[];
            
            for (i=0;i<(emails||[]).length ; i++){
                if(emails[i].indexOf('@')>-1){
                    actualmails.push(emails[i]);
                }else{
                    actualgroups.push(emails[i]);
                }
            }

            if(userId && qollId) {
                Qoll.update({'_id':qollId}, 
                    {$set:
                        {qollText:qollText, 
                            qollTypes: qollTypes, 
                            submittedTo : actualmails,
                            updatedOn : new Date()
                        }
                    });
                qlog.info('Qoll updated with id: ' + qollId, filename);
                return qollId;
            }
        },
        
        
        
        
});
