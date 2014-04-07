var filename = "lib/Router.js";

Router.configure({
  loadingTemplate: 'layout'
});

Router.map(function() {
	this.route('landing_page', {path: '/'})
	this.route('dashboard');
});

if(Meteor.isClient){
	// After Hooks
  Router.after( function () {
    analyticsInit(); // will only run once thanks to _.once()
  });
}
