var filename = 'server/db/QollTypeStandardDb.js';

QollTypeStandard = new Meteor.Collection('QOLL_TYPE_STANDARD');

Meteor.startup(function(){
	QollTypeStandard.allow({
	  insert: function (userId, doc) {
	    // the user must be logged in, and the document must be owned by the user
	    // return (userId && doc.owner === userId);
	    return true;
	  },
	  update: function (userId, doc, fields, modifier) {
	    // can only change your own documents
	    //return doc.owner === userId;
	    return true;
	  },
	  remove: function (userId, doc) {
	    // can only remove your own documents
	    // return doc.owner === userId;
	    return true;
	  },
	  fetch: ['owner']
	});
	if(QollTypeStandard.find().count() == 0){
		qlog.info('No standard-qoll types found at startup. Initializing with standard type.', filename);
		/** Initialize the standard qoll-types here **/
		QollTypeStandard.insert({
			'qollType' : 'yesno',
			'qollTypeVal' : ['Yes', 'No'],
			'qollTypeDis' : 'Y/N',
			'qollTypeOpt' : {'sel' : 'single', 'mode' : 'button'}
		});

		QollTypeStandard.insert({
			'qollType' : 'yesnomaybe',
			'qollTypeVal' : ['Yes', 'No', 'May Be'],
			'qollTypeDis' : 'Y/N/M',
			'qollTypeOpt' : {'sel' : 'single', 'mode' : 'button'}
		});

		/**QollTypeStandard.insert({
			'qollType' : 'likedislike',
			'qollTypeVal' : ['Like', 'Dislike'],
			'qollTypeDis' : 'Like-Dislike',
			'qollTypeOpt' : {'sel' : 'single', 'mode' : 'button'}
		});

		QollTypeStandard.insert({
			'qollType' : 'likedislikeindiff',
			'qollTypeVal' : ['Like', 'Dislike', 'Indiff'],
			'qollTypeDis' : 'Like-Dislike-Indiff',
			'qollTypeOpt' : {'sel' : 'single', 'mode' : 'button'}
		});**/
	}
});