var filename = "client/views/editor/aceEdit.js";
 
var test_qolls = 
"\# Who was Rani laxmibai\?\n"+
"* text Identify the women from a small kingdom in northern part of U.P. to have fought with English rule in 1857, died in 1858\n"+
"*hint She was a warrior, a princess, and a queen of the small Maratha kingdom Jhansi\n"+
"* answer A Women\n"+
"- A Women\n"+
"- A Girl\n"+
"- A Man\n"+
"- I dont know who\n\n"+

"\# Who was Maharana Pratap\?\n"+
"* text Correctly identify the legend of Maharana Pratap\n"+
"* hint Prince of Amer\n"+
"* ans E\n"+
"- USA first President\n"+
"- Narendra Modi was named Maharana Pratap when young\n"+
"- A dacoit/outlaw\n"+
"- Roman emperor\n"+
"- He was prince of Amer who, since his young age, fought against Moughal dynasty and defeated them in many battles\n\n"+

"\# Who was USA first president\n"+
"- Barak Obama\n"+
"- John Nash\n"+
"- George Washington\n\n"+

"\# _mercury_ liquid metal element is named after the noble winning scientist Madam Curie\n"+
"*hint it is liquid metal\n";

Template.aceEditor.rendered = function() {
  var editor = ace.edit("aceEditor");
  editor.setTheme("ace/theme/dawn"); 
  //dawn,dreamweaver,eclipse,github,idle_fingers,kr_theme,solarized_light
  editor.setHighlightActiveLine(true);
  editor.getSession().setMode("ace/mode/text");
  editor.getSession().setUseWrapMode(true);

  editor.getSession().on('change', editorPreviewRefresh);

  editor.setOptions({
      enableBasicAutocompletion: true
  });
  editor.focus();

  if(URLUtil.isDev()) {
    editor.setValue(test_qolls);
  }

  //initEditor(editor);
};


Template.aceEditor.events({
  'keyup .aceEditor': function(e, t) {
    qlog.info('Printing on keyup ......................', filename);
    Meteor.setTimeout(function(){
      qlog.info('Printing this after 5 seconds ... will I?', filename);
    }, 5000);
  },
  'keyup .ace_content': function(e, t) {
    e.preventDefault();
    qlog.info('Printing on keyup ......................', filename);
    Meteor.setTimeout(function(){
      qlog.info('Printing this after 5 seconds ... will I?', filename);
    }, 5000);
  }
});


var editorPreviewRefresh = function() {
    //var editor = ace.edit("aceEditor");
    //var txt = editor.getValue();
    //var pos = editor.getCursorPosition();
    //var sel = editor.getSelection();

    //var current_qoll = findCurrentQoll(txt, pos);

    //console.log(pos);
    //console.log(sel);
    //qlog.info('Printing on keyup ......................', filename);
    //qlog.info('................. ' + current_qoll + '.....' +  pos, filename);
    //qlog.info(txt, filename);
    Meteor.setTimeout(function(){
      //qlog.info('Printing this after 5 seconds ... will I?', filename);

      var editor = ace.edit("aceEditor");
      var parsed_qoll;
      Meteor.call('parse_downtown', editor.getValue(), DownTownOptions.downtown_default(), function(err, val) {
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
      });
      //previewQoll(preparePreviewHtml(parsed_qoll));
    }, 5000);
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


