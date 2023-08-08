/*global document, window, yall, setTimeout, Swiper, createElementWithClass, createRatingsHtmlElement, Cookies, semanticTabs, Image, Shopify, Event, getComputedStyle, CustomEvent, enquire, IntersectionObserver */
/*//jshint esversion: 6 */

/*function childrenMatches(elem, callback) {
	return Array.from(elem.children).filter(callback);
}*/

/**
 * Changes made:
 * - removed some"global" variables that were declared right after document.addEventListener('DOMContentLoaded', ....) and moved them inside methods that are using it
 * - instead of using window.open, change <a> tag to add noopener and target as _blank
 * - renamed variable of to _of on scrolling method (avoid using javascript keywords for variable names as best practice)
 * - comments in some functions
 * - removed i var for loops and added inside for loop (it's super hard to visually debug what the value of i will be when using like that)
 * - action and test required on @02, @03
 * - replaced all keyCode to key - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
 * - @04 the function is super big (and some other in the code too)
 */

var html_tag = document.documentElement,
	// i = 0, -> moved to be inside of for()
	img_lazy = document.querySelectorAll('img[data-src]:not(.dont), picture[data-srcset]:not(.dont)'),
	header_id = document.getElementById('header'),
	header_inner = document.getElementById('header-inner'),
	header_outer_id = document.getElementById('header-outer'),
	nav_id = document.getElementById('nav'),
	nav_bar_id = document.getElementById('nav-bar'),
	isMobile = false,
	global_dir,
	i;
for (i = 0; i < img_lazy.length; i = i + 1) {
	img_lazy[i].classList.add('lazy');
	if (!img_lazy[i].hasAttribute('src')) {
		img_lazy[i].setAttribute('src', img_lazy[i].getAttribute('data-src'));
	}
}

function isTouchDevice() {
	'use strict';
	if (window.matchMedia("(pointer: coarse)").matches) {
		return true;
	} else {
		return false;
	}
}
if (window.mobileCheck() || isTouchDevice()) {
	isMobile = true;
}

var listCollectionSliderEvt = new CustomEvent("listCollectionSlider"),
	announcementSliderEvt = new CustomEvent("announcementSlider"),
	moduleFeaturedSliderEvt = new CustomEvent("moduleFeaturedSlider"),
	listProductSliderEvt = new CustomEvent("listProductSlider"),
	listUspSliderEvt = new CustomEvent("listUspSlider"),
	listTestimonialsSliderEvt = new CustomEvent("listTestimonialsSlider"),
	listStaticSliderEvt = new CustomEvent("listStaticSlider"),
	searchClassesEvt = new CustomEvent("searchClasses"),
	createColsEvt = new CustomEvent("createCols"),
	moduleTabsEvt = new CustomEvent("moduleTabs"),
	formZindexEvt = new CustomEvent("formZindex"),
	ratingsEvt = new CustomEvent("ratings"),
	inputPaddingEvt = new CustomEvent("inputPadding"),
	topEvt = new CustomEvent("top"),
	backgroundEvt = new CustomEvent("background");

/**
 * Close dropdown element
 * @param {HTMLElement} element Parent element that receives the aria-expanded attribute
 */
function toggle_dropdowns_simple(el) {
	'use strict';
	if (el.classList.contains('toggle')) {
		el.classList.remove('toggle');
		//el.parentElement.setAttribute('aria-expanded', false);
	} else {
		el.classList.add('toggle');
		//el.parentElement.setAttribute('aria-expanded', true);
	}
}


function append_url(el, content, className, href, access) {
	'use strict';
	var link = createElementWithClass('a', className);
	if (href) {
		link.href = href;
	} else {
		link.href = './';
	}
	if (access === true) {
		link.setAttribute('tabindex', -1);
		link.setAttribute('aria-hidden', true);
		link.setAttribute('focusable', false);
	}
	link.innerHTML += content;
	if (el !== undefined) {
		el.appendChild(link);
	}
}

function wrap(el, wrapper, className) {
	'use strict';
	el.parentNode.insertBefore(wrapper, el);
	if (className) {
		wrapper.classList.add(className);
	}
	wrapper.appendChild(el);
}

function new_css(id, href, media) {
	"use strict";
	if (!document.getElementById(id)) {
		var a = document.createElement('link'),
			b = document.querySelectorAll('link[id]');
		if (media === undefined) {
			media = 'screen';
		}
		a.setAttribute('id', id);
		a.setAttribute('rel', 'stylesheet');
		a.setAttribute('href', href);
		a.setAttribute('media', media);
		a.setAttribute('id', id);

		//if (async = true && b) {
		if (b.length) {
			Array.from(b).forEach(function (el) {
				el.after(a);
			});
		} else {
			document.head.appendChild(a);
		}
	}
}

var root_styles = document.querySelector(':root');

function getScrollbarWidth() {
	'use strict';
	root_styles.style.setProperty('--scrollbar_width', window.innerWidth - html_tag.clientWidth + 'px');
}

function customDropHeight() {
	'use strict';
	var nav_main;
	if (nav_bar_id) {
		nav_main = nav_bar_id;
	} else if (nav_id) {
		nav_main = nav_id;
	}
	if (nav_main) {
		root_styles.style.setProperty('--drop_nav_mah', window.innerHeight - nav_main.clientHeight - nav_main.getBoundingClientRect().bottom + 'px');
		root_styles.style.setProperty('--drop_nav_mah_fixed', window.innerHeight - nav_main.clientHeight - nav_main.offsetTop + 'px');
		root_styles.style.setProperty('--mega_nav_mah', window.innerHeight - nav_main.getBoundingClientRect().bottom + 'px');
		root_styles.style.setProperty('--mega_nav_mah_fixed', window.innerHeight - nav_main.offsetTop + 'px');
		root_styles.style.setProperty('--sticky_nav_mah', window.innerHeight - nav_main.clientHeight + 'px');
		if (header_id) {
			root_styles.style.setProperty('--header_mih_c', header_id.clientHeight + 'px');
		}
	}
	if (header_outer_id && header_inner) {
		root_styles.style.setProperty('--sticky_offset_m', header_outer_id.clientHeight + 'px');
		if (header_inner.classList.contains('sticky-nav')) {
			html_tag.classList.add('has-sticky-nav');
			root_styles.style.setProperty('--sticky_offset', nav_main.clientHeight + 'px');
		} else {
			root_styles.style.setProperty('--sticky_offset', header_outer_id.clientHeight + 'px');
		}
	}
}
setTimeout(function () {
	'use strict';
	customDropHeight();
}, 100);
getScrollbarWidth();

if (header_inner) {
	if (header_inner && header_inner.classList.contains('mobile-visible-search')) {
		html_tag.classList.add('has-mobile-visible-search');
	}
	if (header_inner && header_inner.classList.contains('t1nn')) {
		html_tag.classList.add('t1nn');
	}
}

function create_slider(el, settings, minSlides) {
	'use strict';
	var sliderElement = el,
		divContent,
		items,
		paginationClass,
		dots,
		dots_cont,
		//fr_cont,
		prev,
		next;

	if (el.children.length > 1) {
		//new_css('css-swiper', '//cdn.shopify.com/s/files/1/0099/8693/2814/t/37/assets/async-swiper.css?v=111603181540343972631691157452');
		// if swiper element is <ul>, convert it to <div> and all it's children from <li> to <div class="li">
		if (el.tagName.toLowerCase() === "ul") {
			el.setAttribute('role', 'none');
			Array.from(el.children).forEach(function (child) {
				child.setAttribute('role', 'none');
				child.classList.add('li');
				/*var addClass = 'li',
					divLi;
				if (child.hasAttribute('class')) {
					addClass = 'li ' + child.getAttribute('class');
				}

				divLi = document.createElement("div");
				divLi.className = addClass;
				divLi.innerHTML = child.innerHTML;*/
				//child.parentNode.replaceChild(divLi, child);
			});

			/*divContent = document.createElement('div');
			divContent.className = el.getAttribute('class');
			if (el.getAttribute('style') !== null) {
				divContent.setAttribute('style', el.getAttribute('style'));
			}
			if (el.getAttribute('data-shopify-editor-block') !== null) {
				divContent.setAttribute('data-shopify-editor-block', el.getAttribute('data-shopify-editor-block'));
			}
			if (el.getAttribute('data-slide-index') !== null) {
				divContent.setAttribute('data-slide-index', el.getAttribute('data-slide-index'));
			}
			divContent.innerHTML = el.innerHTML;
			if (el.hasAttribute('data-random')) {
				divContent.setAttribute('data-random', el.getAttribute('data-random'));
			}
			el.parentNode.replaceChild(divContent, el);
			sliderElement = divContent;*/
		}

		items = sliderElement.children;

		if (!minSlides) {
			minSlides = 1;
		}
		if (items.length > parseFloat(minSlides)) {
			// if pagination class is different from default value (swiper-pagination), creates pagination element with correct class
			paginationClass = (settings && settings.pagination && settings.pagination.el) || ".swiper-pagination";
			paginationClass = paginationClass.replace(/\./g, " ").trim();

			dots = createElementWithClass('span', paginationClass);
			prev = createElementWithClass('span', 'swiper-button-prev');
			next = createElementWithClass('span', 'swiper-button-next');
			sliderElement.classList.add('s4wi');

			Array.from(items).forEach(function (el) {
				wrap(el, document.createElement('div'), 'swiper-slide');
			});
			sliderElement.innerHTML = '<div class="swiper-outer"><div class="swiper-wrapper">' + sliderElement.innerHTML + '</div></div> <div class="swiper-custom-pagination"></div>';
			dots_cont = sliderElement.getElementsByClassName('swiper-custom-pagination')[0];
			// this fixed the bug that when adding the swiper in the top, the pagination for the main swiper wasn't being created
			if (settings && settings.pagination) {
				settings.pagination.el = settings.pagination.el || "." + paginationClass;
				dots_cont.appendChild(prev);
				dots_cont.appendChild(dots);
				dots_cont.appendChild(createElementWithClass('span', 'swiper-custom-fraction'));
				dots_cont.appendChild(next);

			} else {
				sliderElement.appendChild(prev);
				sliderElement.appendChild(next);
			}

			return new Swiper(sliderElement.children[0], settings);
		}
	}

	return null;
}

