var filename='lib/i18n/i18n.js';

i18n = {};


i18n.translations = [];

i18n.translate = function (str) {
  //var lang = URLUtil.getSetting('language', 'hi');
  var lang = UserUtil.getLocale(Meteor.user());
  if(i18n.translations[lang] && i18n.translations[lang][str]){
    return i18n.translations[lang][str];
  }
  return str; 
};

/**i18n = {

  translations: [],

  translate: function (str) {
    var lang = URLUtil.getSetting('language', 'hi');
    if(i18n.translations[lang] && i18n.translations[lang][str]){
      return i18n.translations[lang][str];
    }
    return str; 
  }

};**/

if(Meteor.isClient){
  Handlebars.registerHelper('i18n', function(str){
    var rt = i18n.translate(str);
    return rt;
  }); 
}