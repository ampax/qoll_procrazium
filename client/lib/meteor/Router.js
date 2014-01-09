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

Router.configure({
	layout : 'layout',
	loadingTemplate : 'loading',
	notFoundTemplate : 'notFound',

	before: function(){
		//qlog.info('Initializing routing ...', filename);
		//active_brand_nav();
	},
	after: function(){
		//qlog.info('Done initializing routing ...', filename);
	}
});