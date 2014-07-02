var filename="client/lib/QollAutoComplete.js";
QollAutoComplete = {};

QollAutoComplete.enableLogging = false;

var log = function (level, message) {
  if (QollAutoComplete.enableLogging)
    console.log('QollAutoComplete - ' + level + ' - ' + message);
}

var logObj = function (obj) {
  if (QollAutoComplete.enableLogging)
    console.dir(obj);
}

/**
 * Initialize element with jQueryUI autocomplete
 * @param element
 */
QollAutoComplete.init = function (element) {
  $(element).autocomplete({ source: []});
  log('INFO', 'Initalized element(s) identified by ' + element);
}

/**
 * Run a database query to find all objects and populate the autocomplete box
 * @param config
 */
QollAutoComplete.autocomplete = function (config, value, cb) {
  qlog.info('==============>' + value, filename);
  if (typeof(config) === 'undefined'){
    log('ERROR', 'Missing required config parameter in autocompleter()');
    return
  }

  // Build the query
  initQuery = {};

  /**
    If the mode is set to mono, the query string will be single element as in case of qolls
    Else If the mode is set to multi, the query string will be the last element in the input box - 
      database will be queried for the last entered query-string
  **/
  var query = undefined;
  var qstr = $(config['element']).val();
  qstr = qstr.replace(/\s/g,"");

  if(config['mode'] === 'mono' || config['mode'] == undefined) {
    qlog.info("Procesisng for mono", filename);
  } else if(config['mode'] === 'multi') {
    qlog.info("Procesisng for multi", filename);
    if(qstr.search(/,/) != -1) {
      var tmp = split(qstr);
      qstr = tmp[tmp.length-1];
    }
  }

  initQuery[config['field']] = {
    $regex: ".*" + qstr + ".*",
    $options: 'i'};
  if (typeof(config['filter']) === 'undefined')
    query = initQuery;
  else
    query = mergeObjects(initQuery, config['filter']);
  log('DEBUG', 'Query object: ');
  logObj(query);

  // Build filtering
  filter = {};
  filter['limit'] = config['limit'];
  filter['sort'] = config['sort'];
  filter['fields'] = {};
  //filter['fields'][config['field']] = 1; // Only include the searchable
  //filter['fields'][config['value']] = 1;//if(config['value']) 
  qlog.info('Printing the config parameters -> '+config[1], filename);
  //value: 'groupName',
                                         // field in the result
  log('DEBUG', 'Filter object: ');
  logObj(filter);

  // Find all results
  results = {};
  if( qstr != "" ) {
    results = config['collection'].find(query, filter).fetch();
    log('DEBUG', 'Results object: ');
    logObj(results);
  }

  // Get the name parameter from the results
  autocompleteResults = []
  for (var i = results.length - 1; i >= 0; i--) {
    qlog.info('Printing before pusing it to the array =======>' + JSON.stringify(results[i]) + '/' + cb(results[i]), filename);
    
    if(cb && cb != null)
      autocompleteResults[i] = cb(results[i]);
    else autocompleteResults[i] = results[i][config['field']];
  };

  qlog.info("Results for the query: " + JSON.stringify(query) + ", results: " + JSON.stringify(autocompleteResults), filename);
  // Update the autocomplete result list
  $(config['element']).autocomplete({ 
    //This is fired when user inputs some text to find more items from collections
    source: function(request, response) {
      if( qstr != "")
        response(autocompleteResults);
      //response( $.ui.autocomplete.filter(autocompleteResults, extractLast( request.term ) ) );
    },
    focus : function() {
      return false;
    },
    //This is fired when user selects an item from the drop down
    select: function(event, ui) {
      event.preventDefault();
      qlog.info("Value in the box: " + this.value + ", config mode is: " + config['mode'], filename);

      if(config['mode'] == 'mono' || config['mode'] == undefined) {
        this.value = ui.item.value;
      } else {
        //Get the current input
        var terms = split(this.value);
        //Remove the current input
        terms.pop();
        //Add the selected element
        terms.push(ui.item.value);
        //Add the placeholder to get the comma-and-space at the end
        terms.push("");
        this.value = terms.join(", ");
      }
      return false;
    }
  });
}

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
var mergeObjects = function (obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    qlog.info('mergedObjects: ' + obj3, filename);
    return obj3;
};

var split = function(val){
  return val.split( /,\s*/ );
};

function extractLast( term ) {
  return split( term ).pop();
};


var source = function(mode) {
  if(mode === 'mono')
    return monoSource();
  else if (mode == 'multi')
    return multiSource();
}

var monoSource = function() {
  //FIXME
}

var multiSource = function() {
  //FIXME
}