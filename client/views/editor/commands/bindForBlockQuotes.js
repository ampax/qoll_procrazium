var filename="bindForBlockQuotes.js";

bindForBlockQuotes = function(editor) {
	console.log('Initializing for code');
	editor.getSession().setMode("ace/mode/text");
	editor.navigateLineEnd();
	//editor.insert("\n");
	//editor.navigateUp(1);
	editor.insert("\n> ");

}