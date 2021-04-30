// Page ready

$(function(){
	extraNavFuncs(); // Extra Nav Functions
	setUpSpecialNavs(); // Special Nav Bars 
	setUpDropdownSubs(); // Dropdown Menu Support
	setUpLightBox(); // Lightbox
	setUpVisibilityToggle(); // Toggle Visibility 
	setUpClassToggle(); // Toggle Class
	addKeyBoardSupport(); // Add Keyboard Support (Used for Lightbox Nav)
	setUpImgProtection(); // Set Up Image Protection
	
	$('a[onclick^="scrollToTarget"]').click(function(e){e.preventDefault()}); // Prevent page jump on scroll to links
	$('.nav-item [data-active-page]').addClass($('.nav-item [data-active-page]').attr('data-active-page')); // Apply Active Link Classes
	$('[data-toggle="tooltip"]').tooltip(); // Initialise Tool tips
});

// Loading page complete
$(window).on('load', function()
{
	animateWhenVisible();  // Activate animation when visible	
	$('#page-loading-blocs-notifaction').addClass('preloader-complete'); // Remove page loading UI
})

// Set Up Special NavBars 
function setUpSpecialNavs()
{
	$('.navbar-toggler').click(function(e)
	{ 
		var targetNav = $(this).closest('nav');
		var targetMenu = targetNav.find('ul.site-navigation');
		var newMenu = targetMenu.clone();
	
		if (targetMenu.parent().is('.fullscreen-nav, .sidebar-nav')) // Nav is Special
		{
			e.stopPropagation(); // Dont do this is normal menu in use
			targetMenu.parent().addClass('nav-special');
			
			if (!$(this).hasClass('selected-nav')) // Open Menu
			{
				$(this).addClass('selected-nav');
				var navClasses = targetNav.attr('class').replace('navbar','').replace('row','');
				var menuClasses = targetMenu.parent().attr('class').replace('navbar-collapse','').replace('collapse','');
				
				if ($('.content-tint').length =-1)
				{
					$('body').append('<div class="content-tint"></div>');
				}
				
				newMenu.insertBefore('.page-container').wrap('<div class="blocsapp-special-menu '+navClasses+'"><blocsnav class="'+menuClasses+'">');
				$('blocsnav').prepend('<a class="close-special-menu animated fadeIn animDelay06"><div class="close-icon"></div></a>');
				
				animateNavItems(); // Animate Nav Items

				setTimeout(function(){
					$('.blocsapp-special-menu blocsnav').addClass('open');
					$('.content-tint').addClass('on');
					$('body').addClass('lock-scroll');
				}, 10);
			}
			else // Close menu
			{
				$('.close-special-menu').toggleClass('fadeOut fadeIn animDelay06 animSpeed02');
				$('.blocsapp-special-menu blocsnav').removeClass('open');
				$('.selected-nav').removeClass('selected-nav');
				
				setTimeout(function(){
					$('.blocsapp-special-menu').remove();
					$('body').removeClass('lock-scroll');
					$('.nav-special').removeClass('nav-special');
				}, 300);
			}
		}
	});
	
	// Close Special Menu with Tint Click	
	$('body').on("mousedown touchstart",".content-tint, .close-special-menu",function(e)
	{	
		$('.content-tint').removeClass('on');
		$('.selected-nav').click();
	
		setTimeout(function(){
			$('.content-tint').remove();
		}, 10);
	}
	).on("click",".blocsapp-special-menu a",function(e) // Close Menu On Link Click
	{	
		if (!$(e.target).closest('.dropdown-toggle').length)
		{
			$('.close-special-menu').mousedown();
		} 
	});
	
	// Animate Nav Items
	function animateNavItems()
	{
		var animationStyle = 'fadeInRight';
		var delay = 0;
		var increaseVal = 60;
	
		if ($('.blocsapp-special-menu blocsnav').hasClass('fullscreen-nav'))
		{
			animationStyle = 'fadeIn';
			increaseVal = 100;
		}
		else if ($('.blocsapp-special-menu').hasClass('nav-invert')) // Inverted Nav
		{
			animationStyle = 'fadeInLeft';
		}
	
		$('.blocsapp-special-menu blocsnav li').each(function()
		{
			if ($(this).parent().hasClass('dropdown-menu')) // Not A drop down
			{
				$(this).addClass('animated fadeIn');	
			}
			else
			{
				delay += increaseVal; 
				$(this).attr('style','animation-delay:'+delay+'ms').addClass('animated '+animationStyle);	
			}
		});
	}
}


