var filename = 'client/questioaire/group_performance.js';

//{"name":"Priyanka Sharma","email":"abc1@gmail.com",
//"qollst":"Blackrock qollstionnaire",
//"qoll_snip":"The SO    ion is called a sulfate ion.",
//"qoll":"The SO    ion is called a sulfate ion.","is_multiple":false,
//"correct_answers":["\-\-\-"],"answers":["\-\-\-"],"is_parent":false}

var qollst_display_fields = ['name', 'email', 'qollst'];
var qoll_display_fields = ['qoll_snip', 'answers', 'correct_answers'];

Template.group_performance.helpers({
	group_stats1 : function(group_name) {
		qlog.info('<================ Getting stats for: ' + group_name + ' ====================>');
		return GroupStats.find(group_name);
	},
	qoll_class : function(){
		if(this.is_parent) return 'blue_bg_6';
		else return '';
	},
	get_display : function(field_name) {
		if(this.is_parent) {
			if(_.contains(qollst_display_fields, field_name))
				return this[field_name];
			else return '';
		} else {
			if(_.contains(qoll_display_fields, field_name))
				return this[field_name];
			else return '';
		}
			return field_name;
	},
	did_pass_or_fail : function() {
		if(this.is_parent) return '';
		else if(this.did_pass) return "<span class='glyphicon glyphicon-thumbs-up green'/>";
		else return "<span class='glyphicon glyphicon-thumbs-down red'/>";
	}
});

/**
Template.group_performance.rendered = function() {
	qlog.info('Group performance has been rendered.', filename);
	$('#groupStatistics').dataTable();
}
**/