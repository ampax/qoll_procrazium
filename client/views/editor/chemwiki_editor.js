var filename = "client/views/editor/chemwiki_editor.js";


var MarkdownQollHooks = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        
        var tags = insertDoc.tags;
        
        var edtr = ace.edit("aceEditor");
		var content = edtr.getValue();

		console.log(tags);
        console.log(content);

        var access = 'private';
        var qollIdToEdit = undefined;
        
        var tex_mode = QollConstants.TEX_MODE.MATHJAX; // lets default the TEX mode to mathjax
        //$("input[type='radio'][name='texPref']:checked").val();

        var topic_id = Router.current().params._id;

        var share_circle = 'ChemWiki';

		qlog.info('==========================> ' + tags, filename);
		qlog.info('==========================> ' + topic_id, filename);
		qlog.info('==========================> ' + tex_mode, filename);
		qlog.info('==========================> ' + content, filename);

		// return false;

		Meteor.call("addQollMasterTopicWise", content, tags, topic_id, QollConstants.QOLL_ACTION_STORE, access, tex_mode, share_circle, undefined, function(error, msg) {
			if (error) {
				qlog.error('Error occured while converting - ' + content + '/n to markdown - ' + error, filename);
	          	QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: ' + error + '/' + msg.msg);
	          	this.done();
	          	return false;
			} else {
				QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: ' + msg.msg);
				edtr.setValue('', 1);
				$('div.xmultiple').html('');
				this.done();
				return false;
			}
		});

        /**
        var jsn = {title : title, tags : tags, end_time : end_time, recips : send_to, action : state, allqollids : allqollids};

        qlog.info(JSON.stringify(jsn), filename);

        createQuestionnaire(jsn)
        **/

        return false;
    },
};


AutoForm.addHooks('chemWikiForm', MarkdownQollHooks);


Template.chemwiki_editor.helpers({
	customMarkMenuOptSchema: function() {
	    return Schemas.custom_markdown_menu_options;
	},
	mydoc: function() {
	      var doc = {};
	      doc.share_with = new Array();

	      var coll_grps = CollabGroups.find().fetch();
	      qlog.info('-------------> ' + JSON.stringify(coll_grps), filename);

	      if(coll_grps && coll_grps.length > 0){
	        coll_grps.forEach(function(qg){
	          qlog.info('.............................>>>>>>'+JSON.stringify(qg), filename);

	          doc.share_with.push(qg.groupName);
	        });
	      }

	      qlog.info('----------> '+JSON.stringify(doc), filename);
	      return doc;
	},
	topic_prev_parent_id : function() {
		qlog.info('topic_parent_id ==> ' + Router.current().params._id + '/' + this.previous_page_parent_id, filename);
		return this.previous_page_parent_id;
	},
	topic_created_on : function(createdOn) {
		return moment(createdOn).format('MMM Do YYYY, h:mm a');
	},
	banner_img_for_id: function(img_id) {
		qlog.info('Finding topic banner for id ---> ' + img_id, filename);
		var imgs1 = QollImages.find({'_id': img_id});
		return imgs1;
	},
});

Template.chemwiki_editor.onCreated(function(){
    this.subscribe('images');
});


