var filename='server/db/SocialDb.js';

SocialDb={};

/*
Sample -
(1) Google  
{ 	name: 'Amit Kaushik',
	email: 'kaushik.amit@gmail.com',
	photoUrl: 'https://www.google.com/m8/feeds/photos/media/procrazium%40gmail.com/2f202ab00f7a85a2',
	mime_type: 'image/*' 
}

(2) Facebook
{
	"id":"100004286557312",
	"gender":"male",
	"last_name":"Khandelwal",
	"first_name":"Ajay",
	"locale":"en_US",
	"username":"ajay.khandelwal.142892"
}
*/
SocialDb.insertSocialConnect=function(user_id, social_unique_id, social_connect) {
	var existing;
	if(social_connect.social_type === 'google') {
		existing = SocialConnect.findOne({email : social_connect.email});
	} else if(social_connect.social_type === 'facebook') {
		existing = SocialConnect.findOne({facebook_id : social_connect.facebook_id});
	}

	if(existing) {
		var existing_social_friends = SocialFriends.findOne({user_id : user_id, social_unique_id : social_unique_id});
		//Social-Connect has already been pulled. Populate the SocialFriends for the user-id (if it does not already exist)
		if(!existing_social_friends)
			SocialFriends.insert({social_connect_id : existing._id, user_id : user_id, friend_id : existing._id, social_unique_id : social_unique_id, active : 1});
	} else {
		//Social-Connect is not present. Populate Social-Connect and Social-Friends
		var social_connect_id = SocialConnect.insert(social_connect);
		SocialFriends.insert({social_connect_id : social_connect_id, user_id : user_id, friend_id : social_connect_id, social_unique_id : social_unique_id, active : 1});
	}
}

SocialDb.SocialConnect = {
	get : function(connect_id) {
		return SocialConnect.findOne({_id : connect_id});
	},
};


