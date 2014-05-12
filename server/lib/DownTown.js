var filename="server/lib/DownTown.js"

DownTown = {};

DownTown.downtown = function(data, option, escape_mathjax){
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
	//qlog.info('data is: ' + data, filename);
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

Meteor.methods({
    downtown : function(data, option, escape_mathjax) {
        return DownTown.downtown(data, option, escape_mathjax);
    },
    parse_downtown : function(data, option, escape_mathjax) {
    	var parsed_qolls = new Array();
    	var qolls = data.split(/\#\s/);
        qolls = qolls.slice(1);
        qolls.map(function(q){
            var qs = q.split(/\n-/);
            var qoll = qs[0];
            qoll = DownTown.downtown(qoll, DownTownOptions.downtown_default());

            var types = new Array();
            qs.slice(1).map(function(type){
            	var x = {};
            	type = type.trim();
	            if(type.indexOf('(a) ') == 0) {
	                type = type.replace('(a) ', '');
	                type = DownTown.downtown(type, DownTownOptions.downtown_default());
	                x.type = type;
	                x.isCorrect = 1;
	            } else {
	                type = DownTown.downtown(type, DownTownOptions.downtown_default());
	                x.type = type;
	                x.isCorrect = 0;
	            }

	            types.push(x);
            });




            parsed_qolls.push({'qoll':qoll, 'types' : types});
        });
        return parsed_qolls;
    },
});