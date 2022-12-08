import { insertDivs } from './dom.js';
import { initHero } from './hero.js';

/**
 * Main Entry function of all JS associated with this website
 * Calling single function gives more control over debugging
 */
const __main = () => {
    // Initialize Events
    initHero();
    // initIconSlider();

    // TODO: Add timeline
    // insertDivs('timeline-dial', 20, ['timeline__dial__hand'], true, {
    //     enabled: true,
    //     classes: ['timeline__dial__hand--long'],
    //     staggerPosition: 'odd',
    // });
};

// ICONS SLIDER
// TODO: Feature zone icons have been removed. Remove this function
const initIconSlider = () => {
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
};

// MAIN ENTRY
__main();
