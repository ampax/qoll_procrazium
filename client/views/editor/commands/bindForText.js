var filename="bindForText.js";

bindForText = function(editor) {
	console.log('Initializing for text');
	editor.getSession().setMode("ace/mode/text");
	editor.focus();
}