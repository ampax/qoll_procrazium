var filename = 'server/publisher/QollPublisher.js';

/** Publishing to the subscribers method for qolls  **/
Meteor.publish('All_QOLL_PUBLISHER', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('Fetching all the qolls in desc order of creation; uuid: ' + uuid, filename);
        //db.QOLL.find({'submittedTo':'usr3322@qoll','action':'send'})
        if(this.userId) {//first publish specialized qolls to this user
			qlog.info('MY  USERID --------->>>>>'+this.userId);
			var ufound = Meteor.users.find({"_id":this.userId}).fetch();
			if (ufound.length>0){
			var user= ufound[0];
			qlog.info('MY  USER --------->>>>>'+user);
			qlog.info('MY  USER --------->>>>>'+user.emails);
			
			//submitted by this user
			var handle = Qoll.find({'submittedBy':this.userId,'action':{$ne:'archive'}}, {sort:{'submittedOn':-1}, reactive:true}).observe({
	          added: function(item, idx) {
				  
	              var q = {
	                qollTitle : item.qollTitle,
	                qollText : item.qollText,
	                qollTypes : item.qollTypes,
	                submittedOn : item.submittedOn,
	                submittedBy : item.submittedBy,
	                submittedTo : item.submittedTo,
	                action :item.action,
	                qollTypes : item.qollTypes,
	                stats: item.stats,
	                viewContext: "createUsr",
	                
	                _id : item._id
	              };
	              self.added('all-qolls', item._id, q);
	              //qlog.info('Adding another self published qoll --------->>>>>'+item._id,filename);

	          },
	          changed: function(item, idx) {
				  
	            
	              var q = {
	                qollTitle : item.qollTitle,
	                qollText : item.qollText,
	                qollTypes : item.qollTypes,
	                submittedOn : item.submittedOn,
	                submittedBy : item.submittedBy,
	                submittedTo : item.submittedTo,
	                action :item.action,
	                qollTypes : item.qollTypes,
	                stats: item.stats,
	                viewContext: "createUsr",
	                
	                _id : item._id
	              };
	              self.changed('all-qolls', item._id, q);
	              //qlog.info('Adding another self published qoll --------->>>>>'+item._id,filename);

	          },
	          removed: function(item) {
	            self.removed('all-qolls', item._id);
	            qlog.info('Removed item with id: ' + item._id);
	          }
	        });
	        //send to me
	        var handle = Qoll.find({'submittedTo':user.emails[0].address,'action':'send'}, {sort:{'submittedOn':-1}, reactive:true}).observe({
	          added: function(item, idx) {
	          	  var usentby = Meteor.users.find({"_id":item.submittedBy}).fetch();
	          	  var sentby ='';
				  if (usentby.length>0)
				 	sentby= usentby[0].emails[0].address;
	              var q = {
	                qollTitle : item.qollTitle,
	                qollText : item.qollText,
	                qollTypes : item.qollTypes,
	                submittedOn : item.submittedOn,
	                submittedBy : item.submittedBy,
	                sendingUser : sentby,
	                submittedTo : item.submittedTo,
	                action :item.action,
	                qollTypes : item.qollTypes,
	                viewContext: "recieveUsr",
	                
	                _id : item._id
	              };
	              self.added('all-qolls', item._id, q);
	              //qlog.info('Adding another DIRECT RECIEVED qoll --------->>>>>'+item._id,filename);

	          },
	          removed: function(item) {
	            self.removed('all-qolls', item._id);
	            qlog.info('Removed item with id: ' + item._id);
	          }
	        });
	        var gpsraw= QollGroups.find({'userEmails':user.emails[0].address},{fields:{"_id": 0,'groupName':1,'submittedBy':2}},{reactive:false});
	        var allUserGroups = [];
	        gpsraw.forEach(function (grpEntry){
				allUserGroups.push({'submittedToGroup':grpEntry.groupName,'submittedBy':grpEntry.submittedBy});
				});
			if (allUserGroups.length>0){
	        var handle = Qoll.find({'$or' :allUserGroups,'action':'send'}, {sort:{'submittedOn':-1}, reactive:true}).observe({
	          added: function(item, idx) {
	          	  var usentby = Meteor.users.find({"_id":item.submittedBy}).fetch();
	          	  var sentby ='';
				  if (usentby.length>0)
				 	sentby= usentby[0].emails[0].address;
	              var q = {
	                qollTitle : item.qollTitle,
	                qollText : item.qollText,
	                qollTypes : item.qollTypes,
	                submittedOn : item.submittedOn,
	                submittedBy : item.submittedBy,
	                sendingUser : sentby,
	                submittedTo : item.submittedTo,
	                action :item.action,
	                qollTypes : item.qollTypes,
	                viewContext: "recieveUsr",
	                
	                _id : item._id
	              };
	              self.added('all-qolls', item._id, q);
	              //qlog.info('Adding another DIRECT RECIEVED qoll --------->>>>>'+item._id,filename);

	          },
	          removed: function(item) {
	            self.removed('all-qolls', item._id);
	            qlog.info('Removed item with id: ' + item._id);
	          }
	        });
	        }	        
		}
	    // here we proceed with publishing qolls to group that one is member of
		}
		var handle = Qoll.find({'submittedTo':'','action':'send'}, {sort:{'submittedOn':-1}, reactive:true}).observe({
          added: function(item, idx) {
              var q = {
                qollTitle : item.qollTitle,
                qollText : item.qollText,
                qollTypes : item.qollTypes,
                submittedOn : item.submittedOn,
                submittedBy : item.submittedBy,
                submittedTo : item.submittedTo,
                action :item.action,
                viewContext: "publicQolls",
                qollTypes : item.qollTypes,
                _id : item._id
              };
              self.added('all-qolls', item._id, q);
              //qlog.info('Adding another PUBLIC RECIEVED qoll --------->>>>>'+item._id,filename);
              //qlog.info('Adding another qoll --------->>>>>'+JSON.stringify(qtype));
              //qlog.info('Adding another qoll --------->>>>>'+JSON.stringify(q));
            
          }
          /**removed: function(item) {
            self.removed('all-qolls', item._id);
            qlog.info('Removed item with id: ' + item._id);
          }**/
        });
		//finally publish all public qolls
        qlog.info('Done initializing the publisher: All_QOLL_PUBLISHER, uuid: ' + uuid, filename);
        initializing = false;
        self.ready();
        //self.flush();

        self.onStop(function(){
                handle.stop();
        });
}); 




