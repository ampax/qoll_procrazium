var filename='client/views/social/contact_card_buttons.js';

Template.sel_button.helpers({
    my_groups: function(){
    	//
    },
    social_connects: function(){
        qlog.info('social_ctx - ' + this.contact.social_ctx);
        //console.log(this);
        var status = this.contact.friend_request_status;
        var ctx = this.contact.social_ctx;
        //qlog.info('Friend request status is - ' + status, filename);

    	var btn_ctx = Session.get('social_btn_ctx');
        return ctx === 'social-qoll-user' && status == undefined;
    },
    disabled_social_connects: function() {
        var pending = this.contact.friend_request_status;
        var is_receiver = this.contact.is_receiver;
        var ctx = this.contact.social_ctx;
        //qlog.info('Friend request status is - ' + pending, filename);

        var btn_ctx = Session.get('social_btn_ctx');
        return ctx === 'social-qoll-user-req-sent' && pending == QollConstants.STATUS.PENDING && is_receiver != true;
    },
    social_connects_open_reqs: function(template_name) {
        var ctx = this.contact.social_ctx;
        var pending = this.contact.friend_request_status;
        var is_receiver = this.contact.is_receiver;
        //qlog.info('Friend request status is - ' + pending, filename);

        /*var btn_ctx = Session.get('social_btn_ctx');
        return btn_ctx === 'social_connects' && pending == QollConstants.STATUS.PENDING && is_receiver === true;*/

        return ctx === 'my-qoll-connects-open-reqs' && is_receiver === true;
    },
    social_connects_open_rec_reqs: function(template_name) {
        var ctx = this.contact.social_ctx;
        var pending = this.contact.friend_request_status;
        var is_receiver = this.contact.is_receiver;
        //qlog.info('Friend request status is - ' + pending, filename);

        /*var btn_ctx = Session.get('social_btn_ctx');
        return btn_ctx === 'social_connects' && pending == QollConstants.STATUS.PENDING && is_receiver === true;*/

        return ctx === 'my-qoll-connects-open-rec-reqs' && is_receiver === false;
    },
    qoll_social_connects: function() {
        //console.log(this);
        var ctx = this.contact.social_ctx;
        /**var confirmed = this.contact.friend_request_status;
        //qlog.info('Friend request status is xxxxx - ' + confirmed, filename);

        var btn_ctx = Session.get('social_btn_ctx');
        return btn_ctx === 'social_connects' && confirmed === QollConstants.STATUS.CONFIRMED; **/

        return ctx === 'my-social-connects';
    },
    my_social: function(){
        var btn_ctx = Session.get('social_btn_ctx');
        return btn_ctx === 'my_social';
    },

    /* Group members card buttons */
    group_members: function() {
        var ctx = this.contact.ctx;
        return ctx === 'group-owner'; 
    },
    no_button: function() {
        var ctx = this.contact.ctx;
        qlog.info('------------------------------> ' + ctx, filename);
        return ctx === 'group-subsc';
    }
});