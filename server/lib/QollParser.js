var filename='server/lib/QollParser.js';

QollRegEx = {
	num 		: /^[\d.,]+$/,
	txt			: /^[\w\s.,:;"'=-_\\\(\)\[\]\{\}\^&#!@$*<>]+$/,
	qoll 		: /^#[\s]*/,
	qollTxt 	: /^[#\s]+(.*)/gm,
	hint 		: /^[\s]*[Hh]int[:=-\s]*/,
	hintTxt 	: /^[\s]*[Hh]int[:=-\s]*(.*)/,
	note 		: /^[\s]*[Nn]ote[:=-\s]*/,
	noteTxt 	: /^[\s]*[Nn]ote[:=-\s]*(.*)/,
	fib 		: /\\_[\w\s,]+\\_/,
	fibTxt 		: /\\_(,.+)\\_/,
	opt 		: /^-[?=Aa]{0,1}[\s]*/,
	optTxt 		: /^-[?=Aa]{0,1}[\s]*(.+)/,
	qollMaster 	: /^#\s(.*)/m,
	isNum		: function(text){return text.match(QollRegEx.num);},
	isTxt		: function(text){return text.match(QollRegEx.txt);},
	isQoll		: function(text){return text.match(QollRegEx.qoll);},
	isHint		: function(text){return text.match(QollRegEx.hint);},
	isNote		: function(text){return text.match(QollRegEx.note);},
	isFib		: function(text){return text.match(QollRegEx.fib);},
	isOpt		: function(text){return text.match(QollRegEx.opt);},
	parseQollTxt	: function(text) {return text.split(QollRegEx.qollTxt);},
	parseHintTxt	: function(text) {return text.match(QollRegEx.hintTxt);},
	parseNoteTxt	: function(text) {return text.match(QollRegEx.noteTxt);},
	parseFibTxt		: function(text) {return text.match(QollRegEx.fibTxt);},
	parseOptTxt		: function(text) {return text.match(QollRegEx.optTxt);},
	parseQollMaster	: function(text) {return text.match(QollRegEx.qollMaster);},
}

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
				qlog.info('SUCCESS: The qoll is fill in the blanks - ' + QollRegEx.isFib(qoll), filename);
			} else qlog.info('FAILURE: The qoll is not fill in the blanks - ' + qoll, filename);
			
			opts.map(function(opt){
				if(QollRegEx.isFib(opt)){ 
					qlog.info('SUCCESS: The option is fill in the blanks - ' + QollRegEx.isFib(opt), filename);
				} else qlog.info('FAILURE: The opts is not fill in the blanks - ' + opt, filename);
			});
        });

	},
	//Parse the data from markdown editor
	/** Helper method for storing qolls for master-qoll-id **/
	addQollsForMaster : function(qollMaster, qollMasterId, emailsandgroups, tags, action, visibility, qollFormat, qollIdtoUpdate) {
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
            var count =0;
            var types = new Array();
            var typesX = new Array();
            var attributes = {};
            attributes.visibility = visibility;
            attributes.type = QollConstants.QOLL.TYPE.SINGLE;
            attributes.complexity = QollConstants.QOLL.DIFFICULTY.EASY;
            var isMultiple = false;
            qs.slice(1).map(function(type){
                var x = {};
                type = type.trim();
                if(type.indexOf('(a) ') == 0) {
                    type = type.replace('(a) ', '');
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    x.type = type;
                    x.isCorrect = 1;
                    count++;
                } else {
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    x.type = type;
                    x.isCorrect = 0;
                }

                types.push(type);
                typesX.push(x);
            });
            if(count > 1) attributes.type = QollConstants.QOLL.TYPE.MULTIPLE; //isMultiple = true;
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
	},
};

