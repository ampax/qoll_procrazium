var filename='client/views/edu/edu_dashboard_qoll.js';

Template.edu_dashboard_qoll.events({

	'click div.dropdown' : function() {

	},
	'click button.qoll_annot_color_1' :function(event) {
		event.preventDefault();
		qlog.info('qoll_annot_color_1 clicked ', filename);
		$('.qoll_annot_color_selected').removeClass('qoll_annot_color_selected');
		Session.set('qoll_annot_color', 'qoll_annot_color_1');
	},
	'click button.qoll_annot_color_2' :function(event) {
		event.preventDefault();
		qlog.info('qoll_annot_color_2 clicked ', filename);
		$('.qoll_annot_color_selected').removeClass('qoll_annot_color_selected');
		Session.set('qoll_annot_color', 'qoll_annot_color_2');
	},
	'click button.qoll_annot_color_3' :function(event) {
		event.preventDefault();
		qlog.info('qoll_annot_color_3 clicked ', filename);
		$('.qoll_annot_color_selected').removeClass('qoll_annot_color_selected');
		Session.set('qoll_annot_color', 'qoll_annot_color_3');
	},
	'click button.qoll_annot_color_4' :function(event) {
		event.preventDefault();
		qlog.info('qoll_annot_color_4 clicked ', filename);
		$('.qoll_annot_color_selected').removeClass('qoll_annot_color_selected');
		Session.set('qoll_annot_color', 'qoll_annot_color_4');
	},
	'click button#rr' : function(event) {
		event.preventDefault();
		var qoll_id = this._id;
		qlog.info('clicked requires review ... let us submit this to the qoll ' + qoll_id, filename);
		
		Meteor.call('insertQollAnnotations', qoll_id, 
			{ annotation : 'Requires Review',  annotation_class : 'qoll_annot_color_1'}, function(err, res){
			if(err) {
				qlog.error('Error happened while adding the annotation to the qoll ... ' + qoll_id, filename);
				qlog.error(err, filename);
			} else {
				//TODO
			}
		});
	},
	'click button#inc' : function(event) {
		event.preventDefault();
		var qoll_id = this._id;
		qlog.info('clicked incorrect ... let us submit this to the qoll ' + qoll_id, filename);

		Meteor.call('insertQollAnnotations', qoll_id, 
			{ annotation : 'Incorrect',  annotation_class : 'qoll_annot_color_2'}, function(err, res){
			if(err) {
				qlog.error('Error happened while adding the annotation to the qoll ... ' + qoll_id, filename);
				qlog.error(err, filename);
			} else {
				//TODO
			}
		});
	},
	'click button#nda' : function(event) {
		event.preventDefault();
		var qoll_id = this._id;
		qlog.info('clicked need dev attention ... let us submit this to the qoll', filename);

		Meteor.call('insertQollAnnotations', qoll_id, 
			{ annotation : 'Needs Dev Attn',  annotation_class : 'qoll_annot_color_3'}, function(err, res){
			if(err) {
				qlog.error('Error happened while adding the annotation to the qoll ... ' + qoll_id, filename);
				qlog.error(err, filename);
			} else {
				//TODO
			}
		});
	},
	'click button#nkofq' : function(event) {
		event.preventDefault();
		var qoll_id = this._id;
		qlog.info('clicked new kind of qoll ... let us submit this to the qoll', filename);

		Meteor.call('insertQollAnnotations', qoll_id, 
			{ annotation : 'New kind of Qoll',  annotation_class : 'qoll_annot_color_4'}, function(err, res){
			if(err) {
				qlog.error('Error happened while adding the annotation to the qoll ... ' + qoll_id, filename);
				qlog.error(err, filename);
			} else {
				//TODO
			}
		});
	},
	'keypress input#qoll_custom_annot': function (evt, template) {
		qlog.info('...xcxcxcxcxcxcxcxcxcxcxcxcxcxcxcx...', filename);
		var qoll_id = this._id;
	    
	    if (evt.which === 13) {
	      var cust_val = template.find("input#qoll_custom_annot").value;
	      var qoll_annot_color = Session.get('qoll_annot_color')? Session.get('qoll_annot_color') : 'qoll_annot_color_1';

	      if(cust_val && cust_val.trim() != '')
	      Meteor.call('insertQollAnnotations', qoll_id, 
				{ annotation : cust_val,  annotation_class : qoll_annot_color}, function(err, res){
				if(err) {
					qlog.error('Error happened while adding the annotation to the qoll ... ' + qoll_id, filename);
					qlog.error(err, filename);
				} else {
					//TODO
				}
			});
	    }
	  }
});

Template.edu_dashboard_qoll_menu.helpers({
	topic_prev_parent_id : function() {
		qlog.info('topic_parent_id ==> ' + Router.current().params._id + '/' + this.previous_page_parent_id, filename);
		return this.previous_page_parent_id;
	},
	topic_created_on : function(createdOn) {
		return moment(createdOn).format('MMM Do YYYY, h:mm a');
	},
	banner_img_for_id: function(img_id) {
		qlog.info('Finding topic banner for id ---> ' + img_id, filename);
		var imgs1 = QollImages.find({'_id': img_id});
		return imgs1;
	},

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
		//qlog.info('+-+-+-+-+-+-+--====> '+txt +'/'+ cat +'/'+ context +'/'+ fib +'/'+ tex +'/'+ tex_mode +'/'+ qoll_idx, filename);
		//method defined in preview.js
		var txt_1 = transform_fib(txt, cat, context, fib);

		//method defined in preview.js
	    var txt_2 = transform_tex(txt_1, tex, tex_mode, qoll_idx);

	    // txt_2 = txt_2 + "\\({a1x^3+z=0}\\)";

	    return txt_2;
	},
	isOwner : function() {
		return this.viewContext == 'createUsr';
	},
	qoll_annot_color_sel : function(qoll_annot_color) {
		return qoll_annot_color === Session.get('qoll_annot_color') ? 'qoll_annot_color_selected' : '';
	},
	fn_annot_class : function(annot_selected) {
		qlog.info(':::::::::=========================> ' + annot_selected, filename);
		console.log(annot_selected);
		return annot_selected.annotation_class === 'qoll_annot_color_1'? 'annot-button-1'
					:annot_selected.annotation_class === 'qoll_annot_color_2'? 'annot-button-2'
						:annot_selected.annotation_class === 'qoll_annot_color_3'? 'annot-button-3'
							:annot_selected.annotation_class === 'qoll_annot_color_4'? 'annot-button-4'
								:'';
	},
});


Template.edu_dashboard_qoll.onRendered(function() {
	Session.setDefault('qoll_annot_color', 'qoll_annot_color_1');
});

Template.edu_dashboard_qoll_menu.rendered = function(){

};

Template.edu_dashboard_qoll_menu.onCreated(function(){
    this.subscribe('images');
});
