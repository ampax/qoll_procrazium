var filename = "client/views/qoll/all_qolls.js";

Template.all_qolls.rendered = function() {
	Session.set('disable_sendtoQbank', true);
	$('.hasDatepicker').datepicker();

	/**qlog.info("jdjdjdjdjdjdjdjdjdjdjdjddjdjdjdj", filename);

	$("div.tex").each(function() {
	  qlog.info("jdjdjdjdjdjdjdjdjdjdjdjddjdjdjdj ---->" + ": " + $( this ).text() );
	  katex.render($( this ).innerHTML, $( this )); 
	});

	$("span.title-qoll").each(function( index ) {
	  qlog.info("jdjdjdjdjdjdjdjdjdjdjdjddjdjdjdj ---->"+ index + ": " + $( this ).text() );
	});

	Array.prototype.forEach.call(
		document.getElementsByTagName("tex"),
		function(el) {
			try {
				qlog.info('Priniting the internal - ' + el.innerHTML, filename);
				katex.render(el.innerHTML, el); 
			} catch (e) { console.log('error happened ---- '+e); }
		}
	);**/

};
$.fn.toggleCheckbox = function() {
	this.attr('checked', !this.attr('checked'));
};
Template.all_qolls.events({
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
			var qollText = this.qollText;
			var qollTitle = this.qollTitle;
			var qollTypesX = this.qollTypesX;
			var html = QollClientSide.previewQollHtml([{qollId : qollId, qollTitle : qollTitle, qollText : qollText, types : qollTypesX}]);
			//qlog.info('The html is: ' + html, filename);
			//qlog.info('Printed the qoll-selection checkbox - ' + qollId + '/' + qollText + '/' + qollTypesX, filename);
			qlog.info('adding this qoll - ' + qollId, filename);
			$('div#content1').append(html);
			
			//Set the appropriate count in the header here
			cnt++;
			$("span[id='cnt']").html(cnt);
		} else {//If this is not already selected, we are removing the existing qoll
			var target = $("span[id='"+qollId+"_outer']");
		    qlog.info('removing this qoll - ' + qollId, filename);
		    $("input[id='"+qollId+"']").prop('checked', false);;
		    target.remove();
		    
		    //Set the appropriate count in the header here
			cnt--;
			$("span[id='cnt']").html(cnt);
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
});
