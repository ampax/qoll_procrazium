Router.map(function(){
	this.route('header_awesome', {
		template : 'header_awesome',
		path: '/header_awesome',
		
	});
	this.route('landing', {
		template : 'landing_page',
		path: '/landing',
		
	});
});

Router.map(function() {
	this.route('landing_page', {path: '/'});
	//this.route('dashboard');
});