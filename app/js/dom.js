import { checkEven } from './utils.js';

/**
 * Creates multiple similar divs inside a parent node
 * @param {string} parentId
 * @param {number} divCount
 * @param {string[]} classes list of css classes that should be applied to all elements
 * @param {StaggerObject} stagger Object
 * @param {boolean} animate boolean
 *
 * StaggerObject =
 * {
 *  enabled: true,
 *  classes: ['timeline__dial__hand--long'],
 *  position: 'odd' - 'even' or 'odd'
 * }
 */
export const insertDivs = (parentId, divCount, classes, animate, stagger) => {
    const parentDiv = document.getElementById(parentId);

    // No need to add divs if parent div doesn't exist
    if (parentDiv) {
        for (let i = 1; i <= divCount + 1; i++) {
            // create a new div element
            const newDiv = document.createElement('div');
            const isElementEven = checkEven(i);

            // add class based on stagger
            if (stagger.enabled) {
                const staggerPosition = stagger.staggerPosition;
                if (staggerPosition === 'even' && isElementEven) {
                    newDiv.classList.add(...classes, ...stagger.classes);
                } else if (staggerPosition === 'odd' && !isElementEven) {
                    newDiv.classList.add(...classes, ...stagger.classes);
                } else {
                    newDiv.classList.add(...classes);
                }
            }

            // add the newly created element and its content into the DOM
            parentDiv.appendChild(newDiv);
        }
    }
};
