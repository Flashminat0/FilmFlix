$(function () {
    extraNavFuncs();
    setUpSpecialNavs();
    setUpDropdownSubs();
    setUpLightBox();
    setUpVisibilityToggle();
    setUpClassToggle();
    addKeyBoardSupport();
    setUpImgProtection();

    $('a[onclick^="scrollToTarget"]').click(function (e) {
        e.preventDefault()
    });
    $('.nav-item [data-active-page]').addClass($('.nav-item [data-active-page]').attr('data-active-page'));
    $('[data-toggle="tooltip"]').tooltip();
});


$(window).on('load', function () {
    animateWhenVisible();
    $('#page-loading-blocs-notifaction').addClass('preloader-complete');
})


function setUpSpecialNavs() {
    $('.navbar-toggler').click(function (e) {
        var targetNav = $(this).closest('nav');
        var targetMenu = targetNav.find('ul.site-navigation');
        var newMenu = targetMenu.clone();

        if (targetMenu.parent().is('.fullscreen-nav, .sidebar-nav')) {
            e.stopPropagation();
            targetMenu.parent().addClass('nav-special');

            if (!$(this).hasClass('selected-nav')) {
                $(this).addClass('selected-nav');
                var navClasses = targetNav.attr('class').replace('navbar', '').replace('row', '');
                var menuClasses = targetMenu.parent().attr('class').replace('navbar-collapse', '').replace('collapse', '');

                if ($('.content-tint').length = -1) {
                    $('body').append('<div class="content-tint"></div>');
                }

                newMenu.insertBefore('.page-container').wrap('<div class="blocsapp-special-menu ' + navClasses + '"><blocsnav class="' + menuClasses + '">');
                $('blocsnav').prepend('<a class="close-special-menu animated fadeIn animDelay06"><div class="close-icon"></div></a>');

                animateNavItems();

                setTimeout(function () {
                    $('.blocsapp-special-menu blocsnav').addClass('open');
                    $('.content-tint').addClass('on');
                    $('body').addClass('lock-scroll');
                }, 10);
            } else {
                $('.close-special-menu').toggleClass('fadeOut fadeIn animDelay06 animSpeed02');
                $('.blocsapp-special-menu blocsnav').removeClass('open');
                $('.selected-nav').removeClass('selected-nav');

                setTimeout(function () {
                    $('.blocsapp-special-menu').remove();
                    $('body').removeClass('lock-scroll');
                    $('.nav-special').removeClass('nav-special');
                }, 300);
            }
        }
    });


    $('body').on("mousedown touchstart", ".content-tint, .close-special-menu", function (e) {
            $('.content-tint').removeClass('on');
            $('.selected-nav').click();

            setTimeout(function () {
                $('.content-tint').remove();
            }, 10);
        }
    ).on("click", ".blocsapp-special-menu a", function (e) {
        if (!$(e.target).closest('.dropdown-toggle').length) {
            $('.close-special-menu').mousedown();
        }
    });


    function animateNavItems() {
        var animationStyle = 'fadeInRight';
        var delay = 0;
        var increaseVal = 60;

        if ($('.blocsapp-special-menu blocsnav').hasClass('fullscreen-nav')) {
            animationStyle = 'fadeIn';
            increaseVal = 100;
        } else if ($('.blocsapp-special-menu').hasClass('nav-invert')) {
            animationStyle = 'fadeInLeft';
        }

        $('.blocsapp-special-menu blocsnav li').each(function () {
            if ($(this).parent().hasClass('dropdown-menu')) {
                $(this).addClass('animated fadeIn');
            } else {
                delay += increaseVal;
                $(this).attr('style', 'animation-delay:' + delay + 'ms').addClass('animated ' + animationStyle);
            }
        });
    }
}


function extraNavFuncs() {

    $(".site-navigation a").click(function (e) {
        if (!$(e.target).closest('.dropdown-toggle').length) {
            $(".navbar-collapse").collapse('hide');
        }
    });


    $("a.dropdown-toggle").click(function (e) {
        $(this).parent().addClass('target-open-menu');
        $(this).closest('.dropdown-menu').find('.dropdown.open').each(function (i) {
            if (!$(this).hasClass('target-open-menu')) {
                $(this).removeClass('open');
            }
        });
        $('.target-open-menu').removeClass('target-open-menu');
    });


    $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
        return openSubDropdown($(this));
    });


    $('body').on("click", ".dropdown-menu a.dropdown-toggle", function (e) {
        return openSubDropdown($(this));
    });


    function openSubDropdown(target) {
        var $el = target;
        var $parent = target.offsetParent(".dropdown-menu");
        if (!target.next().hasClass('show')) {
            target.parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        var $subMenu = target.next(".dropdown-menu");
        $subMenu.toggleClass('show');

        target.parent("li").toggleClass('show');

        target.parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
            $('.dropdown-menu .show').removeClass("show");
        });

        if (!$parent.parent().hasClass('navbar-nav')) {
            if (!target.closest('.nav-special').length) {
                $el.next().css({"top": $el[0].offsetTop, "left": $parent.outerWidth() - 4});
            }
        }

        return false;
    }
}