// Extra Nav Functions
function extraNavFuncs()
{
	// Hide Menu On Item Click
	$(".site-navigation a").click(function(e)
	{
		if (!$(e.target).closest('.dropdown-toggle').length) // Prevent Dropdowns Closing on click
		{
			$(".navbar-collapse").collapse('hide');
		}
	});
	
	// Close Open Dropdown Menu When Another menu on same level is opened
	$("a.dropdown-toggle").click(function(e)
	{
		$(this).parent().addClass('target-open-menu');
		$(this).closest('.dropdown-menu').find('.dropdown.open').each(function(i) // Loop all Open Dropdowns
		{
			if (!$(this).hasClass('target-open-menu'))
			{
				$(this).removeClass('open');
			}
		});
		$('.target-open-menu').removeClass('target-open-menu');
	});
	
	// Handle Multi Level Dropdowns
	$( '.dropdown-menu a.dropdown-toggle' ).on( 'click', function ( e )
	{
        return openSubDropdown($(this));
	});
	
	// Handle Multi Level Dropdowns
	$('body').on("click",".dropdown-menu a.dropdown-toggle",function(e)
	{
        return openSubDropdown($(this));
	});

	// handle Sub Dropdowns
	function openSubDropdown(target)
	{
		var $el = target;
        var $parent = target.offsetParent( ".dropdown-menu" );
        if ( !target.next().hasClass( 'show' ) ) {
            target.parents( '.dropdown-menu' ).first().find( '.show' ).removeClass( "show" );
        }
        var $subMenu = target.next( ".dropdown-menu" );
        $subMenu.toggleClass( 'show' );
    
        target.parent( "li" ).toggleClass( 'show' );

        target.parents( 'li.nav-item.dropdown.show' ).on( 'hidden.bs.dropdown', function ( e ) {
            $( '.dropdown-menu .show' ).removeClass( "show" );
        } );
    
        if (!$parent.parent().hasClass( 'navbar-nav' ))
        {
        	if (!target.closest('.nav-special').length)
        	{
        		$el.next().css( { "top": $el[0].offsetTop, "left": $parent.outerWidth() - 4 } );
        	}
        }

        return false;
	}
}

// Scroll to target
function scrollToTarget(D,T)
{
	var speed = 'slow';
	
	if (D == 0) // Next Bloc
	{
		D = $(T).closest('.bloc').height();
	}
	else if (D == 1) // Top of page
	{
		D = 0;
	}
	else if (D == 2) // Bottom of page
	{
		D = $(document).height();
	}
	else // Specific Bloc
	{
		D = $(D).offset().top;
		if ($('.sticky-nav').length) // Sticky Nav in use
		{
			D -= $('.sticky-nav').outerHeight();
		}
	}
	
	if ($(T).is("[data-scroll-speed]")) // Use asigned scroll speed
	{
		speed = $(T).attr('data-scroll-speed');
		
		if (parseInt(speed)) // Is an integer
		{
			speed = parseInt(speed);
		}
	}


	$('html,body').animate({scrollTop:D}, speed);
	$(".navbar-collapse").collapse('hide');	
}

// Animate when visible
function animateWhenVisible()
{
	hideAll(); // Hide all animation elements
	inViewCheck(); // Initail check on page load
	
	$(window).scroll(function()
	{		
		inViewCheck(); // Check object visability on page scroll
		scrollToTopView(); // ScrollToTop button visability toggle
		stickyNavToggle(); // Sticky nav toggle
	});		
};

// Set Up Dropdown Menu Support
function setUpDropdownSubs()
{
	$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event)
	{
		event.preventDefault(); 
		event.stopPropagation(); 
		$(this).parent().siblings().removeClass('open');
		$(this).parent().toggleClass('open');
		
		var targetMenu = $(this).parent().children('.dropdown-menu');
		var leftVal = targetMenu.offset().left+targetMenu.width();
		if (leftVal > $(window).width())
		{
			targetMenu.addClass('dropmenu-flow-right');
		}
	});
}

