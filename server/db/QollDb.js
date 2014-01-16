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
            var qollId = Qoll.insert({
                    'action' : action,
                    'qollText' : qollText,
                    'qollTypes' : qollTypes,
                    'submittedOn' : new Date(),
                    'submittedBy' : Meteor.userId(),
                    'submittedByEmail' : getCurrentEmail,
                    'submittedTo' : emails
                });
            
            return qollId;
        },
});
