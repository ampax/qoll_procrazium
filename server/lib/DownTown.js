var filename="server/lib/DownTown.js"

DownTown = {};

DownTown.downtown = function(data, option, escape_mathjax){
	if(escape_mathjax) {
		data = escape_mathjax(data);
	}

	var marked = Meteor.npmRequire('marked');
	var renderer = new marked.Renderer();

	renderer.paragraph = function(text) {
	  return text;
	};


	option.renderer = renderer;
	//qlog.info(marked('I am using __markdown__.'), filename);
	data = marked(data, { renderer: renderer });
	//qlog.info('data is: ' + data, filename);
	data = data.replace(/{inline}/g,"&#36;");
	data = data.replace(/{\/inline}/g,"&#36;");
	data = data.replace(/{block}/g,"&#36;&#36;");
	data = data.replace(/{\/block}/g,"&#36;&#36;");

	return data;

};

var escape_mathjax = function(data){
	qlog.info('Escape mathjax markers here', filename);
	data = data.replace("{inline}","$");
	data = data.replace("{/inline}","$");
	data = data.replace("{block}","$$");
	data = data.replace("{/block}","$$");
	return data;//return escaped data
};

Meteor.methods({
    downtown : function(data, option, escape_mathjax) {
        return DownTown.downtown(data, option, escape_mathjax);
    },
    parse_downtown : function(data, option, escape_mathjax) {
    	var parsed_qolls = new Array();
    	var qolls = data.split(/\#\s/);
        qolls = qolls.slice(1);
        qolls.map(function(q){
            var qs = q.split(QollRegEx.gen_opt);//q.split(/\n-/);
            //var q11 = QollRegEx.gen_opt.exec(q);
            /**qlog.info('<==============***Printing qoll***===============>@@@ '+ q.split(QollRegEx.gen_opt)[0] + ' @@@<==================================>', filename);
            
            while ((q11 = QollRegEx.gen_opt.exec(q)) != null) {
                qlog.info('<==============***Printing qoll***===============>' +q11[2] + '<==================================>', filename);
            }**/
            //var qs = QollRegEx.gen_opt.exec(q);
            var qoll = qs[0];
            var qollType = QollConstants.QOLL_TYPE.MULTI;
            var qoll_star_attributes = {};
            var types = new Array();
            qoll_star_attributes[QollConstants.EDU.FIB] = [];
            qoll_star_attributes.answer_matched = 0;

            //fetch the qoll level attributes here. split the qoll string on * and then apply
            var qoll_parts = qoll.split(/\n\s*\*/);
            //qlog.info('<==============***Printing qoll***===============>'+qoll + '/' + qoll_parts.length, filename);
            var cntr =0;
            var foundTitle=0;
            qoll_parts.map(function(part){
                //qlog.info('---------------------------> ' + part, filename);
                if(foundTitle ==0) {
                    foundTitle = 1;
                    qlog.info('This is text/title -> ' + part, filename);
                    part = part.replace(QollRegEx.qoll, '');

                    if(part.match(QollRegEx.fib)) {
                        var matches;
                        qoll_star_attributes[QollConstants.EDU.CAT] = QollConstants.QOLL_TYPE.BLANK;
                        var fib_replace = [];

                        while ((matches = QollRegEx.fib.exec(part)) != null) {
                            qoll_star_attributes[QollConstants.EDU.FIB].push(matches[1]);
                            fib_replace.push(matches[0]);
                        }

                        fib_replace.map(function(fr, idx){
                            part = part.replace(fr, '{'+cntr+'}');
                            cntr++;
                        });
                    }

                    qoll_star_attributes[QollConstants.EDU.TITLE] = part;
                    qoll_star_attributes[QollConstants.EDU.TEXT] = qoll_star_attributes[QollConstants.EDU.TITLE];
                    qoll = qoll_star_attributes[QollConstants.EDU.TITLE];
                } else if(part.match(QollRegEx.txt)) {
                    qlog.info('This is text -> ' + part, filename);
                    part = part.replace(QollRegEx.txt, '');

                    if(part.match(QollRegEx.fib)) {
                        var matches;
                        qoll_star_attributes[QollConstants.EDU.CAT] = QollConstants.QOLL_TYPE.BLANK;
                        var fib_replace = [];

                        while ((matches = QollRegEx.fib.exec(part)) != null) {
                            qoll_star_attributes[QollConstants.EDU.FIB].push(matches[1]);
                            fib_replace.push(matches[0]);
                        }

                        fib_replace.map(function(fr, idx){
                            part = part.replace(fr, '{'+cntr+'}');
                            cntr++;
                        });
                    }

                    qoll_star_attributes[QollConstants.EDU.TEXT] = part;
                } else if(part.match(QollRegEx.answer)) {
                    qlog.info('This is answer -> ' + part, filename);
                    qoll_star_attributes[QollConstants.EDU.ANSWER] = part.replace(QollRegEx.answer, '').trim();
                } else if(part.match(QollRegEx.hint)) {
                    qlog.info('This is hint -> ' + part, filename);
                    qoll_star_attributes[QollConstants.EDU.HINT] = part.replace(QollRegEx.hint, '');
                } else if(part.match(QollRegEx.unit)) {
                    part = part.replace(QollRegEx.unit, '');
                    qlog.info('This is unit -> ' + part, filename);

                    if(part.indexOf(":") != -1) {
                        var tmp = part.split(":");
                        qoll_star_attributes[QollConstants.EDU.UNIT_NAME] = tmp[0];
                        part = tmp[1];
                    }
                    qoll_star_attributes[QollConstants.EDU.UNITS] = new Array();
                    part.split(/(?:,| )+/).map(function(tmp1){
                        if(tmp1.length > 0) qoll_star_attributes[QollConstants.EDU.UNITS].push(tmp1);
                        qlog.info('############## unit => ' + tmp1, filename);
                    });

                    //qoll_star_attributes[QollConstants.EDU.UNITS] = part.replace(QollRegEx.unit, '');
                } else {
                    qlog.info('##############=> ' + part, filename);
                }
            });
            
            var ix =0; ix =0;
            while ((q11 = QollRegEx.gen_opt.exec(q)) != null) {
                qlog.info('<==============***Printing qoll***===============>' +q11[2] + '<==================================>', filename);
            }

            while ((q11 = QollRegEx.gen_opt.exec(q)) != null) {
                type = q11[2];
            //qs.slice(2).map(function(type){
                var x = {index:ix};
                ix =ix+1;
                type = type.trim();

                if(type.match(QollRegEx.fib)) {
                    var fib_replace = [];

                    while ((matches = QollRegEx.fib.exec(type)) != null) {
                        qoll_star_attributes[QollConstants.EDU.FIB].push(matches[1]);
                        fib_replace.push(matches[0]);
                    }

                    fib_replace.map(function(fr, idx){
                        type = type.replace(fr, '{'+cntr+'}');
                        cntr++;
                    });
                }

                if(type.indexOf('(a)') == 0) {
                    type = type.replace('(a)', '');
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    x.isCorrect = 1;
                    qoll_star_attributes.answer_matched = 1;
                    
                } else {
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    if(qoll_star_attributes[QollConstants.EDU.ANSWER] && qoll_star_attributes[QollConstants.EDU.ANSWER].match(QollRegEx.abb_ans)) {
                        var index = -1;
                        if(!qoll_star_attributes[QollConstants.EDU.ANSWER].match(/\d/)) {
                            index = qoll_star_attributes[QollConstants.EDU.ANSWER].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
                        } else {
                            index = parseInt(qoll_star_attributes[QollConstants.EDU.ANSWER]);
                        }

                        if(index === ix) {
                            x.isCorrect = 1;
                            qoll_star_attributes.answer_matched = 1;
                        }
                    }
                    else if(type === qoll_star_attributes[QollConstants.EDU.ANSWER]) {
                        x.isCorrect = 1;
                        qoll_star_attributes.answer_matched = 1;
                    } else x.isCorrect = 0;
                }

                x.type = type;

                types.push(x);
            };
            //);

            if(qoll_star_attributes[QollConstants.EDU.FIB].length > 0)
                qoll_star_attributes.answer_matched = 1;

            qoll_star_attributes.types = types;

            parsed_qolls.push(qoll_star_attributes);
        });

        qlog.info('<==========Printing final stars============>'+JSON.stringify(parsed_qolls), filename);
        return parsed_qolls;
    },
    parse_downtown_bkp : function(data, option, escape_mathjax) {
        var parsed_qolls = new Array();
        var qolls = data.split(/\#\s/);
        qolls = qolls.slice(1);
        qolls.map(function(q){
            var qs = q.split(/\n-/);
            var qoll = qs[0];
            var qollType = QollConstants.QOLL_TYPE.MULTI;
            var qoll_star_attributes = {};
            qoll_star_attributes.fib = [];
            var types = new Array();

            //fetch the qoll level attributes here. split the qoll string on * and then apply
            var qoll_parts = qoll.split(/\n\s*\*/);
            qlog.info('<==============***Printing qoll***===============>'+qoll + '/' + qoll_parts.length, filename);
            var cntr =0;
            qoll_parts.map(function(part){
                //qlog.info('---------------------------> ' + part, filename);
                if(cntr ==0) {
                    qlog.info('This is text/title -> ' + part, filename);
                    part = part.replace(QollRegEx.qoll, '');

                    if(part.match(QollRegEx.fib)) {
                        var matches;
                        while (matches = QollRegEx.fib.exec(part)) {
                            qoll_star_attributes.fib.push(matches[1]);
                            part = part.replace(QollRegEx.fib_replace, '{'+cntr+'}');
                            cntr++;
                            qlog.info('##############=> ' + cntr, filename);
                        }
                    }

                    qoll_star_attributes[QollConstants.EDU.TITLE] = part;
                    qoll_star_attributes[QollConstants.EDU.TEXT] = qoll_star_attributes[QollConstants.EDU.TITLE];
                } else if(part.match(QollRegEx.txt)) {
                    qlog.info('This is text -> ' + part, filename);
                    part = part.replace(QollRegEx.txt, '');

                    if(part.match(QollRegEx.fib)) {
                        var matches;
                        while (matches = QollRegEx.fib.exec(part)) {
                            qoll_star_attributes.fib.push(matches[1]);
                            part = part.replace(QollRegEx.fib_replace, '{'+cntr+'}');
                            cntr++;
                            qlog.info('##############=> ' + cntr, filename);
                        }
                    }

                    qoll_star_attributes[QollConstants.EDU.TEXT] = part;
                } else if(part.match(QollRegEx.answer)) {
                    qlog.info('This is answer -> ' + part, filename);
                    qoll_star_attributes[QollConstants.EDU.ANSWER] = part.replace(QollRegEx.answer, '');
                } else if(part.match(QollRegEx.hint)) {
                    qlog.info('This is hint -> ' + part, filename);
                    qoll_star_attributes[QollConstants.EDU.HINT] = part.replace(QollRegEx.hint, '');
                } else if(part.match(QollRegEx.unit)) {
                    part = part.replace(QollRegEx.unit, '');
                    qlog.info('This is unit -> ' + part, filename);

                    if(part.indexOf(":") != -1) {
                        var tmp = part.split(":");
                        qoll_star_attributes[QollConstants.EDU.UNIT_NAME] = tmp[0];
                        part = tmp[1];
                    }
                    qoll_star_attributes[QollConstants.EDU.UNITS] = new Array();
                    part.split(/(?:,| )+/).map(function(tmp1){
                        if(tmp1.length > 0) qoll_star_attributes[star].push(tmp1);
                        qlog.info('############## unit => ' + tmp1, filename);
                    });

                    //qoll_star_attributes[QollConstants.EDU.UNITS] = part.replace(QollRegEx.unit, '');
                } else {
                    qlog.info('##############=> ' + part, filename);
                }
            });
            
            var ix =0; ix =0;
            qs.slice(1).map(function(type){
                var x = {index:ix};
                ix =ix+1;
                type = type.trim();

                if(type.match(QollRegEx.fib)) {
                    var matches;
                    while (matches = QollRegEx.fib.exec(type)) {
                        qoll_star_attributes.fib.push(matches[1]);
                        type = type.replace(QollRegEx.fib_replace, '{'+cntr+'}');
                        cntr++;
                        qlog.info('##############=> ' + cntr, filename);
                    }
                }

                if(type.indexOf('(a)') == 0) {
                    type = type.replace('(a)', '');
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    x.isCorrect = 1;
                    
                } else {
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    x.isCorrect = 0;
                }

                x.type = type;

                types.push(x);
            });

            qlog.info('=======>'+qoll_star_attributes.fib.join('*_*_*_*_*')+'=======', filename);
            qlog.info('********Start attributes - ' + JSON.stringify(qoll_star_attributes) + '/' + JSON.stringify(types), filename);

            return;
            

            
            qoll = qoll_parts[0];
            if(qoll_parts.length > 1) {
                qoll_parts.slice(1).map(function(qp){
                    if(qp) qp = qp.trim();
                    var star = qp.split(/\s+/)[0];
                    var star_val = qp.substr(qp.indexOf(' ') + 1);
                    qlog.info('<======option name========>' +star, filename);
                    qlog.info('<======option value========>' +star_val, filename);
                    if(_.contains(QollConstants.EDU.ALLOWED_STARS, star)) {
                        //handle the allowed options here
                        if(_.contains(['unit','units'], star)) {
                            qlog.info('This is unit' + star, filename);
                            if(star_val.indexOf(":") != -1) {
                                var tmp = star_val.split(":");
                                qoll_star_attributes[QollConstants.EDU.UNIT_NAME] = tmp[0];
                                star_val = tmp[1];
                            }
                            qoll_star_attributes[star] = new Array();
                            star_val.split(/(?:,| )+/).map(function(tmp1){
                                if(tmp1.length > 0) qoll_star_attributes[star].push(tmp1);
                            });
                        } else if(star === QollConstants.EDU.ANSWER){
                            //Handle the answer here, first part will be number, second (if there) exponent, and third unit
                            /**
                            Examples - 
                            *answer 9.8*10^2 m/sec2
                            *answer 9.8 10 2 m/sec2
                            *answer 9.8 2 m/sec2
                            *answer 9.8 10^2
                            *answer 9.8 2
                            *answer 9.8
                            **/
                            qoll_star_attributes[star] = {};
                            star_val = star_val.replace("*", " ");
                            star_val = star_val.replace("^", " ")
                            var tmp = star_val.split(/\s+/);
                            if(tmp.length === 1) {
                                qoll_star_attributes[star]['blankResponse'] = tmp[0];
                            } else if(tmp.length === 2){
                                //handle case 1
                                qoll_star_attributes[star]['blankResponse'] = tmp[0];
                                qoll_star_attributes[star]['power'] = tmp[1];
                            } else if(tmp.length === 3) {
                                //handle case 2
                                qoll_star_attributes[star]['blankResponse'] = tmp[0];
                                qoll_star_attributes[star]['power'] = tmp[1];
                                qoll_star_attributes[star]['unitSelected'] = tmp[2];
                            } else if(tmp.length === 4) {
                                //handle case 3 (simplest, considering default log base-10)
                                qoll_star_attributes[star]['blankResponse'] = tmp[0];
                                qoll_star_attributes[star]['exponentBase'] = tmp[1];
                                qoll_star_attributes[star]['power'] = tmp[2];
                                qoll_star_attributes[star]['unitSelected'] = tmp[3];
                            }
                        } else
                            qoll_star_attributes[star] = DownTown.downtown(star_val, DownTownOptions.downtown_default());
                    }
                });
            }
            qlog.info('<==========Printing final stars============>'+JSON.stringify(qoll_star_attributes), filename);

            qoll = DownTown.downtown(qoll, DownTownOptions.downtown_default());

            var types = new Array();
            var ix =0; ix =0;
            qs.slice(1).map(function(type){
                var x = {index:ix};
                ix =ix+1;
                type = type.trim();
                if(type.indexOf('(a)') == 0) {
                    type = type.replace('(a)', '');
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    x.type = type;
                    x.isCorrect = 1;
                    
                } else {
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    x.type = type;
                    x.isCorrect = 0;
                }

                types.push(x);
            });

            var qollType
            //If this is a single statement fill in the blanks
            if(qoll.indexOf("?==") != -1){
                qollType = QollConstants.QOLL_TYPE.BLANK_DBL;
            } else if(qoll.indexOf("?=") != -1){
                qollType = QollConstants.QOLL_TYPE.BLANK;
            }
            //Check for type values, if there is one choice only and has ?= then mark it as BLANK. this can be extended to having
            //more than one choices with blanks in 'em'
            else if(types.length === 1) {
                if(types[0].type === "?==") {
                    qollType = QollConstants.QOLL_TYPE.BLANK_DBL;
                } else if(types[0].type === "?="){
                    qollType = QollConstants.QOLL_TYPE.BLANK;
                }
            }
            //Check the type values, if these are true/false then this will be a bool type
            else if(types.length === 2) {
                var foundTrue = false, foundFalse = false;
                types.map(function(t){
                    if(_.contains(['1', 'true', 'True', 'TRUE'], t.type))
                        foundTrue = true;

                    if(_.contains(['0', 'false', 'False', 'FALSE'], t.type))
                        foundFalse = true;
                });

                if(foundTrue && foundFalse)
                    qollType = QollConstants.QOLL_TYPE.BOOL;
            }

            if (types.length > 1)
                qollType = QollConstants.QOLL_TYPE.MULTI




            parsed_qolls.push({'qoll':qoll, 'qoll_star_attributes' : qoll_star_attributes, 'types' : types, 'qollType': qollType});
        });
        return parsed_qolls;
    },
});