function clone_with_class(el, cl1, cl2) {
	'use strict';
	var cln = el.cloneNode(true);
	cln.classList.add(cl1);
	el.after(cln);
	el.classList.add(cl2);
}

function randomize(el) {
	'use strict';
	el.setAttribute('data-random', Math.floor(Math.random() * 10000) + 1);
}

function new_js(el) {
	'use strict';
	var tag = document.createElement('script');
	tag.src = el;
	document.body.appendChild(tag);
}

// Prevent scroll down page when SPACE is pressed in a focused element but BODY, INPUT, SELECT or TEXTAREA
window.onkeydown = function (e) {
	'use strict';
	/*var e = e || window.event,
		target = e.srcElement || e.target,*/
	var f = e || window.event,
		target = f.srcElement || f.target,
		tagName = target.tagName.toLowerCase();
	if (e.key === ' ') {
		// if it's input, allow to perform the action (add space to text)
		if (['body', 'input', 'textarea', 'select'].includes(tagName)) {
			return true;
		} else {
			return false;
		}
	}
	return true;
};
function isTouchDevice() {
	'use strict';
	if (window.matchMedia("(pointer: coarse)").matches) {
		return true;
	} else {
		return false;
	}
}

// Check if image is light or dark
/*function getImageLightness(imageSrc, callback) {
	var img = document.createElement("img");
	img.src = imageSrc;
	img.style.display = "none";
	document.body.appendChild(img);

	var colorSum = 0;

	img.onload = function () {
		// create canvas
		var canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(this, 0, 0);

		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = imageData.data;
		var r, g, b, avg;

		for (var x = 0, len = data.length; x < len; x += 4) {
			r = data[x];
			g = data[x + 1];
			b = data[x + 2];

			avg = Math.floor((r + g + b) / 3);
			colorSum += avg;
		}

		var brightness = Math.floor(colorSum / (this.width * this.height));
		callback(brightness);
	};
}*/

function checkIfImageExists(url, callback) {
	'use strict';
	const img = new Image();
	img.src = url;

	if (img.complete) {
		callback(true);
	} else {
		img.onload = () => {
			callback(true);
		};

		img.onerror = () => {
			callback(false);
		};
	}
}

