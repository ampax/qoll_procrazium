var filename='collections/Qolls.js';

// =============================== All physical collections here ================================ //
Qoll = new Meteor.Collection("QOLL");
QollMaster = new Meteor.Collection("QOLL_MASTER");
QollRaw = new Meteor.Collection("QOLL_RAW");
QollTags = new Meteor.Collection("QOLL_TAGS");
QollRegister = new Meteor.Collection("QOLL_REGISTER");
QollRegisterStats = new Meteor.Collection("QOLL_REGISTER_STATS");
QBank = new Meteor.Collection("QOLL_BANK");
Qollstionnaire = new Meteor.Collection("QOLLSTIONNAIRE");
QollstionnaireResponses = new Meteor.Collection("QOLLSTIONNAIRE_RESPONSES");

// =============================== Add published collections here ================================ //
QbSummary = new Meteor.Collection("qbank_summary");
Tags = new Meteor.Collection("tags");
ISentQuestionaire = new Meteor.Collection("sent-by-me-questionaire");
IStoredQuestionaire = new Meteor.Collection("stored-by-me-questionaire");
IReceivedQuestionaire = new Meteor.Collection("recvd-questionaire");
QollForQuestionaireId = new Meteor.Collection("qoll-for-questionaire-id");
QuestionaireForId = new Meteor.Collection("questionaire-for-id");
QuestionaireProgress = new Meteor.Collection("questionaire-progress");

//All published collections
/****
Publish the following qolls
	(1) My own created qolls - all created by me, and not yet archived
	(2) My own recieved qolls - all recieved and responded by me
	(3) All public qolls - all the qolls created which are public
	(4) My groups - All groups that I have created
	(5) My group's qoll - All qolls sent to this group
	(6) My qollstionnaires - All qollstionnaires created by me
****/
AllQolls = new Meteor.Collection("all-qolls");
MyCreatedQolls = new Meteor.Collection("my_active_qolls");
MyRecievedQolls = new Meteor.Collection("my_rec_qolls");
AllPublicQolls = new Meteor.Collection("mine_and_public_qolls");
MyGroupQolls = new Meteor.Collection("group_qolls");
QollRegist = new Meteor.Collection("qoll-regs");
//MyQollstionnaires = new Meteor.Collection("my_qollstionnaires");





Qoll.allow({
  insert: function(userId, doc) {
  	return doc && Meteor.userId;
  },
  update: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  },
  remove: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  }
});

QollMaster.allow({
  insert: function(userId, doc) {
  	return doc && Meteor.userId;
  },
  update: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  },
  remove: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  }
});

QBank.allow({
  insert: function(userId, doc) {
  	return doc && Meteor.userId;
  },
  update: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  },
  remove: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  }
});

QollRaw.allow({
  insert: function(userId, doc) {
  	return doc && Meteor.userId;
  },
  update: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  },
  remove: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  }
});

Qollstionnaire.allow({
  insert: function(userId, doc) {
  	return doc && Meteor.userId;
  },
  update: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  },
  remove: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  }
});

QollTags.allow({
  insert: function(userId, doc) {
  	return doc && Meteor.userId;
  },
  update: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  },
  remove: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  }
});