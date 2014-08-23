var filename = "client/views/qoll/qolls.js";

Handlebars.registerHelper('include', function(options) {
	var context = {}, mergeContext = function(obj) {
		for (var k in obj)
		context[k] = obj[k];
	};
	mergeContext(this);
	mergeContext(options.hash);
	return options.fn(context);
});

$.fn.outertxtonly = function() {
	var str = '';

	this.contents().each(function() {
		if (this.nodeType == 3) {
			str += this.textContent || this.innerText || '';
		}
	});

	return str;
};

/**
//Meteor.autosubscribe(function () {
Template.qolls.created = function() {
	QollRegist.find({}, {
		reactive : true
	}).observe({
		added : function(v) {
			qlog.debug("Getting qoll regs ......", filename);
			//alert("gotqoll reg");
			var qollId = v.qollId;
			var qollTypeVal = v.qollTypeVal;
			var qollTypeIx = v.qollTypeIndex;
		},
		changed : function(v, vold) {
			qlog.debug("Getting qoll regs ......", filename);
			//alert("gotqoll reg");
			var qollId = v.qollId;
			var qollTypeVal = v.qollTypeVal;
			var qollTypeIx = v.qollTypeIndex;
		}
	});
};
//});
**/

Template.qolls_inner.helpers({
	allQolls : function(event) {
		if(this.qollList.find){
			var found_qolls= this.qollList.findOne();
			return found_qolls.qolls;
		}
		this.qollList.rewind();
		return this.qollList.fetch();

	},
	get_totals : function() {
		if (Session.get('info_pref') == 'full' || Session.get('info_pref') == 'less') {
			return this['totals'];
		}
	},
	value_at : function(obj, val) {
		if (Session.get('info_pref') == 'full') {
			//qlog.info("LOOKUP VALUE AT "+ JSON.stringify(obj) , filename);
			return obj ? obj[val] : obj;
		}
	},
	if_createusr : function() {
		if (this.viewContext == 'createUsr') {
			Session.set('hasCreated', true);
		}
		return (this.viewContext == 'createUsr');
	},
	if_stored : function() {
		return (this.action == 'store');
	},
	if_send : function() {
		return (this.action == 'send');
	},
	if_lock : function() {
		return (this.action == 'lock');
	},
	if_edit : function() {
		return this.enableEdit;
	},
	iif : function(qollType) {
		//qlog.info("Getting all the qollslkjhadkhaskf ......", filename);
		//qlog.info('iif(qollType):  ' + qollType, filename);
		if (qollType == 'yesno') {
			return Template['yesno']();
		} else if (qollType == 'yesnomaybe') {
			return Template['yesnomaybe']();
		} else {
			return Template['default']();
		}

		return Template['default']();
	},
	iif_yesno : function(qollType) {
		//qlog.info('iif_yesno(qollType): ' + qollType, filename);
		if (qollType == 'yesno')
			return qollType;
	},
	iif_yesnomaybe : function(qollType) {
		//qlog.info('iif_yesnomaybe(qollType): ' + qollType, filename);
		if (qollType == 'yesnomaybe')
			return qollType;
	},
	iif_likedislike : function(qollType) {
		//qlog.info('iif_likedislike(qollType): ' + qollType, filename);
		if (qollType == 'likedislike')
			return qollType;
	},
	iif_likedislikeindiff : function(qollType) {
		//qlog.info('iif_likedislikeindiff(qollType): ' + qollType, filename);
		if (qollType == 'likedislikeindiff')
			return qollType;
	},
	iif_default : function(qollType) {
		//qlog.info('iif_default(qollType): ' + qollType, filename);
		if (qollType != 'yesno' && qollType != 'yesnomaybe' && qollType != 'likedislike' && qollType != 'likedislikeindiff')
			return 'default';
	},
	qoll_type_abbr : function(idx) {
		qlog.info('GOT IX 2'+ idx, filename);
		return alphabetical[idx];
	},
	qoll_abbr_class : function(idx) {
		qlog.info('GOT IX '+ idx, filename);
		return "class_" + idx;
	},
	check_selected : function(qollid, qollTypeIx) {
		qlog.info('Testing responce for : ' + qollid + '/' + this._id + ' and index ' + qollTypeIx, filename);
		var retval = '';
		/**QollRegist.find({
			qollId : this.parent._id,
			qollTypeIndex : qollTypeIx
		}, {
			reactive : false
		}).forEach(function(v) {
			if(this.parent._id === 'bxcMmBCAhLcrMCLws')
				qlog.info('FOUND responce for : ' + this.parent._id+' and index '+ JSON.stringify(v), filename);
			if(v.qollTypeReg && v.qollTypeReg[qollTypeIx] === 1)
				retval = 'border-selected';
		});**/
		return retval;
	},
	comma_seperate : function(thelist) {
		return thelist.join();
	},
	is_chk_selected : function(idx) {
		//qlog.info('is chk selected: ' + JSON.stringify(this.parent.qollTypeReg), filename);
		var qollTypeReg = this.qollTypeReg
		if (qollTypeReg == undefined)
			return '';
		if (qollTypeReg[idx] === 1)
			return 'border-selected'
	},
	is_correct_answer : function(qollTypesX, idx) {
		if (qollTypesX == undefined)
			return false;
		if (qollTypesX[idx].isCorrect) {
			return true;
		}
		return false;
	},
	is_not_blank_type : function(qollAttributes) {
		return true;
		if(!HashUtil.checkHash(qollAttributes, 'type') && this.qollTypes && this.qollTypes.length > 1) {
			return true;
		}

		return HashUtil.checkHash(qollAttributes, 'type') && !_.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], qollAttributes.type);
	},
	is_blank_type : function(qollAttributes) {
		return HashUtil.checkHash(qollAttributes, 'type') && _.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], qollAttributes.type);
	},
	is_blank_type_no_opt : function(qollTypes, qollAttributes) {
		//qlog.info('Printing the qollType here - ' + qollType + '/' + qollAttributes.type, filename);
		return qollTypes && qollTypes.length === 0 && HashUtil.checkHash(qollAttributes, 'type') && QollConstants.QOLL_TYPE.BLANK === qollAttributes.type;
	},
	get_qoll_txt : function(qollText, qollAttributes) {
		//Handle the blank type of questions here
		if(HashUtil.checkHash(qollAttributes, 'type') && QollConstants.QOLL_TYPE.BLANK === qollAttributes.type) {
			var fillVal, fillPow;
			qollText = qollText.replace(/\?\=/g, getFillInTheBlanksSimpleHtml(fillVal, fillPow))
		}

		return qollText;
	},
	get_qoll_type : function(qollType, qollAttributes, myAnswers) {
		//qlog.info('Printing myAnswers - ' + JSON.stringify(myAnswers), filename);
		if(HashUtil.checkHash(qollAttributes, 'type') && _.contains([QollConstants.QOLL_TYPE.BLANK,QollConstants.QOLL_TYPE.BLANK_DBL], qollAttributes.type)) {
			var qollTypeVal = this.qollTypeVal;
			var fillVal, fillPow;
			if(qollTypeVal) {

				fillVal = qollTypeVal.blankResponse;
				fillPow = qollTypeVal.power;
			}

			if(qollType === "?==") {
				qollType = qollType.replace(/\?\=\=/g, getFillInTheBlanksCmplxHtml(fillVal, fillPow));
			} else if(qollType === "?=") {
				qollType = qollType.replace(/\?\=/g, getFillInTheBlanksSimpleHtml(fillVal));
			}
		}

		return qollType;
	},
	has_title : function(qollStarAttributes) {
		return qollStarAttributes[QollConstants.EDU.TITLE] != undefined;
	},
	get_title : function(qollStarAttributes) {
		return qollStarAttributes[QollConstants.EDU.TITLE];
	},
	get_units_html : function (qollStarAttributes) {
		var unit_name = qollStarAttributes[QollConstants.EDU.UNIT_NAME], 
			units = qollStarAttributes[QollConstants.EDU.UNITS];
		
		if(units == undefined || units && units.length === 0) return '';

		var qollTypeVal = this.qollTypeVal;
		var unitSelected = qollTypeVal? qollTypeVal.unitSelected : '';

	  	var units_html = '<div class="input-group">';
	  	if(unit_name) units_html += unit_name+': ';
	  	else unit_name += 'Unit: ';
	  	units.map(function(unit){
	  		var checked = '';
	  		if(unit === unitSelected) checked = 'checked';
	    	units_html += '<input name="unit" value="'+unit+'" type="radio" '+checked+'>' + unit+'&nbsp;&nbsp;';
	  	});
	  	units_html += '</div>';

	  	return units_html;
	},
	get_hint_html : function (qollStarAttributes) {
		var hint = qollStarAttributes[QollConstants.EDU.HINT];

		if(hint == undefined) return '';

	  	var hint_html = 
	  	'<button type="button" class="btn btn-warning pull-right" data-toggle="tooltip" data-placement="left" title="Partial credit will be deducted..." id="show_hint">' +
	    	'Hint' +
	  	'</button><div class="is-invisible red_1" id="hint">xyz</div>';

	  	return hint_html;
	},
	show_hint : function(qollStarAttributes) {
		var hint = qollStarAttributes[QollConstants.EDU.HINT];
		$('div#hint').html(hint);
		$('div#hint').removeClass('is-invisible');
	},
	fetch_my_response : function(myAnswers) {
		if(myAnswers && myAnswers.qollTypeVal)
			return myAnswers.qollTypeVal;
		else return '';
	},
	fetch_my_units : function(myAnswers) {
		if(myAnswers && myAnswers.unitSelected)
			return myAnswers.unitSelected;
		else return '';
		return myAnswers.unitSelected;
	}
});

