var filename="server/lib/DownTown.js"

DownTown = {};

DownTown.downtown = function(data, option, escape_mathjax){
	if(escape_mathjax) {
		data = escape_mathjax(data);
	}

	var marked = Meteor.require('marked');
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
            var qs = q.split(/\n-/);
            var qoll = qs[0];
            var qollType = QollConstants.QOLL_TYPE.MULTI

            //fetch the qoll level attributes here. split the qoll string on * and then apply
            qlog.info('<==============Printing qoll===============>'+qoll, filename);
            var qoll_parts = qoll.split(/\n\*/);
            var qoll_star_attributes = {};
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
            qs.slice(1).map(function(type){
            	var x = {};
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