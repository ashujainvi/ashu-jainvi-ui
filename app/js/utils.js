export const debounce = (callback, delay) => {
    let debounceTimer;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

/**
 * Checks if current number is even
 * @param {*} number
 * @returns A boolean 'true' if number is even else false
 */
export const checkEven = (number) => {
    return number % 2 === 0;
};