Template.qolls_inner.events({
	/**'click': function(){
	 qlog.info('Selected to qoll: ' + this._id + ', qollText: ' + qollText, filename);
	 Session.set('selected_qoll_id', this._id);
	 Session.set('qollId', this._id);
	 },**/

	'click a.yes' : function(event) {
		event.preventDefault();
		if (Meteor.userId()) {
			var qollId = this._id;
			//Session.get('selected_qoll_id');
			qlog.info('Registering qoll for: ' + qollId + '/yes', filename);
			Meteor.call('registerQoll', qollId, 'yes', function(err, qollRegId) {
				qlog.info('Registered qoll with id: ' + qollRegId + '/yes', filename);
			});
			ReactiveDataSource.refresh('qollstat' + qollId);
		}
	},
	'click .qoll-response-val' : function(event) {
		event.preventDefault();
		var chk = $(event.target);

		/**var isChkSelected = false;
		if (chk.hasClass('border-selected')) {
			isChkSelected = false;
		} else {
			isChkSelected = true;
		}**/

		//If not a multiple choice question, remove the border-selected
		qlog.info('Printing ooooif this is multiple - '  +this.parent+ '/' + this.parent.isMultiple);
		if (!this.parent.isMultiple) {
			$(chk).closest('div.list-group-item').siblings().find('span.qoll-response-val').map(function(elem) {
				$(this.parent).removeClass('border-selected');
			});
			chk.addClass('border-selected');
		} else {
			if (chk.hasClass('border-selected')) {
				chk.removeClass('border-selected');
			} else {
				chk.addClass('border-selected');
			}
		}

		/**if (!isChkSelected) {
			chk.addClass('border-selected');
		}**/

		/**var foundanswer=false;
		 if(chk.hasClass('qoll-response-val')) {
		 foundanswer=true;
		 }
		 if(!foundanswer){
		 chk=$(event.target).parent();
		 if(chk.hasClass('qoll-response-val')) {
		 }
		 foundanswer=true;
		 }
		 if(!foundanswer){
		 chk=$(event.target).parent().parent();
		 if(chk.hasClass('qoll-response-val')) {
		 chk.siblings().removeClass('bg-orange');
		 chk.addClass('bg-orange');
		 }
		 foundanswer=true;
		 }**/

		var qollId = this.parent._id;
		var qoll = this.parent;
		var answerIndex = this.item.index;
		var answerVal = this.item.value;

		qlog.info('youclicked: ' + answerVal, filename);
		qlog.info('youclickedon: ' + event, filename);
		qlog.info('youclickedid: ' + qollId, filename);
		qlog.info('the aindex =' + answerVal + '/' + answerIndex, filename);
		Meteor.call('registerQollCustom', qollId, answerVal, answerIndex, function(err, qollRegId) {
			if (err) {
				qlog.error('Failed registering the qoll: ' + qollId + ' : ' + err, filename);
			} else {
				qlog.info('Registered qoll with id: ' + qollRegId + answerVal, filename);
				var saved_target = $('#'+qollId).find('span.saved-msg');
			    saved_target.html('Response saved ...');
			    saved_target.fadeOut( 6400, 'swing', function(){
			    	saved_target.html('');
			    	saved_target.removeAttr("style");
			    });
			    qlog.info('The target is ----->'+chk.attr('class'), filename);
			}
		});

		//$(event.target).closest("[class='qoll-response-val']").addClass('bg-orange');
	},

	'click span.register-blank' : function(event) {
		event.preventDefault();
		
		var qollAttributes = this.qollAttributes;
		var qollStarAttributes = this.qollStarAttributes;

		var clk = $(event.target);
		
		var qollId = this._id;
		var blank_resp = clk.parent().find('input#number').val();
		var power = clk.parent().find('input#power').val();
		var unit_selected = $('div#'+qollId+' input[name="unit"]:checked').val();
		qlog.info('Will register the blank response here - ' + qollId + '/**' + blank_resp + '**/**' + clk.attr('class') + '**/**' + unit_selected, filename);
		
		var blankRespHash = {};
		if(qollAttributes && qollAttributes.type === QollConstants.QOLL_TYPE.BLANK_DBL) {
			blankRespHash.blankResponse = Number(blank_resp);
			blankRespHash.power = parseInt((power));
			blankRespHash.unitSelected = unit_selected;
		} else if(qollAttributes && qollAttributes.type === QollConstants.QOLL_TYPE.BLANK) {
			blankRespHash.blankResponse = blank_resp;
			if(power) blankRespHash.unitSelected = Number(power);
			if(unit_selected) blankRespHash.unitSelected = unit_selected;
		} else {
			blankRespHash.blankResponse = blank_resp;
			blankRespHash.power = Number(power);
			blankRespHash.unitSelected = unit_selected;
		}

		/** 
			blank answer wth no unit
			blank-dbl answer with no unit
			blank answer with unit
			blank-dbl answer with unit
		 **/
		 var err_msgs = [];
		 var units = qollStarAttributes[QollConstants.EDU.UNITS];
		
		//if(units == undefined || units && units.length === 0) return '';

		if(units != undefined && units.length > 0 && qollAttributes && 
			_.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], qollAttributes.type)
			&& (unit_selected == undefined || blank_resp == undefined || blank_resp === '')) {
			//TODO: Handle units defined but no unit selected or no blank response provided or both case
			if(unit_selected == undefined) err_msgs.push('Unit');
			if(blank_resp == undefined || blank_resp === '') {
				if(qollAttributes.type === QollConstants.QOLL_TYPE.BLANK) err_msgs.push('Value');
				if(qollAttributes.type === QollConstants.QOLL_TYPE.BLANK_DBL) err_msgs.push('Coefficient');
			}
		} else if((units == undefined || units && units.length == 0) && qollAttributes && 
			_.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], qollAttributes.type)
				&& (blank_resp == undefined || blank_resp === '')){
			//TODO: Handle no units and blank responses issue here
			if(qollAttributes.type === QollConstants.QOLL_TYPE.BLANK) err_msgs.push('Value');
			if(qollAttributes.type === QollConstants.QOLL_TYPE.BLANK_DBL) err_msgs.push('Coefficient');
		}

		if(err_msgs.length > 0) {
			var saved_target = clk.parent().find('span.err-msg');
			var err_msg = err_msgs.length > 1? err_msgs.join(' & ') : err_msgs[0];
			saved_target.html('Input '+err_msg+' to register response ...');
		    saved_target.fadeOut( 8400, function(){
		    	saved_target.html('');
		    	saved_target.removeAttr("style");
		    });
			return;
		}

		if(isNaN(blankRespHash.power)) blankRespHash.power = 0;
		
		Meteor.call('registerQollBlankResponse', qollId, blankRespHash, function(err, qollRegId) {
			if (err) {
				qlog.error('Failed registering the blank-qoll: ' + qollId + ' : ' + err, filename);
			} else {
				qlog.info('Updated/Registered blank-qoll with id: ' + qollRegId + '/' + blank_resp, filename);
				var saved_target = clk.parent().find('span.saved-msg');
			    saved_target.html('Response saved ...');
			    saved_target.fadeOut( 6400, function(){
			    	saved_target.html('');
			    	saved_target.removeAttr("style");
			    });
			}
		});
	},
	'click .send-qoll-btn' : function(event) {
		event.preventDefault();
		var qollId = this._id;
		qlog.info('youclicked to send: ' + qollId, filename);
		Meteor.call('modifyQollId', qollId, 'send', function(err, qollRegId) {
			if(err) {
				qlog.error('Failed while sending qoll - ' + qollId + '/' + err, filename);
			} else {
				qlog.info('SENT qoll with qollRegId: ' + qollRegId + '/qollId: ' + qollId, filename);
			}
		});
	},
	'click .lock-qoll-btn' : function(event) {
		event.preventDefault();
		var qollId = this._id;
		qlog.info('youclicked to LOCK: ' + qollId, filename);
		Meteor.call('modifyQollId', qollId, 'lock', function(err, qollRegId) {
			qlog.info('LOCKED qoll with id: ' + qollRegId + ' err ' + err, filename);
		});
	},
	'click .resend-qoll-btn' : function(event) {
		event.preventDefault();
		var qollId = this._id;
		var choice = confirm("Resend this qoll?");
		if (choice) {
			//qlog.info('youclicked to archiveyes: ' +qollId, filename);
			Meteor.call('modifyQollId', qollId, 'send', function(err, qollRegId) {
				qlog.info('sent qoll with id: ' + qollRegId + ' err ' + err, filename);
			});
		} else {
			//qlog.info('youclicked to no: ' +qollId, filename);
		}
	},
	'click .archive-qoll-btn' : function(event) {
		event.preventDefault();
		var qollId = this._id;

		var choice = confirm("Archive this qoll?");
		if (choice) {
			//qlog.info('youclicked to archiveyes: ' +qollId, filename);
			Meteor.call('modifyQollId', qollId, 'archive', function(err, qollRegId) {
				if(err) {
					qlog.info('Failed while archiving the qoll - ' + qollId + '/' + err, filename);
				} else {
					qlog.info('archived qoll with id: ' + qollRegId + '/' + qollId, filename);
				}
			});
		} else {
			//qlog.info('youclicked to no: ' +qollId, filename);
		}

	},
		'click .edit-qoll-btn' : function(event) {
		event.preventDefault();
		var qollId = this._id;
		var qollRawId= this.qollRawId;
		qlog.info('RAW %%%% qoll for: '+ qollRawId);
		Session.set('QollIdToEdit', qollId);
		Session.set('QollRawIdToEdit', qollRawId);
			$('#qollModalEditor-topdiv').modal('show');
			
		/*$('#qollModalEditor-topdiv').css({
    "position":"absolute", 
    "top": $('#'+qollId).offset().top + "px",
    "left": $('#'+qollId).offset().left + "px",
		});	
		$('.modal-content').css({
    "position":"absolute", 
    "top": $('#'+qollId).offset().top + "px",
    "left": $('#'+qollId).offset().left + "px",
		});	*/
	},
	'click a.no' : function(event) {
		event.preventDefault();
		if (Meteor.userId()) {
			var qollId = this._id;
			qlog.info('Registering qoll for: ' + qollId + '/no', filename);
			Meteor.call('registerQoll', qollId, 'no', function(err, qollRegId) {
				if(err) {
					qlog.error('Failed while answering the qoll: ' + qollId + '/' + err, filename);
				} else {
					qlog.info('Registered qoll with id: ' + qollRegId + '/' + qollId + '/no', filename);
				}
			});
		}
	},

	'click a.maybe' : function(event) {
		event.preventDefault();
		if (Meteor.userId()) {
			var qollId = this._id;
			qlog.info('Registering qoll for: ' + qollId + '/maybe' + event, filename);

		}
	},

	'click .render-chart-btn' : function(event) {
		event.preventDefault();
		qlog.info('clicked to fetch stats for qoll with id: ' + this._id, filename);
		var chart_id = "#charts" + this._id;
		var ctx = $(chart_id).get(0).getContext("2d");
		qlog.info("Clicked on chart: charts" + this._id, filename);

		qlog.info('******************Generating chart now at location: ' + chart_id, filename);
		var str = chartStats(this, ctx, "div.chartStats" + this._id);
		return;
	}
});

