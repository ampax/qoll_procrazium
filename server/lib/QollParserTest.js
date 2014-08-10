QollParserTest = {
	parseHtml : function(qollMaster) {

		/**QollParserTest.isNumTest();
		QollParserTest.isTxtTest();
		QollParserTest.isQollTest();
		QollParserTest.isHintTest();
		QollParserTest.isNoteTest();
		QollParserTest.isFibTest();
		QollParserTest.isOptTest();
		QollParserTest.parseQollTest();
		QollParserTest.parseHintTest();
		QollParserTest.parseNoteTest();
		QollParserTest.parseFibTest();
		QollParserTest.parseOptTest();**/
		QollParserTest.parseQollMasterTest(qollMaster);
	},
	isNumTest : function(){
		var tst = '1234.698';
		var m = QollRegEx.isNum(tst);
		if(m) {
			qlog.info('SUCCESS the text is a number ... **' + m + '**', filename);
		} else {
			qlog.info('FAILURE The text is not a number ... **' + m + '**', filename);
		}
	},
	isTxtTest : function(){
		var tst = '12abcalskj34.69e8';
		var m = QollRegEx.isTxt(tst);
		if(m) { 
			qlog.info('SUCCESS the text is a string literal sequence ... **' + m + '**', filename);
		} else {
			qlog.info('FAILURE The text is not a number ... **' + m + '**', filename);
		}
	},
	isQollTest : function(){
		var qoll = ['# This is a qoll text','#    This is qoll text two', '#This is qoll text three'];
		qoll.map(function(q){
			var m = QollRegEx.isQoll(q);
			if(m) {
				qlog.info('SUCCESS is-qoll: **' + m + '**', filename);
			} else {
				qlog.info('FAILURE is-qoll: **' + m + '**', filename);
			}
		});
	},
	isHintTest : function(){
		var hint = ['hint: This is a hint', 'hint- this is another hint', 'Hint:=  Will this hint be captured', '  hint:-- This is last hint'];
		hint.map(function(h){
			var m = QollRegEx.isHint(h);
			if(m) {
				qlog.info('SUCCESS is-hint: **' + m + '**', filename);
			} else {
				qlog.info('FAILURE is-hint: **' + m + '**', filename);
			}
		});
	},
	isNoteTest : function(){
		var note = ['note: this is note one', 'note:- This is note two', 'Note= this is note three', '  note is this a note'];
		note.map(function(n){
			var m = QollRegEx.isNote(n);
			if(m) {
				qlog.info('SUCCESS is-note: **' + m + '**', filename);
			} else {
				qlog.info('FAILURE is-note: **' + m + '**', filename);
			}
		});
	},
	isFibTest : function(){
		var fib = ['This is a simple _fib_ text'];
		fib.map(function(f){
			var m = QollRegEx.isFib(f);
			if(m) {
				qlog.info('SUCCESS is-fib: **' + m + '**', filename);
			} else {
				qlog.info('FAILURE is-fib: **' + m + '**', filename);
			}
		});
	},
	isOptTest : function(){
		var opt = ['- This is an option', '-a This option is the correct answer', '-A this option is also correct', 'Aa wrong answer'];
		opt.map(function(o){
			var m = QollRegEx.isOpt(o);
			if(m) {
				qlog.info('SUCCESS is-opt: **' + m + '**', filename);
			} else {
				qlog.info('FAILURE is-opt: **' + m + '**', filename);
			}
		});
	},
	parseQollTest : function() {
		var qoll = ['# This is a qoll text','#    This is qoll text two', '#This is qoll text three'];
		qoll.map(function(q){
			var m = QollRegEx.parseQollTxt(q);
			if(m) {
				qlog.info('SUCCESS parse-qoll: ' + m[1], filename);
			} else {
				qlog.info('FAILURE parse-qoll: $$' + m + '$$', filename);
			}
		});
	},
	parseQollMasterTest : function(qollMaster) {
		//var qoll = '# This is a qoll text' + '#    This is qoll text two' + '#This is qoll text three';
		var qolls = qollMaster.split(/\#\s/gm);
		//var m = QollRegEx.parseQollMaster(qollMaster);
		//qlog.info('SUCCESS/FAILURE ------->' + qolls.join('---$$---'), filename);
		qolls.map(function(q){
			q = '#  ' + q;
			qlog.info('Parsing qoll for master -> ' + q, filename);
			var m = QollRegEx.parseOptTxt(q);
			if(m) {
				qlog.info('SUCCESS parse-qollMaster: ' + m.join(' ..... '), filename);
			} else {
				qlog.info('FAILURE parse-qollMaster: $$' + m + '$$', filename);
			}
		});
	},
	parseHintTest : function(){
		var hint = ['hint: This is a hint', 'hint- this is another hint', 'Hint:=  Will this hint be captured', '  hint:-- This is last hint'];
		hint.map(function(h){
			var m = QollRegEx.parseHintTxt(h);
			if(m) {
				qlog.info('SUCCESS parse-hint: ' + m[1], filename);
			} else {
				qlog.info('FAILURE parse-hint: **' + m + '**', filename);
			}
		});
	},
	parseNoteTest : function(){
		var note = ['note: this is note one', 'note:- This is note two', 'Note= this is note three', '  note is this a note'];
		note.map(function(n){
			var m = QollRegEx.parseNoteTxt(n);
			if(m) {
				qlog.info('SUCCESS parse-note: ' + m[1], filename);
			} else {
				qlog.info('FAILURE parse-note: **' + m + '**', filename);
			}
		});
	},
	parseFibTest : function(){
		var fib = ['This is a simple _fill in the blank value_ text'];
		fib.map(function(f){
			var m = QollRegEx.parseFibTxt(f);
			if(m) {
				qlog.info('SUCCESS parse-fib: ' + m[1], filename);
			} else {
				qlog.info('FAILURE parse-fib: **' + m + '**', filename);
			}
		});
	},
	parseOptTest : function(){
		var opt = ['- This is an option', '-a This option is the correct answer', '-A this option is also correct', 'Aa wrong answer'];
		opt.map(function(o){
			var m = QollRegEx.parseOptTxt(o);
			if(m) {
				qlog.info('SUCCESS parse-opt: ' + m[1], filename);
			} else {
				qlog.info('FAILURE parse-opt: **' + m + '**', filename);
			}
		});
	},
};