// Sticky Nav Bar Toggle On / Off
function stickyNavToggle()
{
	if ($('.sticky-nav').length)
	{
		var stickyNav = $('.sticky-nav');
		var offsetVal = stickyNav.offset().top; // Offset Value
		var classes = "sticky"; // Classes
		var targetContainer = $('.page-container');
		var isFillScreenSticky = stickyNav.hasClass('fill-bloc-top-edge');
		
		if (isFillScreenSticky) // Nav in Hero Bloc
		{
			targetContainer = $('.fill-bloc-top-edge.sticky-nav').parent();
			classes = "sticky animated fadeInDown";
		}

		if (stickyNav.hasClass('sticky')) // Use original offset
		{
			offsetVal = stickyNav.attr('data-original-offset')
		}

		if ($(window).scrollTop() > offsetVal) // Scroll Window
		{  
			if (!stickyNav.hasClass('sticky')) // Add Sticky
			{
				stickyNav.addClass(classes).attr('data-original-offset',offsetVal);
				offsetVal = stickyNav.height();

				if (isFillScreenSticky)
				{
					stickyNav.css('background', getBlocBgColor(targetContainer));
					offsetVal += parseInt(targetContainer.css('padding-top')); 
				}

				targetContainer.css('padding-top',offsetVal);
			}
		}
		else if (stickyNav.hasClass('sticky')) // Remove Sticky
		{
			stickyNav.removeClass(classes).removeAttr('style');
			targetContainer.removeAttr('style');
		}
	}	
}

// Get Bloc Background Color
function getBlocBgColor(targetContainer)
{
	var bgColor = targetContainer.css('background-color');
	if (targetContainer.hasClass('b-parallax')) bgColor = targetContainer.find('.parallax').css('background-color'); // Has Parallax
	if (bgColor == "rgba(0, 0, 0, 0)") bgColor = '#FFFFFF'; // Prevent Transparent
	return bgColor;
}

// Hide all animation elements
function hideAll()
{
	$('.animated').each(function(i)
	{	
		if ($("body").hasClass('mob-disable-anim')) // Disable Animation on Mobile
		{
			if ($(window).width() > 767) // Desktop Breakpoint
			{
				$(this).removeClass('animated').addClass('hideMe');
			}
		}
		else
		{
			$(this).removeClass('animated').addClass('hideMe');
		}
	});
}

// Check if object is inView
function inViewCheck()
{	
	$($(".hideMe").get().reverse()).each(function(i)
	{	
		var target = jQuery(this);
		var a = target.offset().top + target.height();
		var b = $(window).scrollTop() + $(window).height();
		
		if (target.height() > $(window).height()) // If object height is greater than window height
		{
			a = target.offset().top;
		}
		
		if (a < b) 
		{	
			var objectClass = target.attr('class').replace('hideMe' , 'animated');
			target.css('visibility','hidden').removeAttr('class');
			setTimeout(function(){target.attr('class',objectClass).css('visibility','visible');},0.01);
			
			// Remove animtion when spent
			target.on("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd", function(event) {
			    $(this).removeClass($(this).attr('data-appear-anim-style'))
			});					
		}
	});
};

// ScrollToTop button toggle
function scrollToTopView()
{
	if ($(window).scrollTop() > $(window).height()/3)
	{	
		if (!$('.scrollToTop').hasClass('showScrollTop'))
		{
			$('.scrollToTop').addClass('showScrollTop');
		}	
	}
	else
	{
		$('.scrollToTop').removeClass('showScrollTop');
	}
};


// Toggle Visibility
function setUpVisibilityToggle()
{
	$(document).on('click', '[data-toggle-visibility]', function(e)
	{
		e.preventDefault();
		var targetID = $(this).attr('data-toggle-visibility');
		if (targetID.indexOf(',')!=-1) // Is Array
		{
			var targeArray = targetID.split(',');
			
			$.each(targeArray, function(i) // Loop Array
			{
				toggleVisibility($('#'+targeArray[i]));
			});
		}
		else // Single
		{
			toggleVisibility($('#'+targetID));
		}
		
		function toggleVisibility(T)
		{
			if (T.is('img')) // Image
			{
				T.toggle();
			}
			else if (T.is('.row, .bloc-group')) // Rows
			{
				T.toggleClass('d-flex');
			}
			else // Other
			{
				T.slideToggle();
			}

			reCalculateParallax();
		}
	});
}

// Toggle Classes On Objects
function setUpClassToggle()
{
	$(document).on('click', '[data-toggle-class-target]', function(e)
	{
		e.preventDefault();
		var targetID = $(this).attr('data-toggle-class-target');
		var targetClass = $(this).attr('data-toggle-class');

		if (targetClass.length)
		{
			if (targetID.indexOf(',')!=-1) // Is Array
			{
				var targeArray = targetID.split(',');
				
				$.each(targeArray, function(i) // Loop Array
				{
					$('#'+targeArray[i]).toggleClass(targetClass);
				});
			}
			else // Single
			{
				$('#'+targetID).toggleClass(targetClass);
			}

			reCalculateParallax();
		}
	});
}

