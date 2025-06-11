/**
 * DOM Elements and Audio Management Module
 * 
 * This module is like the game's address book - it knows where to find every
 * button, display, and interactive element on the page. Instead of searching
 * for DOM elements every time we need them (which is slow and error-prone),
 * we find them once at startup and store references here.
 * 
 * Think of this as creating shortcuts to all the important parts of the HTML.
 * When other parts of the game need to update the score display or play a sound,
 * they can just grab the reference from here instead of hunting through the DOM.
 * 
 * We also handle audio initialization here because sound effects are closely
 * tied to DOM elements. By setting volume levels centrally, we ensure consistent
 * audio experience across the entire game.
 * 
 * Pro tip: If you're adding new HTML elements that the JavaScript needs to
 * interact with, add them to this elements object first!
 * 
 * @fileoverview DOM element references and audio initialization
 * @author Game Development Team
 * @version 1.0.0
 */

/**
 * Central registry of all DOM elements used throughout the game.
 * 
 * This object is our one-stop shop for accessing any HTML element that the
 * JavaScript needs to interact with. By gathering all these references in one
 * place, we make the code more maintainable and performant.
 * 
 * Here's why this approach rocks:
 * - No more document.getElementById() calls scattered everywhere
 * - If an HTML ID changes, we only need to update it in one place
 * - Easy to see at a glance what elements the game depends on
 * - Better performance (we query the DOM once, not repeatedly)
 * 
 * The elements are organized by functionality:
 * - Game display elements (score, timer, hearts)
 * - Game board and shapes
 * - Modal dialogs and screens
 * - Control buttons and inputs
 * - Audio elements for sound effects
 * 
 * Some elements are set to null initially because they're created dynamically
 * during gameplay (like leaderboard tabs).
 * 
 * @type {Object}
 * @property {HTMLElement} score - Displays the current score
 * @property {HTMLElement} attempts - Shows remaining attempts as hearts
 * @property {HTMLElement} targetShape - Container for the shape to find
 * @property {HTMLElement} gameBoard - Main playing area where shapes appear
 * @property {HTMLElement} gameOverScreen - Game over modal dialog
 * @property {HTMLElement} confettiCanvas - Canvas for victory animations
 * @property {HTMLElement} setupModal - Initial game setup dialog
 * @property {NodeList} difficultyButtons - All difficulty selection buttons
 * @property {NodeList} modeButtons - All game mode selection buttons
 * @property {HTMLAudioElement} correctSound - Audio for correct matches
 * @property {HTMLAudioElement} wrongSound - Audio for incorrect matches
 * @property {HTMLAudioElement} gameoverSound - Audio for game over
 */
export const elements = {
    // Core game display elements
    score: document.getElementById('score-centered'), // Updated to match actual HTML ID
    attempts: document.getElementById('hearts'), // Changed to hearts since that's the element showing attempts
    targetShape: document.getElementById('target-shape'),
    gameBoard: document.getElementById('game-board'),

    // Game over screen elements
    gameOverScreen: document.getElementById('game-over'),
    finalScore: document.getElementById('final-score'),
    restartButton: document.getElementById('restart-button'),
    backToMenuButton: document.getElementById('back-to-menu-button'),

    // Visual effects
    confettiCanvas: document.getElementById('confetti-canvas'),

    // Setup and configuration elements
    setupModal: document.getElementById('game-setup-modal'),
    playerNameInput: document.getElementById('player-name'),
    nameErrorMessage: document.createElement('div'), // Will be added to DOM when needed
    difficultyButtons: document.querySelectorAll('.option-btn[data-difficulty]'),
    modeButtons: document.querySelectorAll('.option-btn[data-mode]'),
    decreaseShapesBtn: document.getElementById('decrease-shapes'),
    increaseShapesBtn: document.getElementById('increase-shapes'),
    shapeQuantityDisplay: document.getElementById('shape-quantity-display'),
    startGameBtn: document.getElementById('start-game-btn'),

    // High scores and leaderboard
    highScoresList: document.getElementById('high-scores-list'),

    // Timer display elements
    timerDisplay: document.getElementById('timer-display'),
    timer: document.getElementById('timer'),

    // Game instructions and help
    findShapeText: document.getElementById('find-shape-text'),

    // Leaderboard elements (created dynamically)
    leaderboardTabs: null, // Will be created dynamically
    classicScoresContainer: null, // Will be created dynamically
    timedScoresContainer: null, // Will be created dynamically
    leaderboardContainer: document.getElementById('high-scores-list'),

    // Audio elements for game feedback
    correctSound: document.getElementById('correct-sound'),
    wrongSound: document.getElementById('wrong-sound'),
    gameoverSound: document.getElementById('gameover-sound'),

    // Game control buttons
    quitButton: document.getElementById('quit-game-button')
};

