var filename = 'server/init.js';

//val.replace(/\./g,"_")
qlog.info('INIT !!!!!!!!!!!!!!!!!!!!!!1111111111111');
//step1 iterate over qolls.
var DataScripts = new Meteor.Collection("DATA_SCRIPTS");
var qoll_scriptname =  'index_based_responses_v1';
if ( DataScripts.find({name:qoll_scriptname}).count() == 0){
	qlog.info('INIT !!!!!!!!!!!!!!!!!!!!!!2');
    Qoll.find({}).forEach(function (qoll){
    	qlog.info('INIT !!!!!!!!!!!!!!!!!!!!!!3');
            // convert stats to numbers based
            var oldstats; oldstats = qoll.stats;
            var newstats; newstats = {};
            var hasnewstats; hasnewstats = false;
            
            if (qoll && qoll.qollTypes && qoll.stats ){
            var arrayLength = qoll.qollTypes.length;
            
            for (var i = 0; i < arrayLength; i++) {
            	qlog.info('INIT !!!!!!!!!!!!!!!!!!!!!!4');
                var val; val = qoll.qollTypes[i];
                if ( oldstats && oldstats.hasOwnProperty(val.replace(/\./g,"_"))){
                    newstats[''+i+''] =oldstats[val.replace(/\./g,"_")];
                    hasnewstats =true;
                }
            }
            qlog.info('INIT !!!!!!!!!!!!!!!!!!!!!!5');
            if(hasnewstats){
            	qlog.info('INIT !!!!!!!!!!!!!!!!!!!!!!6');
                qoll.stats = newstats;
                qoll.oldstats = oldstats;
                Qoll.update({_id:qoll._id},qoll);
            }
            qlog.info('INIT !!!!!!!!!!!!!!!!!!!!!!7');
            // find all registers
            QollRegister.find({qollId :qoll._id}).forEach(function (qollreg){
                if( qollreg.qollTypeIndex ==0){
                	qlog.info('INIT !!!!!!!!!!!!!!!!!!!!!!8');
                    qollreg.qollTypeIndex = qoll.qollTypes.indexOf(qollreg.qollTypeVal);
                    QollRegister.update({_id:qollreg._id},qollreg);
                }
                qlog.info('INIT !!!!!!!!!!!!!!!!!!!!!!9');
                });
               }
            // update the register index to correct one
            // thats it
        });
        qlog.info('INIT !!!!!!!!!!!!!!!!!!!!!!10');
    DataScripts.insert({name: qoll_scriptname, runon:  new Date()});
    qlog.info('INIT !!!!!!!!!!!!!!!!!!!!!!11');
    
}