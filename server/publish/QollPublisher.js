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
			
			
			var handle = Qoll.find({'submittedBy':this.userId}, {sort:{'submittedOn':-1}, reactive:true}).observe({
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
	              var valtypehandle = QollRegister.find({'qollId' : item._id, 'submittedBy' : this.userId},{}).fetch();
	              if(valtypehandle) qlog.info("Found valtypehandle ----> " + JSON.stringify(valtypehandle) + " qollId: " + item._id, filename);
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
	              var valtypehandle = QollRegister.find({'qollId' : item._id, 'submittedBy':this.userId},{});
	              if(valtypehandle != undefined) qlog.info("Found valtypehandle ----> " + valtypehandle + " qollId: " + item._id, filename);
	              self.changed('all-qolls', item._id, q);
	              //qlog.info('Adding another self published qoll --------->>>>>'+item._id,filename);

	          }
	          /**removed: function(item) {
	            self.removed('all-qolls', item._id);
	            qlog.info('Removed item with id: ' + item._id);
	          }**/
	        });
	        
	        var handle = Qoll.find({'submittedTo':user.emails[0].address,'action':'send'}, {sort:{'submittedOn':-1}, reactive:true}).observe({
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
	                viewContext: "recieveUsr",
	                
	                _id : item._id
	              };
	              var valtypehandle = QollRegister.find({'qollId' : item._id, 'submittedBy':this.userId},{});
	              if(valtypehandle != undefined) qlog.info("Found valtypehandle ----> " + valtypehandle + " qollId: " + item._id, filename);
	              self.added('all-qolls', item._id, q);
	              //qlog.info('Adding another DIRECT RECIEVED qoll --------->>>>>'+item._id,filename);

	          },
	          removed: function(item) {
	            self.removed('all-qolls', item._id);
	            qlog.info('Removed item with id: ' + item._id);
	          }
	        });
	        var allUserGroups = [];
	        (user.groups||[]).map(function (grpEntry){
				allUserGroups.push(grpEntry.groupName);
				});
	        var handle = Qoll.find({'submittedToGroup':{$in : allUserGroups},'action':'send'}, {sort:{'submittedOn':-1}, reactive:true}).observe({
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
	                viewContext: "recieveUsr",
	                
	                _id : item._id
	              };
	              var valtypehandle = QollRegister.find({'qollId' : item._id, 'submittedBy':this.userId},{});
	              if(valtypehandle != undefined) qlog.info("Found valtypehandle ----> " + valtypehandle + " qollId: " + item._id, filename);
	              self.added('all-qolls', item._id, q);
	              //qlog.info('Adding another DIRECT RECIEVED qoll --------->>>>>'+item._id,filename);

	          },
	          removed: function(item) {
	            self.removed('all-qolls', item._id);
	            qlog.info('Removed item with id: ' + item._id);
	          }
	        });	        
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
              var valtypehandle = QollRegister.find({'qollId' : item._id, 'submittedBy':this.userId},{});
	          if(valtypehandle != undefined) qlog.info("Found valtypehandle ----> " + valtypehandle + " qollId: " + item._id, filename);
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
