var filename="client/views/mockups/brand_name.js"
Template.brand_name.rendered = function(){
    qlog.info('Setting background image', filename);

    //jQuery("body" ).tabs({ active: 1 });
    //jQuery(".selector" ).tabs({ "Primary", "active", 1 });
    //$('body').css('backgroundImage','url(https://s3.amazonaws.com/media.jetstrap.com/gzcwkVMBRKCdh44kdIn0_qoll_topfull.png) no-repeat center center fixed');

    //$(".brand_name div").css("background-image", $(this).attr("src"));
    $('#page-header div').addClass('bg1');
}