var filename='lib/URLUtil.js';

/**********************************************/

    /*Global URL-Util Functions for Qoll*/

/**********************************************/

URLUtil = {};

URLUtil.getSetting = function(setting, defaultValue){
  var settings=Settings.find().fetch()[0];
  if(settings){
    return settings[setting];
  }
  return typeof defaultValue === 'undefined' ? '' : defaultValue;
}
URLUtil.getCurrentTemplate = function() {
  return Router._currentController.template;
}
URLUtil.getCurrentRoute = function() {
  return Router._currentController.path;
}
URLUtil.clearSeenErrors = function(){
  Errors.update({seen:true}, {$set: {show:false}}, {multi:true});
}
URLUtil.t=function(message){
  var d=new Date();
  console.log("### "+message+" rendered at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
}
URLUtil.nl2br= function(str) {   
  var breakTag = '<br />';    
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}
URLUtil.getAuthorName = function(item){
  // since we are not publishing the user collection except for admins, just display the normalized author field
  return item.author;
}
URLUtil.scrollPageTo = function(selector){
  $('body').scrollTop($(selector).offset().top);  
}
URLUtil.getDigestURL = function(moment){
  return '/digest/'+moment.year()+'/'+(moment.month()+1)+'/'+moment.date()
}
URLUtil.getDateRange= function(pageNumber){
  var now = moment(new Date());
  var dayToDisplay=now.subtract('days', pageNumber-1);
  var range={};
  range.start = dayToDisplay.startOf('day').valueOf();
  range.end = dayToDisplay.endOf('day').valueOf();
  // console.log("after: ", dayToDisplay.startOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  // console.log("before: ", dayToDisplay.endOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  return range;
}

// ---------------------------------- URL Helper Functions ----------------------------------- //
URLUtil.goTo = function(url){
  Router.go(url);
}
URLUtil.getPostUrl = function(id){
  return Meteor.absoluteUrl()+'posts/'+id;
}
URLUtil.getPostEditUrl = function(id){
  return Meteor.absoluteUrl()+'posts/'+id+'/edit';
}
URLUtil.getCommentUrl = function(id){
  return Meteor.absoluteUrl()+'comments/'+id;
}
URLUtil.getPostCommentUrl = function(postId, commentId){
  // get link to a comment on a post page
  return Meteor.absoluteUrl()+'posts/'+postId+'/comment/'+commentId;
}
URLUtil.getCategoryUrl = function(slug){
  return Meteor.absoluteUrl()+'category/'+slug;
}
URLUtil.slugify = function(text) {
  if(text){
    text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
    text = text.replace(/-/gi, "_");
    text = text.replace(/\s/gi, "-");
    text = text.toLowerCase();
  }
  return text;
}
URLUtil.getShortUrl = function(post){
  return post.shortUrl ? post.shortUrl : post.url;
}
URLUtil.getDomain = function(url){
  urlObject = Npm.require('url');
  return urlObject.parse(url).hostname;
}
URLUtil.invitesEnabled = function () {
  return getSetting("requireViewInvite") || getSetting("requirePostInvite");
}
URLUtil.getOutgoingUrl = function(url){
  return Meteor.absoluteUrl() + 'out?url=' + url; 
}
// ---------------------------------- String Helper Functions ----------------------------------- //
URLUtil.cleanUp = function(s){
  return URLUtil.stripHTML(s);
}
URLUtil.stripHTML = function(s){
  return s.replace(/<(?:.|\n)*?>/gm, '');
}
/**URLUtil.stripMarkdown = function(s){
  var converter = new Markdown.Converter();
  var html_body = converter.makeHtml(s);
  return URLUtil.stripHTML(html_body);
}**/
URLUtil.trimWords = function(s, numWords) {
  expString = s.split(/\s+/,numWords);
  if(expString.length >= numWords)
    return expString.join(" ")+"…";
  return s;
}

// http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
URLUtil.checkNested = function(obj /*, level1, level2, ... levelN*/) {
  var args = Array.prototype.slice.call(arguments),
      obj = args.shift();

  for (var i = 0; i < args.length; i++) {
    if (!obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}