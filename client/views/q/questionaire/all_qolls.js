var filename = "client/views/qoll/all_qolls.js";

Template.all_qolls.rendered = function() {
	Session.set('disable_sendtoQbank', true);
	Session.set('selected-topics', undefined);
	$('.hasDatepicker').datepicker();

	//Set the background color of the selected box
	$('li#qollshop').css('background-color', 'firebrick');

};

Template.all_qolls.onCreated(function(){
    this.subscribe('images');
}); 


Template.all_qolls.helpers({
  imgs: function(image_ids) {
    if(!image_ids) return [];
    var imgs1 = QollImages.find({'_id': {$in: image_ids}});
    return imgs1;
  },
  submitted_on : function(qollSubmittedOn) {
		// console.log(qollstionnaireSubmittedOn);

		if(!qollSubmittedOn) return '';
		else {
			// return qollstionnaireSubmittedOn;
			return moment(qollSubmittedOn).format('MMM Do YYYY, h:mm a');
		}
	},
	is_fb_user : function() {
		var is_fb_user = Meteor.user().profile.fb_link != undefined;
		return is_fb_user;
	},
	transform_txt : function(txt, cat, context, fib, tex, tex_mode, qoll_idx) {
		// qlog.info('+-+-+-+-+-+-+--====> '+txt +'/'+ cat +'/'+ context +'/'+ fib +'/'+ tex +'/'+ tex_mode +'/'+ qoll_idx, filename);
		// method defined in preview.js
		var txt_1 = transform_fib(txt, cat, context, fib);

		//method defined in preview.js
	    var txt_2 = transform_tex(txt_1, tex, tex_mode, qoll_idx);

	    // txt_2 = txt_2 + "\\({a1x^3+z=0}\\)";

	    return txt_2;
	},
});

$.fn.toggleCheckbox = function() {
	this.attr('checked', !this.attr('checked'));
};

