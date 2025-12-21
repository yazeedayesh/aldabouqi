(function ($) {
	"use strict";

	var windowOn = $(window);

	////////////////////////////////////////////////////
	//  Swiper Js
	const testimonialswiper = new Swiper('.it-testimonial-active', {
		speed: 1500,
		loop: true,
		slidesPerView: 1,
		spaceBetween: 35,
		autoplay: true,
		breakpoints: {
			'1400': {
				slidesPerView: 1,
			},
			'1200': {
				slidesPerView: 1,
			},
			'992': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},		
		pagination: {
			el: ".it-testimonial-dots",
			clickable: true,
		},
		navigation: {
			prevEl: '.arrow-prev',
			nextEl: '.arrow-next',
		},

	});
	////////////////////////////////////////////////////
	//  Swiper Js
	const testimonial2swiper = new Swiper('.it-testimonial-active-2', {
		speed: 1500,
		loop: true,
		slidesPerView: 1,
		spaceBetween: 35,
		autoplay: true,
		breakpoints: {
			'1400': {
				slidesPerView: 1,
			},
			'1200': {
				slidesPerView: 1,
			},
			'992': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},		
		pagination: {
			el: ".it-testimonial-2-dots",
			clickable: true,
		},
		navigation: {
			prevEl: '.arrow-prev',
			nextEl: '.arrow-next',
		},

	});
	////shop-slider
	const progressBar = $(".shop-slider-progress-bar span");
	////////////////////////////////////////////////////
	//  Swiper Js
	const projectswiper = new Swiper('.it-project-active', {
		speed: 1500,
		loop: true,
		slidesPerView: 4,
		spaceBetween: 35,
		autoplay: true,
		breakpoints: {
			'1400': {
				slidesPerView: 4,
			},
			'1200': {
				slidesPerView: 3,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
		navigation: {
			prevEl: '.arrow-prev',
			nextEl: '.arrow-next',
		},
		pagination: {
			el: ".it-project-dots",
			clickable: true,
		},
		on: {
			init: function () {
				updateFraction(this);
			},
			slideChange: function () {
				updateFraction(this);
			}
		}

	});

	// Custom function to update Fraction
	function updateFraction(swiper) {
		const current = swiper.realIndex + 1;
		const total = swiper.slides.length - swiper.loopedSlides * 2; 
		document.querySelector('.swiper-fraction').innerHTML = `${current} / ${total}`;
	}

	////////////////////////////////////////////////////
	//  Swiper Js
	const project2swiper = new Swiper('.it-project-2-active', {
		speed: 1500,
		loop: true,
		slidesPerView: 3,
		spaceBetween: 35,
		autoplay: true,
		breakpoints: {
			'1400': {
				slidesPerView: 3,
			},
			'1200': {
				slidesPerView: 3,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
		pagination: {
			el: ".it-project-2-dots",
			clickable: true,
		},

	});

	////////////////////////////////////////////////////
	//  Swiper Js
	const project3swiper = new Swiper('.it-project-3-active', {
		speed: 1500,
		loop: true,
		slidesPerView: 2,
		spaceBetween: 35,
		autoplay: true,
		breakpoints: {
			'1200': {
				slidesPerView: 2,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
		pagination: {
			el: ".it-project-3-dots",
			clickable: true,
		},
		navigation: {
			prevEl: '.arrow-prev',
			nextEl: '.arrow-next',
		},

	});
	////////////////////////////////////////////////////
	//  Swiper Js
	const project4swiper = new Swiper('.it-project-5-active', {
		speed: 1500,
		loop: true,
		slidesPerView: 5,
		spaceBetween: 35,
		autoplay: true,
		breakpoints: {
			'1200': {
				slidesPerView: 5,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
		navigation: {
			prevEl: '.arrow-prev',
			nextEl: '.arrow-next',
		},
		pagination: {
			el: ".it-project-dots",
			clickable: true,
		},
		on: {
			init: function () {
				updateFraction(this);
			},
			slideChange: function () {
				updateFraction(this);
			}
		}

	});

	////////////////////////////////////////////////////
	// 18. Swiper Js
	const postBoxswiper = new Swiper('.postbox-thumb-slider-active', {
		speed: 1500,
		loop: true,
		slidesPerView: 1,
		spaceBetween: 20,
		autoplay: true,
		breakpoints: {
			'1400': {
				slidesPerView: 1,
			},
			'1200': {
				slidesPerView: 1,
			},
			'992': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
		navigation: {
			prevEl: '.postbox-arrow-prev',
			nextEl: '.postbox-arrow-next',
		},
		
	  });
	////////////////////////////////////////////////////
	//  Swiper Js
	const sliderswiper = new Swiper('.it-slider-active', {
		slidesPerView: 1,
		loop: true,
		autoplay: true,
		autoplay: {
			delay: 4500,
		},
		breakpoints: {
			'1400': {
				slidesPerView: 1,
			},
			'1200': {
				slidesPerView: 1,
			},
			'992': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
		pagination: {
			el: ".it-slider-dots",
			clickable: true,
		},

	});
	////////////////////////////////////////////////////
	// 13. Swiper Js
	var it_text_slider = new Swiper(".it-brand-active", {
		loop: true,
		freemode: true,
		slidesPerView: 'auto',
		spaceBetween: 85,
		centeredSlides: true,
		allowTouchMove: false,
		speed: 2500,
		autoplay: {
			delay: 1,
			disableOnInteraction: true,
		},
	});










	////////////////////////////////////////////////////
	// 13. Swiper Js
	var it_text_slider = new Swiper(".it-text-slider-active", {
		loop: true,
		freemode: true,
		slidesPerView: 'auto',
		spaceBetween: 0,
		centeredSlides: true,
		allowTouchMove: false,
		speed: 2500,
		autoplay: {
			delay: 1,
			disableOnInteraction: true,
		},
	});

})(jQuery);