var filename = "client/views/editor/aceEdit.js";
 
Template.aceEditor.rendered = function() {
  var editor = ace.edit("aceEditor");
  editor.setTheme("ace/theme/twilight");
  editor.setHighlightActiveLine(true);
  editor.getSession().setMode("ace/mode/text");
  editor.getSession().setUseWrapMode(true);

  editor.setOptions({
      enableBasicAutocompletion: true
  });

  //initEditor(editor);
};