var filename='server/lib/QollSearch.js';

SearchSource.defineSource('qoll_searches', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};

  // 'title', 'qollText', 'hint', 'tags'
  
  var qls = undefined;
  if(searchText) {
  	qlog.info('Searching for qolls with text - ' + searchText, filename);
    var regExp = buildRegExp(searchText);

    var selector = {$or: [
      {title: regExp},
      {qollText: regExp},
      {hint: regExp},
      {tags: regExp},
    ]};
    
    qls = Qoll.find(selector, options).fetch();
  } else {
    qls = Qoll.find({}, options).fetch();
  }

  var qls_array = new Array();
  if(qls && qls.length > 0) {
  	qls.forEach(function(item){
  		qls_array.push({
				qollTitle 		: item.title,
				qollText 		: item.qollText,
				submittedOn 	: item.submittedOn,
				viewContext 	: "createUsr",
				_id 			: item._id,
				qollRawId 		: item.qollRawId,
				qollTypesX 		: item.qollTypesX,
				cat 			: item.cat,
				fib 			: item.fib,
				tex 			: item.tex,
				texMode			: item.texMode? item.texMode : QollConstants.TEX_MODE.MATHJAX,
				unit_name 		: item.unit_name,
				unit 			: item.unit,
				visibility 		: item.visibility,
				complexity 		: item.complexity,
				imageIds		: item.imageIds,
				isOwner			: item.submittedBy == Meteor.userId(),
				hint 			: item.hint,
				tags 			: item.tags,
				topics 			: item.topics && item.topics != null? item.topics : ["Unassigned"],
			});
  	});
  }

  return qls_array;

});

var buildRegExp = function(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
};