// Light box support
function setUpLightBox()
{
	window.targetLightbox;
	
	$(document).on('click', '[data-lightbox]', function(e) // Create Lightbox Modal
	{
		e.preventDefault();
		targetLightbox = $(this);
		var lightBoxPath = targetLightbox.attr('data-lightbox');
		var lightBoxAutoPlay = targetLightbox.attr('data-autoplay');
		var captionData ='<p class="lightbox-caption">'+targetLightbox.attr('data-caption')+'</p>';
		var galleryID = 'no-gallery-set';
		var lightBoxFrame = targetLightbox.attr('data-frame');

		if (targetLightbox.attr('data-gallery-id')) // Has a gallery ID so use it
		{
			galleryID = targetLightbox.attr('data-gallery-id');
		}
		
		var autoplay = ""; // No Auto Play default

		if (lightBoxAutoPlay == 1) // Add Auto Play
		{
			autoplay = "autoplay";
		}

		var protectionClass = ""; // No Auto Play default

		if (targetLightbox.find('img').hasClass('img-protected')) // Image Protection
		{
			protectionClass = "img-protected";
		}


		var leftArrow = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32"><path class="lightbox-nav-icon lightbox-prev-icon" d="M22,2L9,16,22,30"/></svg>';
		var rightArrow = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32"><path class="lightbox-nav-icon lightbox-next-icon" d="M10.344,2l13,14-13,14"/></svg>';
		var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32"><path class="lightbox-close-icon" d="M4,4L28,28"/><path class="lightbox-close-icon" d="M28,4L4,28"/></svg>';

		var customModal = $('<div id="lightbox-modal" class="modal fade"><div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content '+lightBoxFrame+' blocs-lb-container"><button id="blocs-lightbox-close-btn" type="button" class="close-lightbox" data-dismiss="modal" aria-label="Close">'+closeIcon+'</button><div class="modal-body"><a href="#" class="prev-lightbox" aria-label="prev">'+leftArrow+'</a><a href="#" class="next-lightbox" aria-label="next">'+rightArrow+'</a><img id="lightbox-image" class="img-fluid mx-auto d-block '+protectionClass+'" src="'+lightBoxPath+'"><div id="lightbox-video-container" class="embed-responsive embed-responsive-16by9"><video controls '+autoplay+' class="embed-responsive-item"><source id="lightbox-video" src="'+lightBoxPath+'" type="video/mp4"></video></div>'+captionData+'</div></div></div></div>');
		$('body').append(customModal);
		
		if (lightBoxFrame == "fullscreen-lb") // Full Screen Light Box
		{
			$('#lightbox-modal').addClass('fullscreen-modal').append('<a class="close-full-screen-modal animated fadeIn" style="animation-delay:0.5s;" onclick="$(\'#lightbox-modal\').modal(\'hide\');">'+closeIcon+'</a>');
			$('#blocs-lightbox-close-btn').remove();
		}
		
		if (lightBoxPath.substring(lightBoxPath.length-4) == ".mp4") // Video Object
		{
			$('#lightbox-image, .lightbox-caption').removeClass('d-block').hide();
			$('#lightbox-video-container').show();
		}
		else // Image Object
		{
			$('#lightbox-image,.lightbox-caption').addClass('d-block').show();
			$('#lightbox-video-container').hide();
			
			if (!targetLightbox.attr('data-caption')) // No caption data
			{
				$('.lightbox-caption').removeClass('d-block').hide();
			}
		}
		
		$('#lightbox-modal').modal('show');
		
		if (galleryID == 'no-gallery-set') // No Gallery ID
		{
			// Handle navigation buttons (next - prev)
			if ($('a[data-lightbox]').index(targetLightbox) == 0)
			{
				$('.prev-lightbox').hide();
			}
			if ($('a[data-lightbox]').index(targetLightbox) == $('a[data-lightbox]').length-1)
			{
				$('.next-lightbox').hide();
			}
		}
		else // Has Gallery ID
		{
			// Handle navigation buttons (next - prev)
			if ($('a[data-gallery-id="'+galleryID+'"]').index(targetLightbox) == 0)
			{
				$('.prev-lightbox').hide();
			}
			if ($('a[data-gallery-id="'+galleryID+'"]').index(targetLightbox) == $('a[data-gallery-id="'+galleryID+'"]').length-1)
			{
				$('.next-lightbox').hide();
			}
		}
		
		addLightBoxSwipeSupport(); // Add Swipe Support
	}
	).on('hidden.bs.modal', '#lightbox-modal', function () // Handle destroy modal 
	{
		$('#lightbox-modal').remove();
	})
	
	$(document).on('click', '.next-lightbox, .prev-lightbox', function(e) 
	{
		e.preventDefault();
		var galleryID = 'no-gallery-set';
		var idx = $('a[data-lightbox]').index(targetLightbox);
		var next = $('a[data-lightbox]').eq(idx+1) // Next
		
		if (targetLightbox.attr('data-gallery-id')) // Has Gallery ID so Use
		{
			galleryID = targetLightbox.attr('data-gallery-id'); // ID
			idx = $('a[data-gallery-id="'+galleryID+'"]').index(targetLightbox); // Index
			next = $('a[data-gallery-id="'+galleryID+'"]').eq(idx+1) // Next
		}
		
		if ($(this).hasClass('prev-lightbox'))
		{
			next = $('a[data-gallery-id="'+galleryID+'"]').eq(idx-1) // Prev
			
			if (galleryID == 'no-gallery-set') // No Gallery ID
			{
				next = $('a[data-lightbox]').eq(idx-1) // Prev
			}
		}
		
		var nextContentPath = next.attr('data-lightbox');
		
		if (nextContentPath.substring(nextContentPath.length-4) == ".mp4") // Video Object
		{
			var lightBoxAutoPlay = next.attr('data-autoplay');
			var autoplay = ""; // No Auto Play default

			if (lightBoxAutoPlay == 1) // Add Auto Play
			{
				autoplay = "autoplay";
			}
			
			$('#lightbox-image, .lightbox-caption').removeClass('d-block').hide();
			$('#lightbox-video-container').show().html('<video controls '+autoplay+' class="embed-responsive-item"><source id="lightbox-video" src="'+nextContentPath+'" type="video/mp4"></video>');	
		}
		else // Image Object
		{
			$('#lightbox-image').attr('src',nextContentPath).addClass('d-block').show();
			$('#lightbox-video-container').hide();
			$('.lightbox-caption').removeClass('d-block').hide();
			
			if (next.attr('data-caption'))
			{
				$('.lightbox-caption').html(next.attr('data-caption')).show();
			}
		}
		
		targetLightbox = next;	
		
		// Handle navigation buttons (next - prev)
		$('.next-lightbox, .prev-lightbox').hide();	
		
		if (galleryID == 'no-gallery-set') // No Gallery ID
		{
			if ($('a[data-lightbox]').index(next) != $('a[data-lightbox]').length-1)
			{
				$('.next-lightbox').show();
			}
			if ($('a[data-lightbox]').index(next) > 0)
			{
				$('.prev-lightbox').show();
			}
		}
		else // Has Gallery ID
		{
			if ($('a[data-gallery-id="'+galleryID+'"]').index(next) != $('a[data-gallery-id="'+galleryID+'"]').length-1)
			{
				$('.next-lightbox').show();
			}
			if ($('a[data-gallery-id="'+galleryID+'"]').index(next) > 0)
			{
				$('.prev-lightbox').show();
			}
		}
	});
}


