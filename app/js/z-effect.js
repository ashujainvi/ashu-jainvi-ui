/**
 * Change an HTML blocks 3D 'Z' Perspective based on mouse move event.
 */

/**
 *
 * @param {mousemove} event
 * @param {DOMElement} HTML DOM element
 */
export const zEffectBlock = (event, element) => {
    const xAxis = (window.innerWidth / 2 - event.pageX) / 49;
    const yAxis = (window.innerHeight / 2 - event.pageY) / 55;
    if (element) {
        element.style.transform = `rotateY(${
            xAxis * -1
        }deg) rotateX(${yAxis}deg)`;
    }
};
