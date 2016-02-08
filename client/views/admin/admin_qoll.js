var filename="client/views/qoll/admin/admin.js";

var ShareCircleAssignHook = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();

        var email = insertDoc.email;
        var share_circle = insertDoc.share_circle;

        console.log(email);

        qlog.info('-----------------------> ' + email + '/' + share_circle, filename);

        
        Meteor.call("assign_share_circle", share_circle, email, function(err) {
          if (err) {
            qlog.info('Error occured while assigning ...' + err, filename);
            return false;
          } else {
            qlog.info('Done assigning user to share-circle ...',filename);
            return false;
          }
        });

        // AutoForm.resetForm('questionnaireForm')

        // return true;
    },
};

AutoForm.addHooks('shareCircleAssignForm', ShareCircleAssignHook);

Template.admin_qoll.helpers({
    isAdmin : function() {
        Meteor.call("isAdmin", function(err, val) {
          if (err) {
            qlog.info('Error on isAdmin...' + err, filename);
            return false;
          } else {
            qlog.info('isAdmin ...' + val,filename);
            return val;
          }
        });
        return false;
    },
    shareCircleAssignSchema: function() {
        return Schemas.share_circle_assign;
    },
    shareCircles: function() {
        return [
            {'description' : 'ChemWiki share circle to give access to all the qolls created by people in this circle',
                'share_circle' : 'ChemWiki', 'access' : 'private'},
            {'description' : 'ChemWiki share circle to give access to all the qolls created by people in this circle',
                'share_circle' : 'ChemWiki', 'access' : 'private'},
        ];
    }
});

Template.admin_qoll.events({
    'click .adminResetUser': function(event){
        event.preventDefault();
        var userNm = $("#usrToReset").val();
        
        qlog.info("Printing userNm: " + userNm);

        return;

        Meteor.call("adminResetOnSvr", userNm, function(error, newval){

            qlog.info("UserNm not ? reset to: " + newval, filename);
            $("#usrToReset").val(newval);
        });

        qlog.info("user reset : " + userNm, filename);                                                                                                                           
        
    }
   
});


renderEmails = function(x) {
    // qlog.info('called render qoll to emails method', filename);
    //console.log(x);
    return Blaze.toHTMLWithData(Template.email_autocomplete, x);
    // return x.email + x.name;
};


renderShareCircle = function(x) {
    // qlog.info('called render qoll to emails method', filename);
    //console.log(x);
    return Blaze.toHTMLWithData(Template.share_circle_autocomplete, x);
    // return x.email + x.name;
};