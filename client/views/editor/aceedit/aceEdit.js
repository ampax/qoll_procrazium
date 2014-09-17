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
"*hint it is liquid metal\n"+

"\# Based on the following paragraph, fill in the blanks the following questions - \n"+
"* txt Mercury dissolves many other metals such as gold and silver to form amalgams. Iron is an exception, and iron flasks have been traditionally used to trade mercury. Several other first row transition metals with the exception of manganese, copper and zinc are reluctant to form amalgams. Other elements that do not readily form amalgams with mercury include platinum and a few other metals. Sodium amalgam is a common reducing agent in organic synthesis, and is also used in high-pressure sodium lamps.\n"+
"- Mercury is the only _liquid metal_ elements\n"+
"- Mercury was invented by _Madam Curie_\n";

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
