Template.aceEditor.events({
  'keydown' : function(event) {
    //console.log("the keycode is: " + event.keyCode );

    var editor = ace.edit("aceEditor");

    /* Add a new qoll **/
    if(event.keyCode == 81 && event.ctrlKey) {
      console.log("Control-Q clicked ... adding a qoll element to the editor now");
      bindToolBarForQoll(editor);
    }

    /** Add a new option/answer **/
    if(event.keyCode == 79 && event.ctrlKey) {
      console.log("Control-O clicked ... adding a new option/answer to the editor now");
      bindToolBarForOption(editor);
    }

    /** Add a new option/answer **/
    if(event.keyCode == 65 && event.ctrlKey) {
      console.log("Control-A clicked ... adding a new option/answer to the editor now");
      bindToolBarForQollAnswer(editor);
    }

    /** Add a new LaTeX expression - In-Line **/
    if(event.keyCode == 73 && event.ctrlKey) {
      console.log("Control-I clicked ... inserting an inline latex element now");
      bindForLatexInline(editor);
    }

    /** Add a new LaTeX expression - Block Expression **/
    if(event.keyCode == 76 && event.ctrlKey) {
      console.log("Control-L clicked ... inserting a block latex expression now");
      bindForLatexBlock(editor);
    }

    /** Add a code block **/
    if(event.keyCode == 67 && event.ctrlKey) {
      console.log("Control-C clicked ... adding a code block now");
      bindForCode(editor);
    }

    /** Add a quote block **/
    if(event.keyCode == 190 && event.ctrlKey) {
      console.log("Control-C clicked ... adding a quote block now");
      bindForBlockQuotes(editor);
    }

    /** Add a quote block **/
    if(event.keyCode == 83 && event.ctrlKey) {
      console.log("Control-S clicked ... persisting qolls now");
      parseAndAddQoll(editor);
    }
  }
});