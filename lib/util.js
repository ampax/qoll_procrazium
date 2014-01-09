getCurrentEmail = function(){
    return Meteor.user() &&
    Meteor.user().emails &&
    Meteor.user().emails[0].address;
};

userId = function(){
    return Meteor.userId();
};