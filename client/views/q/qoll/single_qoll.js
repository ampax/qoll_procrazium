var filename = "client/views/q/qoll/single_qoll.js";

Template.single_qoll.helpers({
	get_totals : function() {
		if (Session.get('info_pref') == 'full' || Session.get('info_pref') == 'less') {
			return this['totals'];
		}
	},
	if_createusr : function() {
	  if (this.q.viewContext == 'createUsr') {
			Session.set('hasCreated', true);
		}
		if(this.btns){
			return this.btns.edit;
		}
		return (this.q.viewContext == 'createUsr');
	},
	if_stored : function() {
		return (this.q.action == 'store');
	},
	if_send : function() {
		return (this.q.action == 'send');
	},
	if_lock : function() {
		return (this.q.action == 'lock');
	},
	if_edit : function() {
		return this.q.enableEdit;
	},
	get_title : function(qollStarAttributes) {
		return qollStarAttributes && qollStarAttributes[QollConstants.EDU.TITLE] ? qollStarAttributes[QollConstants.EDU.TITLE] : '';
	},
	is_unit_selected : function(unit_selected) {
		return this.toString() === unit_selected ? 'checked' : '';
	},
	get_units_html : function(q) {
		var unit_name = undefined, units = undefined;
		qlog.info('Printing unit values - ' + unit_name, + ' **/** ' + units, filename);
		console.log(q);
		if (units == undefined || units && units.length === 0)
			return '';

		var qollTypeVal = this.qollTypeVal;
		var unitSelected = qollTypeVal ? qollTypeVal.unitSelected : '';

		var units_html = '<div class="input-group">';
		if (unit_name)
			units_html += unit_name + ': ';
		else
			unit_name += 'Unit: ';
		units.map(function(unit) {
			var checked = '';
			if (unit === unitSelected)
				checked = 'checked';
			units_html += '<input name="unit" value="' + unit + '" type="radio" ' + checked + '>' + unit + '&nbsp;&nbsp;';
		});
		units_html += '</div>';

		return units_html;
	},
	get_hint_visibility : function(usedHint, context, hint) {
		if(usedHint) {
			return '';
		} else {
			return 'is-invisible';
		}
	},
	get_qoll_txt : function(qollText, qollAttributes) {
		//Handle the blank type of questions here
		if(HashUtil.checkHash(qollAttributes, 'type') && QollConstants.QOLL_TYPE.BLANK === qollAttributes.type) {
			var fillVal, fillPow;
			qollText = qollText.replace(/\?\=/g, getFillInTheBlanksSimpleHtml(fillVal, fillPow))
		}

		return qollText;
	},
	transform_txt : function(txt, cat, context, fib, tex, tex_mode, qoll_idx) {
		// txt_0 = txt.replace(/(?:\r\n|\r|\n)/g, '<br />');
		var txt_0 = txt.replace(/\n|\r\n|\r/g, '<br />');
		
		//method defined in preview.js
		var txt_1 = transform_fib(txt_0, cat, context, fib);

		//method defined in preview.js
	    var txt_2 = transform_tex(txt_1, tex, tex_mode, qoll_idx);

	    // txt_2 = txt_2 + "\\({a1x^3+z=0}\\)";

	    return txt_2;
	},
	transform_txt1 : function(txt, cat, context, fib) {
		qlog.info('Printing fill in the blanks - ' + fib, filename);
		if(cat != QollConstants.QOLL_TYPE.BLANK)
			return txt;

		var disabled = '';
		if(context === QollConstants.CONTEXT.READ)
			disabled = 'DISABLED';

		if(txt.match(QollRegEx.fib_transf))
			qlog.info('hell this is printed', filename);

		while (matches = QollRegEx.fib_transf.exec(txt)) {
			//qlog.info('matches - ' + matches, filename);
			var idx = matches[0].substring(1, matches[0].length-1);
			idx = Number(idx)+1;

            var placeholder = '';
            var fib_val = '';
            if(context === QollConstants.CONTEXT.READ) {
            	//put the read only values for fib
            	placeholder = idx + ':' + fib[idx-1];
            } else {
            	if(fib == undefined)
            		fib_val = '';
            	else fib_val = fib[idx-1] == undefined ? '' : fib[idx-1];
            	placeholder ='';
            }
            
            txt = txt.replace(matches[0], '<input class="textbox fib fib_write" type="text" placeholder="'+placeholder+ '" ' +disabled+' value="'+fib_val+'">');
        }

		return txt;
	},
	is_blank_type : function(cat) {
		return _.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], cat);
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
    imgs: function(img_ids) {
    	console.log(img_ids);
    	if(!img_ids) return [];
	    var imgs1 = QollImages.find({'_id': {$in: img_ids}});
	    return imgs1;
  	},
});

Template.single_qoll.onCreated(function(){
    this.subscribe('images');
}); 

//<input class="textbox"type="text">      http://html-generator.weebly.com/css-textbox-style.html

