var filename="bindForCode.js";

bindForCode = function(editor) {
	console.log('Initializing for code');
	editor.getSession().setMode("ace/mode/text");
	editor.navigateLineEnd();
	editor.insert("\n\n\n\n\n\n");
	editor.navigateUp(2);
	editor.insert("```");
	editor.navigateUp(2);
	editor.insert("```");
	editor.navigateDown(1);
	editor.focus();
}