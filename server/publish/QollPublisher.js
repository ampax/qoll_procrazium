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
			//var user is the same info as would be given in Meteor.user();
			var handle = Qoll.find().observe({
	          added: function(doc, idx) {
	            Qoll.find({'submittedBy':this.userId}, {sort:{'submittedOn':-1}, reactive:true}).forEach(function(item){
	              //var qtype = QollTypeStandard.findOne({_id : item.qollType});
	            /*   var qregs = QollRegister.find({qollId : item._id}).fetch();
	               for (ix = 0; ix < qregs.length; ++ix) {
						qregs[i].// count by type etc here 
					}
			*/
	              var q = {
	                qollTitle : item.qollTitle,
	                qollText : item.qollText,
	                qollTypes : item.qollTypes,
	                submittedOn : item.submittedOn,
	                submittedBy : item.submittedBy,
	                submittedTo : item.submittedTo,
	                action :item.action,
	                qollTypes : item.qollTypes,
	                viewContext: "createUsr",
	                
	                _id : item._id
	              };
	              self.added('all-qolls', item._id, q);
	              //qlog.info('Adding another qoll --------->>>>>'+JSON.stringify(qtype));
	              //qlog.info('Adding another qoll --------->>>>>'+JSON.stringify(q));
	            });
	          },
	          /**removed: function(item) {
	            self.removed('all-qolls', item._id);
	            qlog.info('Removed item with id: ' + item._id);
	          }**/
	        });
	        
	        var handle = Qoll.find().observe({
	          added: function(doc, idx) {
	            Qoll.find({'submittedTo':user.emails[0].address,'action':'send'}, {sort:{'submittedOn':-1}, reactive:true}).forEach(function(item){
	              //var qtype = QollTypeStandard.findOne({_id : item.qollType});
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
	              self.added('all-qolls', item._id, q);
	              //qlog.info('Adding another qoll --------->>>>>'+JSON.stringify(qtype));
	              //qlog.info('Adding another qoll --------->>>>>'+JSON.stringify(q));
	            });
	          },
	          /**removed: function(item) {
	            self.removed('all-qolls', item._id);
	            qlog.info('Removed item with id: ' + item._id);
	          }**/
	        });
		}
	    // here we proceed with publishing qolls to group that one is member of
		}
		var handle = Qoll.find().observe({
          added: function(doc, idx) {
            Qoll.find({'submittedTo':'','action':'send'}, {sort:{'submittedOn':-1}, reactive:true}).forEach(function(item){
              //var qtype = QollTypeStandard.findOne({_id : item.qollType});
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
              //qlog.info('Adding another qoll --------->>>>>'+JSON.stringify(qtype));
              //qlog.info('Adding another qoll --------->>>>>'+JSON.stringify(q));
            });
          },
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
