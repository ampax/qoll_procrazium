

KatexUtil = {};

KatexUtil.toHtml = function(txt, katext_arr) {
    //Return if txt is undefined or null.
    if(txt == undefined || txt == null)
        return txt;

	if(txt.match(QollRegEx.tex_transf))
		qlog.info('hell this is printed', filename);

	while (matches = QollRegEx.tex_transf.exec(txt)) {
		//qlog.info('matches - ' + matches, filename);
		var idx = matches[0].substring(5, matches[0].length-1);
		idx = Number(idx)+1;

        var tex_val = katext_arr[idx-1] == undefined ? '' : katext_arr[idx-1];
        qlog.info('tex_valis =======> ' + idx + ' --- ' + tex_val, filename);

        /**tex_val = 'x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}';
        var html = katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}");**/

        var html = '<span class="tex">'+tex_val+'</span>';
        
        txt = txt.replace(matches[0], html);
        qlog.info('Printing the text after replacing tex ----------> ' + txt, filename);
    }

    return txt;
};