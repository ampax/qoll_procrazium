var filename = "client/views/header/header_awesome.js";
Template.header_awesome.rendered = function()
{// Close bootstrap's dropdown menu after clicking
    $('.collapse-onclick').each(function() {
        $(this).on("click", function () {
            var $obj = $($(this).parents('.in')[0]);
            $obj.animate({'height': '1px'}, function() {
                $obj.removeClass('in').addClass('collapse');
            });
        });
    });
};

