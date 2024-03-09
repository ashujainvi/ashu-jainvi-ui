import { debounce } from './utils.js';
import { zEffectBlock } from './z-effect.js';

/**
 * Contains functions related to Hero section of the website
 */

// CONSTANTS
const HERO_CONTAINER_ID = 'hero-illustration';
const HERO_MOUSE_EVENT_EL = 'hero-content';
const HERO_MOUSEMOVE_DEBOUNCE = 450;

export const initHero = () => {
    const heroContainer = document.getElementById(HERO_MOUSE_EVENT_EL);
    const heroEffectElement = document.getElementById(HERO_CONTAINER_ID);

    // Mouse Events for hero perspective effect
    heroContainer.addEventListener('mousemove', (event) => {
        debounce(
            zEffectBlock(event, heroEffectElement),
            HERO_MOUSEMOVE_DEBOUNCE
        );
    });

    // Remove animation on mouse leave
    heroContainer.addEventListener('mouseleave', (event) => {
        if (heroEffectElement) {
            heroEffectElement.style.transform = `rotateY(0deg) rotateX(0deg)`;
        }
    });
};
