var filename="bindForLatex.js";

/* Binding at load time : these are the raq mechanisms to be bound to clicks in tool-bar */
bindForLatexInline = function(editor) {
	console.log('Initializing for maths');
	editor.getSession().setMode("ace/mode/text");

	//editor.insert("$$");
	editor.insert("begin  end");
	editor.navigateLeft(4);
	editor.focus();
}

bindForLatexBlock = function(editor) {
	console.log('Initializing for maths');
	editor.getSession().setMode("ace/mode/text");
	editor.navigateLineEnd();
	
	//editor.insert("\n$$\n\n$$\n");
	editor.insert("\n{block}\n\n{/block}\n");
	editor.navigateUp(2);
	editor.focus();
}