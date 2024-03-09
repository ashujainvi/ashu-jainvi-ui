import { insertDivs } from './dom.js';
import { initHero } from './hero.js';

/**
 * Main Entry function of all JS associated with this website
 * Calling single function gives more control over debugging
 */
const __main = () => {
    // Initialize Events
    initHero();
    // yeild to main thread
    setTimeout(() => {
        initJobToggle();
    }, 200);
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
    const SLIDE_CONTAINER_ID = 'feature-zone-icons';
    const SLIDE_CONTAINER = document.getElementById(SLIDE_CONTAINER_ID);
    let mouseIsDown = false;
    let startX, scrollLeft;

    if (iconSlider) {
        SLIDE_CONTAINER.addEventListener('mousedown', function (event) {
            mouseIsDown = true;
            $('.feature_zone-icons').stop(true);
            startX = event.pageX - iconSlider.offsetLeft;
            scrollLeft = iconSlider.scrollLeft;
        });

        SLIDE_CONTAINER.addEventListener('mouseleave', function () {
            mouseIsDown = false;
        });

        SLIDE_CONTAINER.addEventListener('mouseup', function () {
            mouseIsDown = false;

            var currScrollX = iconSlider.scrollLeft;
            var scrollDiff = (scrollLeft - currScrollX) * -1;
            var newScrollX = currScrollX + scrollDiff * 0.4;

            $('.feature_zone-icons')
                .stop(true)
                .animate({ scrollLeft: newScrollX }, 400, 'linear');
        });

        SLIDE_CONTAINER.addEventListener('mousemove', function (event) {
            if (!mouseIsDown) {
                return;
            }
            var mousePosX = event.pageX - iconSlider.offsetLeft;
            var slideValue = (mousePosX - startX) * 1.5;
            iconSlider.scrollLeft = scrollLeft - slideValue;
        });
    }
};

const initJobToggle = () => {
    const jobDetailsInfoBox = document.getElementById('job-details-info-box');
    const jobDetailsToggleBtn = document.getElementById(
        'job-details-toggle-btn'
    );

    // No element found, don't run anything :(
    if (!jobDetailsToggleBtn) {
        return;
    }

    const jobDetailsArrowImg = document.getElementById('job-details-arrow-img');

    let isBoxOpen = false;

    jobDetailsToggleBtn.addEventListener('click', (event) => {
        // Box is open, need to close it
        if (isBoxOpen) {
            jobDetailsInfoBox.classList.remove('opened');
            jobDetailsArrowImg.style.transform = 'rotate(90deg)';
            jobDetailsToggleBtn.setAttribute('aria-expanded', false);
            isBoxOpen = false;
        } else {
            jobDetailsInfoBox.classList.add('opened');
            jobDetailsArrowImg.style.transform = 'rotate(270deg)';
            jobDetailsToggleBtn.setAttribute('aria-expanded', true);
            isBoxOpen = true;
        }
    });
};

// MAIN ENTRY
__main();
