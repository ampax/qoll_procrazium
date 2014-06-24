var filename = "client/views/qoll/qolls.js";

var QollRegist = new Meteor.Collection("qoll-regs");

Handlebars.registerHelper('include', function(options) {
	var context = {}, mergeContext = function(obj) {
		for (var k in obj)
		context[k] = obj[k];
	};
	mergeContext(this);
	mergeContext(options.hash);
	return options.fn(context);
});

Handlebars.registerHelper('eachport', function(context, options) {
	var fn = options.fn, inverse = options.inverse;
	var i = 0, ret = "", data;

	if (options.data) {
		data = Handlebars.createFrame(options.data);
	}

	if (context && typeof context === 'object') {
		if ( context instanceof Array) {
			for (var j = context.length; i < j; i++) {
				if (data) {
					data.index = i;
				}

				if ( typeof (context[i]) == 'object') {
					context[i]['_iter_ix'] = i;
					ret = ret + fn(context[i], {
						data : data
					});
				} else {// make an object and add the index property
					item = {
						_iter_v : context[i], // TODO: make the name of the item configurable
						_iter_ix : i
					};
					ret = ret + fn(item, {
						data : data
					});
				}

			}
		} else {
			for (var key in context) {
				if (context.hasOwnProperty(key)) {
					if (data) {
						data.key = key;
						data.index = i;
						context[key]._iter_ix = i;
					}
					ret = ret + fn(context[key], {
						data : data
					});
					i++;
				}
			}
		}
	}

	if (i === 0) {
		ret = inverse(this);
	}

	return ret;
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
			/**$( '#'+qollId).siblings('.qoll-response-val').each(function(ix,elem){
			 var myouttxt = $(elem).find('.indent-littlebit').first().attr( "id") ;
			 qlog.info("a ......"+ myouttxt  +" *"+qollTypeIx, filename);
			 if(myouttxt== qollTypeIx){

			 $(elem).addClass('bg-orange');

			 }else{

			 $(elem).removeClass('bg-orange');
			 }
			 });**/
		},
		changed : function(v, vold) {
			qlog.debug("Getting qoll regs ......", filename);
			//alert("gotqoll reg");
			var qollId = v.qollId;
			var qollTypeVal = v.qollTypeVal;
			var qollTypeIx = v.qollTypeIndex;
			/**$( '#'+qollId).siblings('.qoll-response-val').each(function(ix,elem){
			 var myouttxt = $(elem).find('.indent-littlebit').first().attr( "id") ;
			 qlog.info("a ......"+ myouttxt  +" *"+qollTypeIx, filename);
			 if(myouttxt== qollTypeIx){

			 $(elem).addClass('bg-orange');

			 }else{

			 $(elem).removeClass('bg-orange');
			 }
			 }); **/
		}
	});
};
//});

