Settings = new Meteor.Collection('settings');

Settings.allow({
  insert: UserUtil.isAdminById
, update: UserUtil.isAdminById
, remove: UserUtil.isAdminById
});