function scrollToTarget(D, T) {
    var speed = 'slow';

    if (D == 0) {
        D = $(T).closest('.bloc').height();
    } else if (D == 1) {
        D = 0;
    } else if (D == 2) {
        D = $(document).height();
    } else {
        D = $(D).offset().top;
        if ($('.sticky-nav').length) {
            D -= $('.sticky-nav').outerHeight();
        }
    }

    if ($(T).is("[data-scroll-speed]")) {
        speed = $(T).attr('data-scroll-speed');

        if (parseInt(speed)) {
            speed = parseInt(speed);
        }
    }


    $('html,body').animate({scrollTop: D}, speed);
    $(".navbar-collapse").collapse('hide');
}


function animateWhenVisible() {
    hideAll();
    inViewCheck();

    $(window).scroll(function () {
        inViewCheck();
        scrollToTopView();
        stickyNavToggle();
    });
};


function setUpDropdownSubs() {
    $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');

        var targetMenu = $(this).parent().children('.dropdown-menu');
        var leftVal = targetMenu.offset().left + targetMenu.width();
        if (leftVal > $(window).width()) {
            targetMenu.addClass('dropmenu-flow-right');
        }
    });
}


function stickyNavToggle() {
    if ($('.sticky-nav').length) {
        var stickyNav = $('.sticky-nav');
        var offsetVal = stickyNav.offset().top;
        var classes = "sticky";
        var targetContainer = $('.page-container');
        var isFillScreenSticky = stickyNav.hasClass('fill-bloc-top-edge');

        if (isFillScreenSticky) {
            targetContainer = $('.fill-bloc-top-edge.sticky-nav').parent();
            classes = "sticky animated fadeInDown";
        }

        if (stickyNav.hasClass('sticky')) {
            offsetVal = stickyNav.attr('data-original-offset')
        }

        if ($(window).scrollTop() > offsetVal) {
            if (!stickyNav.hasClass('sticky')) {
                stickyNav.addClass(classes).attr('data-original-offset', offsetVal);
                offsetVal = stickyNav.height();

                if (isFillScreenSticky) {
                    stickyNav.css('background', getBlocBgColor(targetContainer));
                    offsetVal += parseInt(targetContainer.css('padding-top'));
                }

                targetContainer.css('padding-top', offsetVal);
            }
        } else if (stickyNav.hasClass('sticky')) {
            stickyNav.removeClass(classes).removeAttr('style');
            targetContainer.removeAttr('style');
        }
    }
}


function getBlocBgColor(targetContainer) {
    var bgColor = targetContainer.css('background-color');
    if (targetContainer.hasClass('b-parallax')) bgColor = targetContainer.find('.parallax').css('background-color');
    if (bgColor == "rgba(0, 0, 0, 0)") bgColor = '#FFFFFF';
    return bgColor;
}


function hideAll() {
    $('.animated').each(function (i) {
        if ($("body").hasClass('mob-disable-anim')) {
            if ($(window).width() > 767) {
                $(this).removeClass('animated').addClass('hideMe');
            }
        } else {
            $(this).removeClass('animated').addClass('hideMe');
        }
    });
}


function inViewCheck() {
    $($(".hideMe").get().reverse()).each(function (i) {
        var target = jQuery(this);
        var a = target.offset().top + target.height();
        var b = $(window).scrollTop() + $(window).height();

        if (target.height() > $(window).height()) {
            a = target.offset().top;
        }

        if (a < b) {
            var objectClass = target.attr('class').replace('hideMe', 'animated');
            target.css('visibility', 'hidden').removeAttr('class');
            setTimeout(function () {
                target.attr('class', objectClass).css('visibility', 'visible');
            }, 0.01);


            target.on("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd", function (event) {
                $(this).removeClass($(this).attr('data-appear-anim-style'))
            });
        }
    });
};


function scrollToTopView() {
    if ($(window).scrollTop() > $(window).height() / 3) {
        if (!$('.scrollToTop').hasClass('showScrollTop')) {
            $('.scrollToTop').addClass('showScrollTop');
        }
    } else {
        $('.scrollToTop').removeClass('showScrollTop');
    }
};


