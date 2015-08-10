var filename="bindForQoll.js";

bindToolBarForImgEmbed1 = function(editor,img_url) {
	/** console.log('Initializing for qoll');
	editor.insert("![QImg]("+img_url+" \"QImg title\")");**/
	editor.focus();
};

bindToolBarForImgEmbed = function(editor,img_ids) {
	qlog.info('Inserting the selected images - ' + img_ids + ' by bound tool-bar handler', filename);
	/** console.log('Initializing for qoll');
	editor.insert("![QImg]("+img_url+" \"QImg title\")");**/
	editor.insert("* Images - " + img_ids.join(","));
	editor.focus();
};
