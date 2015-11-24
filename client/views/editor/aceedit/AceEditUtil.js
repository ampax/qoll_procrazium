var filename="client/views/editor/aceedit/aceEditUtil.js";

AceEditUtil = {

	qollFocusAttribs : function(editor) {
		// read the cursor position
		
		// then read the position of current qoll in focus
		var content = editor.getValue();
		var g_count = 0;// !content ? content.match(/# /g).length : 0; // then read how many qolls do we have in the editor

		if(!content) return;

		content.match(/# /g).map(function(ct){
			g_count = g_count+1;
		});

		//console.log(editor.getCursor());

		var Range = ace.require('ace/range').Range;
		var pos = editor.getCursorPosition();
		var range = new Range(0,0, pos.row, pos.column);
		var partial_content = editor.session.getTextRange(range);
		var p_count = 0;
		partial_content.match(/# /g).map(function(ct){
			p_count = p_count+1;
		});

		// contents of current focus
		var qls = content.split("# ");


		qlog.info('Global Count ------> ' + g_count + ', Focus Count ------> ' + p_count + ', Qoll --------> ' + qls[p_count], filename);
		return {'g_count' : g_count, 'p_count' : p_count, 'f_qoll' : qls[p_count]};
	},

};

