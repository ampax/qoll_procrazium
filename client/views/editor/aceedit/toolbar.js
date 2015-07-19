var filename = "toolbar.js";

Template.toolbar.events({
	'click .addqoll' : function(event) {
		event.preventDefault();
		var editor = ace.edit("aceEditor");
		bindToolBarForQoll(editor);
	},
	'click .addqoll-fib' : function(event) {
		event.preventDefault();
		var editor = ace.edit("aceEditor");
		bindToolBarForQollFib(editor);
	},
	'click .addqoll-multi' : function(event) {
		event.preventDefault();
		var editor = ace.edit("aceEditor");
		bindToolBarForQollMulti(editor);
	},
	'click .addopti' : function(event) {
		event.preventDefault()
		var editor = ace.edit("aceEditor");
		bindToolBarForOption(editor);
	},
	'click .addltxi' : function(event) {
		event.preventDefault()
		var editor = ace.edit("aceEditor");
		bindForLatexInline(editor);
	},
	'click .addltxb' : function(event) {
		event.preventDefault()
		var editor = ace.edit("aceEditor");
		bindForLatexBlock(editor);
	},
	'click .addcode' : function(event) {
		event.preventDefault()
		var editor = ace.edit("aceEditor");
		bindForCode(editor);
	},
	'click .addbloc' : function(event) {
		event.preventDefault()
		var editor = ace.edit("aceEditor");
		bindForBlockQuotes(editor);
	},
	'click .sendqoll' : function(event) {
		event.preventDefault()
		console.log("Send qoll at this event ...");
		var editor = ace.edit("aceEditor");
		var qoll_editor_content = editor.getValue();
		var recips = jQuery("input#recipient_search").val();
		var tags = jQuery("input.tags").val();

		storeEditorContents(editor, recips, tags, QollConstants.QOLL_ACTION_SEND);
	},
	'click .storqoll' : function(event) {
		event.preventDefault()
		console.log("Store qoll at this event ...");
		var editor = ace.edit("aceEditor");
		var qoll_editor_content = editor.getValue();
		var recips = jQuery("input#recipient_search").val();
		var tags = jQuery("input.tags").val();

		storeEditorContents(editor, recips, tags, QollConstants.QOLL_ACTION_STORE);
	},
	'click .previewqoll' : function(event) {
		event.preventDefault();

		var editor = ace.edit("aceEditor");
		var parsed_qoll;
		Meteor.call('parse_downtown', editor.getValue(), DownTownOptions.downtown_default(), function(err, val) {
			qlog.info("Rec data from server: " + JSON.stringify(val), filename);
			if (err) {
				parsed_qoll = "Error occured while converting qoll-contents. Please try again: " + err;
				previewQoll(parsed_qoll);
			} else {
				parsed_qoll = val;
				previewQoll(preparePreviewHtml(parsed_qoll));
				$("div#aceEditor").height($("div#aceEditor_Preview").parent().height()+'px');
				var editor = ace.edit("aceEditor");
				editor.resize(true);
				editor.setHighlightActiveLine(true);
			}
		});

		if (jQuery("#aceEditor").hasClass("is-invisible")) {
			qlog.info("Showing ace editor ...", filename);
			/**jQuery("#aceEditor").removeClass("is-invisible");
			jQuery("#aceEditor_Preview").addClass("is-invisible");**/
			jQuery('a.previewqoll > i').addClass("glyphicon-eye-open");
			jQuery('a.previewqoll > i').removeClass("glyphicon-eye-close");
		} else {
			qlog.info("Hiding ace editor ...", filename);
			/**jQuery("#aceEditor").addClass("is-invisible");
			jQuery("#aceEditor_Preview").removeClass("is-invisible")**/
			jQuery('a.previewqoll > i').removeClass("glyphicon-eye-open");
			jQuery('a.previewqoll > i').addClass("glyphicon-eye-close");

		}

	},
	'click .checkqoll' : function(event) {
		event.preventDefault()
		console.log("Check correct item in qoll at this event ...");
		var editor = ace.edit("aceEditor");
		bindToolBarForQollAnswer(editor);
	},
	'click #basic' : function(event) {
		event.preventDefault();
		//store the pref in user-preferences and routh to basic editor.
		//Meteor.Router.to('/news');
		qlog.info('Switching to basic editor', filename);
		settings = Settings.find({
			'userId' : Meteor.userId()
		}).fetch();
		if (settings && settings.length > 0) {
			//Settings.update({'editor_mode': QollConstants.EDITOR_MODE.BASIC});

			Settings.update({
				_id : settings[0]._id
			}, {
				$set : {
					'editor_mode' : QollConstants.EDITOR_MODE.BASIC
				}
			}, function(error) {
				if (error) {
					//throwError(error.reason);
					qlog.error('Error happened while saving editor-preferences - ' + error.reason, filename);
				} else {
					qlog.info('Saved editor_mode = basic to preferences', filename);
				}
			});
		} else {
			Settings.insert({
				'userId' : Meteor.userId(),
				'editor_mode' : QollConstants.EDITOR_MODE.BASIC
			});
		}
	},

	'click .qembedimg' : function() {
		console.log("Img Embed ...");
		var img_url = prompt("Image Url", "http://");
		if (img_url != null) {
			var editor = ace.edit("aceEditor");
			bindToolBarForImgEmbed(editor, img_url);
		}
	},
});