Template.all_qolls.events({
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        qlog.info('togggggggggggggled ......', filename);
	},
	'click .qoll_selectall' : function(event) {
		var my_checked = $('.qoll_selectall').prop("checked");
		var checkBoxes = $('.qoll_selection');
		checkBoxes.prop("checked", my_checked);

	},
	'click .archive-qoll-btn' : function(event) {
		event.preventDefault();
		var qollId = this._id;

		var choice = confirm("Archive this qoll?", filename);
		
		if (choice) {
			//qlog.info('youclicked to archiveyes: ' +qollId, filename);
			Meteor.call('modifyQollId', qollId, 'archive', function(err, qollRegId) {
				if (err) {
					qlog.info('Failed while archiving the qoll - ' + qollId + '/' + err, filename);
				} else {
					qlog.info('archived qoll with id: ' + qollRegId + '/' + qollId, filename);
				}
			});
		} else {
			//qlog.info('youclicked to no: ' +qollId, filename);
		}

	},
	'click .store-qollstionnaire' : function(event) {
		var recips = jQuery("input#recipient_search").val();
		var title = jQuery(".qollstionnaire-title").val();
		var tags = jQuery("input#add-tags").val();

		var allqollids = [];
		$('.qoll_selection').each(function() {
			var dolthis = $(this);
			if (dolthis.prop("checked")) {
				allqollids.push(dolthis.attr('id'));
			}

		});
		if ($.trim(recips) === '' || $.trim(title) === '' || allqollids.length == 0) {
			var err_target = jQuery(".qbank-error-msg");
			err_target.html('Select questions, add recipients and title to create qollstionnaire ...');
			err_target.fadeOut(6400, function() {
				err_target.html('');
				err_target.removeAttr("style");
			});
			return;
		}

		var tagArr=[];
		$.each(tags.split(/;|,|\s/),function (ix,tag){
		  tag=$.trim(tag);
		  if(tag.length>0){
		    tagArr.push(tag);
		  }
		});

		qlog.info('tags are - ' + tagArr, filename);
		var target = jQuery(".qbank-error-msg");
		var store_html = target.html();
		target.html("<i class='fa fa-spinner fa-spin toolbar-buttons-link'></i>Saving...");

		var emailsandgroups = [];
		$.each(recips.split(/;|,/), function(ix, email) {
			email = $.trim(email);
			if (email.length > 0) {
				emailsandgroups.push(email);
			}
		});

		var qollstionnaire = {};
		qollstionnaire.emails = emailsandgroups;
		qollstionnaire.title = title.trim();
		qollstionnaire.tags = tagArr;

		qollstionnaire.qollids = allqollids;

		Meteor.call("addQollstionnaire", qollstionnaire, function(err, qollMasterId) {
			if (err) {
				qlog.info('Error occured storing the master qoll. Please try again.' + err, filename);
				target.html("Failed, try again...");
				target.fadeOut(1600, function() {
					target.html(store_html);
				});
				return -1;
			} else {
				qlog.info("Added qoll-master-content with id: " + qollMasterId, filename);
				if ($("#qollsenddate").val() != '') {
					var actdt = new Date($("#qollsenddate").val());
					var hour = parseInt($('.qstion_send_hour').val());
					var min = parseInt($('.qstion_send_min').val());
					if ($('.qstion_send_ampm').val() == 'PM' && hour<12) {
						hour = hour + 12;
					}
				  if ($('.qstion_send_ampm').val() == 'AM' && hour==12) {
						hour = hour - 12;
					}

					actdt.setHours(hour,min);
					

					Meteor.call("addTimerAction", qollMasterId, actdt, 'send');
					qlog.info("Selected start or end date: " + $("#qollenddate").val() + $("#qollsenddate").val(), filename);

				}
				if ($("#qollenddate").val() != '') {
					var actdt = new Date($("#qollenddate").val());
					var hour = parseInt($('.qstion_end_hour').val());
					var min = parseInt($('.qstion_end_min').val());
					if ($('.qstion_end_ampm').val() == 'PM' && hour<12) {
						hour = hour + 12;
					}
				  if ($('.qstion_end_ampm').val() == 'AM' && hour==12) {
						hour = hour - 12;
					}

					actdt.setHours(hour,min);
					

					Meteor.call("addTimerAction", qollMasterId, actdt, 'lock');
					qlog.info("Selected start or end date: " + $("#qollenddate").val() + $("#qollsenddate").val(), filename);
					
				}
				target.html("Qoll Saved...");
				jQuery(".qollstionnaire-title").val('');
				$('.qoll_selection').prop("checked", false);
				$('.qoll_selectall').prop("checked", false);
		
				jQuery("input#recipient_search").val('');
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

	},
	'click .qoll_selection' : function(event) {
		//event.preventDefault();
		var qollId = this._id;
		var isChecked = $("input[id='"+qollId+"']").prop('checked');
		var cnt = Number($("span[id='cnt']").html());
		qlog.info('Printing whether the checkbox is selected ' + isChecked, filename);
		if(isChecked) {//If this is already selected, we are adding a new qoll
			var tex = this.tex;
			var fib = this.fib;
			var cat = this.cat;
			var context = QollConstants.CONTEXT.READ;
			var texMode = this.texMode;

			var qollText = this.qollText;
			var qollTitle = this.qollTitle;
			var qollTypesX = this.qollTypesX;
			var hint = this.hint;

			qlog.info('=========>xxxxxxxxxxxxxx ' + fib + '/' + cat + '/' + context + '/' + hint, filename);

			var html = QollClientSide.previewQollHtml([{qollId : qollId, qollTitle : qollTitle, qollText : qollText, types : qollTypesX,
														tex : tex, fib : fib, cat : cat, context : context, texMode : texMode, hint : hint }]);
			//qlog.info('The html is: ' + html, filename);
			//qlog.info('Printed the qoll-selection checkbox - ' + qollId + '/' + qollText + '/' + qollTypesX, filename);
			qlog.info('adding this qoll - ' + qollId, filename);
			$('div#content1').append(html);
			
			//Set the appropriate count in the header here
			cnt++;
			$("span[id='cnt']").html(cnt);

			if(cnt > 0) {
				// make the create new questionnaire visible
				qlog.info('Making the add button visible at this point - ' + cnt, filename);
				// $('.form-scroll-info').attr('display', 'block');
				$(".form-scroll-info").show();
			}
		} else {//If this is not already selected, we are removing the existing qoll
			var target = $("span[id='"+qollId+"_outer']");
		    qlog.info('removing this qoll - ' + qollId, filename);
		    $("input[id='"+qollId+"']").prop('checked', false);;
		    target.remove();
		    
		    //Set the appropriate count in the header here
			cnt--;
			$("span[id='cnt']").html(cnt);

			if(cnt == 0) {
				// make the create new questionnaire invisible at this point
				qlog.info('Making the add button in-visible at this point - ' + cnt, filename);
				// $('.form-scroll-info').attr('display', 'none');
				$(".form-scroll-info").hide();
			}
		}
	},
	'click .edit-qoll-btn' : function(event) {
		event.preventDefault();
		console.log(this);
		var qollId = this._id;//this.q._id;
		var qollRawId = this.qollRawId;//this.q.qollRawId;
		qlog.info('RAW %%%% qoll for: ' + qollRawId);
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
	'click .facebook' : function(event) {
		event.preventDefault();
		var qollId = this._id;
		qlog.info('Posting the qoll to facebook ... ' + qollId, filename);

		Meteor.call('postOnWall', qollId, function(err, data) {
			if (err) {
				qlog.info('Failed posting on the wall - ' + qollId + '/' + err, filename);
			} else {
				qlog.info('Posting on the wall - ' + qollId + ', message - ' + data, filename);
				console.log(data);
				alert('Posted the qoll on facebook wall');
			}
		});
	},/*
	'click .sendemail' : function(event) {
		event.preventDefault();
		var qollId = this._id;
		qlog.info('Sending this qoll to email recipients ...' + qollId, filename);
		
		Meteor.call('sendQollMail', 'kaushik.anoop@gmail.com', qollId, function(err, data) {
			if (err) {
				qlog.info('Failed sending the email - ' + qollId + '/' + err, filename);
			} else {
				qlog.info('Sent the email - ' + qollId + ', message - ' + data, filename);
			}
		});
	},*/
});