function setUpVisibilityToggle() {
    $(document).on('click', '[data-toggle-visibility]', function (e) {
        e.preventDefault();
        var targetID = $(this).attr('data-toggle-visibility');
        if (targetID.indexOf(',') != -1) {
            var targeArray = targetID.split(',');

            $.each(targeArray, function (i) {
                toggleVisibility($('#' + targeArray[i]));
            });
        } else {
            toggleVisibility($('#' + targetID));
        }

        function toggleVisibility(T) {
            if (T.is('img')) {
                T.toggle();
            } else if (T.is('.row, .bloc-group')) {
                T.toggleClass('d-flex');
            } else {
                T.slideToggle();
            }

            reCalculateParallax();
        }
    });
}


function setUpClassToggle() {
    $(document).on('click', '[data-toggle-class-target]', function (e) {
        e.preventDefault();
        var targetID = $(this).attr('data-toggle-class-target');
        var targetClass = $(this).attr('data-toggle-class');

        if (targetClass.length) {
            if (targetID.indexOf(',') != -1) {
                var targeArray = targetID.split(',');

                $.each(targeArray, function (i) {
                    $('#' + targeArray[i]).toggleClass(targetClass);
                });
            } else {
                $('#' + targetID).toggleClass(targetClass);
            }

            reCalculateParallax();
        }
    });
}


