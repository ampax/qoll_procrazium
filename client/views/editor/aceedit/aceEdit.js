var filename = "client/views/editor/aceEdit.js";

preview_data = new ReactiveDict;

var test_qolls = 
"\# Quadratic Equations; form begin => f(\\sigma x^n)=0end\?\n"+
"* txt Which of the following is a quadratic equation of the form beginax^2+bx+cend\n"+
"*hint It is highest degree of two of the variable\n"+
"* Images - 6EkpFPFXsH9ATGron,iHJdkXovdadFnA4yC,ZJN6PvgsMn8R2ToFB\n"+
"* answer A b e\n"+
"- beginax^2+bx+cend\n"+
"- beginax^3+bx^2+cx+dend\n"+
"- beginax^4+bx^3+cx^2+dx+eend\n"+
"- beginx = {-b pm \\sqrt ((b^2-4ac) * 2a})end\n"+
"- beginx = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}end\n"+
"- beginf(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xiend\n"+
"- begin \\ce{SO4^2- + Ba^2+ -> BaSO4 v} end\n\n" +

"\# Who was Rani laxmibai\?\n"+
"* text Identify the women from a small kingdom in northern part of U.P. to have fought with English rule in 1857, died in 1858\n"+
"*hint She was a warrior, a princess, and a queen of the small Maratha kingdom Jhansi\n"+
"* answer A Women\n"+
"- A Women\n"+
"- A Girl\n"+
"- A Man\n"+
"- I dont know who\n\n"+

"\# Who was Maharana Pratap\?\n"+
"* text Correctly identify the legend of Maharana Pratap\n"+
"* hint Prince of Amer\n"+
"* ans E\n"+
"- USA first President\n"+
"- Narendra Modi was named Maharana Pratap when young\n"+
"- A dacoit/outlaw\n"+
"- Roman emperor\n"+
"- He was prince of Amer who, since his young age, fought against Moughal dynasty and defeated them in many battles\n\n"+

"\# Who was USA first president\n"+
"- Barak Obama\n"+
"- John Nash\n"+
"- George Washington\n\n"+

"\# _mercury_ liquid metal element is named after the noble winning scientist Madam Curie\n"+
"*hint it is liquid metal\n";

Template.aceEditor.rendered = function() {
  var editor = ace.edit("aceEditor");
  // editor.setTheme("ace/theme/twilight");
  // editor.setHighlightActiveLine(true);
  // editor.getSession().setMode("ace/mode/example");
  //editor.getSession().setMode("ace/mode/html");

  //var example = require("ace/mode/example").Mode;
  //editor.getSession().setMode("ace/mode/example");
  //editor.getSession().setMode("ace/mode/java");

  var langTools = ace.require("ace/ext/language_tools");

  editor.setTheme("ace/theme/twilight");
  editor.getSession().setMode("ace/mode/example");
  editor.setHighlightActiveLine(true);

  qlog.info('Editor mode ---------------->>>>>>>> ' + JSON.stringify(editor.getSession().getMode()), filename);

  editor.getSession().setUseWrapMode(true);

  editor.getSession().on('change', editorPreviewRefresh);

  editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
  });

  // autocompletion for TeX
  var texCompleter = {
      getCompletions: function(editor, session, pos, prefix, callback) {
          if (prefix.length === 0) { callback(null, []); return; }

          callback(null, _.values(AceEditTextNotations).map(function(tex_notation) {
            return { name: tex_notation.tex, value: tex_notation.tex, score: 1, meta: tex_notation.tex };
          }));
          /** $.getJSON(
              "http://rhymebrain.com/talk?function=getRhymes&word=" + prefix,
              function(wordList) {
                  // wordList like [{"word":"flow","freq":24,"score":300,"flags":"bc","syllables":"1"}]
                  callback(null, wordList.map(function(ea) {
                      return {name: ea.word, value: ea.word, score: ea.score, meta: "rhyme"}
                  }));
              }) **/
      }
  }
  langTools.addCompleter(texCompleter);

  editor.commands.on("afterExec", function(e){ 
     if (e.command.name == "insertstring"&&/^[\w.]$/.test(e.args)) { 
         editor.execCommand("startAutocomplete");
     } 
  }); 


  editor.focus();

  if(URLUtil.isDev()) {
    editor.setValue(test_qolls);
  }

  //initEditor(editor);
};

Template.aceEditor.events({
  'keyup .aceEditor': function(e, t) {
    /**qlog.info('Printing on keyup ......................', filename);
    Meteor.setTimeout(function(){
      qlog.info('Printing this after 5 seconds ... will I?', filename);
    }, 5000);**/
  },
});


var editorPreviewRefresh = function() {
    Meteor.setTimeout(function(){
      // qlog.info('Printing this after 5 seconds ... will I?', filename);

      var editor = ace.edit("aceEditor");
      var tex_pref = $('input[name=texPref]:checked').val();

      var qoll_focus_attrib = AceEditUtil.qollFocusAttribs(editor);

      var parsed_qoll;

      // set the data in the reactive variable
      preview_data.set("preview_data", editor.getValue() );
      preview_data.set("tex_pref", tex_pref);
      preview_data.set("qoll_focus_attrib", qoll_focus_attrib);
      /** Meteor.call('parse_downtown', editor.getValue(), DownTownOptions.downtown_default(), function(err, val) {
        console.log(val);
        //qlog.info("Rec data from server: " + JSON.stringify(val), filename);
        if (err) {
          parsed_qoll = "Error occured while converting qoll-contents. Please try again: " + err;
          previewQoll(parsed_qoll);
        } else {
          parsed_qoll = val;
          previewQoll(preparePreviewHtml(parsed_qoll));
          $("div#aceEditor").height($("div#aceEditor_Preview").parent().height()+'px');
          var editor = ace.edit("aceEditor");
          editor.resize(true);
          editor.setHighlightActiveLine(true);
        }
      });**/
    }, 2000);
}

var findCurrentQoll = function(str,pos){
    var qolls = str.split(/\#\s/);
    // var words=str.split(' ');
    var offset=0;
    var i;
    for(i=0;i<qolls.length;i++){
        offset+=qolls[i].length+1;
        if (offset>pos) break;
        
    }
    return qolls[i];
}


