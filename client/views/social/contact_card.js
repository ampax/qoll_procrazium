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