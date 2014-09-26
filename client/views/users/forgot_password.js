var filename='client/views/users/forgot_password.js';

Template.forgot_password.events({
  'click input[type=submit]': function(e){
    e.preventDefault();
    //var options={};//new Object();
    //options.email=$('#email').val();
    qlog.info('Resetting the password now .... email: ' + email, filename);
    Accounts.forgotPassword({email : email}, function(error){
      qlog.info('Resetting the password now .... email: ' + email, filename);
      if(error){
        console.error(error);
      }else{
        //throwError(i18n.t("Password reset link sent!"));
        console.info(filename, "Password reset link sent ... " + error);
      }
    });
  }
});