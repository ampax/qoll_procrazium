var filename="client/views/qoll/admin/admin.js";



Template.admin.events({
    'click .adminResetUser': function(event){
        event.preventDefault();
        var userNm = $("#usrToReset").val();
        
        qlog.info("Printing userNm: " + userNm);

        Meteor.call("adminResetOnSvr", userNm, function(error, newval){

            qlog.info("UserNm not ? reset to: " + newval, filename);
            $("#usrToReset").val(newval);
        });

        qlog.info("user reset : " + userNm, filename);                                                                                                                           
        
    }
   
});