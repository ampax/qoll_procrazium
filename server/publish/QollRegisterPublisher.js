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

