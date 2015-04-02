var filename='collections/Qolls.js';

// =============================== All physical collections here ================================ //
Qoll = new Mongo.Collection("QOLL");
QollMaster = new Mongo.Collection("QOLL_MASTER");
QollRaw = new Mongo.Collection("QOLL_RAW");
QollTags = new Mongo.Collection("QOLL_TAGS");
QollRegister = new Mongo.Collection("QOLL_REGISTER");
QollRegisterStats = new Mongo.Collection("QOLL_REGISTER_STATS");
QBank = new Mongo.Collection("QOLL_BANK");
Qollstionnaire = new Mongo.Collection("QOLLSTIONNAIRE");
QollstionnaireResponses = new Mongo.Collection("QOLLSTIONNAIRE_RESPONSES");

// Store qoll html templates here. We will create several templates for academic and social purposes
// and let users select from these for their favorites. Later they can select from the favorites and
// start creating qolls
QollTemplates = new Mongo.Collection("QOLL_TEMPLATES");

// =============================== Add published collections here ================================ //
QbSummary = new Mongo.Collection("qbank_summary");
Tags = new Mongo.Collection("tags");
ISentQuestionaire = new Mongo.Collection("sent-by-me-qabcuestionaire");
IStoredQuestionaire = new Mongo.Collection("stored-by-me-questionaire");
//IReceivedQuestionaire = new Mongo.Collection("recvd-questionaire");
QollForQuestionaireId = new Mongo.Collection("qoll-for-questionaire-id");
ExtQollForQuestionaireId = new Mongo.Collection("ext-qoll-for-questionaire-id");
ExtQollEmbedQuestionaireId = new Mongo.Collection("ext-qoll-embed-questionaire-id");
QuestionaireForId = new Mongo.Collection("questionaire-for-id");
QuestionaireProgress = new Mongo.Collection("questionaire-progress");
Battleground = new Mongo.Collection("battleground");

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
AllQolls = new Mongo.Collection("all-qolls");
MyCreatedQolls = new Mongo.Collection("my_active_qolls");
MyRecievedQolls = new Mongo.Collection("my_rec_qolls");
AllPublicQolls = new Mongo.Collection("mine_and_public_qolls");
MyGroupQolls = new Mongo.Collection("group_qolls");
QollRegist = new Mongo.Collection("qoll-regs");
//MyQollstionnaires = new Mongo.Collection("my_qollstionnaires");





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