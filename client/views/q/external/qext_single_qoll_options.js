var filename = "client/views/q/qoll/qext_single_qoll_options.js";

Template.qext_single_qoll_options.helpers({

	qoll_type_abbr : function(idx) {
		//qlog.info('GOT IX 2' + idx, filename);
		return alphabetical[idx];
	},
	qoll_abbr_class : function(idx, context) {
		//qlog.info('GOT IX ' + idx, filename);
		console.log(context);
		if(context === QollConstants.CONTEXT.WRITE){
			return "class_" + idx;
		} else {
			return 'white_bg_5';
		}
	},
	get_qoll_resp_class : function(context) {
		console.log(context);
		if(context === QollConstants.CONTEXT.WRITE) {
			return 'qoll-response-val';
		} else return 'qoll-response-val-none';
	},
	check_selected : function(qollid, qollTypeIx) {
		//qlog.info('Testing responce for : ' + qollid + '/' + this._id + ' and index ' + qollTypeIx, filename);
		var retval = '';
		return retval;
	},
	comma_seperate : function(thelist) {
		return thelist.join();
	},
	is_chk_selected : function(idx,qoll) {
		//qlog.info('is chk selected: ' + JSON.stringify(this.parent.qollTypeReg), filename);
		if(qoll.myresponses && qoll.myresponses.length>idx){
			if(qoll.myresponses[idx]){
				return 'border-selected';
			}else{
				return '';
			}
		}
		var qollTypeReg = this.qollTypeReg
		if (qollTypeReg == undefined)
			return '';
		if (qollTypeReg[idx] === 1)
			return 'border-selected';
	},
	is_correct_answer : function(qollTypesX, idx, context) {
		if(context === QollConstants.CONTEXT.WRITE) return false;

		if (qollTypesX == undefined)
			return false;
		if (qollTypesX[idx].isCorrect) {
			return true;
		}
		
		return false;
	},
	is_not_blank_type : function(cat) {
		//qlog.info('category ------------- ' + cat, filename);
		return true;
		if (!HashUtil.checkHash(qollAttributes, 'type') && this.qollTypes && this.qollTypes.length > 1) {
			return true;
		}

		return HashUtil.checkHash(qollAttributes, 'type') && !_.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], qollAttributes.type);
	},
	is_blank_type : function(cat) {
		//console.info('hghghghghghghghgg -------- ' + cat, filename);
		return _.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], cat);
	},
	transform_txt : function(txt, cat, myanswer) {
		//return txt;
		if(cat != QollConstants.QOLL_TYPE.BLANK)
			return txt;

		if(txt.match(QollRegEx.fib_transf))
			qlog.info('hell this is printed', filename);

		while (matches = QollRegEx.fib_transf.exec(txt)) {
			//qlog.info('matches - ' + matches, filename);
			var idx = matches[0].substring(1, matches[0].length-1);
			idx = Number(idx)+1;
            //qoll_data[QollConstants.EDU.FIB].push(matches[1]);
            txt = txt.replace(matches[0], '<input class="textbox fib" type="text" placeholder='+idx+':>');
            //cntr++;
            //qlog.info('##############=> ' + idx, filename);
            //break;
        }

		return txt;
	},
	get_qoll_type : function(qollType, cat, myAnswers) {
		//qlog.info('Printing myAnswers - ' + JSON.stringify(myAnswers), filename);
		/**if (HashUtil.checkHash(qollAttributes, 'type') && _.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], qollAttributes.type)) {
			var qollTypeVal = this.qollTypeVal;
			var fillVal, fillPow;
			if (qollTypeVal) {

				fillVal = qollTypeVal.blankResponse;
				fillPow = qollTypeVal.power;
			}

			if (qollType === "?==") {
				qollType = qollType.replace(/\?\=\=/g, getFillInTheBlanksCmplxHtml(fillVal, fillPow));
			} else if (qollType === "?=") {
				qollType = qollType.replace(/\?\=/g, getFillInTheBlanksSimpleHtml(fillVal));
			}
		}**/

		return qollType;
	},
	value_at : function(obj, val) {
		if (Session.get('info_pref') == 'full') {
			//qlog.info("LOOKUP VALUE AT "+ JSON.stringify(obj) , filename);
			return obj ? obj[val] : obj;
		}
	},
	get_register_class : function(context) {
		console.log(context);
		if(context === QollConstants.CONTEXT.READ) {
			return 'register-blank-none';
		} else return 'register-blank';
	},
	get_register_bg_class : function(context) {
		console.log(context);
		if(context === QollConstants.CONTEXT.READ) {
			return 'white_bg_5';
		} else return 'green_bg_1';
	},
});


var getFillInTheBlanksSimpleHtml = function(fill_value) {
	var border_selected = '';
	if(fill_value != undefined) border_selected = 'border-selected';
	else fill_value = '';
	var html = '<div class="input-group">'+
	'<input type="text" class="form-control '+border_selected+' blank_txt_input" id="number" placeholder="Fill in the blanks ..." value="'+fill_value+'">' +
    '</div>&nbsp;&nbsp;&nbsp;<span class="saved-msg green"></span><span class="err-msg red_1"></span>';
	return html;
};

//some private functions. these should go to util classes so that they are shared throughout the ap
var getFillInTheBlanksCmplxHtml = function(fill_value, fill_power) {
	//qlog.info('<======' + fill_power +'==========>', filename);
	var border_selected = '';
	if(fill_value != undefined) border_selected = 'border-selected';
	else fill_value = '';

	if(fill_power == undefined) fill_power = '';
	
	var html = '<div class="input-group">'+
	'<input type="text" class="form-control '+border_selected+' maths_number_input" id="number" placeholder="coefficient" value="'+fill_value+'">' +
	' $$ \\times 10^n,where\\,n=$$' +
	'<input type="text" class="form-control '+border_selected+' maths_power_input" id="power" placeholder="power" value="'+fill_power+'">' +
    '</div>&nbsp;&nbsp;&nbsp;<span class="saved-msg green"></span><span class="err-msg red_1"></span>';
	return html;
};
