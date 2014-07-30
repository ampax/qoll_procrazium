var filename="server/lib/ToMarkdown.js";

ToMarkdown = {};

ToMarkdown.convert = function(html){
	var md = Meteor.require('html-md');
	var val = md(html);
	qlog.info('Converted html to md : => ' + val, filename);
	return val;
};

Meteor.methods({
    toMarkdown : function(html) {
        return ToMarkdown.convert(html);
    },
});