var filename='server/lib/QollParser.js';

QollParser = {
	//Parse the qoll from html editor
	parseHtml : function(qollMaster) {
		//The master qoll will be a group of qolls (least one qoll). Run a qoll parser and then count
		//the number of qolls. Then iterate over each of them, and process the data
		//qlog.info('Parsing: ' + qollMaster, filename);
		var regExAnser = /^(a)\s+/;
        var regExNoAnser = /^\s+/;
        var qollId = new Array();
        var qolls = qollMaster.split(/\#\s/); //qolls are seperated by \n#Qoll\s - changed to \n#\s
        qolls = qolls.slice(1);
        qolls.map(function(q){
        	//ACTIVATE: var qollRawId = Qolls.QollRawDb.insert({qollText: q, qollMasterId: qollMasterId, tags: tags, visibility: visibility, qollFormat: qollFormat});
            var qs = q.split(/\n-\s+/);
            var qoll = qs[0];
            var opts = qs.slice(1, qs.length);
			var qollType = QollConstants.QOLL_TYPE.MULTI; //multi is by default
			//qlog.info('Parsing opts: ' + opts.join('\n\n\n'), filename);

			if(QollRegEx.isFib(qoll)) {
				var fibs = QollRegEx.isFib(qoll);
				qlog.info('SUCCESS: The qoll is fill in the blanks - ' + ', fibs - ' + fibs, filename);
			} else qlog.info('FAILURE: The qoll is not fill in the blanks - ' + qoll, filename);
			
			opts.map(function(opt){
				if(QollRegEx.isFib(opt)){ 
					qlog.info('SUCCESS: The option is fill in the blanks - ' + QollRegEx.isFib(opt), filename);
				} else qlog.info('FAILURE: The opts is not fill in the blanks - ' + opt, filename);
			});
        });

	},
	parseTex : function(d) {
		if(d.txt.match(QollRegEx.tex)) {
			var cntr = d.tex_arr.length;
            //var matches;
            //qoll_data[QollConstants.EDU.CAT] = QollConstants.QOLL_TYPE.BLANK;
            var tex_replace = [];
            d.txt = d.txt.replace(/\\/, "");

            while ((matches = QollRegEx.tex.exec(d.txt)) != null) {
				d.tex_arr.push(matches[1].substring(0, matches[1].length-1));
				tex_replace.push(matches[0]);
			}

			tex_replace.map(function(fr, idx){
				d.txt = d.txt.replace(/<span[^>]*>([^<]*)<\/span>/, '{TEX:'+cntr+'}');
				cntr++;
			});
        }
        return {'txt' : d.txt, 'tex_arr' : d.tex_arr};
	},
	//Parse the data from markdown editor
	/** Helper method for storing qolls for master-qoll-id **/
	addQollsForMaster : function(qollMaster, qollMasterId, emailsandgroups, tags, action, visibility, qollFormat, qollIdtoUpdate) {
        var qollId = new Array();
        var qolls = qollMaster.split(/\#\s/); //qolls are seperated by \n#Qoll\s - changed to \n#\s
        qolls = qolls.slice(1);

        qolls.map(function(q){
        	//qoll: {qollText: qollText, qollMasterId: qollMasterId, tags: tags, visibility: visibility, qollFormat: qollFormat}
            var qollRawId = Qolls.QollRawDb.insert({qollText: '# ' + q, qollMasterId: qollMasterId, tags: tags, visibility: visibility, qollFormat: qollFormat});
            q = ToMarkdown.convert(q);

            qlog.info('Markdown converted qoll is - ' + q, filename);

            var qs = q.split(QollRegEx.gen_opt);//q.split(/\n-/);
            var qoll = qs[0];
			var qollType = QollConstants.QOLL_TYPE.MULTI; //multi is by default
			var qoll_data = {};
            var types = new Array();
            var typesX = new Array();
            qoll_data[QollConstants.EDU.FIB] = [];
            qoll_data[QollConstants.EDU.TEX] = [];
		

			//fetch the qoll level attributes here. split the qoll string on * and then apply
	        //qlog.info('<==============Printing qoll===============>'+qoll, filename);
	        

	        //fetch the qoll level attributes here. split the qoll string on * and then apply
            var qoll_parts = qoll.split(/\n\s*\*/);
            //qlog.info('<==============***Printing qoll***===============>'+qoll + '/' + qoll_parts.length, filename);
            var cntr =0;
            var foundTitle=0;
            qoll_parts.map(function(part){
                qlog.info('---------------------------> ' + part, filename);
                part = part.replace(/&nbsp;/g, ' ');
                //* Start: Find and replace TEX expressions *//
                var tmp = QollParser.parseTex({'txt' : part, 'tex_arr' : qoll_data[QollConstants.EDU.TEX]});
                part = tmp.txt;
                //* End: Find and replace TEX expressions *//

                if(foundTitle ==0) {
                    foundTitle = 1;
                    //qlog.info('This is text/title -> ' + part, filename);
                    part = part.replace(QollRegEx.qoll, '');

                    //* Start: Find and replace Fill-In-The-Blanks *//
                    if(part.match(QollRegEx.fib)) {
                        //var matches;
                        qoll_data[QollConstants.EDU.CAT] = QollConstants.QOLL_TYPE.BLANK;
                        var fib_replace = [];

                        while ((matches = QollRegEx.fib.exec(part)) != null) {
							qoll_data[QollConstants.EDU.FIB].push(matches[1]);
							fib_replace.push(matches[0]);
						}

						fib_replace.map(function(fr, idx){
							part = part.replace(fr, '{'+cntr+'}');
							cntr++;
						});

						//qlog.info('##############1234=> ' + fib_replace, filename);
						//qlog.info('##############4567=> ' + qoll_data[QollConstants.EDU.FIB], filename);
						//qlog.info('##############8911=> ' + part, filename);
                    }
                    //* End: Find and replace Fill-In-The-Blanks *//

                    qoll_data[QollConstants.EDU.TITLE] = part;
                    qoll_data[QollConstants.EDU.TEXT] = qoll_data[QollConstants.EDU.TITLE];
                    qoll = qoll_data[QollConstants.EDU.TITLE];
                } else if(part.match(QollRegEx.txt)) {
                    qlog.info('This is text -> ' + part, filename);
                    part = part.replace(QollRegEx.txt, '');

                    //* Start: Find and replace Fill-In-The-Blanks *//
                    if(part.match(QollRegEx.fib)) {
                        var matches;
                        qoll_data[QollConstants.EDU.CAT] = QollConstants.QOLL_TYPE.BLANK;
                        var fib_replace = [];

                        while ((matches = QollRegEx.fib.exec(part)) != null) {
							qoll_data[QollConstants.EDU.FIB].push(matches[1]);
							fib_replace.push(matches[0]);
						}

						fib_replace.map(function(fr, idx){
							part = part.replace(fr, '{'+cntr+'}');
							cntr++;
						});
                    }
                    //* End: Find and replace Fill-In-The-Blanks *//

                    qoll_data[QollConstants.EDU.TEXT] = part;
                } else if(part.match(QollRegEx.answer)) {
                    qlog.info('This is answer -> ' + part, filename);
                    qoll_data[QollConstants.EDU.ANSWER] = part.replace(QollRegEx.answer, '');
                } else if(part.match(QollRegEx.hint)) {
                    qlog.info('This is hint -> ' + part, filename);
                    qoll_data[QollConstants.EDU.HINT] = part.replace(QollRegEx.hint, '');
                } else if(part.match(QollRegEx.unit)) {
                    part = part.replace(QollRegEx.unit, '');
                    qlog.info('This is unit -> ' + part, filename);

                    if(part.indexOf(":") != -1) {
                        var tmp = part.split(":");
                        qoll_data[QollConstants.EDU.UNIT_NAME] = tmp[0];
                        part = tmp[1];
                    }
                    qoll_data[QollConstants.EDU.UNITS] = new Array();
                    part.split(/(?:,| )+/).map(function(tmp1){
                        if(tmp1.length > 0) qoll_data[QollConstants.EDU.UNITS].push(tmp1);
                        qlog.info('############## unit => ' + tmp1, filename);
                    });

                    //qoll_star_attributes[QollConstants.EDU.UNITS] = part.replace(QollRegEx.unit, '');
                } else {
                    qlog.info('##############=> ' + part, filename);
                }
            });

			var ix =0; ix =0;
			while ((q11 = QollRegEx.gen_opt.exec(q)) != null) {
                type = q11[2];
                type = type.replace(/&nbsp;/g, ' ');
            //qs.slice(1).map(function(type){
                var x = {index:ix};
                x.isCorrect = 0;
                ix =ix+1;
                type = type.trim();

                //* Start: Find and replace TEX expressions *//
                var tmp = QollParser.parseTex({'txt' : type, 'tex_arr' : qoll_data[QollConstants.EDU.TEX]});
                type = tmp.txt;
                //* End: Find and replace TEX expressions *//

                //* Start: Find and replace Fill-In-The-Blanks *//
                if(type.match(QollRegEx.fib)) {
                    var matches;
                    var fib_replace = [];

                    while ((matches = QollRegEx.fib.exec(type)) != null) {
						qoll_data[QollConstants.EDU.FIB].push(matches[1]);
						fib_replace.push(matches[0]);
					}

					fib_replace.map(function(fr, idx){
						type = type.replace(fr, '{'+cntr+'}');
						cntr++
					});
                }
                //* End: Find and replace Fill-In-The-Blanks *//

                if(type.indexOf('(a)') == 0) {
				    type = type.replace('(a)', '');
				    type = DownTown.downtown(type, DownTownOptions.downtown_default());
				    x.isCorrect = 1;
				    qoll_data.answer_matched = 1;
				    
				} else {
				    type = DownTown.downtown(type, DownTownOptions.downtown_default());
				    if(qoll_data[QollConstants.EDU.ANSWER] && qoll_data[QollConstants.EDU.ANSWER].match(QollRegEx.abb_ans)) {
				        var index = -1;
				        if(!qoll_data[QollConstants.EDU.ANSWER].match(/\d/)) {
				            index = qoll_data[QollConstants.EDU.ANSWER].charCodeAt(0) - 'A'.charCodeAt(0) + 1;
				        } else {
				            index = parseInt(qoll_data[QollConstants.EDU.ANSWER]);
				        }
				        
				        if(index === ix) {
				            x.isCorrect = 1;
				            qoll_data.answer_matched = 1;
				        }
				    }
				    else if(type === qoll_data[QollConstants.EDU.ANSWER]) {
				        x.isCorrect = 1;
				        qoll_data.answer_matched = 1;
				    }
				}

                x.type = type;

                types.push(type);
                typesX.push(x);
            };//);

			qoll_data.types = types;
			qoll_data.typesX = typesX;
			qoll_data.visibility = visibility;
			qoll_data.complexity = QollConstants.QOLL.DIFFICULTY.EASY;
			qoll_data.isMultiple = false;

			if(types && types.length === 2) {
				var foundTrue = false, foundFalse = false;
				types.map(function(t){
					if(_.contains(['1', 'true', 'True', 'TRUE'], t.type))
						foundTrue = true;

					if(_.contains(['0', 'false', 'False', 'FALSE'], t.type))
						foundFalse = true;
				});

				if(foundTrue && foundFalse)
					qollType = QollConstants.QOLL_TYPE.BOOL;

				qoll_data.isMultiple = true;
			}
            else if(types && types.length === 1) qollType = QollConstants.QOLL.TYPE.SINGLE;
            else if(types && types.length > 1) {
            	qollType = QollConstants.QOLL.TYPE.MULTIPLE; //isMultiple = true;
            	qoll_data.isMultiple = true;
            } else if(types && types.length === 0) qollType = QollConstants.QOLL_TYPE.NO_CHOICE;

            if(qoll_data[QollConstants.EDU.CAT] === undefined)
            	qoll_data[QollConstants.EDU.CAT] = qollType;

            qlog.info('##########=>'+JSON.stringify(qoll_data), filename);

			//var qid = Meteor.call('addQoll', action, qoll, types, typesX, isMultiple, qollRawId, qollMasterId, emailsandgroups 
			//	,undefined, undefined,  tags, attributes, qollStarAttributes, qollAttributes, qollFormat,qollIdtoUpdate);

			/**
			* Qoll Data will have the following attributes in the end
			* qoll_data = ( QollConstants.EDU.FIB, QollConstants.EDU.CAT, QollConstants.EDU.TITLE, QollConstants.EDU.TEXT,
			*						QollConstants.EDU.ANSWER, QollConstants.EDU.HINT, QollConstants.EDU.UNIT_NAME, QollConstants.EDU.UNITS,
			*						types, typesX, visibility, complexity, isMultiple ) 
			**/
			//function(action, qollData qollRawId, qollMasterId, emails, isparent, parentid, tags, qollFormat, qollIdtoUpdate)
			var qid = Meteor.call('addQoll', action, qoll_data, qollRawId, qollMasterId, emailsandgroups,
										undefined, undefined,  tags, qollFormat, qollIdtoUpdate);
			/**	qoll, 
				types, 
				typesX, 
				isMultiple, 
				qollRawId, qollMasterId, emailsandgroups 
				,undefined, undefined,  tags, 
				attributes, 
				qollStarAttributes, 
				qollAttributes, 
				qollFormat, qollIdtoUpdate, qoll_star_attributes);**/

			qollId.push(qid);


			//**** Above this is the new code
        });

      qlog.info('Inserted qolls with id: ' + qollId + ", for master-qoll-id: " + qollMasterId);
      return qollId;
	},
	addQollsForMaster_bkp : function(qollMaster, qollMasterId, emailsandgroups, tags, action, visibility, qollFormat, qollIdtoUpdate) {
        var regExAnser = /^(a)\s+/;
        var regExNoAnser = /^\s+/;
        var qollId = new Array();
        var qolls = qollMaster.split(/\#\s/); //qolls are seperated by \n#Qoll\s - changed to \n#\s
        qolls = qolls.slice(1);
        qolls.map(function(q){
        	//qoll: {qollText: qollText, qollMasterId: qollMasterId, tags: tags, visibility: visibility, qollFormat: qollFormat}
            var qollRawId = Qolls.QollRawDb.insert({qollText: q, qollMasterId: qollMasterId, tags: tags, visibility: visibility, qollFormat: qollFormat});
            var qs = q.split(/\n-/);
            var qoll = qs[0];
			var qollType = QollConstants.QOLL_TYPE.MULTI; //multi is by default
			var qollAttributes = {};
		

			//fetch the qoll level attributes here. split the qoll string on * and then apply
	        //qlog.info('<==============Printing qoll===============>'+qoll, filename);
	        var qoll_parts = qoll.split(/\n\*/);
	        var qollStarAttributes = {};
	        qoll = qoll_parts[0];
	        
	        //Start attributes are qoll level inputs like units, hints, and title. Fetch it here
	        if(qoll_parts.length > 1) {
	            qoll_parts.slice(1).map(function(qp){
	            	if(qp) qp = qp.trim();
	            	var star = qp.split(/\s+/)[0];
	            	var star_val = qp.substr(qp.indexOf(' ') + 1);
	            	//qlog.info('<======option name========>' +star, filename);
	            	//qlog.info('<======option value========>' +star_val, filename);
	            	if(_.contains(QollConstants.EDU.ALLOWED_STARS, star)) {
	            		//handle the allowed options here
	            		if(_.contains(['unit','units'], star)) {
	            			qlog.info('This is unit' + star, filename);
	            			if(star_val.indexOf(":") != -1) {
	            				var tmp = star_val.split(":");
	            				qollStarAttributes[QollConstants.EDU.UNIT_NAME] = tmp[0];
	            				star_val = tmp[1];
	            			}
	            			qollStarAttributes[star] = new Array();
	        				star_val.split(/(?:,| )+/).map(function(tmp1){
	        					if(tmp1.length > 0) qollStarAttributes[star].push(tmp1);
	        				});
	            		} else if(star === QollConstants.EDU.ANSWER){
	                        //Handle the answer here, first part will be number, second (if there) exponent, and third unit
	                        /**
	                        Examples - 
	                        *answer 9.8*10^2 m/sec2
	                        *answer 9.8 10 2 m/sec2
	                        *answer 9.8 2 m/sec2
	                        **/
	                        qollStarAttributes[star] = {};
	                        var tmp = [];
	                        //star_val = star_val.replace("*", " ").replace("^" " ");
	                        if(star_val) {
		                        star_val = star_val.replace("*", " ");
		                        star_val = star_val.replace("^", " ");
		                        tmp = star_val.split(/\s+/);
		                    }

	                        if(tmp.length === 1) {
	                        	qlog.info('Printing the array from case 1 ' + star_val + '/' + tmp[0], filename);
	                            qollStarAttributes[star]['blankResponse'] = tmp[0];
	                        } else if(tmp.length === 2){
	                            //handle case 1
	                            qollStarAttributes[star]['blankResponse'] = tmp[0];
	                            qollStarAttributes[star]['power'] = tmp[1];
	                        } else if(tmp.length === 3) {
	                            //handle case 2
	                            qollStarAttributes[star]['blankResponse'] = tmp[0];
	                            qollStarAttributes[star]['power'] = tmp[1];
	                            qollStarAttributes[star]['unitSelected'] = tmp[2];
	                        } else if(tmp.length === 4) {
	                            //handle case 3 (simplest, considering default log base-10)
	                            qollStarAttributes[star]['blankResponse'] = tmp[0];
	                            qollStarAttributes[star]['exponentBase'] = tmp[1];
	                            qollStarAttributes[star]['power'] = tmp[2];
	                            qollStarAttributes[star]['unitSelected'] = tmp[3];
	                        }
	                    } else
	            			qollStarAttributes[star] = DownTown.downtown(star_val, DownTownOptions.downtown_default());
	            	}
	            });
	        }
	        
	        qoll = DownTown.downtown(qoll, DownTownOptions.downtown_default());

	        //Fetching and initializing all the qoll answers, with correct answers marked
            var count =0; count=0;
            var types = new Array();
            var typesX = new Array();
            var attributes = {};
            attributes.visibility = visibility;
            qollType = QollConstants.QOLL.TYPE.SINGLE;
            attributes.complexity = QollConstants.QOLL.DIFFICULTY.EASY;
            var isMultiple = false;
            var ix =0; ix =0;
            qs.slice(1).map(function(type){
                var x = {index:ix};ix =ix+1;
                type = type.trim();
                if(type.indexOf('(a) ') == 0) {
                    type = type.replace('(a) ', '');
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    x.type = type;
                    x.isCorrect = 1;
                    count=count+1;
                } else {
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    x.type = type;
                    x.isCorrect = 0;
                }

                types.push(type);
                typesX.push(x);
            });
            qlog.info("counts for this qoll ---- "+ count);
            if(count > 1) qollType = QollConstants.QOLL.TYPE.MULTIPLE; //isMultiple = true;
            else qollType = QollConstants.QOLL.TYPE.SINGLE;
		//If this is a single statement fill in the blanks
        if(qoll.indexOf("?==") != -1){
        	qollType = QollConstants.QOLL_TYPE.BLANK_DBL;
        } else if(qoll.indexOf("?=") != -1){
        	qollType = QollConstants.QOLL_TYPE.BLANK;
        }
        //Check for type values, if there is one choice only and has ?= then mark it as BLANK. this can be extended to having
		//more than one choices with blanks in 'em'
		else if(typesX.length === 1) {
			if(typesX[0].type === "?==") {
				qollType = QollConstants.QOLL_TYPE.BLANK_DBL;
			} else if(typesX[0].type === "?="){
				qollType = QollConstants.QOLL_TYPE.BLANK;
        	}
		}
        //Check the type values, if these are true/false then this will be a bool type
		else if(typesX.length === 2) {
			var foundTrue = false, foundFalse = false;
			typesX.map(function(t){
				if(_.contains(['1', 'true', 'True', 'TRUE'], t.type))
					foundTrue = true;

				if(_.contains(['0', 'false', 'False', 'FALSE'], t.type))
					foundFalse = true;
			});

			if(foundTrue && foundFalse)
				qollType = QollConstants.QOLL_TYPE.BOOL;
		}

		//If there are more than one correct answers, this is a multiple choice question
        //qlog.info('qoll: ' + qoll + ", types: " + types, filename);
		//Set qoll level attributes here - type, multiple or not, public or personal or org, and all
		qollAttributes.type = qollType;
		qollAttributes.isMultiple = isMultiple;
		
		var qid = Meteor.call('addQoll', action, qoll, types, typesX, isMultiple, qollRawId, qollMasterId, emailsandgroups 
				,undefined, undefined,  tags, attributes, qollStarAttributes, qollAttributes, qollFormat,qollIdtoUpdate);
		qollId.push(qid);
        });

      qlog.info('Inserted qolls with id: ' + qollId + ", for master-qoll-id: " + qollMasterId);
      return qollId;
	},
	parseEmailAndGroups : function(emailsandgroups) {
		var i = 0, actualmails = [], actualgroups = [];

		for ( i = 0; i < (emailsandgroups || []).length; i++) {
			if (emailsandgroups[i].indexOf('@') > -1) {
				actualmails.push(emailsandgroups[i]);
			} else {
				actualgroups.push(emailsandgroups[i]);
			}
		}

		var eandg = {};
		eandg.submittedTo = actualmails;
		eandg.submittedToGroup = actualgroups;
		return eandg;
	},
	mapQollsToEmail : function(emails, qollids) {
		var qolls_to_email = {};

		emails.forEach(function(email){
			email = email.replace(/\./g,"&#46;");
			qlog.info('Printing email =======> ' + email, filename);
			qolls_to_email[email] = {};
			qollids.forEach(function(qid){
				qolls_to_email[email][qid] = '';
			});
		});

		return qolls_to_email;
	},
};

