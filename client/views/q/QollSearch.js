var filename='client/views/q/QollSearch.js';

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['title', 'qollText', 'hint', 'tags'];

QollSearch = new SearchSource('qoll_searches', fields, options);