var filename="server/lib/Facebook.js";

FB = {};

Facebook = function(accessToken) {
    this.fb = Meteor.require('fbgraph');
    this.accessToken = accessToken;
    this.fb.setAccessToken(this.accessToken);
    this.options = {
        timeout: 3000,
        pool: {maxSockets: Infinity},
        headers: {connection: "keep-alive"}
    };
    this.fb.setOptions(this.options);
};

Facebook.prototype.query = function(query, method) {
    var self = this;
    var method = (typeof method === 'undefined') ? 'get' : method;
    var data = Meteor.sync(function(done) {
        self.fb[method](query, function(err, res) {
            done(null, res);
        });
    });
    return data.result;
};

Facebook.prototype.getUserData = function() {
    return this.query('me');
};

/**Facebook.prototype.getFriendsData = function() {
    return this.query('/me/friends');
};**/

Facebook.prototype.getFriendsData = function() {
    return this.query('/me/friends?fields=id,bio,birthday,email,gender,hometown,last_name,first_name,locale,location,middle_name,username');
};

FB.SocialFunFacebook = function(user) {
    var friends = FB.getFriendsData(user.services.facebook.accessToken);
    qlog.info('Recieved facebook friends ' + friends.data.length, filename);

    var count = 1;
    if(friends) {
        friends.data.map(function(friend){
            //insert friends one by one into Social-Connect and establish connection with the user
            //qlog.info('Facebook friend ' + count++ + ' - ' + JSON.stringify(friend), filename);
            friend['createdAt'] = new Date();
            friend['whoPulled'] = user._id;
            friend['social_type'] = 'facebook';
            friend['facebook_id'] = friend.id;
            friend['active'] = 1;
            SocialDb.insertSocialConnect(user._id, friend.id, friend);
        });
    }
}

FB.getUserData = function(accessToken) {
    var fb = new Facebook(accessToken); // if user already created - Meteor.user().services.facebook.accessToken else use the function parameter
    var data = fb.getUserData();
    return data;
}

FB.getFriendsData = function(accessToken) {   
    var fb = new Facebook(accessToken); // if user already created - Meteor.user().services.facebook.accessToken else use the function parameter
    var data = fb.getFriendsData();
    return data;
}

Meteor.methods({
    getUserData: function() {
        var fb = new Facebook(Meteor.user().services.facebook.accessToken);
        var data = fb.getUserData();
        return data;
    },
    getFriendsData: function() {   
	    var fb = new Facebook(Meteor.user().services.facebook.accessToken);
	    var data = fb.getFriendsData();
	    return data;
	}
});