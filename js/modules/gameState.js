/**
 * Game State Management Module
 * 
 * Think of this as the game's memory - it remembers everything that's happening
 * during gameplay. While the player is having fun clicking shapes, this module
 * is quietly keeping track of their score, how many attempts they have left,
 * what the target shape is, and much more.
 * 
 * This is a classic example of the "single source of truth" pattern. Instead of
 * having game information scattered across different files (which would be a
 * nightmare to debug!), we keep everything in one place. Any part of the game
 * that needs to know "what's the current score?" or "is the game over?" can
 * look here.
 * 
 * The reset function is particularly important - it's like hitting the refresh
 * button on the game state, cleaning up everything for a fresh start while
 * preserving the player's preferences.
 * 
 * @fileoverview Centralized game state management and reset functionality
 * @author Game Development Team
 * @version 1.0.0
 */

/**
 * The master game state object - the brain that remembers everything!
 * 
 * This object is the central nervous system of our game. Every piece of information
 * that changes during gameplay lives here. Think of it as a shared notebook that
 * all parts of the game can read from and write to.
 * 
 * We've organized the properties into logical groups:
 * - Game status (active, over, score, attempts)
 * - Target and shapes (what the player needs to find)
 * - Player settings (difficulty, mode, preferences)
 * - High scores and player identity
 * - Technical stuff (timers, animations)
 * 
 * Some properties have "previous" versions (like previousScore) because we use
 * these to trigger animations when values change. It's a neat trick that makes
 * the UI feel more alive!
 * 
 * @type {Object}
 * @property {boolean} isGameActive - Whether a game round is currently running
 * @property {number} score - Player's current score (number of correct matches)
 * @property {number} previousScore - Previous score value for animation triggers
 * @property {number} attemptsLeft - Remaining wrong guesses before game over
 * @property {number} previousAttempts - Previous attempts for animation triggers
 * @property {number} timer - Current timer value (used internally)
 * @property {?number} timerInterval - ID of the active timer interval
 * @property {?string} targetShape - The shape type player needs to find
 * @property {?string} targetColor - The color of the target shape
 * @property {Array} shapes - Array of shape objects currently on the game board
 * @property {string} difficulty - Current difficulty level ('easy', 'medium', 'hard')
 * @property {number} movementSpeed - Speed multiplier for moving shapes
 * @property {number} shapesCount - Number of shapes to display on screen
 * @property {string} playerName - Name entered by the player
 * @property {Object} highScores - Stored high scores by difficulty level
 * @property {string} currentDifficulty - Currently selected difficulty
 * @property {string} currentMode - Currently selected game mode
 * @property {number} shapesQuantity - User's preferred number of shapes
 * @property {boolean} gameOver - Whether the current game has ended
 * @property {?number} animationFrameId - ID of active animation frame for cleanup
 * @property {number} timeRemaining - Seconds left in timed mode
 * @property {?number} confettiAnimationId - ID of active confetti animation
 */
const gameState = {
    // Core game status
    isGameActive: false,
    score: 0,
    previousScore: 0, // Added to track previous score for animation
    attemptsLeft: 0,
    previousAttempts: 0, // Added to track previous attempts for animation

    // Timer management
    timer: 0,
    timerInterval: null,

    // Current round data
    targetShape: null,
    targetColor: null, // Added to store target color separately
    shapes: [],

    // Game configuration
    difficulty: 'easy',
    movementSpeed: 1,
    shapesCount: 10,

    // Player data
    playerName: '',
    highScores: {
        easy: [],
        medium: [],
        hard: []
    },

    // Current session settings
    currentDifficulty: 'easy',
    currentMode: 'classic',
    shapesQuantity: 10,

    // Game flow control
    gameOver: false,
    animationFrameId: null,
    timeRemaining: 0,
    confettiAnimationId: null // Added to track confetti animations
};

/**
 * Resets the game state to prepare for a fresh game.
 * 
 * This function is like hitting the "New Game" button - it cleans up all the
 * temporary game data while preserving the player's preferences. It's called
 * whenever we need to start fresh: new game, restart, or returning to menu.
 * 
 * Here's what gets reset vs. what stays:
 * 
 * GETS RESET (temporary game data):
 * - Score and attempts (back to zero)
 * - Target shape and board shapes
 * - Timers and animations
 * - Game over flags
 * 
 * STAYS THE SAME (player preferences):
 * - Chosen difficulty and game mode
 * - Number of shapes preference
 * - Player name
 * - High scores
 * 
 * This approach means players don't have to re-enter their settings every time
 * they start a new game, which makes for a much smoother experience.
 * 
 * @example
 * // When player clicks "Restart Game"
 * resetGameState();
 * startNewGame();
 * 
 * // When returning to main menu
 * resetGameState();
 * showSetupModal();
 * 
 * @function
 * @returns {void}
 */
export function resetGameState() {
    // Reset core game status
    gameState.isGameActive = false;
    gameState.score = 0;
    gameState.previousScore = 0; // Reset previousScore
    gameState.attemptsLeft = 0;
    gameState.previousAttempts = 0;

    // Clear timer data
    gameState.timer = 0;
    gameState.timerInterval = null;

    // Clear current round data
    gameState.targetShape = null;
    gameState.targetColor = null;
    gameState.shapes = [];

    // Reset game flow flags
    gameState.gameOver = false;
    gameState.animationFrameId = null;
    gameState.timeRemaining = 0;
    gameState.confettiAnimationId = null;

    // Preserve user preferences - these should NOT be reset:
    // - gameState.currentDifficulty 
    // - gameState.currentMode 
    // - gameState.shapesQuantity
    // - gameState.playerName
    // - gameState.highScores

    console.log('Game state reset - ready for new game');
}

export default gameState;