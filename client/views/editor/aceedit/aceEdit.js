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
  }
});