/**
 * Initializes the confetti canvas context for victory animations.
 * 
 * The confetti system uses HTML5 Canvas to create those satisfying particle
 * effects when players get a correct match. This function sets up the 2D
 * rendering context that we'll use to draw all those colorful rectangles
 * flying across the screen.
 * 
 * Why we need this function:
 * - Canvas contexts are expensive to create, so we do it once and reuse
 * - We can check if the canvas exists before trying to get its context
 * - Centralizes canvas setup logic in one place
 * 
 * @example
 * // Usually called during game initialization
 * const ctx = initializeConfettiContext();
 * if (ctx) {
 *   // Ready to draw confetti!
 *   ctx.fillStyle = '#FF6B6B';
 *   ctx.fillRect(x, y, width, height);
 * }
 * 
 * @function
 * @returns {CanvasRenderingContext2D|null} The 2D rendering context for confetti, or null if canvas not found
 * @throws {Error} If canvas element exists but context creation fails
 */
export function initializeConfettiContext() {
    if (!elements.confettiCanvas) {
        console.warn('Confetti canvas element not found');
        return null;
    }

    try {
        return elements.confettiCanvas.getContext('2d');
    } catch (error) {
        console.error('Failed to initialize confetti context:', error);
        return null;
    }
}

/**
 * Configures audio settings for optimal game experience.
 * 
 * Audio feedback is crucial for game feel - it makes correct answers feel
 * rewarding and wrong answers feel appropriately disappointing. But nobody
 * wants their ears blown out by loud sound effects!
 * 
 * This function sets volume levels that we've carefully tested to be:
 * - Audible and engaging without being startling
 * - Balanced relative to each other (wrong sound slightly louder for feedback)
 * - Respectful of players who might be in quiet environments
 * 
 * The volume levels (0.0 to 1.0) were chosen through playtesting with various
 * devices and headphone types. Wrong sounds are slightly louder because
 * clear negative feedback is important for learning.
 * 
 * @example
 * // Called during game initialization
 * initAudioSettings();
 * 
 * // Now audio elements have appropriate volumes
 * elements.correctSound.play(); // Plays at 50% volume
 * elements.wrongSound.play();   // Plays at 70% volume
 * 
 * @function
 * @returns {void}
 * @throws {Error} If audio elements are not found in the DOM
 */
export function initAudioSettings() {
    try {
        // Set volume levels for different sounds
        if (elements.correctSound) {
            elements.correctSound.volume = 0.5; // Reduced from default 1.0 - pleasant but not overwhelming
        }

        if (elements.wrongSound) {
            elements.wrongSound.volume = 0.7;   // Keep this a bit louder for clear feedback
        }

        if (elements.gameoverSound) {
            elements.gameoverSound.volume = 0.8; // Prominent but not jarring
        }

        console.log('Audio settings initialized successfully');
    } catch (error) {
        console.error('Failed to initialize audio settings:', error);
        // Don't throw - game should still work without audio
    }
}