/** Manage various events for storing the qoll contents **/
// Global method ... wil be called from quick qoll page also to store qolls
storeEditorContents = function(editor, recips, tags, action) {

	qlog.info('Adding the qoll to the db with %' + recips + '%' + tags + '%', filename);
	var qollIdToEdit = Session.get('QollIdToEdit');
	if (!qollIdToEdit) {
		if ($.trim(recips) === '' && action === QollConstants.QOLL_ACTION_SEND || $.trim(tags) === '') {
			var err_target = jQuery("span.toolbar-error-msg");
			var err_msg1 = '', err_msg2 = '', err_separator = '';
			if ($.trim(recips) === '' && action === QollConstants.QOLL_ACTION_SEND)
				err_msg1 = 'recipients';
			if ($.trim(tags) === '')
				err_msg2 = 'at least one tag';
			if ($.trim(err_msg1) === '' && $.trim(err_msg2) === '')
				err_separator = ' \& ';

			err_target.html('Add ' + err_msg1 + err_separator + err_msg2 + ' to proceed please ...');
			err_target.fadeOut(6400, function() {
				err_target.html('');
				err_target.removeAttr("style");
			});
			return;
		}
	}
	var foundqoll;
	var editor_content = editor.getValue();
	var target = jQuery(".toolbar-storqoll");
	var store_html = target.html();
	target.html("<i class='fa fa-spinner fa-spin toolbar-buttons-link'></i>Saving...");

	var emailsandgroups = [];
	var tagArr = [];
	if (!qollIdToEdit) {
		$.each(recips.split(/;|,/), function(ix, email) {
			email = $.trim(email);
			if (email.length > 0) {
				emailsandgroups.push(email);
			}
		});

		$.each(tags.split(/;|,|\s/), function(ix, tag) {
			tag = $.trim(tag);
			if (tag.length > 0) {
				tagArr.push(tag);
			}
		});
	} else {
		Meteor.apply("getQollById", [qollIdToEdit],{wait:true},function(error,foundqoll){
				tagArr = foundqoll.tags;
		    emailsandgroups = foundqoll.submittedTo.concat(foundqoll.submittedToGroup);
		});


	}
	Meteor.call("addQollMaster", editor_content, emailsandgroups, tagArr, action,qollIdToEdit, function(error, qollMasterId) {
		if (error) {
			qlog.info('Error occured storing the master qoll. Please try again.', filename);
			target.html("Failed, try again...");
			target.fadeOut(1600, function() {
				target.html(store_html);
			});
			return -1;
		} else {
			qlog.info("Added qoll-master-content with id: " + qollMasterId, filename);
			target.html("Qoll Saved...");
			editor.setValue('', 1);
			jQuery("input#recipient_search").val('');
			jQuery("input.tags").val('');
			target.fadeOut(2400, function() {
				//setTimeout(function(){
				target.html(store_html);
				target.removeAttr("style");
				//}, 800);
				qlog.info('Adding store-qoll button back: ' + store_html, filename);
			});
			return qollMasterId;
		}
	});
};

var previewQoll = function(val) {
	$("div#aceEditor_Preview").html(val);
};

