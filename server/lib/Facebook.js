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

Facebook.prototype.getFriendsData = function() {
    // return this.query('/me/friendlists');
    return this.query('/me/friends');
};

Facebook.prototype.getUserData = function() {
    return this.query('me');
};



/**
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

Facebook.prototype.getFriendsData = function() {
    return this.query('/me/friends');
};

Facebook.prototype.post = function() {
    this.post();
};

**/

/**

Facebook.prototype.getFriendsData = function() {
    qlog.info('called ............................... 2', filename);   
    return this.query('/me/friends?fields=id,bio,birthday,email,gender,hometown,last_name,first_name,locale,location,middle_name');
};
**/

var getFriendsData = function(user) {
    qlog.info('called ............................... 1', filename);   
    var fb = new Facebook(user.services.facebook.accessToken);
    var data = fb.getFriendsData();
    return data;
}

QFB.SocialFunFacebook = function(user) {
    // var friends = getFriendsData();
    // var friends = QFB.getFriendsData(user.services.facebook.accessToken);

    var friends = getFriendsData(user);

    qlog.info('================> ' + JSON.stringify(friends), filename);
    
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

QFB.postOnWall = function(wallTitle, wallPost, wallDescription, accessToken, userId, qollstionnaire_id) {
    var graph = Meteor.npmRequire('fbgraph');
    if(Meteor.user().services.facebook.accessToken) {
        graph.setAccessToken(Meteor.user().services.facebook.accessToken);
        //var future = new Future();
        //var onComplete = future.resolver();
        graph.post('/me/feed',
            { 
                name: wallPost,
                message : wallTitle,
                description : wallDescription,
                caption : 'Take Qoll at Qoll.io',
                //picture: 'http://www.qoll.io/logos/b.jpg',
                picture: 'http://www.qoll.io/logos/2_logotype_250_px.png',
                //picture: 'http://www.qoll.io/logos/2_logotype.png',
                icon : 'http://www.qoll.io/logos/brand.png',
                // link : 'www.qoll.io',
                link : URLUtil.SITE_URL + '/ext_wall_board/' + qollstionnaire_id + '/facebook',

                /** name: wallTitle,
                message : wallPost,
                description : wallDescription,
                caption : 'Take Qoll at Qoll.io',
                icon : 'http://www.qoll.io/logos/brand.png',
                link : 'www.qoll.io', **/
            },
            function(err,result) {
            //return onComplete(err, result);
            if(err) {
                console.log(err);
                qlog.error('ERROR: Failed to post {' + wallPost + '} to facebook wall!!', filename);
                return 'ERROR: Failed to post {' + wallPost + '} to facebook wall!!';
            } else {
                console.log(result);
                qlog.info('SUCCESS: Posted {Post: ' + wallPost + '/Post-ID: ' + JSON.stringify(result) + '} to facebook wall!!', filename);
                return 'SUCCESS: Posted {Post: ' + wallPost + '/Post-ID: ' + result + '} to facebook wall!!';
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

        var wallPost =  q.qollText;
        var wallTitle =  q.title? q.title : 'Qoll';

        /** START ::::: Replace the fill in the blanks if it is of FIB type **/
        if(q.cat === QollConstants.QOLL_TYPE.BLANK)
            while (matches = QollRegEx.fib_transf.exec(wallPost)) {
                wallPost = wallPost.replace(matches[0], ' ______ ');
            }

        if(q.cat === QollConstants.QOLL_TYPE.BLANK)
            while (matches = QollRegEx.fib_transf.exec(wallTitle)) {
                wallTitle = wallTitle.replace(matches[0], ' ______ ');
            }
        /** END ::::: Replace the fill in the blanks if it is of FIB type **/

        wallPost = KatexUtil.toTxt(wallPost, q.tex);
        wallTitle = KatexUtil.toTxt(wallTitle, q.tex);

        var wallDescription = ''; // new Array();

        q.qollTypesX.forEach(function(typesX){
            var typesX_type = KatexUtil.toTxt(typesX.type, q.tex);
            // wallDescription.push('(' + (typesX.index+1) + ') ' + typesX_type);
            wallDescription += '(' + (typesX.index+1) + ') ' + typesX_type + '\n';
        });

        qlog.info('Callling posting on facebook wall ...' + JSON.stringify(q) + '/' + accessToken, filename);

        // create an anonymous questionnaire (if one is already not there) before posting the qoll
        var qollids = new Array();
        qollids.push(qollId);
        var qollstionnaire_id = Meteor.call('addAnonymousQollstionnaire', 'Register your responses by clicking the choices please', qollids, 'facebook');
        qlog.info('Callling posting on facebook wall ...' + JSON.stringify(q) + '/' + accessToken + '/' + qollstionnaire_id, filename);
        
        var data = QFB.postOnWall(wallTitle, wallPost, wallDescription, accessToken, userId, qollstionnaire_id);
        return data;
    },
});