document.addEventListener('DOMContentLoaded', function () {
	'use strict';
	yall({
		observeChanges: true,
		threshold: 500
		/*,
				events: {
					load: function (event) {
						if (!event.target.classList.contains("lazy") && event.target.tagName.toLowerCase() === 'img') {
							event.target.classList.add("yall-loaded");
						}
					}
				}*/
	});
	var // i = 0,
		header_inner = document.getElementById('header-inner'),
		footer_id = document.getElementsByClassName('shopify-section-footer')[0],
		content_id = document.getElementById('content'),
		logo_id = document.getElementById('logo'), nav_main,
		search_id = document.getElementById('search'),
		top_bar,
		nav_top_id = document.getElementById('nav-top'),

		Default = {
			utils: {
				start: function () {
					html_tag.classList.add('js');
				},
				links: function () {
					// Force external link to open in the new tab
					/*var a_tag_external = document.querySelectorAll('a[rel*="external"]');
                    if (a_tag_external.length) {
                        Array.from(a_tag_external).forEach(function (el) {
                            // removed window.open() and added noopener as best practice to <a> tags
                            // https://developer.mozilla.org/en-US/docs/Web/API/Window/open#avoid_resorting_to_window.open
                            var relAttribute = (el.getAttribute('rel') || '').split(' '),
                                targetAttribute;
                            if (!relAttribute.includes('noopener')) {
                                relAttribute.push('noopener');
                            }
                            el.setAttribute('rel', relAttribute.join(' '));

                            // add target to it - https://developer.mozilla.org/en-US/docs/Web/API/Window/open#offer_to_open_a_link_in_a_new_window_using_these_guidelines
                            // although this won't work because when use noopener, it will automatically set target to _blank
                            targetAttribute = el.getAttribute('target');
                            if (!targetAttribute) {
                                targetAttribute = 'external';
                            }
                            el.setAttribute('target', targetAttribute);
                        });
                    }*/

					var breadcrumb_back = document.querySelectorAll('.breadcrumb-back');
					if (breadcrumb_back.length) {
						Array.from(breadcrumb_back).forEach(function (el) {
							if (document.referrer.indexOf(window.location.host) !== -1) {
								el.addEventListener('click', function (e) {
									history.go(-1); return false;
								})
							}
							else { el.remove(); }
						})
					}

				},
				mails: function () {
					// Convert email//domain/com to actual email address
					var email_tag = document.getElementsByClassName('email');
					if (email_tag.length) {
						Array.from(email_tag).filter(function (el) {
							return el.tagName.toLowerCase() !== 'input' && el.tagName.toLowerCase() !== 'div';
						}).forEach(function (el) {
							el.innerHTML = el.innerHTML.replace('//', '@');
							if (el.tagName.toLowerCase() === 'a') {
								el.setAttribute('href', 'mailto:' + el.innerText);
							}
						});
					}
				},
				forms: function () {
					var form_children, select_tag = document.getElementsByTagName('select');
					window.addEventListener("formZindex", function (evt) {
						// Assign z-indexes to form elements
						// :placeholder-like support for <select> element
						if (select_tag.length) {
							Array.from(select_tag).forEach(function (el) {
								el.parentNode.classList.add('has-select');
								if (el.closest('p') !== null) {
									el.closest('p').classList.add('has-select');
								}
								el.addEventListener('change', function () {
									el.classList.add('changed');
								});
							});
						}

						form_children = document.querySelectorAll('form > *, fieldset > *, .no-zindex, .no-zindex > *, .has-select, .f8pr > *, .l4ca.compact.in-panel > *');
						if (form_children.length) {
							Array.from(form_children).forEach(function (el, index) {
								el.style.zIndex = form_children.length - index;
							});
						}
					});
					window.dispatchEvent(formZindexEvt);

					// :placeholder-like support for <select> element
					select_tag = document.getElementsByTagName('select');
					if (select_tag.length) {
						Array.from(select_tag).forEach(function (el) {
							el.addEventListener('change', function () {
								el.classList.add('changed');
							});
						});
					}

					window.addEventListener("inputPadding", function (evt) {
						var input_prefix, input_suffix;
						// Padding for ".input-prefix" element
						input_prefix = document.querySelectorAll('.input-prefix > span:first-child');
						if (input_prefix.length) {
							Array.from(input_prefix).forEach(function (el) {
								var c = el.nextElementSibling;
								if (el.offsetWidth != 0) {
									if (html_tag.getAttribute('dir') === 'rtl') {
										c.style.paddingRight = el.offsetWidth + 'px';
									} else {
										c.style.paddingLeft = el.offsetWidth + 'px';
									}
								}
							});
						}
						// Padding for ".input-suffix" element
						input_suffix = document.querySelectorAll('.input-suffix > span:first-child');
						if (input_suffix.length) {
							Array.from(input_suffix).forEach(function (el) {
								var c = el.nextElementSibling;
								if (html_tag.getAttribute('dir') === 'rtl') {
									c.style.paddingLeft = el.offsetWidth + 'px';
								} else {
									c.style.paddingRight = el.offsetWidth + 'px';
								}
							});
						}
					});
					setTimeout(function () {
						window.dispatchEvent(inputPaddingEvt);
					}, 500);
					window.check_limit_event = function() {
						var check_limit = document.querySelectorAll('.check[data-limit]');
						if (check_limit.length) {
							Array.from(check_limit).forEach(function (el) {
								if (!el.classList.contains('check-limit-initialized')) {
									el.classList.add('check-limit-initialized');
									var tag_limit = 'a',
										limit,
										trigger,
										nextAll = false,
										last_desc;
									if (el.tagName.toLowerCase() === 'ul' || el.tagName.toLowerCase() === 'ol') {
										tag_limit = 'li';
									}
									limit = createElementWithClass(tag_limit, 'limit');
									trigger = el.children[el.dataset.limit - 1];

									if (trigger !== undefined) {
										nextAll = [].filter.call(trigger.parentNode.children, function (htmlElement) {
											return (htmlElement.previousElementSibling === trigger) ? nextAll = true : nextAll;
										});
										nextAll.forEach(function (em) {
											if (!em.classList.contains('hidden')) {
												em.classList.add('hidden-check');
											}
										});
										limit.innerText = '+' + Math.abs(el.querySelectorAll('li:not(.hidden, .tip-cont)').length - el.dataset.limit);
										if (tag_limit = 'li') {
											limit.innerHTML = '<a href="./">' + limit.innerHTML + '</a>';
										}
										el.append(limit);
										last_desc = el.querySelectorAll('li.hidden')[0];
										if (last_desc !== undefined) {
											el.appendChild(el.querySelectorAll('li.hidden')[0]);
										}
										Array.from(el.querySelectorAll('a.limit, .limit a')).forEach(function (em) {
											em.addEventListener('click', function (e) {
												el.classList.add('limit-clicked');
												e.preventDefault();
											});
										});
									}
								}
							});
						}
					};
					check_limit_event();
					/*var list_cart = document.querySelectorAll('.l4ca > li');
					if (list_cart.length) {
						Array.from(list_cart).filter(function (el) {
							if(!el.querySelectorAll('figure').length){
								el.classList.add('no-img');
							}
						});
					}*/
				},
				top: function () {
					window.addEventListener("top", function (evt) {
						nav_top_id = document.getElementById('nav-top');
						header_inner = document.getElementById('header-inner');
						logo_id = document.getElementById('logo');
						search_id = document.getElementById('search');
						nav_id = document.getElementById('nav');
						nav_bar_id = document.getElementById('nav-bar');

						if (logo_id) {
							var logo_text = logo_id.querySelectorAll('span');
							if (logo_id.parentElement.classList.contains('text-center-logo') && !header_inner.classList.contains('hide-btn')) {
								search_id.classList.add('compact');
							}
							if (logo_text.length) {
								header_inner.classList.add('logo-text');
							}
							Array.from(logo_id.querySelectorAll('img[alt]')).forEach(function (el) {
								var pt = el.parentNode,
									span;

								checkIfImageExists(el.getAttribute('src'), (exists) => {
									if (!exists) {
										span = document.createElement('span');
										span.innerHTML = el.getAttribute('alt');
										pt.appendChild(span);
										pt.classList.add('broken-img');
									}
								});
							});
						}
						if (search_id && header_inner) {
							if (!search_id.classList.contains('compact') && header_inner.classList.contains('hide-btn') && header_inner.classList.contains('text-center-logo')) {
								search_id.classList.add('not-compact');
								if (search_id.classList.contains('not-compact')) {
									enquire.register('screen and (max-width: 1000px)', function () {
										search_id.classList.add('compact');
									}).register('screen and (min-width: 1001px)', function () {
										search_id.classList.remove('compact');
									});
								}
							}
						}

						// Expandable nav
						if (nav_id) {
							nav_main = nav_id;
						}
						if (nav_bar_id) {
							nav_main = nav_bar_id;
						}

						if (html_tag.getAttribute('dir') === 'rtl') {
							global_dir = ['rtl', false];
						} else {
							global_dir = ['ltr', true];
						}

						function checkInv(el, ratio) {
							"use strict";
							var el_off;
							if (global_dir[1] === false) {
								el_off = window.innerWidth - el.offsetLeft - el.offsetWidth;
							} else {
								el_off = el.offsetLeft;
							}
							if (el_off > (window.innerWidth * ratio)) {
								el.classList.add('inv');
							} else {
								el.classList.remove('inv');
							}
						}

						function countNavDist(el, em) {
							var el_off, el_tr = 0,
								d, f;
							d = el.dataset.copy,
								f = nav_main.querySelectorAll('.show-all li[data-copy="' + d + '"]')[0];

							if (el.classList.contains('temp-hidden')) {
								el.classList.remove('temp-hidden');
								if (typeof f !== 'undefined') {
									f.classList.remove('temp-hidden');
								}
							}

							if (html_tag.getAttribute('dir') === 'rtl') {
								el_off = nav_main.clientWidth - el.offsetLeft - el.clientWidth;
							} else {
								el_off = el.offsetLeft;
							}
							if (el.parentElement.querySelectorAll('.temp-hidden:not(.show-all)').length > 0) {
								el_tr = 1.2;
							}

							if (nav_main.clientWidth < el_off + el.clientWidth + em * el_tr) {
								el.classList.add('temp-hidden');
								if (typeof f !== 'undefined') {
									f.classList.add('temp-hidden');
								}
							} else {
								el.classList.remove('temp-hidden');
								if (typeof f !== 'undefined') {
									f.classList.remove('temp-hidden');
								}
							}
						}

						function countNavDistF(el, em, en) {
							if (el.clientWidth > nav_main.clientWidth) {
								if (nav_main.classList.contains('text-center')) {
									nav_main.classList.remove('text-center');
									nav_main.classList.add('have-text-center');
								}
								if (nav_main.classList.contains('text-end')) {
									nav_main.classList.remove('text-end');
									nav_main.classList.add('have-text-end');
								}
								html_tag.classList.add('has-long-nav');
								if (em.length) {
									en = em[0].clientWidth;
								}
								Array.from(el.children).forEach(function (eo) {
									countNavDist(eo, en);
									window.addEventListener('resize', function () {
										countNavDist(eo, en);
									});
								});
							} else {
								html_tag.classList.remove('has-long-nav');
								if (nav_main.classList.contains('have-text-center')) {
									nav_main.classList.add('text-center');
								}
								if (nav_main.classList.contains('have-text-end')) {
									nav_main.classList.add('text-end');
								}
							}
						}

						if (nav_id || nav_bar_id) {
							var nmu = nav_main.querySelectorAll('[data-type]')[0],
								nml,
								nms = 0,
								nmt,
								nmv = nav_main.getElementsByClassName('sub-static'),
								all_submenu;

							if (nmu !== undefined) {
								nml = nmu.querySelectorAll('li.show-all');

								Array.from(nmu.children).forEach(function (el, index) {
									el.setAttribute('data-copy', nmu.children.length - index);
								});

								if (nml.length) {
									all_submenu = createElementWithClass('ul', 'show-all-submenu');
									nml[0].appendChild(all_submenu);
									nmt = nml[0].closest('ul').children;
									Array.from(nmt).forEach(function (el) {
										var clone_me = el.cloneNode(true);
										nml[0].querySelectorAll('.show-all-submenu')[0].appendChild(clone_me);
									});

									countNavDistF(nmu, nml, nms);
									setTimeout(function () {
										countNavDistF(nmu, nml, nms);
									}, 100);
									window.addEventListener('resize', function () {
										html_tag.classList.add('has-long-nav');
										countNavDistF(nmu, nml, nms);
									});
								}
								if (nmv.length) {
									Array.from(nmv).forEach(function (el) {
										checkInv(el, 0.4);
										window.addEventListener('resize', function () {
											checkInv(el, 0.4);
										});
									});
								}
							}
						}


						// If #nav exists, create a #nav-top for mobile menu
						if (nav_id && nav_top_id && !nav_id.querySelectorAll('ul.nav-top').length) {
							//console.log(nav_top_id.querySelectorAll('ul[data-type]'));
							Array.from(nav_top_id.querySelectorAll('ul[data-type]')).forEach(function (el) {
								var clone_me = el.cloneNode(true);
								clone_me.classList.add('nav-top');
								nav_id.appendChild(clone_me);
							});
						}

						// Detect empty URLs
						if (nav_main) {
							Array.from(nav_main.querySelectorAll('li.sub > a[href="#"]')).forEach(function (el) {
								el.parentElement.classList.add('empty-url');
							});
						}

						/*var a_accessible = document.getElementsByClassName('link-accessible');
						if (a_accessible.length) {
							Array.from(a_accessible).forEach(function (el) {
								el.parentElement.classList.add('has-link-accessible');
								if (el.tagName.toLowerCase() === 'a') {
									el.addEventListener('click', function (e) {
										if (html_tag.classList.contains('t1ac')) {
											html_tag.classList.remove('t1ac');
											Cookies.remove('accessible', { sameSite: 'none', secure: true });
										} else {
											new_css('accessible-mode-css', "//cdn.shopify.com/s/files/1/0099/8693/2814/t/37/assets/theme-accessible.css?v=183390142599239287431691157453");
											html_tag.classList.add('t1ac');
											Cookies.set('accessible', 'yes', { sameSite: 'none', secure: true });
										}
										if (nav_id || nav_bar_id) {
											var temp_hidden = nav_main.getElementsByClassName('temp-hidden');
											setTimeout(function () {
												Array.from(temp_hidden).forEach(function (el) {
													el.classList.remove('temp-hidden');
												});
												countNavDistF(nmu, nml, nms);
												window.dispatchEvent(new Event('resize'));
											}, 100);
										}
										e.preventDefault();
									});
								}
							});
							document.addEventListener('click', function (e) {
                                if((e.target.closest('a') !== null && e.target.closest('a').classList.contains('link-accessible')) || (e.target.tagName.toLowerCase() === 'a' && e.target.classList.contains('link-accessible'))){
							}
                            });
						}
						if (general.enable_accessibility_default) {
							Cookies.set('accessible', 'yes', { sameSite: 'none', secure: true });
						} else if (general.show_accessibility == false) {
							Cookies.remove('accessible', { sameSite: 'none', secure: true });
						}
						if (Cookies.get('accessible') === 'yes') {
							new_css('accessible-mode-css', "//cdn.shopify.com/s/files/1/0099/8693/2814/t/37/assets/theme-accessible.css?v=183390142599239287431691157453");
							html_tag.classList.add('t1ac');
						} else {
							html_tag.classList.remove('t1ac');
							Cookies.remove('accessible', { sameSite: 'none', secure: true });
						}*/

						// Searchbox
						if (search_id) {
							if (search_id.classList.contains('compact-handle')) {
								html_tag.classList.add('t1sh-mobile', 'search-compact-handle');
							} else {
								html_tag.classList.remove('t1sh-mobile', 'search-compact-handle');
							}
							if (search_id.classList.contains('compact-handle-mobile')) {
								html_tag.classList.add('t1sh-mobile', 'search-compact-handle', 'search-compact-handle-mobile');
							}
							if (search_id.classList.contains('compact')) {
								if (search_id.classList.contains('compact-handle')) {
									html_tag.classList.add('t1sh');
								} else {
									html_tag.classList.remove('t1sh');
								}
								//if ((!html_tag.classList.contains('t1sr-desktop')) || (!html_tag.classList.contains('t1sr-mobile'))) {
								//html_tag.classList.add('t1sr');
								//}*/
								/*if (search_id.classList.contains('compact-desktop')) {
                                    html_tag.classList.add('t1sr-desktop');
                                } else if (search_id.classList.contains('compact-mobile')) {
                                    html_tag.classList.add('t1sr-mobile');
                                } else {*/
								html_tag.classList.add('t1sr');
								//}
							} else {
								html_tag.classList.remove('t1sr', 't1sh');
							}
							if (search_id.classList.contains('text-center-sticky')) {
								html_tag.classList.add('search-compact-is-centered');
							} else {
								html_tag.classList.remove('search-compact-is-centered');
							}
						}
					});
					window.dispatchEvent(topEvt);
				},
				footer: function () {
					// Togglable headers on mobile
					if (footer_id) {
						Array.from(footer_id.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach(function (el) {
							append_url(el, 'Close', 'header-toggle');
							el.querySelector('a.header-toggle').addEventListener('click', function (e) {
								toggle_dropdowns_simple(el.parentElement);
								e.preventDefault();
							});
						});
					}
					window.addEventListener("background", function(evt) {
						// Change the position of background element (just for security)
						if (document.querySelector('#background.done')) {
							document.querySelector('#background.done').remove();
						}
						var background_id = document.getElementById('background');
						if (background_id && !background_id.classList.contains('static') && (background_id.parentNode.id === 'content' || background_id.parentNode.classList.contains('shopify-section'))) {
							document.getElementById('root').appendChild(background_id);
							background_id.classList.add('done');
						}
					});
					window.dispatchEvent(backgroundEvt);
				},
				mobile: function () {
					if (isMobile) {
						html_tag.classList.add('mobile');
					} else {
						html_tag.classList.add('no-mobile');
					}
				},
				done: function () {
					new_js("//cdn.shopify.com/s/files/1/0099/8693/2814/t/37/assets/scripts-async.js?v=80854015575402928021691406220");
				},
				ratings: function () {
					window.addEventListener("ratings", function(evt) {
						var rating_element = document.querySelectorAll('[data-val][data-of]:not(.rating-initialized)');
						if (rating_element.length) {
							Array.from(rating_element).forEach(function (el) {
								var reviewsElem = createElementWithClass('span', 'rating-label'),
									reviews = el.innerHTML,
									rating = el.dataset.val,
									total = el.dataset.of;
								if (!el.classList.contains('s1br')) {
									el.innerHTML = '';
									el.append(createRatingsHtmlElement(rating, total));
									reviewsElem.innerHTML = reviews;
								} else {
									reviewsElem.innerHTML = '<span class="bar" style="width: ' + rating / total * 100 + '%;"></span>';
								}
								el.appendChild(reviewsElem);
								el.classList.add('rating-initialized');
							});
						}
					});
					window.dispatchEvent(ratingsEvt);
				},
				backgrounds: function () {
					var align_middle = document.getElementsByClassName('align-middle'),
						align_center = document.getElementsByClassName('align-center');
					if (align_middle.length) {
						Array.from(align_middle).forEach(function (el) {
							var em = el.parentNode,
								en = em.parentNode;
							if ((el.previousElementSibling === null && el.nextElementSibling === null && em.id === 'content') || (el.previousElementSibling === null && el.nextElementSibling === null && em.previousElementSibling === null && em.nextElementSibling === null && en.id === 'content')) {
								document.getElementById('content').classList.add('align-center');
							}
						});
					}
					if (align_center.length) {
						Array.from(align_center).forEach(function (el) {
							var em = el.parentNode,
								en = em.parentNode;
							if ((el.previousElementSibling === null && el.nextElementSibling === null && em.id === 'content') || (el.previousElementSibling === null && el.nextElementSibling === null && em.previousElementSibling === null && em.nextElementSibling === null && en.id === 'content')) {
								document.getElementById('content').classList.add('align-center-static');
							}
						});
					}
					var list_featured_content_box = document.querySelectorAll('.l4ft .content.box');
					if (list_featured_content_box.length) {
						Array.from(list_featured_content_box).forEach(function (el) {
							if (el.closest('li') !== null) {
								el.closest('li').classList.add('has-content-box');
							}
						});
					}
					/*var list_featured_img = document.querySelectorAll('.l4ft img');
					Array.from(list_featured_img).forEach(function (el) {
						getImageLightness(el.getAttribute('src'), function (brightness) {
							if (brightness > 180) {
								el.closest('li').classList.add('bg-light');
							} else {
								el.closest('li').classList.add('bg-dark');
							}
						});
					});*/
				},
				tabs: function () {
					// Create tabs
					// Create tabs
					window.addEventListener("moduleTabs", function(evt) {
						if (content_id) {
							var module_tabs = content_id.getElementsByClassName('m6tb');
							if (module_tabs.length) {
								/*loadRes(path_js + 'plugin-tabs.js', function () {
                                    "use strict";*/
								Array.from(module_tabs).forEach(function (el) {
									if (typeof semanticTabs === 'function' /*&& typeof semanticTabs !== 'undefined'*/ && !el.classList.contains('tabs-initialized')) {
										semanticTabs(el);
									}
									el.classList.add('tabs-initialized');
								});
								//linkMore();
								//}, 'tabs-loaded');
							}
						}
					});
					window.dispatchEvent(moduleTabsEvt);
				},
				swipers: function () {
					var module_featured, list_panel_slider, list_testimonials, list_static, list_usp, popup_a, list_collection_slider, module_collection, list_product_slider, data_update_product_slider, data_update_generic_slider, data_scroll_product_slider, autoplay_top_int;
					window.addEventListener("moduleFeaturedSlider", function(event) {
						module_featured = document.querySelectorAll('.m6fr:not(.s4wi)');
						if (module_featured.length) {
							Array.from(module_featured).forEach(function (el) {
								var pagination_type = 'bullets',
									autoplay_int = false,
									total_sl = el.children.length,
									featuredSlider;
                  el.querySelectorAll('figure').forEach(function (em) {
                    if (em.getElementsByTagName('picture').length > 1) {
                      em.classList.add('has-pics');
                    }
                  });
								if (el.classList.contains('slider-fraction')) {
									pagination_type = 'fraction';
								}
								if (el.getAttribute('data-autoplay')) {
									autoplay_int = {
										delay: parseFloat(el.getAttribute('data-autoplay')),
										pauseOnMouseEnter: true
										/*,disableOnInteraction: false*/
									};
								}
								randomize(el);
								//var swiper_new = create_slider(el, {
								featuredSlider = create_slider(el, {
									direction: 'horizontal',
									loop: true,
									autoHeight: true,
									resizeObserver: true,
									/*lazy: {
                                        loadPrevNext: true,
                      loadOnTransitionStart: true
                                    },*/
									autoplay: autoplay_int,
									threshold: 50,
									pagination: {
										el: '.swiper-pagination-' + el.getAttribute('data-random'),
										//el: el.getElementsByClassName('swiper-pagination-bullets')[0],
										clickable: true,
										type: pagination_type,
										renderBullet: function (index, className) {
											return '<span class="' + className + '">' + (index + 1) + "<span class='prg'></span></span>";
										}
									},
									navigation: {
										nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
										prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
									},
									on: {
										slideChangeTransitionStart: function (swiper) {
											Array.from(el.querySelectorAll('.swiper-slide > article.aside')).forEach(function (em) {
												em.parentNode.classList.add('has-aside');
											});
											var active_content = swiper.el.querySelectorAll('.swiper-slide[data-swiper-slide-index="' + swiper.realIndex + '"] > article')[0];
											if (typeof active_content !== 'undefined') {
												el.setAttribute('data-active-content', active_content.getAttribute('class'));
											}
											if (swiper.realIndex > 0) {
												el.classList.add('changed');
											} else {
												el.classList.remove('changed');
											}
											if (swiper.realIndex + 1 === total_sl) {
												el.classList.add('last-slide-active');
											} else {
												el.classList.remove('last-slide-active');
											}
										},
										resize: function (swiper) {
											// html_tag.classList.add('resized');
											if (typeof Shopify !== 'undefined' && Shopify.designMode) {
												Array.from(featuredSlider.slides).forEach(function () {
													featuredSlider.slideNext(0);
												});
											}
											setTimeout(function () {
												featuredSlider.updateAutoHeight();
											}, 500);

										}
									}

								});
								if (featuredSlider !== null) {
									if (el.getAttribute('data-autoplay') && !el.classList.contains('no-controls')) {
										append_url(el, 'Play/Pause', 'play-pause');
										el.getElementsByClassName('play-pause')[0].addEventListener('click', function (e) {
											if (el.classList.contains('paused')) {
												el.classList.remove('paused');
												featuredSlider.autoplay.start();
											} else {
												el.classList.add('paused');
												featuredSlider.autoplay.stop();
											}
											e.preventDefault();
										});
									}
									el.addEventListener('mouseleave', function () {
										if (el.getAttribute('data-autoplay') && !el.classList.contains('paused')) {
											el.classList.remove('paused');
											featuredSlider.autoplay.start();
										}
									});
									/*el.getElementsByClassName('play-pause')[0].addEventListener('click', function (e) {
                                        if (el.classList.contains('paused')) {
                                            el.classList.remove('paused');
                                        } else {
                                            el.classList.add('paused');
                                        }
                                    });*/
									window.addEventListener('resize', function (event) {
										html_tag.classList.add('resized');
									}, true);
									setTimeout(function () {
										featuredSlider.updateAutoHeight();
									}, 500);
								}
								if (el.classList.contains('s4wi')) {
									setTimeout(function () {
										if (typeof updateSlidersEvt != 'undefined') {
											window.dispatchEvent(updateSlidersEvt);
										}
									}, 300);
								}
							});
						}
					});
					window.dispatchEvent(moduleFeaturedSliderEvt);

					window.addEventListener("announcementSlider", function(event) {
						top_bar = document.querySelector('.shopify-section-announcement-bar:not(.s4wi)');
						var top_bar_children = document.querySelectorAll('.shopify-section-announcement-bar:not(.s4wi) > *:not(.close, .overlay-close)');
						if (top_bar && top_bar_children.length > 1) {
							Array.from(top_bar.querySelectorAll('.close, .overlay-close')).forEach(function (el) {
								el.remove();
							});
							autoplay_top_int = false;
							if (top_bar.getAttribute('data-autoplay')) {
								autoplay_top_int = {
									delay: parseFloat(top_bar.getAttribute('data-autoplay')),
									pauseOnMouseEnter: true,
									disableOnInteraction: false
								};
							}
							if (top_bar.getElementsByClassName('no-nav').length) {
								top_bar.classList.add('no-nav');
							}
							randomize(top_bar);
							create_slider(top_bar, {
								direction: 'horizontal',
								loop: true,
								autoHeight: true,
								/*lazy: {
                                    loadPrevNext: true
                                },*/
								spaceBetween: html_tag.clientWidth * 0.5,
								autoplay: autoplay_top_int,
								pagination: false,
								navigation: {
									nextEl: '[data-random="' + top_bar.getAttribute('data-random') + '"] .swiper-button-next',
									prevEl: '[data-random="' + top_bar.getAttribute('data-random') + '"] .swiper-button-prev'
								}
								/*,
								on: {
									afterInit: function (swiper) {
										Array.from(swiper.el.querySelectorAll('[style]')).forEach(function (el) {
											if(el.parentNode.classList.contains('swiper-slide')){
												el.parentNode.css
											}
										});
									}
								}*/
							});
						}
					});
					window.dispatchEvent(announcementSliderEvt);

					list_panel_slider = document.getElementsByClassName('l4ps');
					if (list_panel_slider.length) {
						Array.from(list_panel_slider).forEach(function (el) {
							var pagination_type = 'bullets',
								autoplay_int = false,
								total_sl = el.children.length;
							if (el.classList.contains('slider-fraction')) {
								pagination_type = 'fraction';
							}
							if (el.getAttribute('data-autoplay')) {
								autoplay_int = {
									delay: parseFloat(el.getAttribute('data-autoplay')),
									pauseOnMouseEnter: true,
									disableOnInteraction: false
								};
							}
							randomize(el);
							create_slider(el, {
								direction: 'horizontal',
								loop: false,
								autoHeight: true,
								/*lazy: {
									loadPrevNext: true
								},*/
								autoplay: autoplay_int,
								pagination: {
									el: '.swiper-pagination-' + el.getAttribute('data-random'),
									clickable: true,
									type: pagination_type
								},
								navigation: {
									nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
									prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
								},
								on: {
									slideChangeTransitionStart: function (swiper) {
										if (swiper.realIndex > 0) {
											swiper.el[0].parentNode.classList.add('changed');
										} else {
											swiper.el[0].parentNode.classList.remove('changed');
										}
										if (swiper.realIndex + 1 === total_sl) {
											swiper.el[0].parentNode.classList.add('last-slide-active');
										} else {
											swiper.el[0].parentNode.classList.remove('last-slide-active');
										}
									}
								}
							});
						});
					}

					window.addEventListener("listTestimonialsSlider", function(event) {
						list_testimonials = document.querySelectorAll('.l4ts:not(.s4wi)');
						if (list_testimonials.length) {
							Array.from(list_testimonials).forEach(function (el) {
								var ln = [1, 2, 3],
									pagination_type = 'bullets',
									autoplay_int = false,
									total_sl = el.children.length,
									options;
								if (el.classList.contains('wide') || el.classList.contains('w100')) {
									ln = [1, 1, 1];
								}
								if (el.classList.contains('w50')) {
									ln = [1, 2, 2];
								}
								if (el.classList.contains('slider-fraction')) {
									pagination_type = 'fraction';
								}
								if (el.getAttribute('data-autoplay')) {
									autoplay_int = {
										delay: parseFloat(el.getAttribute('data-autoplay')),
										pauseOnMouseEnter: true,
										disableOnInteraction: false
									};
								}
								randomize(el);
								options = {
									direction: 'horizontal',
									loop: true,
									autoHeight: true,
									spaceBetween: 16,
									slidesPerView: ln,
									slidesPerGroup: ln,
									autoplay: autoplay_int,
									pagination: {
										el: '.swiper-pagination-' + el.getAttribute('data-random'),
										clickable: true,
										type: pagination_type
									},
									navigation: {
										nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
										prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
									},
									on: {
										slideChangeTransitionStart: function (swiper) {
											if (swiper.realIndex > 0) {
												swiper.el[0].parentNode.classList.add('changed');
											} else {
												swiper.el[0].parentNode.classList.remove('changed');
											}
											if (swiper.realIndex + 1 === total_sl) {
												swiper.el[0].parentNode.classList.add('last-slide-active');
											} else {
												swiper.el[0].parentNode.classList.remove('last-slide-active');
											}
										}
									},
									breakpoints: {
										0: {
											slidesPerView: ln[0],
											slidesPerGroup: ln[0]
										},
										760: {
											slidesPerView: ln[1],
											slidesPerGroup: ln[1]
										},
										1000: {
											slidesPerView: ln[2],
											slidesPerGroup: ln[2]
										}
									}
								};
								if (el.classList.contains('slider') && el.children.length > ln[2]) {
									create_slider(el, options);
								}
								if (el.classList.contains('slider-mobile') && el.children.length > ln[0]) {
									clone_with_class(el, 'mobile-only', 'mobile-hide');
									if (el.nextElementSibling.classList.contains('mobile-only')) {
										if (el.nextElementSibling.hasAttribute('id')) {
											el.nextElementSibling.removeAttribute('id');
										}
										create_slider(el.nextElementSibling, options);
									}
								}
							});
						}
					});
					window.dispatchEvent(listTestimonialsSliderEvt);

					window.addEventListener("listStaticSlider", function(event) {
						list_static = document.querySelectorAll('.l4st:not(.s4wi)');
						if (list_static.length) {
							Array.from(list_static).forEach(function (el) {
								var pagination_type = 'bullets',
									autoplay_int = false,
									total_sl = el.children.length;
								if (el.classList.contains('slider-fraction')) {
									pagination_type = 'fraction';
								}
								if (el.getAttribute('data-autoplay')) {
									autoplay_int = {
										delay: parseFloat(el.getAttribute('data-autoplay')),
										pauseOnMouseEnter: true,
										disableOnInteraction: false
									};
								}
								randomize(el);
								clone_with_class(el, 'mobile-only', 'mobile-hide');
								if (el.nextElementSibling.classList.contains('mobile-only')) {
									if (el.nextElementSibling.hasAttribute('id')) {
										el.nextElementSibling.removeAttribute('id');
									}
									create_slider(el.nextElementSibling, {
										direction: 'horizontal',
										loop: true,
										autoHeight: true,
										spaceBetween: 16,
										autoplay: autoplay_int,
										pagination: {
											el: '.swiper-pagination-' + el.getAttribute('data-random'),
											clickable: true,
											type: pagination_type
										},
										navigation: {
											nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
											prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
										},
										on: {
											slideChangeTransitionStart: function (swiper) {
												if (swiper.realIndex > 0) {
													swiper.el[0].parentNode.classList.add('changed');
												} else {
													swiper.el[0].parentNode.classList.remove('changed');
												}
												if (swiper.realIndex + 1 === total_sl) {
													swiper.el[0].parentNode.classList.add('last-slide-active');
												} else {
													swiper.el[0].parentNode.classList.remove('last-slide-active');
												}
											}
										}
									});
								}
								/*if (el.classList.contains('slider')) {
                                    randomize(el);
                                }*/
							});
						}
					});
					window.dispatchEvent(listStaticSliderEvt);

					window.addEventListener("listUspSlider", function(event) {
						list_usp = document.querySelectorAll('.l4us:not(.s4wi)');
						if (list_usp.length) {
							Array.from(list_usp).forEach(function (el) {
								if (!el.classList.contains('static')) {
									var options,
										autoplay_int = false,
										autowidth_int = 1,
										space_between;
									//pagination_type = 'bullets',
									//autoplay_int = false,
									//options;
									/*if (el.classList.contains('slider-fraction')) {
                                        pagination_type = 'fraction';
                                    }*/
									if (el.classList.contains('no-arrows')) {
										space_between = 16;
									} else {
										space_between = 44;
									}
									if (el.getAttribute('data-autoplay')) {
										autoplay_int = {
											delay: parseFloat(el.getAttribute('data-autoplay')),
											pauseOnMouseEnter: true,
											disableOnInteraction: false
										};
									}
									randomize(el);
									if (el.querySelectorAll('li').length === 1) {
										el.classList.remove('slider', 'slider-single');
									}
									if (el.closest('#nav-top') !== null && el.classList.contains('slider')) {
										el.classList.add('slider-in-header');
										if (!el.classList.contains('slider-single')) {
											autowidth_int = 'auto';
										}
									}
									options = {
										direction: 'horizontal',
										loop: true,
										pagination: false,
										autoplay: autoplay_int,
										slidesPerView: autowidth_int,
										autoHeight: true,
										spaceBetween: space_between,
										navigation: {
											nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
											prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
										},
										breakpoints: {
											0: {
												slidesPerView: 1
											},
											760: {
												slidesPerView: autowidth_int
											},
											1000: {
												spaceBetween: space_between
											},
											1100: {
												spaceBetween: 20
											}
										}
									};
									if (!el.classList.contains('slider')) {
										clone_with_class(el, 'l4us-mobile', 'mobile-hide');
										if (el.nextElementSibling.classList.contains('l4us-mobile')) {
											el.nextElementSibling.classList.remove('slider', 'slider-in-header');
											if (el.nextElementSibling.hasAttribute('id')) {
												el.nextElementSibling.removeAttribute('id');
											}
											create_slider(el.nextElementSibling, options);
										}
									}
									if (el.classList.contains('slider')) {
										create_slider(el, options);
									}
								}
							});
						}
					});
					window.dispatchEvent(listUspSliderEvt);

					popup_a = document.getElementsByClassName('popup-a');
					if (popup_a.length) {
						Array.from(popup_a).forEach(function (el) {
							Array.from(el.getElementsByClassName('l4cl')).forEach(function (el) {
								el.classList.add('in-popup');
							});
						});
					}

					module_collection = document.getElementsByClassName('m6cl');
					if (module_collection.length) {
						Array.from(module_collection).forEach(function (el) {
							Array.from(el.querySelectorAll('.l4cl.slider:not(.w12, .w14, .w16, .w20, .w25, .w33, .w50)')).forEach(function (el) {
								el.classList.add('in-col');
							});
						});
					}
					var list_collection = document.getElementsByClassName('l4cl');
					if (list_collection.length) {
						Array.from(list_collection).forEach(function (el) {
							if (el.clientHeight < el.scrollHeight) {
								el.classList.add('is-scrollable');
							}
							Array.from(el.querySelectorAll('div.box')).forEach(function (em) {
								if (em.closest('li') !== null) {
									em.closest('li').classList.add('has-div-box');
								}
							});
							Array.from(el.querySelectorAll('li, .li')).forEach(function (em) {
								if (em.querySelectorAll('picture ~ picture').length) {
									em.classList.add('has-picture-picture');
								}
							});
						});
					}

					window.addEventListener("listCollectionSlider", function(event) {
						list_collection_slider = document.querySelectorAll('.l4cl.slider:not(.in-popup, .s4wi)');
						if (list_collection_slider.length) {
							Array.from(list_collection_slider).forEach(function (el) {
								var items, hasImg = false,
									autoHeight = true,
									loopMe = false,
									spacing = 16,
									wrapper_id;
								// if (el.closest('.m6pn') !== null) {
								// 	console.log('a');
								// }
								if (typeof el.querySelectorAll('figure')[0] !== 'undefined') {
									hasImg = true;
									el.querySelectorAll('figure')[0].classList.add('first-image');
								} else {
									el.classList.add('no-img');
								}
								if (el.classList.contains('slider-loop')) {
									loopMe = true;
								}
								if (!isNaN(parseFloat(getComputedStyle(el).getPropertyValue('--dist_a')))) {
									spacing = parseFloat(getComputedStyle(el).getPropertyValue('--dist_a'));
								}
								if (el.classList.contains('text-justify')) {
									items = ['auto', 'auto', 'auto'];
									autoHeight = false;
								} else {
									if (el.classList.contains('in-col')) {
										items = [4, 4, 3];
									} else if (el.classList.contains('w12')) {
										items = [8, 6, 4];
									} else if (el.classList.contains('w14')) {
										items = [7, 6, 4];
									} else if (el.classList.contains('w16')) {
										items = [6, 5, 3];
									} else if (el.classList.contains('w20')) {
										items = [5, 5, 3];
									} else if (el.classList.contains('w25')) {
										items = [4, 4, 3];
									} else if (el.classList.contains('w33')) {
										items = [3, 3, 3];
									} else if (el.classList.contains('w50')) {
										items = [2, 2, 2];
									} else {
										items = [5, 5, 3];
									}
								}
								randomize(el);
								create_slider(el, {
									direction: 'horizontal',
									loop: loopMe,
									autoHeight: autoHeight,
									slidesPerView: items[0],
									focusableElements: 'input',
									spaceBetween: spacing,
									touchStartPreventDefault: false,
									/*lazy: {
                                        loadPrevNext: true
                                    },*/
									pagination: {
										el: '.swiper-pagination-' + el.getAttribute('data-random'),
										clickable: true
									},
									navigation: {
										nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
										prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
									},
									breakpoints: {
										0: {
											simulateTouch: false,
											allowTouchMove: false
										},
										760: {
											slidesPerView: items[2],
											simulateTouch: false,
											allowTouchMove: false
										},
										1000: {
											slidesPerView: items[1],
											simulateTouch: false,
											allowTouchMove: false
										},
										1100: {
											slidesPerView: items[0],
											simulateTouch: false,
											allowTouchMove: false
										}
									},
									on: {
										afterInit: function (swiper) {
											if (hasImg === true) {
												el.style.setProperty('--fih', swiper.el.getElementsByClassName('first-image')[0].clientHeight + 'px');
											}
										},
										resize: function (swiper) {
											if (hasImg === true) {
												el.style.setProperty('--fih', swiper.el.getElementsByClassName('first-image')[0].clientHeight + 'px');
											}
										}
									}
								});
								if (hasImg === true && el.closest('li.sub') !== null) {
									el.closest('li.sub').addEventListener('mouseenter', function () {
										el.style.setProperty('--fih', el.getElementsByClassName('first-image')[0].clientHeight + 'px');
									});
								}
								wrapper_id = el.querySelectorAll('.swiper-wrapper[id]')[0];
								if (wrapper_id.hasAttribute('id')) {
									wrapper_id.removeAttribute('id');
								}
							});
						}
					});
					window.dispatchEvent(listCollectionSliderEvt);
					window.addEventListener("listProductSlider", function(event) {
						list_product_slider = document.querySelectorAll('.l4pr:not(.s4wi)');
						if (list_product_slider.length) {
							Array.from(list_product_slider).forEach(function (el) {
								if (el.classList.contains('static')) {
									var clone_me = el.cloneNode(true);
									clone_me.classList.remove('static');
									clone_me.classList.add('desktop-hide');
									el.classList.add('desktop-only');
									el.after(clone_me);

									el = el.nextElementSibling;
								}
								//Array.from(list_product_slider).forEach(el => {
								var mainSliderElement = el,
									children = mainSliderElement.children,
									qttChildren = children.length,
									total_sl = el.children.length,
									mainSlider,
									slides,
									initial_slide = 0,
									firstModel = el.querySelectorAll('a > .model-3d:first-child model-viewer[poster]');

								Array.from(firstModel).forEach(function (em) {
									var staticPoster = document.createElement('img'),
										staticPosterWrapper = document.createElement('picture');
									staticPoster.setAttribute('src', em.getAttribute('poster'));
									staticPoster.setAttribute('data-src', em.getAttribute('poster'));
									staticPosterWrapper.prepend(staticPoster);
									staticPosterWrapper.classList.add('just-poster');
									if (em.hasAttribute('alt')) {
										staticPoster.setAttribute('alt', em.getAttribute('alt'));
									}
									em.closest('a').prepend(staticPosterWrapper);
								});
								if (typeof children[5] !== 'undefined') {
									children[4].classList.add('more');
									append_url(children[4], '+' + qttChildren - 5, 'more');
								}
								if (el.getAttribute('data-featured_media_position')) {
									initial_slide = parseFloat(el.getAttribute('data-featured_media_position')) - 1;
								}
								// clone all slides before swiper uses them and change the DOM - used to create custom pagination
								slides = mainSliderElement.cloneNode(true).children;
								Array.from(el.getElementsByClassName('m6bx')).forEach(function (em) {
									var pr = em.parentElement;
									em.classList.add('m6bx-inside');
									el.children[0].appendChild(em);
									pr.remove();
								});

								randomize(el);
								mainSlider = create_slider(mainSliderElement, {
									direction: 'horizontal',
									loop: false,
									autoHeight: true,
									preloadImages: false,
									initialSlide: initial_slide,
									/*lazy: {
                                        loadPrevNext: true
                                    },*/
									pagination: {
										el: '.swiper-pagination-' + el.getAttribute('data-random'),
										clickable: true,
										renderBullet: function (index, className) {
											var finalSpan = document.createElement("a"),
												img_type,
												add_class,
												img,
												divFlex,
												moreLink,
												icon,
												span,
												a_thumb,
												a_thumb_img,
												a_thumb_pic,
												a_thumb_pic_class;
											finalSpan.classList.add(className);
											if (slides[index].hasAttribute('class')) {
												add_class = slides[index].getAttribute('class');
												if (add_class.includes('portrait')) {
													finalSpan.classList.add('portrait');
												}
												if (add_class.includes('landscape')) {
													finalSpan.classList.add('landscape');
												}
												if (add_class.includes('auto')) {
													finalSpan.classList.add('auto');
													finalSpan.classList.remove('landscape', 'portrait');
												}
												//finalSpan.classList.add(add_class);
											}
											if (slides[index].querySelector("picture")) {
												img_type = 'picture';
											} else {
												img_type = 'img';
											}
											img = slides[index].querySelector(img_type);
											if (img !== null) {
												a_thumb = img.closest('a[data-gallery-thumb]');
												a_thumb_img = document.createElement('img');
												a_thumb_pic = document.createElement('picture');

												/*if (img) {
                                                    finalSpan.appendChild(img);
                                                }*/
												if (a_thumb !== null) {
													a_thumb_img.setAttribute('src', a_thumb.getAttribute('data-gallery-thumb'));
													a_thumb_pic_class = a_thumb.querySelectorAll('picture[class]')[0];
													if (a_thumb_pic_class) {
														a_thumb_pic.classList.add(a_thumb_pic_class.getAttribute('class'));
													}
													a_thumb_img.setAttribute('alt', 'Thumbnail');
													a_thumb_pic.appendChild(a_thumb_img);
													finalSpan.appendChild(a_thumb_pic);
												} else {
													if (img) {
														finalSpan.appendChild(img);
													}
												}
											}

											divFlex = document.createElement("span");
											//divFlex.style = 'display: flex; height: 100%; width: 100%; position: absolute; top: 0; left: 0; align-items: center; justify-content: center; color: var(--secondary_bg);';

											moreLink = slides[index].querySelector("a.more");
											if (moreLink) {
												span = document.createElement("span");
												span.innerText = '+' + ((qttChildren - 1) - index).toString();

												divFlex.appendChild(span);
												finalSpan.classList.add('has-more');
												if (slides[index].querySelectorAll('a[data-fancybox]')) {
													Array.from(slides[index].querySelectorAll('a[data-fancybox]')).forEach(function (em) {
														//finalSpan.setAttribute('data-fancybox',em.getAttribute('data-fancybox'));
														finalSpan.setAttribute('href', em.getAttribute('href'));
													});
												}
											}

											icon = slides[index].querySelector("i[class^=icon-]");
											if (icon) {
												//icon.removeAttribute("aria-hidden");
												//icon.style = "text-indent: 0;";

												divFlex.appendChild(icon);
											}

											finalSpan.appendChild(divFlex);

											return finalSpan.outerHTML;
											// return '<span class="' + className + '">' + img.outerHTML + '</span>';
										}
									},
									navigation: {
										nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
										prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
									},
									on: {
										// "this" keyword within event handler always points to Swiper instance (from documentation https://swiperjs.com/swiper-api#events)
										activeIndexChange: function () {
											var activeIndex = this.activeIndex;
											Array.from(this.el.parentNode.getElementsByClassName('custom-progressbar-inner')).forEach(function (el) {
												el.style.width = 100 * (activeIndex + 1) / qttChildren + '%';
											});
										},
										afterInit: function (swiper) {
											// create progress bar
											var progress_bar = createElementWithClass('div', 'custom-progressbar'),
												custom_fraction;
											progress_bar.innerHTML = '<div class="custom-progressbar-inner" style="width:' + 100 / qttChildren + '%;"></div>';
											swiper.el.appendChild(progress_bar);
											Array.from(swiper.el.querySelectorAll('.s1lb, .label')).forEach(function (em) {
												swiper.el.parentNode.appendChild(em);
											});
											Array.from(swiper.el.getElementsByClassName('m6bx-inside')).forEach(function (em) {
												swiper.el.appendChild(em);
											});
											if (el.classList.contains('no-thumbs-mobile') || el.classList.contains('slider-fraction')) {
												custom_fraction = swiper.el.parentNode.getElementsByClassName('swiper-custom-fraction')[0];
												custom_fraction.innerHTML = '<span class="swiper-pagination-current">1</span> / <span class="total-el">' + swiper.slides.length + '</span>';
											}

											// click events
											/*Array.from(swiperElement.parentNode.getElementsByClassName('swiper-pagination-bullet')).forEach(function (el) {
                                                el.addEventListener('click', function (e) {
                                                    el.classList.add('show');
                                                });
                                            });*/
											setTimeout(function () {
												var h = swiper.height + 'px';
												swiper.navigation.prevEl[0].style.height = h;
												swiper.navigation.nextEl[0].style.height = h;
											}, 300);
										},
										slideChangeTransitionEnd: function (swiper) {
											setTimeout(function () {
												var h = swiper.height + 'px';
												swiper.navigation.prevEl[0].style.height = h;
												swiper.navigation.nextEl[0].style.height = h;
											}, 300);
										},
										slideChangeTransitionStart: function (swiper) {
											setTimeout(function () {
												if (el.classList.contains('no-thumbs-mobile') || el.classList.contains('slider-fraction')) {
													var custom_fraction = swiper.el.parentNode.getElementsByClassName('swiper-pagination-current')[0];
													custom_fraction.innerHTML = swiper.realIndex + 1;
													if (swiper.realIndex > 0) {
														swiper.el.classList.add('changed');
													} else {
														swiper.el.classList.remove('changed');
													}
												}
												if (swiper.realIndex + 1 === total_sl) {
													swiper.el.classList.add('last-slide-active');
												} else {
													swiper.el.classList.remove('last-slide-active');
												}
											}, 300);
										},
										resize: function (swiper) {
											var h = swiper.height + 'px';
											swiper.navigation.prevEl[0].style.height = h;
											swiper.navigation.nextEl[0].style.height = h;
										}
									}
								});

								data_update_product_slider = document.querySelectorAll('[data-l4pr-index]');
								data_scroll_product_slider = document.querySelectorAll('[data-scroll]');
								if (data_scroll_product_slider.length) {
									Array.from(data_scroll_product_slider).forEach(function (el) {
										if (el.tagName.toLowerCase() === 'option') {
											var em = el.parentNode;
											em.addEventListener('change', function () {
												var dx = em[em.selectedIndex].getAttribute('data-scroll');
												document.querySelectorAll(dx)[0].scrollIntoView();
											});
										}
									});
								}
								if (data_update_product_slider.length) {
									Array.from(data_update_product_slider).forEach(function (el) {
										if (el.tagName.toLowerCase() === 'option') {
											var em = el.parentNode;
											em.addEventListener('change', function () {
												var dx = em[em.selectedIndex].getAttribute('data-l4pr-index');
												if (dx !== null) {
													mainSlider.slideTo(dx);
												}
											});
										} else {
											el.addEventListener('click', function (e) {
												mainSlider.slideTo(el.getAttribute('data-l4pr-index'));
												if (el.tagName.toLowerCase() === 'a') {
													e.preventDefault();
												}
											});
										}
									});
								}
							});
						}
					});
					window.dispatchEvent(listProductSliderEvt);
				}
			},
		};

	setTimeout(function () {
		Default.utils.start();
		Default.utils.top();
		Default.utils.links();
		Default.utils.mails();
		Default.utils.forms();
		Default.utils.footer();
		Default.utils.tabs();
		Default.utils.swipers();
		Default.utils.ratings();
		Default.utils.backgrounds();
		Default.utils.mobile();
		Default.utils.done();
	}, 0);
});

var data_update_generic_slider = document.querySelectorAll('[data-slide-to]');

if (data_update_generic_slider.length) {
	Array.from(data_update_generic_slider).forEach(function (el) {
		if (el.tagName.toLowerCase() === 'option') {
			var em = el.parentNode;
			em.addEventListener('change', function () {
				var dx = em[em.selectedIndex].getAttribute('data-slide-to'),
					findSwiper;
				if (el.closest('li') !== null && dx !== null) {
					findSwiper = el.closest('li').querySelectorAll('.s4wi')[0].children[0].swiper;
					findSwiper.slideTo(dx);
				}
				/*if (dx !== null) {
					mainSlider.slideTo(dx);
				}*/
			});
		}
		/*else {
					el.addEventListener('click', function (e) {
						mainSlider.slideTo(el.getAttribute('data-l4pr-index'));
						if (el.tagName.toLowerCase() === 'a') {
							e.preventDefault();
						}
					});
				}*/
	});
}

document.addEventListener("DOMContentLoaded", function() {
	var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

	if ("IntersectionObserver" in window) {
		var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(video) {
				if (video.isIntersecting) {
					for (var source in video.target.children) {
						var videoSource = video.target.children[source];
						if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
							videoSource.src = videoSource.dataset.src;
						}
					}

					video.target.load();
					video.target.classList.remove("lazy");
					lazyVideoObserver.unobserve(video.target);
				}
			});
		});

		lazyVideos.forEach(function(lazyVideo) {
			lazyVideoObserver.observe(lazyVideo);
		});
	}
});

