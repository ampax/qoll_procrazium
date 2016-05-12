var filename = "client/views/editor/update_aceeditor/updateAceEditor.js";

preview_data = new ReactiveDict;


var MarkdownQollHooks = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        
        var share_with = insertDoc.share_with;
        var tags = insertDoc.tags;
        var topics = insertDoc.topics;
        var edtr = ace.edit("aceEditor");
        var content = edtr.getValue();

        console.log(share_with);
        console.log(tags);
        console.log(topics);
        console.log(content);

        var access = 'private';

        var controller = Router.current();
        var qollIdToEdit = controller.params._id;
        
        var accessGroups = share_with;
        var emailsandgroups = undefined;

        var tex_mode = $("input[type='radio'][name='texPref']:checked").val();

        qlog.info('==========================> ' + tex_mode+'/'+tags+'/'+topics+'/'+content+'/'+qollIdToEdit, filename);

        Meteor.call("addQollMaster", content, emailsandgroups, tags, topics, QollConstants.QOLL_ACTION_STORE, access, qollIdToEdit, accessGroups, undefined, tex_mode, function(error, msg) {
      if (error) {
        qlog.error('Error occured while converting - ' + content + '/n to markdown - ' + error, filename);
              QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: ' + error + '/' + msg.msg);
      } else {
        QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: ' + msg.msg);
        edtr.setValue('', 1);
        $('div.xmultiple').html('');
      }
    });

        /**
        var jsn = {title : title, tags : tags, end_time : end_time, recips : send_to, action : state, allqollids : allqollids};

        qlog.info(JSON.stringify(jsn), filename);

        createQuestionnaire(jsn)
        **/

        $('div.xmultiple').html('');

        Router.go('all_qolls_folder');

        return false;
    },
    before: {
            pre_populate: function(doc) {
              qlog.info('.................. called ....................');
              var q = RawQollForId.findOne();
              if(q.topics) doc.topics = q.topics;
              if(q.tags) doc.tags = q.tags;

              return doc;
            }
        },
};


AutoForm.addHooks('updateQollAceForm', MarkdownQollHooks);

Template.updateAceEditor.rendered = function() {
  var editor = ace.edit("aceEditor");
  editor.setTheme("ace/theme/dawn"); //twilight
  //dawn,dreamweaver,eclipse,github,idle_fingers,kr_theme,solarized_light
  editor.setHighlightActiveLine(true);
  editor.getSession().setMode("ace/mode/text");
  editor.getSession().setUseWrapMode(true);

  editor.getSession().on('change', editorPreviewRefresh);

  editor.setOptions({
      enableBasicAutocompletion: true
  });

  var qoll = RawQollForId.findOne();

  if(qoll) editor.setValue(qoll.rawQoll.qollText);

  editor.focus();

  if(URLUtil.isDev()) {
    // editor.setValue(test_qolls);
  }

  //initEditor(editor);
};

Template.updateAceEditor.onCreated(function(){
  //
}); 

Template.updateAceEditor.helpers({
  customMarkMenuOptSchema: function() {
      return Schemas.custom_markdown_menu_options;
  },
  arrOptions: function () {
    return Colors.find().map(function (c) {
      return {label: c.name, value: c._id};
    });
  },
  mydoc: function() {
    qlog.info('.................. called ....................');
    var doc = {};
    var q = RawQollForId.findOne();
    if(q.topics) doc.topics = q.topics;
    if(q.tags) doc.tags = q.tags;

    return doc;
  }
});

Template.updateAceEditor.events({
  'keyup .aceEditor': function(e, t) {
    /**qlog.info('Printing on keyup ......................', filename);
    Meteor.setTimeout(function(){
      qlog.info('Printing this after 5 seconds ... will I?', filename);
    }, 5000);**/
  },
});


var editorPreviewRefresh = function() {
    Meteor.setTimeout(function(){
      // qlog.info('Printing this after 5 seconds ... will I?', filename);

      var editor = ace.edit("aceEditor");
      var tex_pref = $('input[name=texPref]:checked').val();

      var qoll_focus_attrib = AceEditUtil.qollFocusAttribs(editor);

      var parsed_qoll;

      // set the data in the reactive variable
      preview_data.set("preview_data", editor.getValue() );
      preview_data.set("tex_pref", tex_pref);
      preview_data.set("qoll_focus_attrib", qoll_focus_attrib);
      /** Meteor.call('parse_downtown', editor.getValue(), DownTownOptions.downtown_default(), function(err, val) {
        console.log(val);
        //qlog.info("Rec data from server: " + JSON.stringify(val), filename);
        if (err) {
          parsed_qoll = "Error occured while converting qoll-contents. Please try again: " + err;
          previewQoll(parsed_qoll);
        } else {
          parsed_qoll = val;
          previewQoll(preparePreviewHtml(parsed_qoll));
          $("div#aceEditor").height($("div#aceEditor_Preview").parent().height()+'px');
          var editor = ace.edit("aceEditor");
          editor.resize(true);
          editor.setHighlightActiveLine(true);
        }
      });**/
    }, 2000);
}

var findCurrentQoll = function(str,pos){
    var qolls = str.split(/\#\s/);
    // var words=str.split(' ');
    var offset=0;
    var i;
    for(i=0;i<qolls.length;i++){
        offset+=qolls[i].length+1;
        if (offset>pos) break;
        
    }
    return qolls[i];
}


