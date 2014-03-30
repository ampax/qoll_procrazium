var filename="bindForCode.js";

bindForCode = function(editor) {
	console.log('Initializing for code');
	editor.getSession().setMode("ace/mode/text");
	editor.navigateLineEnd();
	editor.navigateDown(1);
	editor.insert("```");
	editor.insert("\n\n");
	editor.navigateDown(2);
	editor.insert("```");
	editor.navigateUp(1);
	editor.focus();
}