/*!*/
window.addEventListener("createCols", function(event) {
	var servicePageElement = document.querySelector('[id$="page-service-info-blocks"]');
	if (servicePageElement != null) {
		if (servicePageElement.parentElement.classList.contains('cols')) {
			var parent = servicePageElement.parentElement;
			var article = servicePageElement.parentElement.querySelector('article.w64.t55');
			if (article) { article.replaceWith(...article.childNodes); }
			parent.replaceWith(...parent.childNodes);
		}

		var anySiblingFound = false;
		var wrapper = document.createElement('div');
		wrapper.classList.add('cols');
		var wrapperInner = document.createElement('article');
		wrapperInner.classList.add('w64','t55');
		wrapper.appendChild(wrapperInner);
		var possibleSiblings = ['shopify-section-page-service-menu', 'shopify-section-faq', 'shopify-section-contact-form', 'shopify-section-google-maps'];

		var findSibling = function() {
			var prevSibling = servicePageElement.previousSibling;
			if (prevSibling) {
				var correctSiblingFound = false;
				for (var i = 0; i < possibleSiblings.length; i++) {
					if (prevSibling.classList.contains(possibleSiblings[i])) {
						correctSiblingFound = true;
						anySiblingFound = true;
						prevSibling.classList.add('w64','t55')
						wrapperInner.appendChild(prevSibling);
					}
				}
				if (correctSiblingFound) {
					findSibling();
				} else {
					for (var i = 1; i < wrapperInner.childNodes.length; i++){
						wrapperInner.insertBefore(wrapperInner.childNodes[i], wrapperInner.firstChild);
					}
					if (anySiblingFound) {
						servicePageElement.parentNode.insertBefore(wrapper, servicePageElement);
						wrapper.appendChild(servicePageElement);
					}
				}
			}
		}
		findSibling();
	}
});
window.dispatchEvent(createColsEvt);

