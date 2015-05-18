var filename = "client/lib/meteor/Router.js";

var active_nav = function(){
	$('ul.nav > li').click(function (e) {
        e.preventDefault();
        $('ul.nav > li').removeClass('active');
        $(this).addClass('active');                
	});
};

var active_brand_nav = function(){
	$('.navbar-brand').click(function (e) {
        e.preventDefault();
        $('ul.nav > li').removeClass('active');
	});
};

checkSessionAndSendToHome = function() {
	qlog.info('Sending user to home', filename);
	if(!Meteor.userId) {
		qlog.info('Sending user to home', filename);
		this.redirect('/')
		//Router.url('/');
	}
}


//--------------------------------------------------------------------------------------------------//
//------------------------------------------- Controllers ------------------------------------------//
//--------------------------------------------------------------------------------------------------//
// Controller for user pages

UserPageController = RouteController.extend({
  waitOn: function() {
  	qlog.info('before subscribing to singleUser - ' + this.params._idOrSlug, filename);
    Meteor.subscribe('singleUser', this.params._idOrSlug);
    Meteor.subscribe('currentUser');
    Meteor.subscribe('USER_SUBSCRIPT_GROUPS');
    Meteor.subscribe('PUBLISH_GROUPS_OF_USER_1');
  },
  data: function() {
    var findById = Meteor.users.findOne(this.params._idOrSlug);
    var findBySlug = Meteor.users.findOne({'profile.slug': this.params._idOrSlug});
    qlog.info('found users findById - ' + JSON.stringify(findById) + ', findBySlug - ' 
    	+ JSON.stringify(findBySlug) + ', slug - ' + this.params._idOrSlug);
    if(typeof findById !== "undefined"){
      // redirect to slug-based URL
      Router.go(UserUtil.getProfileUrl(findById), {replaceState: true});
    }else{
      return {
        user: (typeof findById == "undefined") ? findBySlug : findById
      }
    }
  }
});


//--------------------------------------------------------------------------------------------------//
//--------------------------------------------- Routes ---------------------------------------------//
//--------------------------------------------------------------------------------------------------//


Router.map(function() {

// ---------------------------------- user page routers -------------------------------------- //
  // User Profile

  this.route('user_profile', {
    path: '/users/:_idOrSlug',
    controller: UserPageController
  });

  // User Edit

  this.route('user_edit', {
    path: '/users/:_idOrSlug/edit',
    controller: UserPageController
  });

  // Account

  this.route('account', {
    path: '/account',
    template: 'user_edit',
    data: function() {
      return {
        user: Meteor.user()
      }
    }
  });

  // Forgot Password

  this.route('forgot_password');

/** End: Router **/
});

// adding common subscriptions that's need to be loaded on all the routes
// notification does not included here since it is not much critical and 
// it might have considerable amount of docs
if(Meteor.isServer) {
  /** FastRender.onAllRoutes(function() {
    this.subscribe('categories');
    this.subscribe('Settings');
    this.subscribe('currentUser');
  }); **/
}
