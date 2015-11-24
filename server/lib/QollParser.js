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
		//regex-         /\\begin*\\end/g,
		if(d.txt.match(QollRegEx.tex_1)) {
			var cntr = d.tex_arr.length;
            //var matches;
            //qoll_data[QollConstants.EDU.CAT] = QollConstants.QOLL_TYPE.BLANK;
            var tex_replace = [];
            // d.txt = d.txt.replace(/\\/, "");

            while ((matches = QollRegEx.tex_1.exec(d.txt)) != null) {
            	//qlog.info('TEEEEEEX ======> ' + matches[1].substring(0, matches[1].length), filename);
				d.tex_arr.push(matches[1].substring(0, matches[1].length));
				tex_replace.push(matches[0]);
			}

			tex_replace.map(function(fr, idx){
				// d.txt = d.txt.replace(/<span[^>]*>([^<]*)<\/span>/, '{TEX:'+cntr+'}');
				d.txt = d.txt.replace(tex_replace[idx], '{TEX:'+cntr+'}');
				cntr++;
			});
        }
        //if(d.tex_arr && d.tex_arr.length > 0)
        //	qlog.info('Printing TEX ------> ' + JSON.stringify({'txt' : d.txt, 'tex_arr' : d.tex_arr}), filename);
        return {'txt' : d.txt, 'tex_arr' : d.tex_arr};
	},
	//Parse the data from markdown editor
	/** Helper method for storing qolls for master-qoll-id **/
	parseQollMaster : function(qollMaster, qollMasterId, emailsandgroups, tags, action, visibility, qollFormat, qollIdtoUpdate, accessGroups, selImgIds, texMode) {
        var parsedQoll = {};
        parsedQoll.qollCombo = new Array();

        var qollId = new Array();
        var qolls = qollMaster.split(/\#\s/); //qolls are seperated by \n#Qoll\s - changed to \n#\s
        qolls = qolls.slice(1);

        qolls.map(function(q){
        	// ******************** no insertion at this point, storing in a hash to insert later
        	var qoll_master = {qollText: '# ' + q, qollMasterId: qollMasterId, tags: tags, visibility: visibility, qollFormat: qollFormat, imageIds: selImgIds, texMode: texMode}
        	// var qollRawId = Qolls.QollRawDb.insert({qollText: '# ' + q, qollMasterId: qollMasterId, tags: tags, visibility: visibility, qollFormat: qollFormat, imageIds: selImgIds});
            // q = ToMarkdown.convert(q);

            qlog.info('Markdown converted qoll is - ' + q, filename);

            var qs = q.split(QollRegEx.gen_opt);//q.split(/\n-/);
            var qoll = qs[0];
			var qollType = QollConstants.QOLL_TYPE.MULTI; //multi is by default
			var qoll_data = {};
            var types = new Array();
            var typesX = new Array();
            qoll_data[QollConstants.EDU.FIB] = [];
            qoll_data[QollConstants.EDU.TEX] = [];
            qoll_data.texMode = texMode;
		

			//fetch the qoll level attributes here. split the qoll string on * and then apply
	        //qlog.info('<==============Printing qoll===============>'+qoll, filename);
	        

	        //fetch the qoll level attributes here. split the qoll string on * and then apply
            var qoll_parts = qoll.split(/\n\s*\*/);
            //qlog.info('<==============***Printing qoll***===============>'+qoll + '/' + qoll_parts.length, filename);
            var cntr =0;
            var foundTitle=0;
            qoll_parts.map(function(part){
                //qlog.info('---------------------------> ' + part, filename);
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
                    part = part.replace(/(\r\n|\n|\r)/gm,"");;
                    qoll_data[QollConstants.EDU.ANSWER] = part.replace(QollRegEx.answer, '');
                    qlog.info('This is answer -> *' + qoll_data[QollConstants.EDU.ANSWER] +'*', filename);
                } else if(part.match(QollRegEx.hint)) {
                    qlog.info('This is hint -> ' + part, filename);
                    qoll_data[QollConstants.EDU.HINT] = part.replace(QollRegEx.hint, '');
                } else if(part.match(QollRegEx.imgs)) {
                    qlog.info('This is iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiimages -> ' + part, filename);
                    qoll_data[QollConstants.EDU.IMGS] = part.replace(QollRegEx.imgs, '').split(',');
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
                } else if(part.match(QollRegEx.exp)) {
                    qlog.info('This is explanation -> ' + part, filename);
                    qoll_data[QollConstants.EDU.EXPL] = part.replace(QollRegEx.exp, '');
                    // convert explanation into a JSON of elements. let us manage images and TEX here
                    //qoll_data[QollConstants.EDU.EXPL] = {'txt' : part.replace(QollRegEx.exp, '')};
                    //qoll_data[QollConstants.EDU.EXPL][QollConstants.EDU.TEX] = [];
                } else {
                    qlog.info('##############*^*^*^*^*^**^**=> ' + part, filename);
                }
            });

			// at this point, populate imgs with selImgIds
			if(selImgIds && selImgIds.length > 0) {
				if(!qoll_data[QollConstants.EDU.IMGS]) qoll_data[QollConstants.EDU.IMGS] = [];
				qoll_data[QollConstants.EDU.IMGS] = _.union(qoll_data[QollConstants.EDU.IMGS], selImgIds);
			}

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
				        if(qoll_data[QollConstants.EDU.ANSWER].match(QollRegEx.abb_ans_alpha)) {

				        	//iterate over the alphabetical correct answers and see if the index matches x.index
				        	var arrayOfAns = qoll_data[QollConstants.EDU.ANSWER].split(QollRegEx.abb_ans_spl);
				        	arrayOfAns.forEach(function(ansm){
				        		//qlog.info('---------------->*' + ansm+'*', filename);
				        		index = ansm.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
				        		if(index === x.index) {
				        			x.isCorrect = 1;
				        			qoll_data.answer_matched = 1;
				        		}
				        	});

				            // index = qoll_data[QollConstants.EDU.ANSWER].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
				            // qlog.info('Printing from the correct loooooooooooop answer 1111 ....' + index + '/'+qoll_data[QollConstants.EDU.ANSWER].toUpperCase().charCodeAt(0), filename);
				        } else {
				            // index = parseInt(qoll_data[QollConstants.EDU.ANSWER]);
				            var arrayOfAns = qoll_data[QollConstants.EDU.ANSWER].split(QollRegEx.abb_ans_spl);
				            qlog.info(arrayOfAns.join('/'), filename);
				        	arrayOfAns.forEach(function(ansm){
				        		index = parseInt(ansm);
				        		//qlog.info('---------------->**' + ansm+'**'+index+'**', filename);
				        		if(index === x.index) {
				        			x.isCorrect = 1;
				        			qoll_data.answer_matched = 1;
				        		}
				        	});
				        }
				        
				        qlog.info('Printing from the correct loooooooooooop answer ....' + index + '/' + qoll_data[QollConstants.EDU.ANSWER], filename);

				        /** if(index === ix) {
				            x.isCorrect = 1;
				            qoll_data.answer_matched = 1;
				        } **/
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

            qlog.info('########## qoll_data=>'+JSON.stringify(qoll_data), filename);

			/**
			* Qoll Data will have the following attributes in the end
			* qoll_data = ( QollConstants.EDU.FIB, QollConstants.EDU.CAT, QollConstants.EDU.TITLE, QollConstants.EDU.TEXT,
			*						QollConstants.EDU.ANSWER, QollConstants.EDU.HINT, QollConstants.EDU.UNIT_NAME, QollConstants.EDU.UNITS,
			*						types, typesX, visibility, complexity, isMultiple ) 
			**/
			//function(action, qollData, qollRawId, qollMasterId, emails, isparent, parentid, 
									// tags, qollFormat, qollIdtoUpdate, accessGroups, selImgIds)
			// *********** move this call to the QollsDb, put this as part of the 
			var qls = {action : action, qollData : qoll_data, 
						qollRawId : undefined, qollMasterId : qollMasterId, 
						emails : emailsandgroups, isparent : undefined, 
						parentid : undefined, tags : tags, 
						qollFormat : qollFormat, qollIdtoUpdate : qollIdtoUpdate, 
						accessGroups : accessGroups, selImgIds : selImgIds, texMode : texMode};

			parsedQoll.qollCombo.push({master : qoll_master, qoll : qls});

			/** var qid = Meteor.call('addQoll', action, qoll_data, qollRawId, qollMasterId, emailsandgroups,
			 							undefined, undefined,  tags, qollFormat, qollIdtoUpdate, accessGroups, selImgIds);
			
			qollId.push(qid); **/


			//**** Above this is the new code
        });

      qlog.info('Inserted qolls with id: ' + qollId + ", for master-qoll-id: " + qollMasterId);
      // return qollId;
      return parsedQoll;
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


Meteor.methods({
	// parseQollMaster : function(qollMaster, qollMasterId, emailsandgroups, tags, action, 
		// visibility, qollFormat, qollIdtoUpdate, accessGroups, selImgIds)
	parseQollPreview : function(qollMaster, texMode) {
		var parsedQoll = QollParser.parseQollMaster(qollMaster, undefined, undefined, undefined, undefined, 
										 undefined, undefined, undefined, undefined, undefined, texMode);

		qlog.info('TEX_PREF =>> ' + texMode, filename);

		var qolls = new Array();

		parsedQoll.qollCombo.forEach(function(combo, idx){
			var t = idx+1;
			var p = '(Q' + t + ')';
			combo.qoll.qollData.idx = t;
			combo.qoll.qollData.qoll_idx_title = '(Q' + t + ')';
			combo.qoll.qollData.qoll_idx = p;

			// convert all text expressions and put the katex display content here
			
			qolls.push(combo.qoll.qollData);
		});

		return qolls;
	}
});

