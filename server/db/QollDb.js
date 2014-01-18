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
                    'submittedTo' : ['priyankasharma181@gmail.com','kaushik.amit@gmail.com'],
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
            var stats = qollTypes.map(function (qtype){newQtype[qtype]=0;});
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
});
