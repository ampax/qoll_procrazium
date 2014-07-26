var filename = "client/views/editor/aceEdit.js";
 
var test_qolls = 
"\# Who was Rani laxmibai\?\n"+
"- A Women\n"+
"- A Girl\n"+
"- A Man\n"+
"- I dont know who\n\n"+

"# Who was Maharana Pratap?\n"+
"- USA first President\n"+
"- Narendra Modi was named Maharana Pratap when young\n"+
"- A dacoit/outlaw\n"+
"- Roman emperor\n\n"+

"# Who was USA first president\n"+
"- Barak Obama\n"+
"- John Nash\n"+
"- George Washington\n\n"+

"\# What is 2\+2\?\n"+
"- 22\n"+
"- 4\n"+
"- 224\n\n"+

"# Is chemistry same as physics?\n"+
"- No, chemistry is same as maths\n"+
"- No, chemistry is philosophy\n"+
"- No, chemistry is not the same as physics\n";

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
