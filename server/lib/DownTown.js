var filename="server/lib/DownTown.js"


downtown = function(data, option, escape_mathjax){
	if(escape_mathjax) {
		data = escape_mathjax(data);
	}

	var marked = Meteor.require('marked');
	var renderer = new marked.Renderer();

	renderer.paragraph = function(text) {
	  return text;
	};


	option.renderer = renderer;
	//qlog.info(marked('I am using __markdown__.'), filename);
	data = marked(data, { renderer: renderer });
	qlog.info('data is: ' + data, filename);
	data = data.replace(/{inline}/g,"&#36;");
	data = data.replace(/{\/inline}/g,"&#36;");
	data = data.replace(/{block}/g,"&#36;&#36;");
	data = data.replace(/{\/block}/g,"&#36;&#36;");
	return data;

};

var escape_mathjax = function(data){
	qlog.info('Escape mathjax markers here', filename);
	data = data.replace("{inline}","$");
	data = data.replace("{/inline}","$");
	data = data.replace("{block}","$$");
	data = data.replace("{/block}","$$");
	return data;//return escaped data
};