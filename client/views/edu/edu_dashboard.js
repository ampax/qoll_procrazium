var filename='client/view/editor/edu/edu_dashboard.js';

Template.edu_dashboard_prof.helpers({
	topic_created_on : function(createdOn) {
		return moment(createdOn).format('MMM Do YYYY, h:mm a');
	},
	has_parent : function(item) {
		return item.parent;
	},
	has_previous_page_parent_id : function(item) {
		qlog.info('previous_page_parent_id===> ' + item.previous_page_parent_id, filename);
		return item.previous_page_parent_id != 'none';
	},
    imgs: function () {
	    qlog.info('Called the method to get all the images ... ', filename);
	    return QollImages.find(); // Where Images is an FS.Collection instance
	},
	no_img_selected: function() {
		var sel_img = Session.get("selected_topic_image"); // single image
		return sel_img == undefined;
	},
	sel_imgs: function() {
	    var sel_img = Session.get("selected_topic_image"); // single image
	    var imgs1 = QollImages.find({'_id': sel_img});
	    console.log(imgs1);
	    return imgs1;
	},
	banner_img_for_id: function(img_id) {
		qlog.info('Finding topic banner for id ---> ' + img_id, filename);
		var imgs1 = QollImages.find({'_id': img_id});
		return imgs1;
	},
  });

Template.edu_dashboard_prof.onCreated(function(){
    this.subscribe('images');

    // set the session thumbnail variable for selected pictures
    // this should be reset everytime the template is loaded so this is the best place to set this variable
    Session.set("selected_topic_image", undefined);
});

Template.edu_dashboard_prof.onRendered(function(){
    // this.subscribe('images');

    $('li.newtopic').hide();
	$('div.create_newtopic, button.cancel_create_newtopic').on('click',
        function() {
	           $('li.create_newtopic_1, li.newtopic').toggle();
	       });
});

Template.edu_dashboard.events({
	'change .myFileInput': function(event, template) {
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

        var sel_imgs = Session.get("selected_topic_image");
        console.log(Session.get("selected_topic_image"));

        var target = jQuery("img#"+this._id);
        target.toggleClass('qoll-thumbs-toggle');

        //Session.set("selected_images", sel_imgs);
        Session.set("selected_topic_image", this._id);

        console.log(Session.get("selected_topic_image"));
    },
    'click button.create-new-topic': function(event, template) {
    	var sel_img = Session.get("selected_topic_image");
    	var topic_source = $('input#topic_source').val();
    	var topic_title = $('input#topic_title').val();
    	var owner = Meteor.userId();
    	var circle = 'ChemWiki';

    	var parent_id = Router.current().params._id, num_qolls =0, num_questionnaires =0;

    	if(!topic_source) {
    		$('input#topic_source').css('border-color', 'red');
    		return;
    	} else $('input#topic_source').css('border-color', '');

    	if(!topic_title) {
    		$('input#topic_title').css('border-color', 'red');
    		return;
    	} else $('input#topic_title').css('border-color', '');

    	
    	

    	qlog.info('Storing the new topic now ... ' + sel_img + '/' + topic_source + '/' + topic_title + '/' +owner + '/_id' + parent_id, filename);

    	// return; 
    	// storeTopics : function(source, topic, owner, circle) {

    	Meteor.call('storeTopics', 
    		topic_source, topic_title, owner, circle, parent_id, num_qolls, num_questionnaires, sel_img, function(err, res){
			if(err) {
				qlog.error('Error happened while submitting the topic ... ' + topic, filename);
				qlog.error(err, filename);
			} else {
				// alert(res.msg);
				$('input#topic_source').val('');
				$('input#topic_title').val('');
				Session.set("selected_topic_image", undefined);

				$('li.create_newtopic, li.newtopic').toggle();
			}
		});
    },

});