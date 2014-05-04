var filename = "client/views/header/header_awesome.js";
Template.header_awesome.rendered = function()
{// Close bootstrap's dropdown menu after clicking
    $('.collapse-onclick').each(function() {
        $(this).on("click", function () {
            var $obj = $($(this).parents('.in')[0]);
            $obj.animate({'height': '1px'}, function() {
                $obj.removeClass('in').addClass('collapse');
            });
        });
    });

    if($('#mob-only').css('display') == 'none') {
        $('li#mob-only').remove();
    }

    if($('#desk-only').css('display') == 'none') {
        $('li#desk-only').remove();
    }

    if(!Meteor.user()){
        $('.login-link-text').text(i18n.translate("Sign Up/Sign In"));
    }else{
        var close = i18n.translate("Close");
        var edit_account = i18n.translate("Edit Account");
        var view_profile = i18n.translate("View Profile");
        var chang_passwd = i18n.translate("Change Password");
        var sign_out = i18n.translate("Sign Out");

        //Change the text & Set the additional buttons for profile here
        $('a.login-close-text').text(close);
        $('div#login-buttons-open-change-password').text(chang_passwd);
        $('div#login-buttons-logout').text(sign_out);
        $('#login-buttons-logout').before('<a href="/users/'+Meteor.user().profile.slug+'" class="account-link login-button button">'+view_profile+'</a>');
        $('#login-buttons-logout').before('<a href="/account" class="account-link login-button button">'+edit_account+'</a>');
      }

    //$('#login-buttons').append(SOMETHING CUSTOM).append('Some other custom thing');login-buttons-open-change-password
    //$('#login-buttons-open-change-password').append('Some other custom thing');
};

Template.header_awesome.events({
	'click #logout' : function(event, tmpl) {
		qlog.info('User logout event happened', filename);
	    logoutFromService();
	}
});