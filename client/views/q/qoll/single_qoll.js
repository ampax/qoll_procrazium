var filename = "client/views/q/qoll/single_qoll.js";

Template.single_qoll.helpers({
	get_totals : function() {
		if (Session.get('info_pref') == 'full' || Session.get('info_pref') == 'less') {
			return this['totals'];
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
	get_title : function(qollStarAttributes) {
		return qollStarAttributes && qollStarAttributes[QollConstants.EDU.TITLE] ? qollStarAttributes[QollConstants.EDU.TITLE] : '';
	},
	get_units_html : function(qollStarAttributes) {
		var unit_name = qollStarAttributes ? qollStarAttributes[QollConstants.EDU.UNIT_NAME] : undefined, 
		units = qollStarAttributes ? qollStarAttributes[QollConstants.EDU.UNITS] : undefined;

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
	get_hint_html : function(qollStarAttributes) {
		var hint = qollStarAttributes ? qollStarAttributes[QollConstants.EDU.HINT] : undefined;

		if (hint == undefined)
			return '';

		var hint_html = '<button type="button" class="btn btn-warning pull-right" data-toggle="tooltip" data-placement="left" title="Partial credit will be deducted..." id="show_hint">' + 'Hint' + '</button><div class="is-invisible red_1" id="hint">xyz</div>';

		return hint_html;
	},
	get_qoll_txt : function(qollText, qollAttributes) {
		//Handle the blank type of questions here
		if(HashUtil.checkHash(qollAttributes, 'type') && QollConstants.QOLL_TYPE.BLANK === qollAttributes.type) {
			var fillVal, fillPow;
			qollText = qollText.replace(/\?\=/g, getFillInTheBlanksSimpleHtml(fillVal, fillPow))
		}

		return qollText;
	}	
});
