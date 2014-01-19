var filename="client/views/mockups/mock1.js";

Template.mock1.helpers({
	load_template: function(){
		qlog.info('Loading the template: ' + Session.get('template'), filename);
		var t = Spark.render(Template[Session.get("template")]);
		qlog.info('Printing template: ' + t[1], filename);
		Template[Session.get("template")].render = function(){
			$("div.content1").children().remove();
			$("div.content1").append(t);
		};
		//t.rendered = function(){
		//	$("div.content1").children().remove();
		//	$("div.content1").append(t[1]);
		//};

        //return Template[Session.get('template')];
        //document.body.appendChild(Spark.render(Template[Session.get("template")]));
        //return Spark.render(Template[Session.get("template")]);
    },
    iif_qolls: function() {
    	qlog.info("Printing " + Session.get("template") === "qolls", filename);
    	return Session.get("template") === "qolls";
    },
    iif_managecontacts: function() {
    	return Session.get("template") === "managecontacts";
    },
    iif_addQoll: function() {
    	return Session.get("template") === "addQoll";
    },
});

Template.mock1.dynamic_template = function(){
	return Meteor.render(function(){
		qlog.info("Rendering the new template: " + Session.get("template"), filename);
		var t = Template[Session.get("template")];
		return t(this);
	});
};


Template.mock1.events({
	'click .qoll-plus' : function(event){
		event.preventDefault();
		qlog.info('Clicked qoll-plus', filename);
		Session.set('template', 'addQoll');
	},
	'click .group-plus' : function(event){
		event.preventDefault();
		qlog.info('Clicked group-plus', filename);
		Session.set('template', 'managecontacts');
	},
	'click .Inbox' : function(event){
		event.preventDefault();
		qlog.info('Clicked Inbox', filename);
		Session.set('template', 'qolls');
	},
	'click .SentItems' : function(event){
		event.preventDefault();
		qlog.info('Clicked SentItems', filename);
		Session.set('template', 'qolls');
	},
});


Deps.autorun(function(){

});