var filename = "client/views/header/landing_page.js";

// for convenience
//var loginButtonsSession = Accounts._loginButtonsSession;

Template.landing_page.rendered = function() {
    qlog.info('Setting the extra byttons hereeeeeeeeeeeeeee...................', filename);
      // One page navigation
    $('.nav').singlePageNav({
        offset: $('.navbar').outerHeight()
    });
}


Template.landing_page.events({
    'click .smooth-scroll': function(event){
        event.preventDefault();
        $('html,body').animate({scrollTop: $('#page').offset().top}, 600);
    },
    'click .send-msg': function(event) {
        event.preventDefault();
        var name = $('#Name').val();
        var from = $('#Email').val();
        var to = "webmaster@qoll.io";
        var msg = $('#Message').val();
        var subject = "Qoll Cust Contacting: " + name;

        Meteor.call('sendContactUsEmail', from, to, subject, msg, function(err){
            if(err) {
                qlog.error('Failed sending the email' + err, filename);
            } else {
                qlog.info('Sent the email', filename);
                $('#Name').val('');
                $('#Email').val('');
                $('#Message').val('');
            }
        });
    },
    'click #login-buttons-logout' : function(event, tmpl) {
    
     qlog.info('User logout event happened', filename);
     Login.logoutFromService();
    },
    'click #login-buttons-facebook' : function(event, tmpl) {
        Login.loginWithService('facebook');
    },
    'click #login-buttons-google' : function(event, tmpl) {
        Login.loginWithService('google', function(){});
    },
    /**'click #login-buttons-password' : function() {
        var email_or_id = $('input#login-username-or-email').val();
        var password = $('input#login-password').val();
        Meteor.loginWithPassword(email_or_id, password, function (err, val) {
            if(err){
                //notify.show(i18n.translate('Signin error'), i18n.translate(err.reason));
                console.log(err);
                console.log(val);
            } else {
                console.log(val);
            }
        });**/

        /**Login.loginWithService(user : email_or_id, password : password}, function(error, val){
            if(error) {
                qlog.info('Error occured while logging in with password - ' + error, filename);
            } else {
                qlog.info('Logging in with password - ' + val, filename);
            }
        });**/
    //},

});


/**
 * Single Page Nav Plugin
 * Copyright (c) 2013 Chris Wojcik <hello@chriswojcik.net>
 * Dual licensed under MIT and GPL.
 * @author Chris Wojcik
 * @version 1.1.0
 */

// Utility
if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function($, window, document, undefined) {
    "use strict";
    
    var SinglePageNav = {
        
        init: function(options, container) {
            
            this.options = $.extend({}, $.fn.singlePageNav.defaults, options);
            
            this.container = container;            
            this.$container = $(container);
            this.$links = this.$container.find('a');

            if (this.options.filter !== '') {
                this.$links = this.$links.filter(this.options.filter);
            }

            this.$window = $(window);
            this.$htmlbody = $('html, body');
            
            this.$links.on('click.singlePageNav', $.proxy(this.handleClick, this));

            this.didScroll = false;
            this.checkPosition();
            this.setTimer();
        },

        handleClick: function(e) {
            var self  = this,
                link  = e.currentTarget,
                $elem = $(link.hash);  

            e.preventDefault();             

            if ($elem.length) { // Make sure the target elem exists

                
                // Prevent active link from cycling during the scroll
                self.clearTimer();

                // Before scrolling starts
                if (typeof self.options.beforeStart === 'function') {
                    self.options.beforeStart();
                }

                self.setActiveLink(link.hash);
                
                self.scrollTo($elem, function() { 
                 
                    if (self.options.updateHash) {
                        document.location.hash = link.hash;
                    }

                    self.setTimer();

                    // After scrolling ends
                    if (typeof self.options.onComplete === 'function') {
                        self.options.onComplete();
                    }
                });                            
            }     
        },
        
        scrollTo: function($elem, callback) {
            var self = this;
            var target = self.getCoords($elem).top;
            var called = false;

            self.$htmlbody.stop().animate(
                {scrollTop: target}, 
                { 
                    duration: self.options.speed,
                    easing: self.options.easing, 
                    complete: function() {
                        if (typeof callback === 'function' && !called) {
                            callback();
                        }
                        called = true;
                    }
                }
            );
        },
        
        setTimer: function() {
            var self = this;
            
            self.$window.on('scroll.singlePageNav', function() {
                self.didScroll = true;
            });
            
            self.timer = setInterval(function() {
                if (self.didScroll) {
                    self.didScroll = false;
                    self.checkPosition();
                }
            }, 250);
        },        
        
        clearTimer: function() {
            clearInterval(this.timer);
            this.$window.off('scroll.singlePageNav');
            this.didScroll = false;
        },
        
        // Check the scroll position and set the active section
        checkPosition: function() {
            var scrollPos = this.$window.scrollTop();
            var currentSection = this.getCurrentSection(scrollPos);
            this.setActiveLink(currentSection);
        },        
        
        getCoords: function($elem) {
            return {
                top: Math.round($elem.offset().top) - this.options.offset
            };
        },
        
        setActiveLink: function(href) {
            var $activeLink = this.$container.find("a[href='" + href + "']");
                            
            if (!$activeLink.hasClass(this.options.currentClass)) {
                this.$links.removeClass(this.options.currentClass);
                $activeLink.addClass(this.options.currentClass);
            }
        },        
        
        getCurrentSection: function(scrollPos) {
            var i, hash, coords, section;
            
            for (i = 0; i < this.$links.length; i++) {
                hash = this.$links[i].hash;
                
                if ($(hash).length) {
                    coords = this.getCoords($(hash));
                    
                    if (scrollPos >= coords.top - this.options.threshold) {
                        section = hash;
                    }
                }
            }
            
            // The current section or the first link
            return section || this.$links[0].hash;
        }
    };
    
    $.fn.singlePageNav = function(options) {
        return this.each(function() {
            var singlePageNav = Object.create(SinglePageNav);
            singlePageNav.init(options, this);
        });
    };
    
    $.fn.singlePageNav.defaults = {
        offset: 0,
        threshold: 120,
        speed: 400,
        currentClass: 'current',
        easing: 'swing',
        updateHash: false,
        filter: '',
        onComplete: false,
        beforeStart: false
    };
    
})(jQuery, window, document);