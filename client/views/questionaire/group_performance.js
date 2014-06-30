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
		return GroupStats.find(group_name);
	},
	qoll_class : function(){
		if(this.is_parent) return 'blue_bg_6';
		else return '';
	},
	get_display : function(field_name) {
		//qlog.info('Printing the qoll - ' + JSON.stringify(this), filename);
		if(this.is_parent) {
			if(_.contains(qollst_display_fields, field_name))
				return this[field_name];
			else return '';
		} else {
			if(_.contains(qoll_display_fields, field_name)) {
				if(field_name === 'correct_answers') {
					var answer = this.star_attributes? this.star_attributes.answer : '--';
					//if(!answer || answer == undefined) answer = '--';
					if(answer == undefined) return '--';

					if(this.qoll_type === QollConstants.QOLL_TYPE.BLANK) {
						return this.star_attributes.answer.blankResponse;
					} else if(this.qoll_type === QollConstants.QOLL_TYPE.BLANK_DBL){
						var ans = '$$';
						if(answer.blankResponse) ans += answer.blankResponse;

						if(answer.exponentBase) ans += '\\times '+ answer.exponentBase;
						else ans += '\\times 10';

						if(answer.power) ans += '^' + answer.power;
						else ans += '^' + 0;

						if(answer.unitSelected) ans += answer.unitSelected;

						ans += '$$';

						return ans;
					}
				} else if(field_name === 'answers') {
					var answer = this.answers[0];
					if(!answer || answer == undefined) answer = '--';
					if(answer === '--') return answer;

					if(this.qoll_type === QollConstants.QOLL_TYPE.BLANK) {
						qlog.info('Printing the asnwer - ' + JSON.stringify(answer), filename);
						return answer.blankResponse;
					} else if(this.qoll_type === QollConstants.QOLL_TYPE.BLANK_DBL){
						qlog.info('Printing the asnwer - ' + JSON.stringify(answer), filename);
						var ans = '$$';
						if(answer.blankResponse) ans += answer.blankResponse;

						if(answer.exponentBase) ans += '\\times '+ answer.exponentBase;
						else ans += '\\times 10';

						if(answer.power) ans += '^' + answer.power;
						else ans += '^' + 0;

						if(answer.unitSelected) ans += answer.unitSelected;

						ans += '$$';

						return ans;
					}
				} 
				return this[field_name];
			}
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