Template.qolls.helpers({
	allQolls : function(event) {
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
		return alphabetical[idx];
	},
	qoll_abbr_class : function(idx) {
		return "class_" + idx;
	},
	check_selected : function(qollid, qollTypeIx) {
		//qlog.info('Testing responce for : ' + qollid + '/' + this.parent._id + ' and index ' + qollTypeIx, filename);
		var retval = '';
		QollRegist.find({
			qollId : this.parent._id,
			qollTypeIndex : qollTypeIx
		}, {
			reactive : false
		}).forEach(function(v) {
			//qlog.info('FOUND responce for : ' + this.parent._id+' and index '+ qollTypeIx, filename);
			retval = 'border-selected';
		});
		return retval;
	},
	comma_seperate : function(thelist) {
		return thelist.join();
	},
	is_chk_selected : function(qollTypeReg, idx) {
		qlog.info('is chk selected: ' + JSON.stringify(qollTypeReg), filename);
		if (qollTypeReg == undefined)
			return '';
		if (qollTypeReg[idx])
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
		return qollAttributes && QollConstants.QOLL_TYPE.BLANK != qollAttributes.type;
	},
	is_blank_type : function(qollAttributes) {
		return qollAttributes && QollConstants.QOLL_TYPE.BLANK === qollAttributes.type;
	},
	is_blank_type_no_opt : function(qollTypes, qollAttributes) {
		//qlog.info('Printing the qollType here - ' + qollType + '/' + qollAttributes.type, filename);
		return qollTypes && qollTypes.length === 0 && qollAttributes && QollConstants.QOLL_TYPE.BLANK === qollAttributes.type;
	},
	get_qoll_txt : function(qollText, qollAttributes) {
		//Handle the blank type of questions here
		if(qollAttributes && QollConstants.QOLL_TYPE.BLANK === qollAttributes.type) {
			qollText = qollText.replace(/\?\=/g, getFillInTheBlanksHtml())
		}

		return qollText;
	},
	get_qoll_type : function(qollType, qollAttributes, myAnswers) {
		//qlog.info('Printing myAnswers - ' + JSON.stringify(myAnswers), filename);
		if(qollAttributes && QollConstants.QOLL_TYPE.BLANK === qollAttributes.type) {
			qollType = qollType.replace(/\?\=/g, getFillInTheBlanksHtml())
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

	  	var units_html = '<div class="input-group">';
	  	if(unit_name) units_html += unit_name+': ';
	  	else unit_name += 'Unit: ';
	  	units.map(function(unit){
	    	units_html += '<input name="unit" value="'+unit+'" type="radio">' + unit;
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

Template.qolls.events({
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

		var isChkSelected = false;
		if (chk.hasClass('border-selected')) {
			isChkSelected = true;
		}

		//If not a multiple choice question, remove the border-selected
		if (!this.isMultiple) {
			$(chk).closest('div.list-group-item').siblings().find('span.qoll-response-val').map(function(elem) {
				$(this).removeClass('border-selected');
			});
		}

		if (!isChkSelected) {
			chk.addClass('border-selected');
		}

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
		var answerIndex = this._iter_ix;
		var answerVal = this._iter_v;

		qlog.info('youclicked: ' + this._iter_v, filename);
		qlog.info('youclickedon: ' + event, filename);
		qlog.info('youclickedid: ' + qollId, filename);
		qlog.info('the aindex =' + answerIndex, filename);
		Meteor.call('registerQollCustom', qollId, answerVal, answerIndex, function(err, qollRegId) {
			if (err) {
				qlog.error('Failed registering the qoll: ' + qollId + ' : ' + err, filename);
			} else {
				qlog.info('Registered qoll with id: ' + qollRegId + answerVal, filename);
			}
		});

		//$(event.target).closest("[class='qoll-response-val']").addClass('bg-orange');
	},

	'click span.register-blank' : function(event) {
		event.preventDefault();
		var clk = $(event.target);
		
		var qollId = this.parent._id;
		var blank_resp = clk.parent().find('input').val();
		var unit_selected = $('div#'+qollId+' input[name="unit"]:checked').val();
		qlog.info('Will register the blank response here - ' + qollId + '/**' + blank_resp + '**/**' + clk.attr('class') + '**/**' + unit_selected, filename);

		Meteor.call('registerQollBlankResponse', qollId, blank_resp, unit_selected, {}, function(err, qollRegId) {
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
			qlog.info('SENT qoll with id: ' + qollRegId + ' err ' + err, filename);
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
				qlog.info('archived qoll with id: ' + qollRegId + ' err ' + err, filename);
			});
		} else {
			//qlog.info('youclicked to no: ' +qollId, filename);
		}

	},
	'click a.no' : function(event) {
		event.preventDefault();
		if (Meteor.userId()) {
			var qollId = this._id;
			qlog.info('Registering qoll for: ' + qollId + '/no', filename);
			Meteor.call('registerQoll', qollId, 'no', function(err, qollRegId) {
				qlog.info('Registered qoll with id: ' + qollRegId + '/no', filename);
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
		//var handle = QollStats.find(this._id);
		//chartStats();
		//qlog.info('Recieved qlog register data: ' + this._id + ', value: ' + $("div.charts").html(), filename);
		//$("#chart").highcharts(handle);
		//$("#charts").html(chartStats(this._id));
		var chart_id = "#charts" + this._id;
		var ctx = $(chart_id).get(0).getContext("2d");
		qlog.info("Clicked on chart: charts" + this._id, filename);

		qlog.info('******************Generating chart now at location: ' + chart_id, filename);
		var str = chartStats(this, ctx, "div.chartStats" + this._id);
		//LineChart(this._id, ctx);
		//PieChart(this._id, ctx);
		//DoughnutChart(this._id, ctx);
		return;
	}
});

Template.qolls.rendered = function() {
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

//some private functions. these should go to util classes so that they are shared throughout the ap
var getFillInTheBlanksHtml = function() {
  var html = '<div class="input-group">'+
    '<input type="text" class="form-control" placeholder="Fill in the blanks ...">' +
    '</div>&nbsp;&nbsp;&nbsp;<span class="saved-msg green"></span>';
  return html;
};
