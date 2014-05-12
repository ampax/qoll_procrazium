Meteor.publish('Settings', function() {
  var options = {};
  /**if(!UserUtil.isAdminById(this.userId)){
    options = _.extend(options, {
      fields: {
        mailChimpAPIKey: false,
        mailChimpListId: false
      }
    });
  }**/
  options.userId = this.userId;
  return Settings.find(options, {reactive:false});
});