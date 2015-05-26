var filename='client/views/editor/temp_editor/quick_qoll.js';

/**
# Who was Rani laxmibai?
* text Identify the women from a small kingdom in northern part of U.P. to have fought with English rule in 1857, died in 1858
*hint She was a warrior, a princess, and a queen of the small Maratha kingdom Jhansi
* answer A Women
- A Women
- A Girl
- A Man
- I dont know who


# sadfsafsafasfsafasfasdfsadf
 * sdfsafsfsadfasfsadfasdfsadfasfasd
- fasdfasfasfasfsafasfasdfsaf
- sdfsadfasfsafsafsafsafsdfsdfasdf

**/

var QuickQollHooks = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        console.log(insertDoc);
        var send_to = insertDoc.send_to;
        var title = insertDoc.title;
        var text = insertDoc.qollText;
        var options = insertDoc.qollTypes;
        var sel_img_ids = Session.get("selected_image_ids");
        var type = QollConstants.EDITOR_MODE.QUICK;

        var qoll_txt = '\n# ' + title + '\n*text ' + text;
        options.forEach(function(opt){
            qoll_txt = qoll_txt + '\n- ' + opt;
        });



        console.log(qoll_txt);


        // store the qoll in database now
        var qollIdToEdit = undefined;
        var access = QollConstants.GROUPS.PVT;
        var accessGroups = undefined;
        var tagArr = [];

        Meteor.call("addQollMaster", qoll_txt, send_to, tagArr, QollConstants.QOLL_ACTION_SEND, access, qollIdToEdit, accessGroups, sel_img_ids, function(error, msg) {
            if (error) {
                qlog.error('Error occured while converting - ' + qoll_txt + '/n to markdown - ' + error, filename);
                QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: ' + error + '/' + msg);
            } else {
                QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: ' + msg.msg);
                Session.set("selected_image_ids", new Array());
                // Send the emails now
                // if a questionnaire is created, send the questionnaire email 
                // if single qolls are created with no questionnaire, then send no emails
                if(msg.questId) {
                    Meteor.call('sendQollstionnaireMail', msg.questId, function(err, data) {
                        if (err) {
                            qlog.info('Failed sending the email - ' + msg.questId + '/' + err, filename);
                        } else {
                            qlog.info('Sent the email - ' + msg.questId + ', message - ' + data, filename);
                        }
                    });
                }
                //this.done();
                //edtr.setValue('', 1);
            }
        });

        qlog.info('Storing the qoll now - ' + qoll_txt, filename);

        this.done();
        //console.log(updateDoc);
        //console.log(currentDoc);
        //You must call this.done()!
        //this.done(); // submitted successfully, call onSuccess
        //this.done(new Error('foo')); // failed to submit, call onError with the provided error
        //this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
        return false;
    },
};

AutoForm.addHooks('quickQollForm', QuickQollHooks);

Template.quick_qoll.helpers({
  quickQollSchema: function() {
    return Schemas.quick_qoll;
  },
  imgs: function () {
    qlog.info('Called the method to get all the images ... ', filename);
    return QollImages.find(); // Where Images is an FS.Collection instance
  },
  sel_imgs: function() {
    var sel_imgs = Session.get("selected_image_ids");
    var imgs1 = QollImages.find({'_id': {$in: sel_imgs}});
    console.log(imgs1);
    return imgs1;
  },
});

Template.quick_qoll.events({
    "change .myFileInput": function(event, template) {
        console.log('I am called ....');
        /**var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            console.log(files[i]);
          // Images.insert(files[i], function (err, fileObj) {
            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
          //});
        }**/

        FS.Utility.eachFile(event, function(file) {
            console.log(file);
            // if the image type is GIF, then store it as it is

            // if the image type is anything other than GIF, convert it to JPEG and store it
            var newFile = new FS.File(file);
            var galleryId = Meteor.user()._id;
            newFile.metadata = { owner : Meteor.user()._id, gallery : galleryId };

            QollImages.insert(newFile, function (err, fileObj) {
                if(err) {
                    qlog.info('Error happened while processing/storing the image - ' + err, filename);
                    console.error(err);
                } else {
                    // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                    qlog.info('Inserted the image - ' + fileObj._id, filename);
                    console.log(fileObj);
                    console.log('URL is ===================>');
                    //console.log(fileObj.url);
                    //fileObj.metadata.url = '/cfs/files/images/' + this._id;
                    //QollImages.update(Meteor.user()._id, fileObj);
                }
              
            });
        });
    },
    'click div.img-container > .qoll-thumbs': function(event, template) {
        event.preventDefault();
        //console.log(this);

        //console.log(QollImages.findOne({_id : this._id}));

        //console.log('Setting the default toggle class here');
        //$(this).toggleClass( "qoll-thumbs-toggle" );

        var sel_imgs = Session.get("selected_image_ids");
        console.log(Session.get("selected_image_ids"));

        var target = jQuery("img#"+this._id);
        target.toggleClass('qoll-thumbs-toggle');

        var sel_imgs_tmp = _.without(sel_imgs, this._id);

        if(sel_imgs.length === sel_imgs_tmp.length) {
            sel_imgs_tmp.push(this._id);
        }

        //Session.set("selected_images", sel_imgs);
        Session.set("selected_image_ids", sel_imgs_tmp);

        console.log(Session.get("selected_image_ids"));
    },
});


Template.quick_qoll.onCreated(function(){
    this.subscribe('images');

    // set the session thumbnail variable for selected pictures
    // this should be reset everytime the template is loaded so this is the best place to set this variable
    Session.set("selected_image_ids", new Array());

    // toggle the class on click
    //console.log('Setting the default toggle class here');
    //$( ".qoll-thumbs" ).click(function() {
    //  $( this ).toggleClass( "qoll-thumbs-toggle" );
    //});
}); 

Template.quick_qoll.rendered = function() {
    // $( "img.qoll-thumbs" ).toggleClass( "qoll-thumbs-toggle" );
    
    //$( "img.qoll-thumbs" ).click(function() {
    //  $( this ).toggleClass( "qoll-thumbs-toggle" );
    //});
};

renderQollToEmails = function(x) {
    // qlog.info('called render qoll to emails method', filename);
    // console.log(x);
    return Blaze.toHTMLWithData(Template.quick_qoll_send_to, x);
    // return x.email + x.name;
};

renderQollToEmailsCb = function(x) {
    // qlog.info('Called the render-to-qoll-emails callback', filename);
    // console.log(x);
};


// ------------------------------------------------------ //
  Template.images.helpers({
    randImg: function() {
      //return Images.findOne();
      return QollImages.findOne()
    },
    imgs: function() {
      return QollImages.find();
      // return QollImagesPub.find();
    }
  });

  Template.uploadForm.events({
    'change .myFileInput': function(event, template) {
        FS.Utility.eachFile(event, function(file) {
          var newFile = new FS.File(file);
          QollImages.insert(newFile, function (err, fileObj) {
            //If !err, we have inserted new doc with ID fileObj._id, and
            //kicked off the data upload using HTTP
          });
        });
      }
  });

