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
	tex_1		: /begin\s*(.+)\s*end/g, // beginx = {-b \pm \sqrt{b^2-4ac} * 2a}end
	tex_transf	: /\{TEX:\d{1,2}\}/,
	tex_transfg	: /\{TEX:\d{1,2}\}/g,
	num 		: /^[\d.,]+$/,
	txt			: /^\s*([Tt]ext|[Tt]xt)\s*[:=-]*\s+/, ///^[\w\s.,:;"'=-_\\\(\)\[\]\{\}\^&#!@$*<>]+$/,
	qoll 		: /^\s*#\s*/,
	answer 		: /^\s*([Aa]nswer|[Aa]ns|\(a\))\s*[:=-]*\s+/,
	abb_ans_spl	: /[\,{0,1}\s]*/,
	abb_ans		: /^([A-Za-z\d]{1}\,{0,1}\s*)*/g, // /^[A-Za-z\d]{1}$/i,
	abb_ans_alpha		: /^([A-Za-z]{1}\,{0,1}\s*)*/g,
	abb_ans_numer		: /^(\d{1}\,{0,1}\s*)*/g,
	abb_ans_noend	: /^([A-Za-z\d]{1}\,)*[A-Za-z\d]{1}$/g,
	//qollTxt 	: /^[#\s]+(.*)/gm,
	hint 		: /^\s*([Hh]int\s*)[:=-]*\s+/,
	imgs 		: /^\s*(Images\s*)[:=-]*\s+/,
	//hintTxt 	: /^[\s]*[Hh]int[:=-\s]*(.*)/,
	note 		: /^\s*([Nn]ote\s*)[:=-]*\s*/,
	unit 		: /^\s*([Uu]nit[s]*\s*)[:=-]*\s+/,
	//noteTxt 	: /^[\s]*[Nn]ote[:=-\s]*(.*)/,
	fib_replace : /_([A-Za-z,0-9\{\}\(\)\[\]\s\?=\.\^\&\*\-\!\%$#+<>~`|:;,'"]*)_/, //replace it one by one
	fib 		: /_([A-Za-z,0-9\{\}\(\)\[\]\s\?=\.\^\&\*\-\!\%$#+<>~`|:;,'"]*)_/g,
	fib_transf	: /\{\d{1,2}\}/,
	//fibTxt 		: /\\_(.+)\\_/,
	opt 		: /^-[?=Aa]{0,1}[\s]*/,
	gen_opt 	: /^([-]{1}|\([A-za-z\d]{1}\)|[A-Za-z\d]{1,2}[\.]+[|\s]+)(.+)/gm,
	//optTxt 		: /^-[?=Aa]{0,1}[\s]*(.+)/,
	qollMaster 	: /^#\s(.*)/m,
	isNum		: function(text){return text.match(QollRegEx.num);},
	isTxt		: function(text){return text.match(QollRegEx.txt);},
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