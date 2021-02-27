var screenSize = window.innerWidth;
var scene = document.getElementById('scene');
var parallaxInstance = new Parallax(scene);
// typed initiator
// add typed js only if width > 768px
// if (screenSize > 768) {
// 	var head = document.getElementsByTagName('body')[0];
// 	var scriptTag = document.createElement('script');
// 	scriptTag.type = 'text/javascript';
// 	scriptTag.src = 'https://cdn.jsdelivr.net/npm/typed.js@2.0.9';
// 	head.appendChild(scriptTag);
// }

// var typed;
// function initializeTyped() {
// 	const stringArray = [
// 		'~ ashutoshjainvi.com$: Hey ' + userName + '! Nice to meet you.',
// 		'~ ashutoshjainvi.com$: So, let me help you in waking this sloth up.',
// 		"~ ashutoshjainvi.com$: There's a white switch on top left corner of the desk.",
// 		'~ ashutoshjainvi.com$: Click on it to turn the lights on.',
// 		'~ ashutoshjainvi.com$: Be careful, it might break his concentration and make him mad.',
// 	];
// 	var typedOptions = {
// 		strings: stringArray,
// 		typeSpeed: 40,
// 		backDelay: 700,
// 		attr: 'placeholder',
// 		loop: true,
// 		onStop: function () {
// 			typed.reset();
// 		},
// 	};
// 	typed = new Typed('_____FILL IN THE BLANK', typedOptions);
// }

// if (screenSize > 768) {
// 	initializeTyped();
// }

// ICONS SLIDER
var iconSlider = document.getElementById('feature-zone-icons');
var mouseIsDown = false;
var startX, scrollLeft;

if (iconSlider) {
    iconSlider.addEventListener('mousedown', function (event) {
        mouseIsDown = true;
        $('.feature_zone-icons').stop(true);
        startX = event.pageX - iconSlider.offsetLeft;
        scrollLeft = iconSlider.scrollLeft;
    });

    iconSlider.addEventListener('mouseleave', function () {
        mouseIsDown = false;
    });

    iconSlider.addEventListener('mouseup', function () {
        mouseIsDown = false;

        var currScrollX = iconSlider.scrollLeft;
        var scrollDiff = (scrollLeft - currScrollX) * -1;
        var newScrollX = currScrollX + scrollDiff * 0.4;

        $('.feature_zone-icons')
            .stop(true)
            .animate({ scrollLeft: newScrollX }, 400, 'linear');
    });

    iconSlider.addEventListener('mousemove', function (event) {
        if (!mouseIsDown) {
            return;
        }
        var mousePosX = event.pageX - iconSlider.offsetLeft;
        var slideValue = (mousePosX - startX) * 1.5;
        iconSlider.scrollLeft = scrollLeft - slideValue;
    });
}

// uiKit animations using scrollSpy
// var topServiceGrids = document.getElementById('top-service-grids');
// var options = {
// 	cls: 'animation-fade',
// 	target: '> div',
// 	delay: 220,
// 	repeat: true,
// };
// UIkit.scrollspy(topServiceGrids, options);

var sectionIntro = document.getElementsByClassName('section-intro');
var sectionOptions = {
    cls: 'animation-fade',
    delay: 220,
    repeat: true,
};
for (var i = 0; i < sectionIntro.length; i++) {
    UIkit.scrollspy(sectionIntro[i], sectionOptions);
}
