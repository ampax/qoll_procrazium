var filename='server/lib/QuestionnaireSearch.js';

SearchSource.defineSource('questionnaire_searches', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};

  // 'title', 'qollText', 'hint', 'tags'
  
  var qls = undefined;
  if(searchText) {
  	qlog.info('Searching for questionnaire with text - ' + searchText, filename);
    var regExp = buildRegExp(searchText);

    var selector = {$or: [
      {title: regExp},
      {tags: regExp},
    ]};
    
    qls = Qollstionnaire.find(selector, options).fetch();
  } else {
    qls = Qollstionnaire.find({}, options).fetch();
  }

  var qls_array = new Array();
  if(qls && qls.length > 0) {
  	qls.forEach(function(item){

      var length_class = item.qollids.length == 1? 'single' : 'multiple';
      var r = getQuestCompletionRate(item);

      qls_array.push({_id : item._id, 
        title : item.title, 
        tags : item.tags, 
        qoll_count : item.qollids.length, 
        recips_count : item.submittedTo.length, 
        submitted_on : item.submittedOn, 
        closed_on : item.qollstionnaireClosedOn, 
        tags : item.tags, 
        topics  : item.topics && item.topics != null? item.topics : ["Unassigned"],
        length_class : length_class, 
        respo_length : r.respo_length, 
        recip_length : r.recip_length
      });

  	});
  }

  return qls_array;

});

var getQuestCompletionRate = function(item) {
  var r = {};
  var counter = 0;

  QollstionnaireResponses.find({ qollstionnaireid : item._id }).map(function(i){
    counter++;
  });

  r.respo_length = counter;
  r.recip_length = item.submittedTo.length;

  return r;
};

var buildRegExp = function(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
};