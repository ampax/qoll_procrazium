var filename = "lib/Router.js";

Router.configure({
	layoutTemplate : 'layout',
	loadingTemplate : 'loading',
});

Router.map(function() {
	this.route('landing_page', {path: '/' });
});