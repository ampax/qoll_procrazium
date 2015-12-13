Router.map(function(){
	this.route('header_awesome', {
		template : 'header_awesome',
		path: '/header_awesome',
		
	});

	/**this.route('landing', {
		template : 'landing_page',
		path: '/',
		
	});**/

	/**if (Meteor.isCordova) {
	    this.route('landing_signin', {
			template : 'signin_qoll_cordova',
			path: '/',
		});
		this.route('landing_register', {
			template : 'register_qoll_cordova',
			path: '/register',
		});
		this.route('landing_forgot_password', {
			template : 'passwd_recover_qoll_cordova',
			path: '/passwd_recover',
		});
		this.route('go_home_cordova', {
			template : 'nav_cordova',
			path: '/home_cordova',
		});
	  }

	  if (Meteor.isClient) {
	    this.route('landing', {
			//template : 'landing_page',
			template : 'home_page',
			path: '/',
		});
	  } **/

	this.route('landing', {
		//template : 'landing_page',
		template : 'home_page',
		path: '/',
	});

	this.route('landing', {
		template : 'landing_page',
		path: '/landing',
		
	});
	
});

/**
Router.map(function() {
	this.route('landing_page', {path: '/'});
	//this.route('dashboard');
});
**/