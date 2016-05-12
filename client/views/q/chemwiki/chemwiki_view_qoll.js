

Template.chemwiki_view_qoll.helpers( {
    qoll_btns : function() {
        return {del:false, edit:false, graph:false, send:false } ;
    },
    get_parent_id : function() {
    	var ql = AllQolls.findOne({});
    	qlog.info('Finding all-qolls ...');
    	console.log(ql);
    	qlog.info('Finding all-qolls ...' + ql.topic_id);

    	return ql.topic_id;
    }
});

Template.chemwiki_view_qoll.events({
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        qlog.info('togggggggggggggled ......', filename);
	},
	'click button#bkButton' : function(e,t){
		e.preventDefault();
		Router.go('all_qolls_folder');
	},
});