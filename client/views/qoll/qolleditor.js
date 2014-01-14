var filename="client/views/qoll/qolleditor.js";

/**
Template.qolleditor.events({
	'click .preview-qoll': function(event) {
		qlog.info("Clicked on preview-qoll", filename);
		$(".editor-writer").addClass("is-invisible");
		jQuery(".editor-writer").removeClass("is-invisible");
	},
});
**/
Template.qolleditor.rendered = function() {
	qlog.info('clicked on rendered', filename);
	jQuery('.preview-qoll').click(function(){
		//alert('clicked');
		jQuery(".editor-writer").addClass("is-invisible");
		jQuery(".preview-qoll").addClass("is-invisible");
		jQuery(".editor-preview").removeClass("is-invisible");
		jQuery(".write-qoll").removeClass("is-invisible");
	});

	jQuery('.write-qoll').click(function(){
		//alert('clicked');
		jQuery(".editor-writer").removeClass("is-invisible");
		jQuery(".preview-qoll").removeClass("is-invisible");
		jQuery(".editor-preview").addClass("is-invisible");
		jQuery(".write-qoll").addClass("is-invisible");
	});
}