function setUpLightBox() {
    window.targetLightbox;

    $(document).on('click', '[data-lightbox]', function (e) {
            e.preventDefault();
            targetLightbox = $(this);
            var lightBoxPath = targetLightbox.attr('data-lightbox');
            var lightBoxAutoPlay = targetLightbox.attr('data-autoplay');
            var captionData = '<p class="lightbox-caption">' + targetLightbox.attr('data-caption') + '</p>';
            var galleryID = 'no-gallery-set';
            var lightBoxFrame = targetLightbox.attr('data-frame');

            if (targetLightbox.attr('data-gallery-id')) {
                galleryID = targetLightbox.attr('data-gallery-id');
            }

            var autoplay = "";

            if (lightBoxAutoPlay == 1) {
                autoplay = "autoplay";
            }

            var protectionClass = "";

            if (targetLightbox.find('img').hasClass('img-protected')) {
                protectionClass = "img-protected";
            }


            var leftArrow = '<svg xmlns="http:
            var rightArrow = '<svg xmlns="http:
            var closeIcon = '<svg xmlns="http:

            var customModal = $('<div id="lightbox-modal" class="modal fade"><div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content ' + lightBoxFrame + ' blocs-lb-container"><button id="blocs-lightbox-close-btn" type="button" class="close-lightbox" data-dismiss="modal" aria-label="Close">' + closeIcon + '</button><div class="modal-body"><a href="#" class="prev-lightbox" aria-label="prev">' + leftArrow + '</a><a href="#" class="next-lightbox" aria-label="next">' + rightArrow + '</a><img id="lightbox-image" class="img-fluid mx-auto d-block ' + protectionClass + '" src="' + lightBoxPath + '"><div id="lightbox-video-container" class="embed-responsive embed-responsive-16by9"><video controls ' + autoplay + ' class="embed-responsive-item"><source id="lightbox-video" src="' + lightBoxPath + '" type="video/mp4"></video></div>' + captionData + '</div></div></div></div>');
            $('body').append(customModal);

            if (lightBoxFrame == "fullscreen-lb") {
                $('#lightbox-modal').addClass('fullscreen-modal').append('<a class="close-full-screen-modal animated fadeIn" style="animation-delay:0.5s;" onclick="$(\'#lightbox-modal\').modal(\'hide\');">' + closeIcon + '</a>');
                $('#blocs-lightbox-close-btn').remove();
            }

            if (lightBoxPath.substring(lightBoxPath.length - 4) == ".mp4") {
                $('#lightbox-image, .lightbox-caption').removeClass('d-block').hide();
                $('#lightbox-video-container').show();
            } else {
                $('#lightbox-image,.lightbox-caption').addClass('d-block').show();
                $('#lightbox-video-container').hide();

                if (!targetLightbox.attr('data-caption')) {
                    $('.lightbox-caption').removeClass('d-block').hide();
                }
            }

            $('#lightbox-modal').modal('show');

            if (galleryID == 'no-gallery-set') {

                if ($('a[data-lightbox]').index(targetLightbox) == 0) {
                    $('.prev-lightbox').hide();
                }
                if ($('a[data-lightbox]').index(targetLightbox) == $('a[data-lightbox]').length - 1) {
                    $('.next-lightbox').hide();
                }
            } else {

                if ($('a[data-gallery-id="' + galleryID + '"]').index(targetLightbox) == 0) {
                    $('.prev-lightbox').hide();
                }
                if ($('a[data-gallery-id="' + galleryID + '"]').index(targetLightbox) == $('a[data-gallery-id="' + galleryID + '"]').length - 1) {
                    $('.next-lightbox').hide();
                }
            }

            addLightBoxSwipeSupport();
        }
    ).on('hidden.bs.modal', '#lightbox-modal', function () {
        $('#lightbox-modal').remove();
    })

    $(document).on('click', '.next-lightbox, .prev-lightbox', function (e) {
        e.preventDefault();
        var galleryID = 'no-gallery-set';
        var idx = $('a[data-lightbox]').index(targetLightbox);
        var next = $('a[data-lightbox]').eq(idx + 1)

        if (targetLightbox.attr('data-gallery-id')) {
            galleryID = targetLightbox.attr('data-gallery-id');
            idx = $('a[data-gallery-id="' + galleryID + '"]').index(targetLightbox);
            next = $('a[data-gallery-id="' + galleryID + '"]').eq(idx + 1)
        }

        if ($(this).hasClass('prev-lightbox')) {
            next = $('a[data-gallery-id="' + galleryID + '"]').eq(idx - 1)

            if (galleryID == 'no-gallery-set') {
                next = $('a[data-lightbox]').eq(idx - 1)
            }
        }

        var nextContentPath = next.attr('data-lightbox');

        if (nextContentPath.substring(nextContentPath.length - 4) == ".mp4") {
            var lightBoxAutoPlay = next.attr('data-autoplay');
            var autoplay = "";

            if (lightBoxAutoPlay == 1) {
                autoplay = "autoplay";
            }

            $('#lightbox-image, .lightbox-caption').removeClass('d-block').hide();
            $('#lightbox-video-container').show().html('<video controls ' + autoplay + ' class="embed-responsive-item"><source id="lightbox-video" src="' + nextContentPath + '" type="video/mp4"></video>');
        } else {
            $('#lightbox-image').attr('src', nextContentPath).addClass('d-block').show();
            $('#lightbox-video-container').hide();
            $('.lightbox-caption').removeClass('d-block').hide();

            if (next.attr('data-caption')) {
                $('.lightbox-caption').html(next.attr('data-caption')).show();
            }
        }

        targetLightbox = next;


        $('.next-lightbox, .prev-lightbox').hide();

        if (galleryID == 'no-gallery-set') {
            if ($('a[data-lightbox]').index(next) != $('a[data-lightbox]').length - 1) {
                $('.next-lightbox').show();
            }
            if ($('a[data-lightbox]').index(next) > 0) {
                $('.prev-lightbox').show();
            }
        } else {
            if ($('a[data-gallery-id="' + galleryID + '"]').index(next) != $('a[data-gallery-id="' + galleryID + '"]').length - 1) {
                $('.next-lightbox').show();
            }
            if ($('a[data-gallery-id="' + galleryID + '"]').index(next) > 0) {
                $('.prev-lightbox').show();
            }
        }
    });
}


function addKeyBoardSupport() {
    $(window).keydown(function (evt) {
        if (evt.which == 37) {
            if ($('.prev-lightbox').is(':visible')) {
                $('.prev-lightbox').click();
            }
        } else if (evt.which == 39) {
            if ($('.next-lightbox').is(':visible')) {
                $('.next-lightbox').click();
            }
        }
    });
}


function addLightBoxSwipeSupport() {
    if ($("#lightbox-image").length) {

        $("#lightbox-image").swipe(
            {
                swipeLeft: function (event, direction, distance, duration, fingerCount) {
                    if ($('.next-lightbox').is(':visible')) {
                        $('.next-lightbox').click();
                    }
                },
                swipeRight: function () {
                    if ($('.prev-lightbox').is(':visible')) {
                        $('.prev-lightbox').click();
                    }
                },
                threshold: 0
            });
    }
}


function setUpImgProtection() {
    $('body').on("contextmenu", ".img-protected", function (e) {
        return false;
    });
    $('body').on("mousedown", ".img-protected", function (e) {
        e.preventDefault()
    });
}


function reCalculateParallax() {
    if ($('.b-parallax').length) {
        var parallax = $('.parallax__container .parallax');
        parallax.css('height', '100%');
        setTimeout(function () {
            calculateHeight(parallax, 3)
        }, 400);
    }
}