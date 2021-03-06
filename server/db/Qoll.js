var filename="server/db/Qoll.js";

/**		
		This is new Qoll Db object. Only functions that will reside in this
		object will be to directly manipulate data in database table

		Qoll - the main qoll table. Data from this will directly be displayed on dashboard

		QollMaster - the table will keep raq Markdown editor data, each broken and converted

		QollRaw - the table will keep one big blob of data from markdown editor

		QollRegister - the table will keep all registered responses for a qoll

		QollRegisterStats - the table will keep high level statistics for all the registered responses

		Qollstionnaire - the table will keep all the questionnaires for intended responses, remember, this can be one or more qolls
**/

Qolls = {};

Qolls.QollDb = {
	insert : function(){},
	update : function(){},
	remove : function(){},
	get		 : function (params){
		return Qoll.findOne(params);
	}
};

Qolls.QollMasterDb = {
	insert : function(qoll){
		//This method stores original complete html qoll into the QollHtmlRaw table
		if(qoll.qollFormat == undefined || qoll.qollFormat === '' 
			|| !_.contains([QollConstants.QOLL.FORMAT.BASIC, QollConstants.QOLL.FORMAT.HTML, QollConstants.QOLL.FORMAT.TXT], qoll.qollFormat))
			return 'ERROR: You must specify format to persist the Qoll';

		if(qoll.visibility == undefined) qoll.visibility = QollConstants.QOLL.VISIBILITY.PUB;

		var qollMasterId = QollMaster.insert({
			'qollText' : qoll.qollText,
			'tags' : qoll.tags,
			'submittedOn' : new Date(),
			'updatedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,
			'visibility' : qoll.visibility,
			'qollFormat' : qoll.qollFormat
		});

		return qollMasterId;
	},
	update : function(){},
	remove : function(){},
};

Qolls.QollRawDb = {
	//qoll: {qollText: qollText, qollMasterId: qollMasterId, tags: tags, visibility: visibility, qollFormat: qollFormat}
	insert : function(qoll){
		
		if(qoll.visibility == undefined) qoll.visibility = QollConstants.QOLL.VISIBILITY.PUB;
		
		var id = QollRaw.insert({
			//JSON: You can send whatever you want but we will extract and store only required information
			'qollText' : qoll.qollText,
			'qollMasterId' : qoll.qollMasterId,
			'tags' : qoll.tags,
			'submittedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,
			'visibility' : qoll.visibility,
			'qollFormat' : qoll.qollFormat
		});

		return id;
	},
	update : function(){},
	remove : function(){},
};

Qolls.QollRegisterDb = {
	insert : function(){},
	update : function(){},
	remove : function(){},
};

Qolls.QollRegisterStatsDb = {
	insert : function(){},
	update : function(){},
	remove : function(){},
};

Qolls.QollstionnaireDb = {
	insert : function(qollstionnaire){
		var questId = Qollstionnaire.insert({
			title						: qollstionnaire.title,
			submittedBy 				: Meteor.userId(),
			submittedOn 				: new Date(),
			qollids 					: qollstionnaire.qollids,
			qolls_to_email 				: qollstionnaire.qolls_to_email,
			tags 						: qollstionnaire.tags,
			submittedTo 				: qollstionnaire.submittedTo,
			submittedToGroup 			: qollstionnaire.submittedToGroup,
			status 						: qollstionnaire.status,
			visibility 					: qollstionnaire.visibility,
		});

		return questId;
	},
	update : function(query, upd){
		Qollstionnaire.update(query, {$set : upd});
	},
	remove : function(id){
		Qollstionnaire.update({_id : id}, {$set : {status : QollConstants.STATUS.ARCHIVE}});
	},
};

// Exposing DB methods to client.
Meteor.methods({
	getQollById: function (qollid) { return Qolls.QollDb.get({_id:qollid});},
	removeQuestionnaire : function(questid) { Qolls.QollstionnaireDb.update({_id : questid}, {status : QollConstants.STATUS.ARCHIVE});},
	sendQuestionnaire : function(questid) { Qolls.QollstionnaireDb.update({_id : questid}, {status : QollConstants.STATUS.SENT});}
});
