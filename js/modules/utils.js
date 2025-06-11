/**
 * Utility Functions Module
 * 
 * Every good game needs a toolbox, and this is ours! This module contains all
 * the handy helper functions that don't belong to any specific part of the game
 * but are used everywhere. Think of these as the Swiss Army knife functions -
 * small, focused, and incredibly useful.
 * 
 * These functions follow the principle of "do one thing and do it well." They're
 * pure functions (no side effects) which makes them easy to test and debug.
 * You can use them anywhere without worrying about breaking something else.
 * 
 * We've also included an accessibility helper for screen reader announcements,
 * because inclusive design isn't optional - it's essential!
 * 
 * @fileoverview Collection of utility functions used throughout the game
 * @author Game Development Team
 * @version 1.0.0
 */

/**
 * Selects a random item from an array.
 * 
 * This is probably our most-used utility function! Whether we're picking a
 * random shape, choosing a color, or selecting which tooltip to show, this
 * function is working behind the scenes.
 * 
 * The math here is simple but important: Math.random() gives us a decimal
 * between 0 and 1, we multiply by array length to get a decimal between 0
 * and length, then Math.floor() rounds down to get a valid array index.
 * 
 * @example
 * const colors = ['red', 'blue', 'green'];
 * const randomColor = getRandomItem(colors); // Might return 'blue'
 * 
 * const shapes = ['circle', 'square'];
 * const targetShape = getRandomItem(shapes); // 50/50 chance of each
 * 
 * @function
 * @param {Array} array - The array to select from
 * @returns {*} A randomly selected item from the array
 * @throws {Error} If array is empty or not an array
 */
export function getRandomItem(array) {
    if (!Array.isArray(array) || array.length === 0) {
        throw new Error('getRandomItem requires a non-empty array');
    }

    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a random integer between min and max (inclusive).
 * 
 * JavaScript's Math.random() gives you decimals, but games often need whole
 * numbers - like "spawn between 5 and 10 shapes" or "rotate between 0 and 360
 * degrees." This function handles the math to give you clean integers.
 * 
 * The key insight is that we add 1 to the range before Math.floor() to make
 * the maximum value inclusive. Without this, you'd never get the max value!
 * 
 * @example
 * const diceRoll = getRandomNumber(1, 6); // 1, 2, 3, 4, 5, or 6
 * const shapeCount = getRandomNumber(5, 15); // Anywhere from 5 to 15 shapes
 * const rotation = getRandomNumber(0, 359); // Full rotation range
 * 
 * @function
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer between min and max
 * @throws {Error} If min is greater than max or if parameters aren't numbers
 */
export function getRandomNumber(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
        throw new Error('getRandomNumber requires numeric parameters');
    }

    if (min > max) {
        throw new Error('Min value cannot be greater than max value');
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * 
 * When you need to randomize an array, this is the gold standard algorithm.
 * It's been proven to give every possible permutation an equal chance, which
 * means truly random results (unlike some naive approaches).
 * 
 * The algorithm works backwards through the array, swapping each element with
 * a randomly chosen element from the remaining unshuffled portion. It's elegant,
 * efficient, and mathematically sound.
 * 
 * We modify the original array rather than creating a copy for performance
 * reasons - with large arrays of shapes, copying would be wasteful.
 * 
 * @example
 * const deck = ['♠️', '♥️', '♦️', '♣️'];
 * shuffleArray(deck);
 * console.log(deck); // Order is now randomized
 * 
 * const gridPositions = generateGridPositions();
 * shuffleArray(gridPositions); // Randomize shape placement
 * 
 * @function
 * @param {Array} array - The array to shuffle (modified in place)
 * @returns {Array} The same array, now shuffled
 * @throws {Error} If parameter is not an array
 */
export function shuffleArray(array) {
    if (!Array.isArray(array)) {
        throw new Error('shuffleArray requires an array parameter');
    }

    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // ES6 destructuring swap
    }

    return array;
}

/**
 * Capitalizes the first letter of a string.
 * 
 * A simple but essential function for making user-facing text look professional.
 * We use this when displaying difficulty levels in the UI ('easy' becomes 'Easy')
 * or when showing player names in leaderboards.
 * 
 * The implementation handles edge cases gracefully - empty strings won't crash
 * your app, and single characters work perfectly.
 * 
 * @example
 * capitalize('easy'); // Returns 'Easy'
 * capitalize('HARD'); // Returns 'HARD' (only first letter affected)
 * capitalize('multiplayer mode'); // Returns 'Multiplayer mode'
 * capitalize(''); // Returns '' (handles empty strings)
 * 
 * @function
 * @param {string} string - The string to capitalize
 * @returns {string} String with first letter capitalized
 * @throws {Error} If parameter is not a string
 */
export function capitalize(string) {
    if (typeof string !== 'string') {
        throw new Error('capitalize requires a string parameter');
    }

    if (string.length === 0) {
        return string;
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Announces a message to screen readers without visual display.
 * 
 * This is our accessibility superhero function! Screen readers can only announce
 * text that's actually in the DOM, but we don't want to clutter the visual
 * interface with announcement messages. This function creates a hidden element
 * that screen readers can see but sighted users cannot.
 * 
 * The 'aria-live' attribute tells screen readers how urgent the message is:
 * - 'polite': Wait for a pause before announcing (good for scores)
 * - 'assertive': Interrupt immediately (good for errors or important alerts)
 * 
 * We automatically clean up the announcement element after 1 second to prevent
 * DOM pollution. This gives screen readers time to process the message while
 * keeping the HTML clean.
 * 
 * @example
 * // Announce a score update
 * announceTo('polite', 'Score: 15 points');
 * 
 * // Announce an important game state change
 * announceTo('assertive', 'Game Over! Final score: 23 points');
 * 
 * // Announce leaderboard position
 * announceTo('assertive', 'Congratulations! You achieved first place!');
 * 
 * @function
 * @param {'polite'|'assertive'} priority - How urgently screen readers should announce this
 * @param {string} message - The message to announce to screen reader users
 * @returns {void}
 * @throws {Error} If priority is not 'polite' or 'assertive', or if message is not a string
 */
export function announceTo(priority, message) {
    if (priority !== 'polite' && priority !== 'assertive') {
        throw new Error('announceTo priority must be "polite" or "assertive"');
    }

    if (typeof message !== 'string') {
        throw new Error('announceTo message must be a string');
    }

    if (message.trim().length === 0) {
        return; // Don't announce empty messages
    }

    // Create a hidden element for the announcement
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('role', 'status');
    announcer.className = 'sr-only'; // Screen reader only - hidden from visual display
    announcer.textContent = message;

    // Add to DOM so screen readers can detect it
    document.body.appendChild(announcer);

    // Remove after announcement (screen readers need time to process)
    setTimeout(() => {
        if (document.body.contains(announcer)) {
            document.body.removeChild(announcer);
        }
    }, 1000);

    console.log(`Screen reader announcement: ${message}`);
}