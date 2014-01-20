var filename = "client/views/contacts/managecontacts.js"


Template.managecontacts.events({
    'click .create-group': function(event){
        var groupName = $("input.create-group").val();

        var emails = new Array();
        $('.email-group-panel').each(function(){
            qlog.info('found email: ' + $(this).html());
            emails.push($(this).html());
            //$(this).remove();
        });


        qlog.info('Sending the following emails for group updated: ' + emails + ', @group: ' + groupName, filename);

        if(groupName && emails.length > 0){
            //SEND to server for updating user profiles
            qlog.info('Sending to server ' + groupName + ', ' + emails, filename);
            
            Meteor.call("updateUserGroup", groupName, emails, function(error){
                if(!error){ 
                    qlog.info("Updated users with group", filename);
                } else {
                    qlog.info("Failed to create group: " + error, filename);
                }
                
            });
        }

        $('.email-group-panel').remove();
        $("input.create-group").val('');
        $('.add-email').val('');
    },
});

/** jQuery functionality will come here **/
Template.managecontacts.rendered = function() {
    qlog.info('Loaded managecontacts', filename);
    jQuery('.add-email').click(function(){
        var email = $("#addemail").val();
        qlog.info("Adding new email to the group: "+email, filename);

        jQuery('#addedemails').append("<div class='email-group-panel' id='emailtogrouppanel'>"+email+"</div>");
        $("#addemail").val('');
    });

    $('body').removeClass('bg1');
}