Template.qolls_inner.rendered = function() {
	jQuery(".selector").tabs({
		active : 1
	});
	//jQuery(".selector" ).tabs({ "Primary", "active", 1 });

	$("i.lock-btn").hover(function() {
		$(this).toggleClass('red');
	});

	$("i.lock-btn").click(function() {
		//$("#ccc").slideDown('fast').show();
		$(this).removeClass('orange').addClass('red');
	});

	//$('body').addClass('bg1');
	$('body').removeClass('bg1');
};

Template.contextbtns.helpers({
	if_inbox : function() {
		var curpath = Router && Router.current() && Router.current().path;
		if ((curpath || '').indexOf("/dashboard") == 0 && Session.get("hasCreated"))
			return true;
	},
	info_pref : function() {
		if (!Session.get('info_pref')) {
			Session.set('info_pref', 'full');
		}
		return Session.get('info_pref');
	}
});

Template.contextbtns.events({

	'click .information-toggle' : function(event) {
		event.preventDefault();

		qlog.info('changing');
		var oldtext = Session.get('info_pref');

		if (oldtext == "less") {
			$('.information-toggle-txt').removeClass("glyphicon-volume-down").addClass("glyphicon-volume-up");
			$('.information-toggle-txt').text("full");
			Session.set('info_pref', 'full');
			$('.fulltoggle').show();
			$('.lesstoggle').show();
		}
		if (oldtext == "none") {
			$('.information-toggle-txt').removeClass("glyphicon-volume-off").addClass("glyphicon-volume-down");
			$('.information-toggle-txt').text("less");
			Session.set('info_pref', 'less');
			$('.fulltoggle').hide();
			$('.lesstoggle').show();
		}
		if (oldtext == "full") {
			$('.information-toggle-txt').removeClass("glyphicon-volume-up").addClass("glyphicon-volume-off");
			$('.information-toggle-txt').text("none");
			Session.set('info_pref', 'none');
			$('.fulltoggle').hide();
			$('.lesstoggle').hide();
		}

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
