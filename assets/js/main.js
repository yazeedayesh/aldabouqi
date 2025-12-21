(function ($) {
	"use strict";

	var windowOn = $(window);

	// PreLoader Js
	$(window).on('load', function () {
		$('#preloader').fadeOut(500);
	});

	// Sticky Header Js
	$(window).on('scroll', function () {
		var scroll = $(window).scrollTop();
		if (scroll < 400) {
			$("#header-sticky").removeClass("header-sticky");
		} else {
			$("#header-sticky").addClass("header-sticky");
		}
	});


	if ($('.it-header-height').length > 0) {
		var headerHeight = document.querySelector(".it-header-height");
		var setHeaderHeight = headerHeight.offsetHeight;
		$(".it-header-height").each(function () {
			$(this).css({
				'height': setHeaderHeight + 'px'
			});
		});
		$(".it-header-height .header-sticky").each(function () {
			$(this).css({
				'height': inherit,
			});
		});
	}

	// Nice Select Js
	$('select').niceSelect();


	// Data CSS Js
	$("[data-background").each(function () {
		$(this).css("background-image", "url( " + $(this).attr("data-background") + "  )");
	});

	$("[data-width]").each(function () {
		$(this).css("width", $(this).attr("data-width"));
	});

	$("[data-bg-color]").each(function () {
		$(this).css("background-color", $(this).attr("data-bg-color"));
	});


	// accordion
	$(".accordion-items").on("click", function () {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			$(this).addClass("active").siblings().removeClass("active");
		}
	});


	// Counter Js
	if ($(".purecounter").length) {
		new PureCounter({
			filesizing: true,
			selector: ".filesizecount",
			pulse: 2,
		});
		new PureCounter();
	}
	

	//  magnificPopup
	$('.popup-image').magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});


	// MagnificPopup 
	$(".popup-video").magnificPopup({
		type: "iframe",
	});

	// isotope
	$('.grid').imagesLoaded(function () {
		var $grid = $('.grid').isotope({
			itemSelector: '.grid-item',
			percentPosition: true,
			masonry: {
				columnWidth: '.grid-item',
			},

		});
		$('.masonary-menu').on('click', 'button', function () {
			var filterValue = $(this).attr('data-filter');
			$grid.isotope({
				filter: filterValue,
				animationOptions: {
					duration: 100,
					easing: "linear",
					queue: true
				}
			});

		});
		$('.masonary-menu button').on('click', function (event) {
			$(this).siblings('.active').removeClass('active');
			$(this).addClass('active');
			event.preventDefault();
		});

	});

    // mobile menu
	if ($('.it-menu-content').length && $('.it-menu-mobile').length) {
		let navContent = document.querySelector(".it-menu-content").outerHTML;
		let mobileNavContainer = document.querySelector(".it-menu-mobile");
		mobileNavContainer.innerHTML = navContent;

		let arrow = $(".it-menu-mobile .has-dropdown > a");

		arrow.each(function () {
			let self = $(this);
			let arrowBtn = document.createElement("BUTTON");
			arrowBtn.classList.add("dropdown-toggle-btn");
			arrowBtn.innerHTML = "<i class='fal fa-angle-right'></i>";
			self.append(function () {
				return arrowBtn;
			});

			self.find("button").on("click", function (e) {
				e.preventDefault();
				let self = $(this);
				self.toggleClass("dropdown-opened");
				self.parent().toggleClass("expanded");
				self.parent().parent().addClass("dropdown-opened").siblings().removeClass("dropdown-opened");
				self.parent().parent().children(".it-submenu").slideToggle();
			});

		});
	}

	// scroll-to-target 
	windowOn.on('scroll', function () {
		var scroll = windowOn.scrollTop();
		if (scroll < 500) {
			$('.scroll-to-target').removeClass('open');

		} else {
			$('.scroll-to-target').addClass('open');
		}
	});

	//  Scroll Up Js
	if ($('.scroll-to-target').length) {
		$(".scroll-to-target").on('click', function () {
			var target = $(this).attr('data-target');
			// animate
			$('html, body').animate({
				scrollTop: $(target).offset().top
			}, 1000);

		});
	}

	// Sidebar Js
	$(".it-menu-bar").on("click", function () {
		$(".itoffcanvas").addClass("opened");
		$(".body-overlay").addClass("apply");
	});
	$(".close-btn").on("click", function () {
		$(".itoffcanvas").removeClass("opened");
		$(".body-overlay").removeClass("apply");
	});
	$(".body-overlay").on("click", function () {
		$(".itoffcanvas").removeClass("opened");
		$(".body-overlay").removeClass("apply");
		$(".search-popup").removeClass("search-active");
	});

	//  Search Js
    if($('.search-box-outer').length) {
		$('.search-box-outer').on('click', function() {
			$('.search-popup').addClass('search-active');
			$(".body-overlay").addClass("apply");
		});
		$('.close-search').on('click', function() {
			$('.search-popup').removeClass('search-active');
			$(".body-overlay").removeClass("apply");
		});
	}

	// wow animation
	var wow = new WOW(
		{
		  mobile: true,
		}
	  );
	  wow.init();
	var windowOn = $(window);

	// Cart Quantity Js
	$('.cart-minus').on('click', function () {
		var $input = $(this).parent().find('input');
		var count = parseInt($input.val()) - 1;
		count = count < 1 ? 1 : count;
		$input.val(count);
		$input.change();
		return false;
	});

	$('.cart-plus').on('click', function () {
		var $input = $(this).parent().find('input');
		$input.val(parseInt($input.val()) + 1);
		$input.change();
		return false;
	});


	// Toggle Js
	$('#showlogin').on('click', function () {
		$('#checkout-login').slideToggle(900);
	});

	$('#cbox').on('click', function () {

		$('#cbox_info').slideToggle(900);
	
	});

	$('#showcoupon').on('click', function () {

		$('#checkout_coupon').slideToggle(900);
	});


	// for range
	$("#slider-range").slider({
		range: true,
		min: 0,
		max: 1200,
		values: [80, 700],
		slide: function (event, ui) {
			$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
		}
	});
	$("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));


	// webgl hover animation
	if ($('.it-img-anim-wrap').length > 0) {
		const initImageHoverAnimation = function ($animElement, $images) {
			const hoverEffectInstance = new hoverEffect({
				parent: $animElement.get(0),
				intensity: $animElement.data("intensity") || undefined,
				speedIn: $animElement.data("speedin") || undefined,
				speedOut: $animElement.data("speedout") || undefined,
				easing: $animElement.data("easing") || undefined,
				hover: $animElement.data("hover") || undefined,
				image1: $images.eq(0).attr("src"),
				image2: $images.eq(0).attr("src"),
				displacementImage: $animElement.data("displacement"),
				imagesRatio: $images[0].height / $images[0].width,
				hover: false
			});

			$animElement.closest(".it-img-anim-wrap")
				.on("mouseenter", function () {
					hoverEffectInstance.next();
				})
				.on("mouseleave", function () {
					hoverEffectInstance.previous();
				});
		};

		const setupAllImageHoverAnimations = function () {
			$(".it-img-anim").each(function () {
				const $currentAnimElement = $(this);
				const $imgElements = $currentAnimElement.find("img");
				const $firstImage = $imgElements.eq(0);

				if ($firstImage[0].complete) {
					initImageHoverAnimation($currentAnimElement, $imgElements);
				} else {
					$firstImage.on("load", function () {
						initImageHoverAnimation($currentAnimElement, $imgElements);
					});
				}
			});
		};
		setupAllImageHoverAnimations();
	}

	// ScrollSmoother
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
	if ($('#smooth-wrapper').length && $('#smooth-content').length) {
		gsap.config({
			nullTargetWarn: false,
		});
		let smoother = ScrollSmoother.create({
			smooth: 1.35,
			effects: true,
			smoothTouch: 1,
			normalizeScroll: false,
			ignoreMobileResize: true,

		});
	}

	// split text animation
	if ($('.it-split-text').length > 0) {
		var st = $(".it-split-text");
		if(st.length == 0) return;
		gsap.registerPlugin(SplitText);
		st.each(function(index, el) {
			el.split = new SplitText(el, {
				type: "lines,words,chars",
				linesClass: "it-split-line"
			});
			gsap.set(el, { perspective: 400 });
	
			if( $(el).hasClass('it-split-in-right') ){
				gsap.set(el.split.chars, {
					opacity: 0,
					x: "50",
					ease: "Back.easeOut",
				});
			}
			if( $(el).hasClass('it-split-in-left') ){
				gsap.set(el.split.chars, {
					opacity: 0,
					x: "-50",
					ease: "circ.out",
				});
			}
			if( $(el).hasClass('it-split-in-up') ){
				gsap.set(el.split.chars, {
					opacity: 0,
					y: "80",
					ease: "circ.out",
				});
			}
			if( $(el).hasClass('it-split-in-down') ){
				gsap.set(el.split.chars, {
					opacity: 0,
					y: "-80",
					ease: "circ.out",
				});
			}
			el.anim = gsap.to(el.split.chars, {
				scrollTrigger: {
					trigger: el,
					start: "top 90%",
				},
				x: "0",
				y: "0",
				rotateX: "0",
				scale: 1,
				opacity: 1,
				duration: 0.4,
				stagger: 0.02,
			});
		});	
	}

	// IT Fade Animation 
	let fadeArray_items = document.querySelectorAll(".it-fade-anim");
	if (fadeArray_items.length > 0) {
		const fadeArray = gsap.utils.toArray(".it-fade-anim")
		fadeArray.forEach((item, i) => {

			var fade_direction = "bottom"
			var onscroll_value = 1
			var duration_value = 1.15
			var fade_offset = 50
			var delay_value = 0.15
			var ease_value = "power2.out"

			if (item.getAttribute("data-fade-offset")) {
				fade_offset = item.getAttribute("data-fade-offset");
			}
			if (item.getAttribute("data-duration")) {
				duration_value = item.getAttribute("data-duration");
			}

			if (item.getAttribute("data-fade-from")) {
				fade_direction = item.getAttribute("data-fade-from");
			}
			if (item.getAttribute("data-on-scroll")) {
				onscroll_value = item.getAttribute("data-on-scroll");
			}
			if (item.getAttribute("data-delay")) {
				delay_value = item.getAttribute("data-delay");
			}
			if (item.getAttribute("data-ease")) {
				ease_value = item.getAttribute("data-ease");
			}

			let animation_settings = {
				opacity: 0,
				ease: ease_value,
				duration: duration_value,
				delay: delay_value,
			}

			if (fade_direction == "top") {
				animation_settings['y'] = -fade_offset
			}
			if (fade_direction == "left") {
				animation_settings['x'] = -fade_offset;
			}

			if (fade_direction == "bottom") {
				animation_settings['y'] = fade_offset;
			}

			if (fade_direction == "right") {
				animation_settings['x'] = fade_offset;
			}

			if (onscroll_value == 1) {
				animation_settings['scrollTrigger'] = {
					trigger: item,
					start: 'top 85%',
				}
			}
			gsap.from(item, animation_settings);
		})
	}

	//One Page navigation
	function scrollNav() {
		$('.it-onepage-menu li a').on('click', function () {
			$(".it-onepage-menu li a").removeClass("active");
			$(this).addClass("active");

			$('html, body').stop().animate({
				scrollTop: $($(this).attr('href')).offset().top - 80
			}, 300);
			return false;
		});
	}
	scrollNav();
	
	 
})(jQuery);