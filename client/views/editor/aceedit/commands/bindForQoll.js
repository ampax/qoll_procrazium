var filename="bindForQoll.js";

bindToolBarForQoll = function(editor) {
	console.log('Initializing for qoll');
	//editor.getSession().setMode("ace/mode/text");
	//editor.setValue(editor.getValue(), 1);
	if(editor.find("\n# ", {wrap: false}, false)){
		console.log('Log found ...');
		editor.moveCursorToPosition(editor.getCursorPosition());
		editor.navigateUp(1);
		//editor.insert("\n");
		editor.navigateUp(1);
		editor.insert("\n# ");
		editor.setHighlightActiveLine(true);
	} else {
		//no #Qoll found
		console.log('No qoll found ...');
		editor.navigateFileEnd();
		//editor.insert("\n");
		editor.navigateUp(1);
		editor.insert("# ");
		editor.setHighlightActiveLine(true);
	}

	// Calculate total number of lines
	var len = editor.session.getLength();
	console.log("Total number of lines in the editor: " + len);
	editor.focus();
};


bindToolBarForQollFib = function(editor) {
	console.log('Initializing for qoll');
	editor.navigateFileEnd();
	editor.insert("\n# (Title must start with #)\n");
	editor.insert("* Hint Starts with * Hint\n");
	//editor.insert("* Note Starts with * Note\n");
	editor.insert("* Text _fill_ in the _blanks_\n");

	// Calculate total number of lines
	var len = editor.session.getLength();
	console.log("Total number of lines in the editor: " + len);
	editor.focus();
};

bindToolBarForQollMulti = function(editor) {
	console.log('Initializing for qoll');
	editor.navigateFileEnd();
	editor.insert("\n# (Title must start with #)\n");
	editor.insert("* Hint Starts with * Hint\n");
	editor.insert("* Text Additional text can be provided starting with '* text'\n");
	editor.insert("*answer 3\n");
	editor.insert("- A\n");
	editor.insert("- B\n");
	editor.insert("- C\n");

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