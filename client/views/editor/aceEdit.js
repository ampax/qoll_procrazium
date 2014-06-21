var filename = "client/views/editor/aceEdit.js";
 
Template.aceEditor.events({
  'click #show_hint' : function(event) {
    //todo
    //event.preventDefault();
    qlog.info('Will print the hint from this now', filename);
    $('#hint').removeClass('is-invisible');
  },
});

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

  //initEditor(editor);
};