var filename="server/lib/Facebook.js";

QFB = {};

Facebook = function(accessToken) {
    this.fb = Meteor.npmRequire('fbgraph');
    this.accessToken = accessToken;
    this.fb.setAccessToken(this.accessToken);
    this.options = {
        timeout: 3000,
        pool: {maxSockets: Infinity},
        headers: {connection: "keep-alive"}
    };
    this.fb.setOptions(this.options);
    return this;
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

Facebook.prototype.post = function() {
    this.post();
};

QFB.SocialFunFacebook = function(user) {
    var friends = QFB.getFriendsData(user.services.facebook.accessToken);
    
    var count = 1;
    if(friends && friends.data) {
        qlog.info('Recieved facebook friends ' + friends.data.length, filename);
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

QFB.getUserData = function(accessToken) {
    var fb = new Facebook(accessToken); // if user already created - Meteor.user().services.facebook.accessToken else use the function parameter
    var data = fb.getUserData();
    qlog.info(JSON.stringify(data));
    return data;
}

QFB.getFriendsData = function(accessToken) {   
    var fb = new Facebook(accessToken); // if user already created - Meteor.user().services.facebook.accessToken else use the function parameter
    var data = fb.getFriendsData();
    return data;
}

/**QFB.postOnWall = function(qollId, accessToken, userId) {
    //var fb = Meteor.npmRequire('fbgraph'); //Meteor.user().services.facebook.accessToken
    //fb.setAccessToken(accessToken);

    var wallPost = 'XXXXXXXXXXXXX Posting on wall - ' + qollId;

    console.log(fb);

    fb.postData = wallPost;
    fb.url = userId + "/feed";
    fb.callback =  function(err, res) {
        console.log(err);
        console.log(res);
        if(err) {
            qlog.info('Error happened - ', filename);
            qlog.info(err);
            return 'Error happened - ' + err;
        } else {
            // returns the post id
            console.log(fb);
            console.log(res); // { id: xxxxx}
            return 'Will be posting this qoll to the facebook wall ... <' + res + '>';
        }
    };

    fb.post();
}**/

QFB.postOnWall = function(wallPost, accessToken, userId) {
    var graph = Meteor.npmRequire('fbgraph');
    if(Meteor.user().services.facebook.accessToken) {
        graph.setAccessToken(Meteor.user().services.facebook.accessToken);
        //var future = new Future();
        //var onComplete = future.resolver();
        graph.post('/me/feed',
            { 
                message : wallPost,
                description : 'Qoll for your opinion',
                caption : 'Qoll for your opinion',
                icon : 'http://www.qoll.io/img/QollBrand.png',
            },
            function(err,result) {
            //return onComplete(err, result);
            if(err) {
                console.log(err);
                return 'ERROR: Failed to post {' + wallPost + '} to facebook wall!!';
            } else {
                console.log(result);
                return 'SUCCESS: Posted {' + wallPost + '} to facebook wall!!';
            }
        });
        //Future.wait(future);
    } else{
        return 'ERROR: No valid access_token exists for user to post {' + wallPost + '} to facebook wall!!';
    }
};

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
	},
    postOnWall: function(qollId) {
        var accessToken = Meteor.user().services.facebook.accessToken;
        var userId = Meteor.user().profile.fb_id;

        // Get qoll information and post title and qoll text to facebook
        var q = Qolls.QollDb.get({_id : qollId});

        var wallPost =  q.title === q.qollText? q.qollText : q.title + ' ' + q.qollText;

        /** START ::::: Replace the fill in the blanks if it is of FIB type **/
        if(q.cat === QollConstants.QOLL_TYPE.BLANK)
            while (matches = QollRegEx.fib_transf.exec(wallPost)) {
                wallPost = wallPost.replace(matches[0], ' ______ ');
            }
        /** END ::::: Replace the fill in the blanks if it is of FIB type **/

        qlog.info('Callling posting on facebook wall ...' + JSON.stringify(q) + '/' + accessToken, filename);
        var data = QFB.postOnWall(wallPost, accessToken, userId);
        return data;
    },
});