var filename="client/views/editor/temp_editor/quickedit_qoll.js";

var QuickQollEditHooks = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        //this.event.preventDefault();
        //console.log(insertDoc);
        
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

        console.log('========================>>>>');
        console.log(insertDoc);
        console.log('========================>>>>');
        console.log(updateDoc);
        console.log('========================');
        console.log(currentDoc);
        console.log('========================');

        // return;


        // store the qoll in database now
        var qollIdToEdit = this.docId;
        var access = QollConstants.GROUPS.PVT;
        var accessGroups = undefined;
        var tagArr = [];

        qlog.info('Qoll to update - ' + qollIdToEdit, filename);

        // return;

        Meteor.call("updateQollMaster", qoll_txt, send_to, tagArr, QollConstants.QOLL_ACTION_SEND, access, qollIdToEdit, accessGroups, sel_img_ids, function(error, msg) {
            if (error) {
                qlog.error('Error occured while converting - ' + qoll_txt + '/n to markdown - ' + error, filename);
                // QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: ' + error + '/' + msg);
            } else {
                // QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: ' + msg.msg);
                Session.set("selected_image_ids", new Array());
            }
        });

        qlog.info('Storing the qoll now - ' + qoll_txt, filename);

        this.done();

        return false;
    },
};

AutoForm.addHooks('quickQollEditForm', QuickQollEditHooks);

Template.quickedit_qoll.helpers({
	quickQollSchema: function() {
		return Schemas.quick_qoll;
	},
	qoll : function() {
		/** var id = Session.get('edit_qoll_id');

		Meteor.call("getQollById", id, function(error, doc) {
			if (error) {
				qlog.error('Error on qoll retrieval  - ' + error, filename);
          		console.log(error);
			} else {
				console.log('Recieved qoll ================>')
          		console.log(doc);
          		return doc;
			}
		});

		return {}; **/
		
		// return QollForQuestionaireId.find({_id : Session.get('questionnaire_id')}).fetch()[0];

		var id = Session.get('edit_qoll_id');

		var q = RawQollForId.find({_id : id}).fetch()[0];

		return RawQollForId.find({_id : id}).fetch()[0];

		//var retq = {'title' : q.title, 'text' : q.qollText};
		//console(retq);

		//return {'title' : q.title, 'text' : q.qollText};
	},

	qollDoc : function() {
		var id = Session.get('edit_qoll_id');
		var doc = RawQollForId.find({_id : id}).fetch()[0];

		/** var img_ids = doc.imageIds;
		if(!img_ids) img_ids = new Array();
		Session.set("selected_image_ids", img_ids); **/

		return doc;
	},

	qoll_txt: function() {
		return JSON.stringify(RawQollForId.find().fetch());
	},
	qoll_title: function() {
		var doc = RawQollForId.find().fetch();
		return doc.title;
	},
	is_cat_mult: function(cat) {
		return 'Multiple' === cat;
	},
	is_cat_blank: function(cat) {
		return 'blanks' === cat;
	},
	sel_imgs: function() {
		var sel_imgs = Session.get("selected_image_ids");

		qlog.info('++++++++++++++++++ ' + sel_imgs, filename);

		if(sel_imgs) {
			var imgs1 = QollImages.find({'_id': {$in: sel_imgs}});
			console.log(imgs1);
			return imgs1;
		}
		else {
			Session.set("selected_image_ids", new Array());
			return [];
		}
	},
	imgs: function () {
		qlog.info('Called the method to get all the images ... ', filename);
		return QollImages.find(); // Where Images is an FS.Collection instance
	},
});


Template.quickedit_qoll.events({
    'click #menu-toggle' : function(e,t) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    },
    'click button#bkButton' : function(e,t){
        e.preventDefault();
        Router.go('all_qolls');
    },
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


Template.quickedit_qoll.onCreated(function(){
	var id = Session.get('edit_qoll_id');
	Meteor.subscribe('RAW_QOLL_FOR_ID_PUBLISHER', {_id : id});

	this.subscribe('images');
});

Template.quickedit_qoll.rendered = function() {
    //set the background of the selected box
    $('li#qollshop').css('background-color', 'firebrick');
};
