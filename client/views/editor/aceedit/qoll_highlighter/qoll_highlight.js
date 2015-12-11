//****************************************//
//**      define the rules here          **//
//****************************************//

define('ace/mode/example_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/html', 'ace/mode/text_highlight_rules', 'ace/tokenizer', 'ace/mode/html_highlight_rules', 'ace/mode/javascript_highlight_rules', 'ace/mode/markdown_highlight_rules'], function(require, exports, module) {

var oop = require("ace/lib/oop");
/**var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
var HtmlHighlightRules = require("/ace/mode/html_highlight_rules").HtmlHighlightRules;
var JavaHighlightRules = require("ace/mode/java_highlight_rules").JavaHighlightRules;**/
var JavaScriptHighlightRules = require("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;
var HtmlHighlightRules = require("ace/mode/html_highlight_rules").HtmlHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var MarkdownHighlightRules = require("./markdown_highlight_rules").MarkdownHighlightRules;
//javascript

var ExampleHighlightRules = function() {

    // this.$rules = new TextHighlightRules().getRules();
    // this.$rules = new HtmlHighlightRules().getRules();
    // this.$rules = new JavaScriptHighlightRules().getRules();
    this.$rules = new MarkdownHighlightRules().getRules();

}

// oop.inherits(ExampleHighlightRules, TextHighlightRules);
// oop.inherits(ExampleHighlightRules, HtmlHighlightRules);
// oop.inherits(ExampleHighlightRules, JavaScriptHighlightRules);
oop.inherits(ExampleHighlightRules, MarkdownHighlightRules);

exports.ExampleHighlightRules = ExampleHighlightRules;
});


//****************************************//
//**  define the highlighter here       **//
//****************************************//
define('ace/mode/example', function(require, exports, module) {

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var ExampleHighlightRules = require("ace/mode/example_highlight_rules").ExampleHighlightRules;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new ExampleHighlightRules().getRules());
};
oop.inherits(Mode, TextMode);

(function() {
    // Extra logic goes here. (see below)
}).call(Mode.prototype);

exports.Mode = Mode;
});
