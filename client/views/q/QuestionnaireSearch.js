var filename='client/views/q/QuestionnaireSearch.js';

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['title', 'tags'];

QuestionnaireSearch = new SearchSource('questionnaire_searches', fields, options);