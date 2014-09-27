var filename="server/lib/ToMarkdown.js";

ToMarkdown = {};

ToMarkdown.convert = function(html){
	//var md = Meteor.npmRequire('html-md');//to-markdown
	var md = Meteor.npmRequire('to-markdown');
	var val = md.toMarkdown(html);
	qlog.info('Converted html to md : => ' + val, filename);
	return val;
};

Meteor.methods({
    toMarkdown : function(html) {
        return ToMarkdown.convert(html);
    },
});