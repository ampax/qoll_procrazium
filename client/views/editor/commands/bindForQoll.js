var filename="bindForQoll.js";

bindToolBarForQoll = function(editor) {
	console.log('Initializing for qoll');
	//editor.getSession().setMode("ace/mode/text");
	//editor.setValue(editor.getValue(), 1);
	if(editor.find("\n#Qoll ", {wrap: false}, false)){
		console.log('Log found ...');
		editor.moveCursorToPosition(editor.getCursorPosition());
		editor.navigateUp(1);
		//editor.insert("\n");
		editor.navigateUp(1);
		editor.insert("\n#Qoll ");
		editor.setHighlightActiveLine(true);
	} else {
		//no #Qoll found
		console.log('No qoll found ...');
		editor.navigateFileEnd();
		//editor.insert("\n");
		editor.navigateUp(1);
		editor.insert("#Qoll ");
		editor.setHighlightActiveLine(true);
	}

	// Calculate total number of lines
	var len = editor.session.getLength();
	console.log("Total number of lines in the editor: " + len);
	editor.focus();
};


bindToolBarForOption = function(editor) {
	console.log('Initializing for option');
	//editor.getSession().setMode("ace/mode/text");
	editor.navigateLineEnd();
	editor.insert("\n");
	editor.insert("- ");
	editor.focus();
};

bindToolBarForQollAnswer = function(editor){
	console.log('Initializing for answer');
	editor.navigateLineStart();
	editor.navigateRight(1);
	editor.insert("(a)");
	editor.focus();
};