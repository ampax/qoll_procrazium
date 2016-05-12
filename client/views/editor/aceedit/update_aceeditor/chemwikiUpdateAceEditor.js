var filename = "client/views/editor/chemwikiUpdateAceEditor.js";


var ChemwikiUpdateMarkdownQollHooks = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        
        var tags = insertDoc.tags;
        
        var edtr = ace.edit("aceEditor");
        var content = edtr.getValue();

        console.log(tags);
        console.log(content);

        var access = 'private';
        var qollIdToEdit = Router.current().params._id;

        var topic_id = Router.current().params.topic_id;
        
        var tex_mode = QollConstants.TEX_MODE.MATHJAX; // lets default the TEX mode to mathjax
        //$("input[type='radio'][name='texPref']:checked").val();

        var share_circle = 'ChemWiki';

    qlog.info('==========================> ' + tags, filename);
    qlog.info('==========================> ' + qollIdToEdit, filename);
    qlog.info('==========================> ' + content, filename);
    qlog.info('==========================> ' + topic_id, filename);
    qlog.info('==========================> ' + tex_mode, filename);
    qlog.info('==========================> ' + share_circle, filename);

    // qollText, tags, topic_id, action, visibility, texMode, share_circle, qollIdtoUpdate

    Meteor.call("addQollMasterTopicWise", content, tags, topic_id, QollConstants.QOLL_ACTION_STORE, access, tex_mode, share_circle, qollIdToEdit, function(error, msg) {
      if (error) {
        qlog.error('Error occured while converting - ' + content + '/n to markdown - ' + error, filename);
              QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: ' + error + '/' + msg.msg);
              this.done();
              return false;
      } else {
        QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: ' + msg.msg);
        edtr.setValue('', 1);
        $('div.xmultiple').html('');
        //this.done();
        return false;
      }
    });

        /**
        var jsn = {title : title, tags : tags, end_time : end_time, recips : send_to, action : state, allqollids : allqollids};

        qlog.info(JSON.stringify(jsn), filename);

        createQuestionnaire(jsn)
        **/

        Router.go('/edu_dashboard_qoll/'+Router.current().params.topic_id);
    },
};


AutoForm.addHooks('chemwikiUpdateForm', ChemwikiUpdateMarkdownQollHooks);

Template.chemwikiUpdateAceEditor.rendered = function() {
  var editor = ace.edit("aceEditor");
  // editor.setTheme("ace/theme/dawn"); 
  editor.setTheme("ace/theme/monokai"); 
  //dawn,dreamweaver,eclipse,github,idle_fingers,kr_theme,solarized_light
  editor.setHighlightActiveLine(true);
  editor.getSession().setMode("ace/mode/text");
  editor.getSession().setUseWrapMode(true);

  // editor.getSession().on('change', editorPreviewRefresh);
  editor.on("changeSelection", editorPreviewRefresh); 

  editor.setOptions({
      enableBasicAutocompletion: true
  });

  // editor.renderer.setShowGutter(false)

  //var qoll = RawQollForId.findOne({});

  //if(qoll) qlog.info(qoll.rawQoll.qollText, filename);

  editor.focus();

  var code = editor.getValue();
  editor.setValue(code);


  if(URLUtil.isDev()) {
    //editor.setValue("test_qolls");
  }

  //initEditor(editor);
};

Template.chemwikiUpdateQoll.helpers({
  customMarkMenuOptSchema: function() {
      return Schemas.custom_markdown_menu_options;
  },
  mydoc: function() {
    var doc = {};
    var q = RawQollForId.findOne();
    if(q && q.tags) doc.tags = q.tags;

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

Template.chemwikiUpdateQoll.onCreated(function(){
    this.subscribe('images');

    /** var editor = ace.edit("aceEditor");

    var qoll = RawQollForId.findOne();

    qlog.info(qoll.rawQoll.qollText, filename);

    if(qoll) editor.setValue(qoll.rawQoll.qollText); **/
});


