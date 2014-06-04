var filename = "client/views/qoll/qbank.js";

Template.qollbank.rendered = function() {
	Session.set('disable_sendtoQbank', true);

};
$.fn.toggleCheckbox = function() {
	this.attr('checked', !this.attr('checked'));
};
Template.qollbank.events({
	'click .qoll_selectall' : function(event) {
		var my_checked = $('.qoll_selectall').prop("checked");
		var checkBoxes = $('.qoll_selection');
		checkBoxes.prop("checked", my_checked);

	},
	'click .store-qollstionnaire' : function(event) {
		var recips = jQuery("input#recipient_search").val();
		var title = jQuery(".qollstionnaire-title").val();
		var tags = jQuery("input#add-tags").val();
		
		var allqollids =[];
		$('.qoll_selection').each(function(){
			var dolthis = $(this);
			if(dolthis.prop("checked")){
				allqollids.push(dolthis.attr('id'));
			}
  		
		});
		if ($.trim(recips) === '' || $.trim(title) === ''|| allqollids.length==0) {
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

		var qollstionnaire ={};
		qollstionnaire.emails =emailsandgroups;
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
});
