var filename = "client/views/q/qoll/single_qoll_options.js";

Template.single_qoll_options.helpers({

	qoll_type_abbr : function(idx) {
		//qlog.info('GOT IX 2' + idx, filename);
		return alphabetical[idx];
	},
	qoll_abbr_class : function(idx, context) {
		//qlog.info('GOT IX ' + idx, filename);
		// console.log(context);
		if(context === QollConstants.CONTEXT.WRITE){
			return "class_" + idx;
		} else {
			return 'white_bg_5';
		}
	},
	get_qoll_resp_class : function(context) {
		// console.log(context);
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

		var rc_idx = this.rc_index;
		if(!rc_idx) {
			if(qoll.tt && qoll.tt.length === 1) {
				rc_idx = 0;
			}
		}

		var ret_chk = '';
		if(rc_idx != undefined && qoll.myresponses && qoll.myresponses[rc_idx]) {
			if(qoll.myresponses[rc_idx][idx] === true) {
				ret_chk = 'border-selected';
			}
		} else if(qoll.myresponses && qoll.myresponses.length>idx) {
			if(qoll.myresponses[idx] === true) {
				ret_chk = 'border-selected';
			}
		}


		var qollTypeReg = this.qollTypeReg
		if (qollTypeReg && qollTypeReg[idx] === 1)
			ret_chk = 'border-selected';

		return ret_chk;
	},
	//
	is_chk_selected_bg : function(idx,qoll) {
		//qlog.info('is chk selected: ' + JSON.stringify(this.parent.qollTypeReg), filename);
		//qlog.info('+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_++++++>>> '+JSON.stringify({}), filename);
		//console.log(qoll);
		//qlog.info(this.rc_index + '***/***' + idx, filename );

		var rc_idx = this.rc_index;
		if(!rc_idx) {
			if(qoll.tt && qoll.tt.length === 1) {
				rc_idx = 0;
			}
		}

		var ret_bg = '';
		if(rc_idx != undefined && qoll.myresponses && qoll.myresponses[rc_idx]) {
			//qlog.info('111', filename);
			if(qoll.myresponses[rc_idx][idx] === true) {
				//qlog.info('222', filename);
				ret_bg = 'qoll-background-selected';
			}
		} else if(qoll.myresponses && qoll.myresponses.length>idx) {
			//qlog.info('333', filename);
			if(qoll.myresponses[idx] === true) {
				//qlog.info('444', filename);
				ret_bg = 'qoll-background-selected';
			}
		}


		var qollTypeReg = this.qollTypeReg
		if (qollTypeReg && qollTypeReg[idx] === 1) 
			ret_bg = 'qoll-background-selected';

		return ret_bg;
	},
	is_correct_answer : function(qoll, idx, context, viewContext) {
		if(context === QollConstants.CONTEXT.WRITE || viewContext!='createUsr') return false;

		//console.log(qoll);
		//qlog.info('item index - ' + idx, filename);
		//qlog.info('rc_index ----> ' + this.rc_index, filename);

		var rc_idx = this.rc_index;
		if(!rc_idx) {
			if(qoll.tt && qoll.tt.length === 1) {
				rc_idx = 0;
			}
		}

		if(qoll.tt) {
			return qoll.tt[rc_idx].typesX[idx].isCorrect;
		}

		return qoll.qollTypesX && qoll.qollTypesX[idx] && qoll.qollTypesX[idx].isCorrect;
	},
	get_feedback_bg : function(qollTypesX, idx, context, viewContext) {
		if(context === QollConstants.CONTEXT.WRITE || viewContext!='createUsr') {
			return '#E4D7D7';
		}

		if (qollTypesX == undefined)
			return '#E4D7D7';
		if (qollTypesX[idx] && qollTypesX[idx].isCorrect) {
			return '#D7E4DA';
		}
		
		return '#E4D7D7';
	},
							//
	has_feedback : function(qollTypesX, idx, context, viewContext) {
		if(context === QollConstants.CONTEXT.WRITE || viewContext!='createUsr') return false;

		if (qollTypesX == undefined) {
			return false;
		}
		if (qollTypesX[idx] && qollTypesX[idx].feedback) {
			return true;
		}
		
		return false;
	},
	feedback_at_idx : function(qollTypesX, idx, cat, context, fib, tex, tex_mode, qoll_idx) {
		var txt_0 = qollTypesX[idx].feedback.replace(/\n|\r\n|\r/g, '<br />');
    

	    var txt_1 = transform_fib(txt_0, cat, context, fib);

	    var txt_2 = transform_tex(txt_1, tex, tex_mode, qoll_idx);
	    return txt_2;
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
	//transform_txt : function(txt, cat, myanswer) {
	transform_txt : function(txt, cat, context, fib, tex, tex_mode, qoll_idx) {

		var txt_0 = txt.replace(/\n|\r\n|\r/g, '<br />');

		var txt_1 = transform_fib(txt_0, cat, context, fib);

		//method defined in preview.js
	    var txt_2 = transform_tex(txt_1, tex, tex_mode, qoll_idx);

	    // txt_2 = txt_2 + "\\({a1x^3+z=0}\\)";

	    return txt_2;
	},
	transform_txt1 : function(txt, cat, myanswer) {
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
  	log: function () {
	    console.log(this);
	}
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