window.addEventListener("showAlert", function(event) {
	var messageText = event.detail.message,
		messageType = event.detail.type,
		messageHeader = event.detail.header ? event.detail.header : false,
		messageOrigin = event.detail.origin ? 'message-' + event.detail.origin : false,
		messageColor = '';
	switch(messageType) {
		case "success":
			messageColor = 'lime';
			if (!messageHeader) { messageHeader = 'Success!'; }
			break;
		case "info":
			messageColor = 'pine';
			if (!messageHeader) { messageHeader = 'Info'; }
			break;
		case "error":
			messageColor = 'rose';
			if (!messageHeader) { messageHeader = 'Error...'; }
			break;
		default:
			messageColor = 'lime';
			if (!messageHeader) { messageHeader = ''; }
	}
	var message = '<li class="overlay-'+ messageColor +' '+ messageOrigin +'"><i aria-hidden="true" class="icon-'+ messageType +'"></i><p class="strong">'+ messageHeader +'</p><p>'+ messageText +'</p><a href="./" class="close">Close</a></li>';
	var list_alerts = document.querySelector('.l4al:not(.inline)');

	if (list_alerts === null) {
		list_alerts = document.createElement("ul");
		list_alerts.classList.add('l4al', 'fixed');
		document.getElementById('root').appendChild(list_alerts);
	}
	if ((messageOrigin && list_alerts.getElementsByClassName(messageOrigin).length == 0) || !messageOrigin) { // Prevent double messages (multiple of the same forms are being triggered when posted in shopfiy)
		list_alerts.innerHTML += message;
	}
	if (typeof alertsEvt != 'undefined') { window.dispatchEvent(alertsEvt); }
}, false);

function scrollToTargetAdjusted(el) {
	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual';
	}
	el.scrollIntoView({
		block: 'center'
	});
}
let loadMoreItemClicked = localStorage.getItem('loadMoreItemClicked');
if (loadMoreItemClicked != null) {
	let el = document.querySelector('#collection > li > figure > a[href="'+ loadMoreItemClicked +'"], .m6cl .results > div a[href="'+ loadMoreItemClicked +'"], .m6cl .results > .l4ne a[href="'+ loadMoreItemClicked +'"]'),
		url = window.location.href;
	if (el && !url.includes(loadMoreItemClicked)) {
		scrollToTargetAdjusted(el);
		localStorage.removeItem('loadMoreItemClicked');
	} else if (!url.includes(loadMoreItemClicked)) {
		localStorage.removeItem('loadMoreItemClicked');
	}
}