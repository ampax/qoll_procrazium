var filename = "client/lib/meteor/router.js";

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

