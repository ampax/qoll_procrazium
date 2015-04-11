var filename='lib/collections/Images.js';




// temporaryrrrrrr
var createSquareThumb = function(fileObj, readStream, writeStream) {
  var size = '96';
  gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
};

thumbStore_1 = new FS.Store.GridFS("thumbs_1", { transformWrite: createSquareThumb});






/******  Published image collection  ******/
QollImagesPub =  new Mongo.Collection('qoll-images');

/*****  Core image collections  ****/
imageStore = new FS.Store.GridFS("images1");

//thumbStore = new FS.Store.GridFS("thumbs", { transformWrite: createThumb, path: "~/uploads" });

jpegStore = new FS.Store.GridFS("jpeg", { beforeWrite : changeExtension, transformWrite: createJpeg });

QollImages = new FS.Collection("images", {
    stores: [
      thumbStore_1,
      new FS.Store.GridFS("images"),
      new FS.Store.GridFS("thumbs", {
        transformWrite: function(fileObj, readStream, writeStream) {
          // Transform the image into a 10x10px thumbnail
          gm(readStream, fileObj.name()).resize('40', '40').stream().pipe(writeStream);
        }
      })
    ],
    filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});

QollImages.allow({
 insert: function(userId, doc){
 	return true;//return doc && Meteor.userId && userId == doc.userId;
 },
 update: function(userId, doc){
 	return true;//return doc && Meteor.userId && userId == doc.userId;
 },
 remove: function(userId, doc){
 	return true;//return doc && Meteor.userId && userId == doc.userId;
 },
 download: function(userId, doc){
 	return true;//return doc && Meteor.userId && userId == doc.userId;
 }
});


/****  Image processing  ****/
var createThumb = function(fileObj, readStream, writeStream) {
  // Transform the image into a 10x10px thumbnail
  gm(readStream, fileObj.name()).resize('10', '10').stream().pipe(writeStream);
};

var createJpeg = function(fileObj, readStream, writeStream) {
  // Transform the image into a 10x10px PNG thumbnail
  gm(readStream, fileObj.name()).resize('60', '60').stream().pipe(writeStream); //'JPEG'
  // The new file size will be automatically detected and set for this store
};

var changeExtension = function(fileObj) {
  // We return an object, which will change the
  // filename extension and type for this store only.
  return {
    extension: 'jpeg',
    type: 'image/jpeg'
  };
}




