var filename='lib/QollRegEx.js';

/**
Test the regular expressions using the following code snippet at jsfiddle.net
link - http://jsfiddle.net/jfriend00/UtF6J/

Code snippet - 
var txt = "This is a complex Qoll with _qoll option 1_, _qoll option 2_, _qoll option 3_, _qoll option 4_";
var re = /_([A-Za-z,0-9\{\}\(\)\[\]\s\?=\.\^\&\*\-\!\%$#+<>~`|:;,'"]*)_/g;
while ((matches = re.exec(txt)) != null) {
    alert(matches[1]);
}

**/

QollRegEx = {
	tex 		: /[\(]([^)]+)[\)]/g, //Parses 2-tex exp from  - \(x = {-b \pm \sqrt{b^2-4ac} \over 2a}\) and \(x = {-b \pm \over 2a}\)
	tex_1		: /begin\s*(.+?)\s*end/gm, // beginx = {-b \pm \sqrt{b^2-4ac} * 2a}end
	tex_transf	: /\{TEX:\d{1,2}\}/,
	tex_transfg	: /\{TEX:\d{1,2}\}/g,
	num 		: /^[\d.,]+$/,
	txt			: /^\s*([Tt]ext|[Tt]xt)\s*[:=-]*\s+/, ///^[\w\s.,:;"'=-_\\\(\)\[\]\{\}\^&#!@$*<>]+$/,
	exp			: /^\s*([Ee]xp|[Ee]xpl|[Ee]xplanation|[Ss]ol|[Ss]olution|[Dd]esc|[Dd]escription|[Dd]etail)\s*[:=-]*\s+/m,
	qoll 		: /^\s*#\s*/,
	answer_r 	: /^\s*([Aa]nswer|[Aa]ns)\s*[:=-]*\s+/m,
	answer 		: /^\s*([Aa]nswer|[Aa]ns)\s*[:=-]*\s+([a-zA-Z0-9]{1}\s+)*/m,
	abb_ans_spl	: /[\,{0,1}\s]*/,
	abb_ans				: /^([A-Za-z\d]{1}\,{0,1}\s*)*/g, // /^[A-Za-z\d]{1}$/i,
	abb_ans_alpha		: /^([A-Za-z\d]{1}\,{0,1}\s*)*/g,
	abb_ans_numer		: /^(\d{1}\,{0,1}\s*)*/g,
	abb_ans_noend	: /^([A-Za-z\d]{1}\,)*[A-Za-z\d]{1}$/g,
	//qollTxt 	: /^[#\s]+(.*)/gm,
	hint 		: /^\s*([Hh]int\s*)[:=-]*\s+/,
	imgs 		: /^\s*(Images\s*)[:=-]*\s+/,
	//hintTxt 	: /^[\s]*[Hh]int[:=-\s]*(.*)/,
	note 		: /^\s*([Nn]ote\s*)[:=-]*\s*/,
	unit 		: /^\s*([Uu]nit[s]*\s*)[:=-]*\s+/,
	//noteTxt 	: /^[\s]*[Nn]ote[:=-\s]*(.*)/,
	// tex_1		: /begin\s*(.+?)\s*end/gm, // beginx = {-b \pm \sqrt{b^2-4ac} * 2a}end
	fib_replace : /_\s*(.+?)\s*_/g, //replace it one by one
	fib 		: /_\s*(.+?)\s*_/gm,
	fib_transf	: /\{\d{1,2}\}/,
	//fibTxt 		: /\\_(.+)\\_/,
	opt_fb 		: /^\s*feedback\s*(.*\n?)*/m,
	opt_fb_r 	: /^\s*feedback\s*/m,
	opt 		: /^-[?=Aa]{0,1}[\s]*/,
	gen_opt 	: /^-[A-Za-z0-9]{1}\s+(.+)/gm,
	gen_opt_1 	: /^([-]{1}|\([A-za-z\d]{1}\)|[A-Za-z\d]{1,2}[\.]+[|\s]+)(.+)/gm,
	//optTxt 		: /^-[?=Aa]{0,1}[\s]*(.+)/,
	qollMaster 	: /^#\s(.*)/m,
	groupForAuthor	: /(.*)\s*\(\s*Author:\s*(.*)\,\s*ID: (.*)\s*\)\s*/i, // (.*)\s*\(\s*Author:\s*(.*)\s*\)\s*
	groupNameNdDesc : /(.*)\((.*)\,\s*ID:\s*(.*)\)/, //(.*)\((.*)\)
	isNum		: function(text){return text.match(QollRegEx.num);},
	isTxt		: function(text){return text.match(QollRegEx.txt);},
	isExp		: function(text){return text.match(QollRegEx.exp);},
	isQoll		: function(text){return text.match(QollRegEx.qoll);},
	isHint		: function(text){return text.match(QollRegEx.hint);},
	isImgs		: function(text){return text.match(QollRegEx.imgs);},
	isNote		: function(text){return text.match(QollRegEx.note);},
	isFib		: function(text){return text.match(QollRegEx.fib);},
	isOpt		: function(text){return text.match(QollRegEx.opt);},
	parseQollTxt	: function(text) {return text.split(QollRegEx.qollTxt);},
	parseHintTxt	: function(text) {return text.match(QollRegEx.hintTxt);},
	parseImgsTxt	: function(text) {return text.match(QollRegEx.imgsTxt);},
	parseNoteTxt	: function(text) {return text.match(QollRegEx.noteTxt);},
	parseFibTxt		: function(text) {return text.match(QollRegEx.fibTxt);},
	parseOptTxt		: function(text) {return text.match(QollRegEx.optTxt);},
	parseQollMaster	: function(text) {return text.match(QollRegEx.qollMaster);},
};