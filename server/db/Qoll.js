var filename="server/db/Qoll.js";

/**		
		This is new Qoll Db object. Only functions that will reside in this
		object will be to directly manipulate data in database table

		Qoll - the main qoll table. Data from this will directly be displayed on dashboard

		QollMaster - the table will keep raq Markdown editor data, each broken and converted

		QollRaw - the table will keep one big blob of data from markdown editor

		QollRegister - the table will keep all registered responses for a qoll

		QollRegisterStats - the table will keep high level statistics for all the registered responses
**/

QollDb = {
	insert : function(){},
	update : function(){},
	remove : function(){},
};

QollMasterDb = {
	insert : function(){},
	update : function(){},
	remove : function(){},
};

QollRawDb = {
	insert : function(){
		//This method stores original complete html qoll into the QollHtmlRaw table
		var id = QollHtmlRaw.insert({
			//JSON: You can send whatever you want but we will extract and store only required information
			'qollText' : htmlQoll.qollText,
			'qollMasterId' : qollMasterId,
			'tags' : tags,
			'submittedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,
			'visibility' : visibility
		});
	},
	update : function(){},
	remove : function(){},
};

QollRegisterDb = {
	insert : function(){},
	update : function(){},
	remove : function(){},
};

QollRegisterStatsDb = {
	insert : function(){},
	update : function(){},
	remove : function(){},
};
