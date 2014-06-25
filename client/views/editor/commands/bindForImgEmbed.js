var filename="bindForQoll.js";

bindToolBarForImgEmbed = function(editor,img_url) {
	console.log('Initializing for qoll');
	//editor.getSession().setMode("ace/mode/text");
	//editor.setValue(editor.getValue(), 1);
	editor.insert("![QImg]("+img_url+" \"QImg title\")");
	editor.focus();
};

