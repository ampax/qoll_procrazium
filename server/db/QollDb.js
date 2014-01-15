var filename = 'server/db/QollDb.js';

Qoll = new Meteor.Collection("QOLL");

/** Database insert method for qolls  **/
Meteor.methods({
        addQoll: function(qollText, qollType){
            qlog.info("Add qoll: " + qollText, filename);
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

        addQoll: function(qollTitle, qollText, qollTypes){
            qlog.info("Add qoll: " + qollTitle, filename);
            var qollId = Qoll.insert({
                    'qollTitle' : qollTitle,
                    'qollText' : qollText,
                    'qollTypes' : qollTypes,
                    'submittedOn' : new Date(),
                    'submittedBy' : Meteor.userId(),
                    'submittedByEmail' : getCurrentEmail,
                    'submittedTo' : []
                });
            
            return qollId;
        },
});