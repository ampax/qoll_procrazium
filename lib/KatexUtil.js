

KatexUtil = {};

KatexUtil.toHtml = function(txt, katext_arr) {
    if(txt == undefined)
        return;
    qlog.info('Converting now ========>'+txt, filename);
	if(txt.match(QollRegEx.tex_transf))
		qlog.info('hell this is printed', filename);

	while (matches = QollRegEx.tex_transf.exec(txt)) {
		//qlog.info('matches - ' + matches, filename);
		var idx = matches[0].substring(5, matches[0].length-1);
		idx = Number(idx)+1;

        var tex_val = katext_arr[idx-1] == undefined ? '' : katext_arr[idx-1];
        qlog.info('tex_valis =======> ' + idx + ' --- ' + tex_val, filename);

        //tex_val = 'x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}';
        //var html = katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}");

        var html = '';
        try {
            html = katex.renderToString(tex_val);

            //html = katex.renderToString('d_i = 0, a = 0, d_4 = 16');
        } catch(err) {
            //html = "<span class='red_1'>" + "Error happened - " + err.message + '. Equation - ' + tex_val +'</span>';
            html = "<span class='red_1'>" + "Equation is not supported - " +  tex_val +'</span>';
        }

        //var html = "<span class='tex'>"+tex_val+"</span>";
        
        qlog.info('Printing the text after replacing tex ----------> ' + txt + '/' + matches[0], filename);
        txt = txt.replace(matches[0], html);
    }

    return txt;
};

KatexUtil.toArray = function(txt, katext_arr) {
    var arr = [];
    var counter = 0;

    while ((matches = QollRegEx.tex_transfg.exec(txt)) != null) {
        var idx = matches[0].substring(5, matches[0].length-1);
        idx = Number(idx)+1;
        arr.push(idx);
    }

    qlog.info('Found the indexes =========================> ' + arr.join(','), filename);
};


KatexUtil.toTxt = function(txt, katext_arr) {
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

        var html = tex_val;
        
        txt = txt.replace(matches[0], html);
        // qlog.info('Printing the text after replacing tex ----------> ' + txt, filename);
    }

    return txt;
};