// Add Keyboard Support
function addKeyBoardSupport()
{
	$(window).keydown(function(evt)
	{		
	  	if (evt.which == 37) // Arrow Left
	  	{
			if ($('.prev-lightbox').is(':visible')) // Lightbox Back
			{
				$('.prev-lightbox').click();
			}
	  	}
	  	else if (evt.which == 39) // Arrow Right
	  	{
			if ($('.next-lightbox').is(':visible')) // Lightbox Forward
			{
				$('.next-lightbox').click();
			}
	  	}
	});
}

// Add Lightbox Swipe Support
function addLightBoxSwipeSupport()
{
	if ($("#lightbox-image").length) // Has Carousels
	{
		// Allow Swipes
		$("#lightbox-image").swipe(
		{
			swipeLeft:function(event, direction, distance, duration, fingerCount)
			{
				if ($('.next-lightbox').is(':visible'))
				{
					$('.next-lightbox').click();
				}
			},
			swipeRight: function()
			{
				if ($('.prev-lightbox').is(':visible'))
				{
					$('.prev-lightbox').click();
				}
			},
			threshold:0
		});
	}
}

// Set Up Image protection
function setUpImgProtection()
{
	$('body').on("contextmenu",".img-protected",function(e){return false;});
	$('body').on("mousedown",".img-protected",function(e){e.preventDefault()});
}


// Recalculate Parallax
function reCalculateParallax()
{
	if ($('.b-parallax').length) // Has Parallax
	{
		var parallax = $('.parallax__container .parallax');
		parallax.css('height','100%');
		setTimeout(function(){calculateHeight(parallax,3)}, 400);
	}
}