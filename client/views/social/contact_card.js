var filename='client/views/social/contact_card.js';

Template.list_card.helpers({
    is_google: function(connect){
        return connect.social_type === 'google';
    },
    is_facebook: function(connect){
        return connect.social_type === 'facebook';
    },
    is_qoll: function(connect){
        return connect.social_type === 'qoll';
    },
});


Template.list_card_long.helpers({
	gravtar : function(email) {
		qlog.info('email - ' + email, filename)
		if(!email) return '/img/ghost_avatar.png';

		var grav_url = Gravatar.imageUrl(email, {secure : true});
		qlog.info('Printing the gravtar url = ' + grav_url, filename);
		return grav_url;
	}
});