var preparePreviewHtml = function(qolls) {
	qlog.info('Printing preview qoll ============>' + qolls, filename);
	var html = '';
	qolls.map(function(qoll) {
		html += "<div class='col-md-12 col-xs-12 list-group-item bg-qoll qoll-seperator'>";

		if (qoll[QollConstants.EDU.TITLE]) {
			html += '<h4>' + qoll[QollConstants.EDU.TITLE] + '</h4>';
		}

		if(qoll[QollConstants.EDU.TITLE] != qoll[QollConstants.EDU.TEXT])
			html += '<h5>' + qoll[QollConstants.EDU.TEXT] + '</h5>';

		var types = qoll['types'];
		var ans;
		if (qoll[QollConstants.EDU.ANSWER] || qoll[QollConstants.EDU.FIB] && qoll[QollConstants.EDU.FIB].length > 0) {
			var ans_arr = [];
			if(qoll[QollConstants.EDU.ANSWER])
				ans_arr.push(qoll[QollConstants.EDU.ANSWER]);

			var cnt = 0;
			qoll[QollConstants.EDU.FIB].map(function(fb){
				ans_arr.push('{'+ cnt++ +'} : ' + fb);
			});

			var ans_class = 'green_1';
			if(qoll.answer_matched != 1) 
				ans_class = 'red_1';
			html += '<h5 class="'+ans_class+'">Answer: ' + ans_arr.join('; ') + '</h5>';
		} else {
			html += '<h5 class="red_1">Answer: Not Defined (please provide answer for auto-checking)</h5>';
		}

		if (qoll[QollConstants.EDU.UNITS]) {
			html += getUnitsHtml(qoll[QollConstants.EDU.UNIT_NAME], qoll[QollConstants.EDU.UNITS]);
		}

		if (qoll[QollConstants.EDU.HINT]) {
			html += getHintHtml(qoll[QollConstants.EDU.HINT]);
		}

		html += "</div>";
		var idx = 0;
		if (types.length > 1) {
			types.map(function(t) {
				if (t.isCorrect) {
					html += "<div class='col-md-12 col-xs-12 list-group-item'>";
					html += "<span class='badge pull-left qoll-response-val class_" + idx + " glossy'>" + alphabetical[idx] + "</span>";
					html += t.type;
					//html += "</div>";
					//html+= "<div class='col-md-2 col-xs-2 list-group-item'>";
					html += "<i class='glyphicon glyphicon-check pull-right green'></i>";
					html += "</div>";
				} else {
					html += "<div class='col-md-12 col-xs-12 list-group-item'>";
					html += "<span class='badge pull-left qoll-response-val class_" + idx + " glossy'>" + alphabetical[idx] + "</span>";
					html += t.type;
					html += "</div>";
				}

				idx = idx + 1;
			});
		} else if (types) {
			//this is a fill in the blanks question, create input boxes
			if (types.length === 0) {
				//this is inline fill in the blanks. find first ? and replace it with input box ... type.indexOf('(a)')
				if (html.indexOf("?==") != -1) {
					//this is extended fill in the blanks, right now this is only scientific support. Get double fill in the blanks
					html = html.replace(/\?\=\=/g, getFillInTheBlanksCmplxHtml());
				} else if (html.indexOf("?=") != -1) {
					//this is single fill in the blanks. Will be used for various single statement posting
					html = html.replace(/\?\=/g, getFillInTheBlanksSimpleHtml());
				}
			} else if (types.length === 1) {
				qlog.info('Printing types - ' + types[0].type, filename);
				html += "<div class='col-md-12 col-xs-12 list-group-item'>";
				var tmp1 = types[0].type;
				//.replace(/\?\=/g, getFillInTheBlanksSimpleHtml());

				if (tmp1.indexOf("?==") != -1) {
					//this is extended fill in the blanks, right now this is only scientific support. Get double fill in the blanks
					tmp1 = tmp1.replace(/\?\=\=/g, getFillInTheBlanksCmplxHtml());
				} else if (tmp1.indexOf("?=") != -1) {
					//this is single fill in the blanks. Will be used for various single statement posting
					tmp1 = tmp1.replace(/\?\=/g, getFillInTheBlanksSimpleHtml());
				}

				html += tmp1;
				html += "</div>";
			}
		}
	});
	return html;
};

var getFillInTheBlanksSimpleHtml = function() {
	var html = '<div class="input-group">' + '<input type="text" class="form-control maths_number_input" placeholder="Fill in the blanks ...">' + '</div>';
	return html;
};

var getFillInTheBlanksCmplxHtml = function() {

	var html = '<div class="input-group">' + '<input type="text" class="form-control maths_number_input" id="number" placeholder="coefficient">' + ' X 10^n,where n=' + '<input type="text" class="form-control maths_power_input" id="power" placeholder="power">' + '</div>&nbsp;&nbsp;&nbsp;<span class="saved-msg green"></span><span class="err-msg red_1"></span>';
	return html;
};

var getUnitsHtml = function(unit_name, units) {
	qlog.info('Unit name / units - ' + unit_name + '/' + units.join('---'), filename);
	var units_html = '<div class="input-group">';
	if (unit_name)
		units_html += unit_name + ': ';
	else
		unit_name += 'Unit: ';
	units.map(function(unit) {
		units_html += '<input name="unit" type="radio">' + unit;
	});
	units_html += '</div>';

	return units_html;
};

var getHintHtml = function(hint) {
	var hint_html = '<button type="button" class="btn btn-warning pull-right" data-toggle="tooltip" data-placement="left" title="Partial credit will be deducted..." id="show_hint">' + 'Hint' + '</button><div class="is-invisible red_1" id="hint">' + hint + '</div>';

	return hint_html;
};
