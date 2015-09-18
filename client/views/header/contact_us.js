var filename = 'client/views/header/contact_us.js';

Template.contact_us.events({
	'click .send-msg': function(event) {
        event.preventDefault();
        var name = $('#Name').val();
        var from = $('#Email').val();
        var to = "webmaster@qoll.io";
        // var to = "procrazium@gmail.com";
        var msg = $('#Message').val();
        var subject = "Qoll User Contacting: " + name;

        Meteor.call('sendContactUsEmail', from, to, subject, msg, function(err){
            if(err) {
                qlog.error('Failed sending the email' + err, filename);
            } else {
                qlog.info('Sent the email', filename);
                $('#Name').val('');
                $('#Email').val('');
                $('#Message').val('');
                alert('Sent the email to Qoll Admin');
            }
        });
    },
});