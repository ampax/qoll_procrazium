analyticsInit = _.once(function() {

   // Google Analytics
 //if (googleAnalyticsId = getSetting("googleAnalyticsId")){

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    window.ga('create', 'UA-47377901-1', 'qoll.io');
    window.ga('send', 'pageview');

  //} 

});

/*analyticsRequest = function() {
  
  // Google Analytics
  if (typeof window.ga !== 'undefined'){
    ga('send', 'pageview', {
      'page': window.location.pathname,
    }); 
  } 
}*/