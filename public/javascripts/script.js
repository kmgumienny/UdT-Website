/**
 * author: wanjapflueger.de (c) wfp 2017
 */


jQuery(document).ready(function($) {

    /**
     * @general vars
     */

    var headerHeight = $("header").outerHeight();
    var mainHeight = $("main").outerHeight();
    var footerHeight = $("footer").outerHeight();
    var navMainWidth = $("header div.right").outerWidth();
    var navMainHeight = $("header div.right").outerHeight();
    var logoWidth = $(".logo").outerWidth();
    var windowWidth = $(window).outerWidth();

    console.log("nav width: " + navMainWidth);
    console.log("logo width: " + logoWidth);
    console.log("window width: " + windowWidth);

    /**************************************************************************************************/

    /**
     * @element header
     */

        // Hide and show header on scroll
        // –––––
        // Variables declaration
    var didScroll;
    var lastScrollTop = 0;
    var delta = 15;
    var offset = headerHeight;

    // On scroll, let the interval function know the user has scrolled
    $(window).scroll(function(event)
    {
        didScroll = true;
    });

    // run hasScrolled() and reset didScroll status
    setInterval(function()
    {
        if (didScroll)
        {
            hasScrolled();
            didScroll = false;
        }
    }, 250);


    function hasScrolled()
    {
        var st = $(this).scrollTop();

        // Users have to scroll up/down more than delta before something happens
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and they have passed the offset then add do something
        if (st > lastScrollTop && st > offset){
            // Scroll Down
            $('header').animate({'top':-headerHeight},600);
            $('.fixed').animate({'top':"0"},400);
            $('.dropdown-menu').fadeOut();
        } else {
            // Scroll Up
            $('header').animate({'top':'0'});
            $('.fixed').stop(true, true).delay(1000).animate({'top':headerHeight});
        }

        lastScrollTop = st;
    }
    if ($(window).width() > 980) {
        $('.facebook_events_wrapper').addClass('fixed');
        $('.fixed').css("top",headerHeight);
    }

    /**************************************************************************************************/

    /**
     * @element navigation
     */

        // Mobile switch

        // @windowSizeW -> $(window).outerWidth();
        // @headerContents -> $('.logo').outerWidth() + $('.right').outerWidth();
    var windowSizeW = $(window).outerWidth();
    var logoWidth = $('.logo').width();
    var langWidth = $('.mod-languages').width();
    var navWidth = $('.right nav.moduletable').outerWidth(true);
    var headerContents = navWidth;
    var spaceLeftInHeader = windowSizeW - headerContents;

    console.log('window: ' + windowSizeW + 'px');
    console.log('headerContents: ' + headerContents + 'px');

    if(spaceLeftInHeader < 0) {
        console.log('mobile: ' + spaceLeftInHeader + 'px zu wenig');
    } else {
        console.log('desktop: ' + spaceLeftInHeader + 'px übrig');
    }

    // Do the mobile switch
    var mainmenu = $('header nav');
    // if(windowWidth - logoWidth - navMainWidth < 0) {
    if($(window).width() < 1090) {
        mainmenu.addClass('mobile');
    } else {
        mainmenu.removeClass('mobile');
    }
    // menu item logout: hide Text only show icon
    $('a.logout').html("");

    // Nav mobile: make it work / toggle
    $('header nav.mobile').before('<div class="toggle_mobile"><i class="fa fa-bars "></i></div>');
    $('.toggle_mobile').on('click', function() {
        $(this).next().slideToggle();
        $('body, html').toggleClass('noscroll');
    });
    $('.mobile').css({"top":headerHeight,"height":$(window).height() - headerHeight});

    // Close mobile menu on click
    $('.mobile a').on('click', function() {
        $('.mobile').hide();
        $('body, html').toggleClass('noscroll');
    });

    // mainmenu-user User nav (login and out and so on)
    $('.moduletablemainmenu-user').css("top",headerHeight + 20);

    // Fix <main> top position because <header> is fixed
    $('main').css({"margin-top":headerHeight,"min-height":$(window).height() - headerHeight - footerHeight});

    // font Font-awesome stuff
    $('header nav span, header nav a, .moduletablemainmenu-user a, footer nav a, footer nav span').each(function() {
        if ($(this).hasClass('fa')) {
            $(this).prepend('<i class="' + $(this).attr("class") + '"></i>');
            $(this).removeClass("fa");
        }
    });

    // Make the menu actually work
    var timer;
    var delay = 200;
    $(function() {
        $("header .parent").hover(function() {
            // on mouse in, start a timeout
            var $this = $(this);
            timer = setTimeout(function() {
                $("header .parent").removeClass("hover");
                $this.addClass("hover");
                $('ul:first', $this).slideDown();
            }, delay);
        }, function() {
            // on mouse out, cancel the timer
            clearTimeout(timer);
            $(this).removeClass("hover");
            $('ul:first', this).css('display', 'none');
        });
    });

    /**************************************************************************************************/

    /**
     * @general settings
     */

    // Fix: f****** language bug with background-images in modules
    $('.all_recipes .item, main .aboutberlin .main #news .news .wrapper .item').each(function(){
        $(this).css("background-image", $(this).css("background-image").replace("/en/","/"));
    });

    // Check for Windows and toggle scrollbar
    if (navigator.appVersion.indexOf("Win")!=-1)
    {
        // windowssucks.addClass("windowssucks"); // Windows
        // windowssucks2.addClass("windowssucks"); // Windows
    } else {
        $(".facebook_events, .satellit_main_page .team, .satellit_main_page .news, .journey, .about_press, .champions .item .text, .jobbuddystory-item .content .right, .tickets_wrapper .right, .aboutberlin .slick-slider-news").addClass("macruleslinuxokay"); // this will style body for other OS (Linux/Mac)
    }

    // goodbye orphans and widows
    $('blockquote, .text p, .news-item .main .content p, .cookbook h1, .champions .content > h1, .donation_header > p, .widow, .timeline .item .description').widowFix();

    // Adjust scroll speed of element with data-scroll-speed="X"
    $.fn.moveIt = function(){
        var $window = $(window);
        var instances = [];

        $(this).each(function(){
            instances.push(new moveItItem($(this)));
        });

        window.onscroll = function(){
            var scrollTop = $window.scrollTop();
            instances.forEach(function(inst){
                inst.update(scrollTop);
            });
        }
    }

    var moveItItem = function(el){
        this.el = $(el);
        this.speed = parseInt(this.el.attr('data-scroll-speed'));
    };

    moveItItem.prototype.update = function(scrollTop){
        this.el.css('transform', 'translateY(' + -(scrollTop / this.speed) + 'px)');
    };

    // Initialization
    $(function(){
        $('[data-scroll-speed]').moveIt();
    });

    // Smooth anchor scroll
    $(function() {
        $('a[href*="#"]:not([href="#"])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - headerHeight
                    }, 1000);
                    return false;
                }
            }
        });
    });

    // Equal height for slick items
    var slickTrackHeight = $('.slick-equalheight .slick-track').height();
    console.log(slickTrackHeight);
    $('.slick-equalheight .item > div').css("height", slickTrackHeight);

    // clean nodes
    function clean(node)
    {
        for(var n = 0; n < node.childNodes.length; n ++)
        {
            var child = node.childNodes[n];
            if
            (
                child.nodeType === 8
                ||
                (child.nodeType === 3 && !/\S/.test(child.nodeValue))
            )
            {
                node.removeChild(child);
                n --;
            }
            else if(child.nodeType === 1)
            {
                clean(child);
            }
        }
    }
    clean(document.body);

    // Standort auswahl Seite
    $('.page_locations').css({"min-height":$(window).height() - headerHeight});
    $('.page_locations button.button').on('click', function() {
        $(this).next('.text').slideToggle();
    });


    // mod-languages module language switch changer sprachauswahl sprache
    // Remove language text and keep flag
    $('a.dropdown-toggle').contents()
        .filter(function() {
            return this.nodeType == 3; //Node.TEXT_NODE
        }).remove();
    // Padding produces empty space so we use height instead and padding 0 x;
    $('header .mod-languages a.dropdown-toggle').css("height", headerHeight);
    $('.dropdown-toggle').on('click',function(e) {
        $('.dropdown-menu').slideToggle();
        e.preventDefault();
    });
    /**************************************************************************************************/

    /**
     * @page home
     */

    $('.slick-slider_home .item').css("height",$(window).height() - headerHeight);

    /**************************************************************************************************/

    /**
     * @page home ar arabic arabisch
     */

    $('.home_ar').css("min-height",$(window).height() - headerHeight);

    /**************************************************************************************************/

    /**
     * @page press
     */

    $('.press .wrapper').css("min-height",$(window).height() - headerHeight);

    /**************************************************************************************************/

    /**
     * @page recipes rezepte
     */

    $('.all_recipes .item a').css("height",$('.all_recipes .item').outerHeight(true));

    /**************************************************************************************************/

    /**
     * @page champions
     */

    // As a matter of fact ipad somehow thinks its bigger than it is. 760 -> 780px (768native)
    if($(window).outerWidth() > 780) {
        $('.champions, .champions .item, .champions .item .content, .champions .item .text').css({"height":$(window).height() - headerHeight});
    } else {
        $('.champions .item .text').css({"top": - headerHeight,"margin-bottom": - headerHeight});
    }

    // Trying to hash slick urls
    // .champions .slick-slider .slick-slider-champions
    // <div class="item" data-url="{$JOOMLA_TITLE_ALIAS}"
    // URL: projects/champions/?slide=[data-url]
    // Goal -> Set slide with data-url == $_GET["slide"] as current slide

    // Natürlich nur wenn es den slider hier auch gibt
    $(function() {
        if( $('.slick-slider-champions').length ) {
            // 1.
            // Get parameter from url
            $.urlParam = function(name) {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                if (results==null){
                    return null;
                } else{
                    return decodeURI(results[1]) || 0;
                }
            }
            // This is the requested slide
            var requestedSlide = $.urlParam('slide');

            // 2.
            // Check if parameter exists among the actual slides

            $(function() {
                i = 0;
                $('.slick-slider-champions > .item').each(function() {
                    $(this).addClass("slidenummer" + i);
                    if($(this).data("url") == requestedSlide) {
                        $('.slick-slider-champions').slick({
                            initialSlide: i,
                            asNavFor: '.slick-slider-champions-nav',
                            pauseOnHover: false,
                            pauseOnFocus: false,
                            autoplay: false,
                            autoplaySpeed: 4500,
                            dots: false,
                            cssEase: 'ease-in-out',
                            arrows: true,
                            speed: 800,
                            touchThreshold: 5,
                            slidesToShow: 1,
                            focusOnSelect: true,
                            infinite: true,
                            fade: true,
                            swipeToSlide: false
                        });
                        $('.slick-slider-champions-nav').slick({
                            initialSlide: i,
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            arrows: false,
                            fade: false,
                            focusOnSelect: true,
                            swipeToSlide: true,
                            variableWidth: true,
                            centerMode: true,
                            dots: false,
                            infinite: false,
                            asNavFor: '.slick-slider-champions'
                        });
                    }
                    i++;
                });
            });
        }
    });


    /**************************************************************************************************/

    /**
     * @page about
     */

    if($(window).width() < 480) {
        $('.kitchenhub .gallery').css({"height":$(this).width()});
        $('.kitchenhub .gallery .slick-list').css({"height":"100%"});
    }

    /**************************************************************************************************/

    /**
     * @page jobbuddys job buddies stories story _> main
     */

    // jobbuddy Story items
    if($(window).width() > 980) {
        $('.jobbuddystory-item .content .right').css({"height":$(window).height() - headerHeight});
        $('.jobbuddystory-item .content .left').css({"height":$('.jobbuddystory-item .content .right').outerHeight()});
    }

    /**************************************************************************************************/

    /**
     * @page job buddy program
     */

        // toggle email button bottom left
    var jobbMail = $('.jobbuddys .email, .building_bridges .email');
    jobbMail.addClass("hidemail");
    $(window).scroll(function() {
        if ($(this).scrollTop() < 30)
        {
            jobbMail.addClass("hidemail");
        }
        else {
            jobbMail.removeClass("hidemail");
        }
        if ($(this).scrollTop() > $(document).outerHeight() - footerHeight - $(window).height() * 1.5)
        {
            jobbMail.addClass("hidemail");
        }
    });

    /**************************************************************************************************/

    /**
     * @page classes
     */

    $('.tickets .item').on('click', function() {
        // alert($(this).data("id"));
        // $("#" + $(this).data("id")).slideDown();
    });

    /**************************************************************************************************/

    /**
     * @page aboutberlin
     */

    $('.scrollme').on('click',function() {
        $("body").animate({ scrollTop: window.pageYOffset + $(window).height()}, 800);
    });

    // about text readmore
    // $('.aboutberlin .fulltext').hide();
    // $('.aboutberlin .text .intro').on('click',function() {
    //   $('.aboutberlin .text .intro, .aboutberlin .text .substr').hide();
    //   $('.aboutberlin .fulltext').show();
    //   $('.aboutberlin .videos_wrapper').fadeIn();
    // });

    // Pres review - Limit items
    var limiPressViewItems = 20;
    $('.aboutberlin .pressreview .item').hide();
    $('.aboutberlin .pressreview .item:lt('+limiPressViewItems+')').show();
    $('.aboutberlin .pressreview .item:nth-child('+limiPressViewItems+')').after('<div class="item expand"><a href="javascript: void(0);"><span class="title">Show more</span><span class="date"></span><span class="publisher"></span></a></div>');

    $('.aboutberlin .pressreview .item.expand').on('click',function() {
        $('.aboutberlin .pressreview .item').show();
        $(this).hide();
    });

    // Timeline for big screens
    if ($(window).width() > 1024) {
        var timeline = $('.timeline');
        var scrollSpeed = timeline.attr('data-scroll-speed');
        console.log("scrollSpeed: " + scrollSpeed);
        $('.aboutberlin').css("min-height", timeline.outerHeight(true) * scrollSpeed + $(window).height() * 0.45 + footerHeight * scrollSpeed / 2);
        timeline.delay(800).fadeIn(800);

        $('.aboutberlin .main').css({"width":$(window).width() - timeline.outerWidth(true)});
    }

    // Team
    $('.aboutberlin .team .item').each(function() {
        // add trigger
        $('.contactinfo', this).before('<div class="trigger_contactinfo fa fa-share">');
    });
    $('.aboutberlin .team .item').on('click',function() {
        $('.trigger_contactinfo', this).toggleClass("active").next('.contactinfo').toggleClass("active");
    });

    // Newsfeed add images
    // We delay the loading of the images to speed up the page load
    $(window).load(function () {
        setTimeout(function() {
            $('.aboutberlin .slick-slider-news .item').each(function() {
                $(this).css("background-image","url('" + $(this).data("background") + "')");
            });
            // Fix this aweful language bug when joomla thinks that /en/ is actually a folder
            $('.aboutberlin .slick-slider-news .item').each(function() {
                $(this).css("background-image",$(this).css("background-image").replace("/en/","/"));
            });
        }, 2000)
    });
    /**************************************************************************************************/

    /**
     * @page location [/berlin, /hamburg]
     */

    // Socials
    if($(window).width() > 480) {
        $('.socials').css({"top":$(window).height() / 2 - $('.socials').outerHeight(true) / 2})
    }

    // Facebook Events
    $(function() {

        // Die einzelnen Events werden gewrapped und in vergangen und aktuell eingeteilt
        $('.facebook_events .item').not('.past').wrapAll('<div class="items">');
        $('.facebook_events .past').wrapAll('<div class="items past">');

        // Delay .facebook_events_wrapper because its too big and ugly to be loaded at the beginning... oO
        $('.facebook_events_wrapper').delay(1000).fadeIn();

        // Close events Button: hide at the beginning
        $('.closeFe').hide();
        var closeFe = false;

    });

    // Wenn die Seite vollständig geladen ist, schauen wir mal wie viel Platz die Events einnehmen
    $(window).load(function () {

        // Und weil das nie klappt warten wir einfach noch 2 Sekunden
        setTimeout(function() {
            var totalWidth = 0;
            $('.facebook_events .items').each(function() {
                totalWidth += parseInt($(this).outerWidth());
            });
            // alert(totalWidth);

            // Nur wenn die Events über den Bildschirmrand hinaus gehen, brauchen wir hier weiter machen
            if(totalWidth > $(window).width()) {
                var worthit = true;
            } else {
                var worthit = false;
            }
            // alert(worthit);

            // wenn es genügend events gibt
            if (worthit) {

                // Next Button
                $('.facebook_events_wrapper').append('<div class="next fa fa-arrow-right"></div>');

                // Hinweis, dass es auch seit einiger Zeit möglich ist horizontal zu scrollen
                var showHint = false;

                // Scroll x on mouseover & click Next Button
                $('.facebook_events_wrapper .next').on('mouseover click',function() {
                    x = (($('.facebook_events').width() / 3)) + $('.facebook_events').scrollLeft();
                    $('.facebook_events').animate({
                        scrollLeft: x,
                    });

                    if(!showHint) {
                        var hintText = "Use your Mouse to scroll horizontally";
                        $('.facebook_events_wrapper').append('<div class="hint fa fa-arrows-h"><span>' + hintText + '</span></div>');
                    }

                    // Hint toggle
                    $('.hint').slideDown();
                    setTimeout(function(){
                        $('.hint').fadeOut();
                    }, 5000);
                    showHint = true;
                });

                // Next Button ausblenden wenn das Ende der Seite erreicht wird
                $('.facebook_events').scroll(function() {
                    var endoftheworld = totalWidth - $(this).scrollLeft() - $(window).width() - 300;
                    // console.log("total: " + totalWidth + " worthit: " + worthit);

                    if(endoftheworld <= 0) {
                        $('.facebook_events_wrapper .next').fadeOut()
                    } else {
                        $('.facebook_events_wrapper .next').fadeIn()
                    }
                });
            }

            // wenn es NICHT genügend events gibt
            else {

            }

        }, 2000);
    });

    $('.facebook_events .item').on('click',function() {
        $('.facebook_events_wrapper').addClass('active');
        $('.facebook_events .item').addClass('active');
        $(this).addClass('activehighlight')
        $('.facebook_events:not(.area-is-active)').addClass('area-is-active');

        // Close Button anzeigen
        closeFe = true;
        if(closeFe) {
            $('.closeFe').delay(3000).slideDown(200);
        }
    });
    // Events schließen und Close Button ausblenden
    $('.closeFe').on('click',function() {
        $('.facebook_events .item').removeClass('active');
        $('.closeFe').hide();
        $('.facebook_events_wrapper').removeClass('active');
        closeFe = false;
    });

    // Facebook Events - END


    // button link extern shop classes satellites .externalshop
    var externalshop = $('.externalshop');
    $('.satellit_main_page .socials').prepend(externalshop);
    if($(window).width() < 481) {
        externalshop.css("bottom",$('.satellit_main_page .socials').css("height"));
    }

    // Fix .hello height
    $('.satellit_main_page .hello').css({'height':$(window).height() - headerHeight});

    // Add scroll down button on .hello
    $('.satellit_main_page .hello').append('<a href="#about" class="scrolldown fa fa-chevron-down"></a>');

    // Fix default header background image text
    // Aus irgendeinem Grund funktionieren F2C und Articles anywhere hier nicht gut zusammen, da bei der Ausgabe über das Plugin von Articles Anywhere an [imag_fulltext] aus #__content automatisch [introtext] angehängt wird. Warum auch immer...
    $('.hello .image').html('');

    // news height
    $('.news').css({'height':$('.about_text .text').outerHeight()});

    // Empty Satellit
    if($('.about_text .text').is(':empty') && !$('.news').length) {
        // add text
        $('.about_text .text').html("No further information provided. <br>We still #maketheworldabetterplate!").css("text-align","center");
    } else if ($('.about_text .text').is(':empty') && $('.news').length) {
        // make the text container disappear and prepare for socials
        $('.about_text').css({"padding":"0","justify-content":"center","align-items":"center"}).addClass("flex");
        // adjust .news size
        $('.news').css({"max-width":"none","width":"100%"});
        if($('.facebook_events').length) {
            $('.satellit_main_page .hello').css({'height':$(window).height() - headerHeight - $('.facebook_events').outerHeight(true) - $('.about .headline').outerHeight(true) - $('.about .inner').outerHeight(true)});
        } else {
            $('.satellit_main_page .hello').css({'height':$(window).height() - headerHeight - $('.about .headline').outerHeight(true) - $('.about .inner').outerHeight(true)});
        }
    }

    // Close support crowdfunding iframe overlay
    $('.overlay').prepend('<div class="close_parent fa fa-times"></div>');
    $('.hello .support .trigger').on('click',function() {
        $('.overlay').addClass("flex-i");
    });

// Newsletter trigger
    $('.newsletter').prepend('<div class="close_parent fa fa-times"></div>');
    $('.newsletter-trigger').on('click',function() {
        $('.newsletter').addClass("flex-i");
    });

// close newsletter with button click
    $('.close_parent').on('click', function() {
        $(this).parent().fadeOut(function() {
            $(this).removeClass("flex-i");
        });
    });


    /**************************************************************************************************/

    /**
     * @page: 404 error
     */

    $('.errorpage').css("height",$(window).height() - headerHeight);

    /**************************************************************************************************/


});
