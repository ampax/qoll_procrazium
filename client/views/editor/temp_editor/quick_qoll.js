var filename='client/views/editor/temp_editor/quick_qoll.js';

Template.quick_qoll.helpers({
  quickQollSchema: function() {
    return Schemas.quick_qoll;
  }
});

renderQollToEmails = function(x) {
    // qlog.info('called render qoll to emails method', filename);
    // console.log(x);
    return Blaze.toHTMLWithData(Template.quick_qoll_send_to, x);
    // return x.email + x.name;
};

renderQollToEmailsCb = function(x) {
    // qlog.info('Called the render-to-qoll-emails callback', filename);
    // console.log(x);
};