/**
* This method publishes all the qolls for the user which are still open for edit.
* Further variants for this section can be - clone an active or deactivated qoll 
* to create new qolls or reopen a qoll for public
**/
Meteor.publish('OPEN_QOLL_PUBLISHER', function(){
	//Get all the qolls created by this user which are still open for edit
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	if(this.userId) {
		var handle = Qoll.find({'submittedBy':this.userId, action : {$in :["store"]}}, {sort:{'submittedOn':-1}, reactive:true}).observe({
          added: function(item, idx) {
			  
              var q = {
                qollTitle : item.qollTitle,
                qollText : item.qollText,
                qollTypes : item.qollTypes,
                submittedOn : item.submittedOn,
                submittedBy : item.submittedBy,
                submittedTo : item.submittedTo,
                action :item.action,
                qollTypes : item.qollTypes,
                stats: item.stats,
                viewContext: "createUsr",
                
                _id : item._id
              };
              self.added('all-open-qolls', item._id, q);
              //qlog.info('Adding another self published qoll --------->>>>>'+item._id,filename);

          },
          changed: function(item, idx) {
			  
            
	          var q = {
	            qollTitle : item.qollTitle,
	            qollText : item.qollText,
	            qollTypes : item.qollTypes,
	            submittedOn : item.submittedOn,
	            submittedBy : item.submittedBy,
	            submittedTo : item.submittedTo,
	            action :item.action,
	            qollTypes : item.qollTypes,
	            stats: item.stats,
	            viewContext: "createUsr",
	            
	            _id : item._id
	          };
	          self.changed('all-open-qolls', item._id, q);
	          //qlog.info('Adding another self published qoll --------->>>>>'+item._id,filename);

          },
          removed: function(item) {
            self.removed('all-open-qolls', item._id);
            qlog.info('Removed item with id: ' + item._id);
          }
        });

		self.ready();
		self.onStop(function(){
			qlog.info('Stopping the OPEN_QOLL_PUBLISHER publisher: ' + this.userId, filename);
            handle.stop();
        });
	}
});
