var filename='client/views/contacts/contacts.js';

Template.contacts.rendered = function(){
    qlog.info('Running post rendered code', filename);

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("active");
    });
    
    $('body').removeClass('bg1');
};