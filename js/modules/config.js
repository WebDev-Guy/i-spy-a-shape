/**
 * Game Configuration Module
 * 
 * Welcome to the brain of our shape-matching game! This file is like the control panel
 * in a spaceship - it contains all the dials, switches, and settings that determine
 * how the game behaves. Want to make the game easier? Change the time limits here.
 * Want to add a new difficulty level? This is your starting point.
 * 
 * We've organized everything into logical groups so you can find what you need quickly.
 * Think of this as the game's "DNA" - these settings influence every aspect of gameplay.
 * 
 * Pro tip: Most game balancing and tweaking happens here. If players say the game is
 * too hard or too easy, you'll probably be adjusting values in this file.
 * 
 * @fileoverview Centralized game configuration and difficulty settings
 * @author Game Development Team
 * @version 1.0.0
 */

/**
 * Master configuration object containing all game settings.
 * 
 * This is the command center for our entire game! Every aspect of gameplay - from
 * how many shapes appear on screen to what colors they can be - is controlled from
 * this single object. This centralized approach makes it super easy to balance the
 * game or add new features without hunting through multiple files.
 * 
 * The configuration is organized into logical sections:
 * - Basic game mechanics (shape counts, attempts)
 * - Available shapes for each difficulty level
 * - Color palette (carefully chosen for accessibility)
 * - Difficulty-specific settings for each level
 * - Tooltip content that explains the rules to players
 * - Visual effects settings (like our beloved confetti!)
 * 
 * @example
 * // Want to make the game more forgiving? Increase max attempts:
 * gameConfig.maxAttempts = 5;
 * 
 * // Want to add more time in easy mode?
 * gameConfig.difficulty.easy.timeLimit = 120;
 * 
 * // Want to make confetti more dramatic?
 * gameConfig.confetti.particleCount = 200;
 * 
 * @type {Object}
 * @property {number} maxShapes - Maximum number of shapes that can appear on screen
 * @property {number} minShapes - Minimum number of shapes that must appear
 * @property {number} maxAttempts - How many wrong guesses before game over
 * @property {string[]} basicShapes - Shapes available in all difficulty levels
 * @property {string[]} mediumShapes - Additional shapes for medium/hard difficulty
 * @property {string[]} hardShapes - Extra challenging shapes for hard mode only
 * @property {string[]} colors - WCAG compliant color palette for shapes
 * @property {Object} difficulty - Settings for each difficulty level (easy/medium/hard)
 * @property {Object} tooltips - Help text shown to players for each mode/difficulty
 * @property {string} mode - Default game mode ('classic' or 'timed')
 * @property {number} successDelay - Milliseconds to wait before showing new shapes
 * @property {Object} confetti - Settings for the victory animation
 */
export const gameConfig = {
    // Shape settings
    maxShapes: 10,         // Maximum number of shapes to display at once
    minShapes: 5,          // Minimum number of shapes to display
    maxAttempts: 3,        // Number of attempts allowed before game over

    /**
     * Basic shapes that appear in all difficulty levels.
     * These are the fundamentals that every player should master first.
     * We chose these because they're universally recognized and teach
     * core geometric concepts.
     * 
     * @type {string[]}
     */
    basicShapes: ['circle', 'square', 'triangle', 'rectangle'],

    /**
     * Medium difficulty shapes that add complexity without being overwhelming.
     * These shapes introduce concepts like multiple sides and curved vs straight edges.
     * The diamond uses a special rendering technique to look like a true gem shape.
     * 
     * @type {string[]}
     */
    mediumShapes: ['pentagon', 'hexagon', 'oval', 'diamond'],

    /**
     * Advanced shapes that challenge even experienced players.
     * These shapes test recognition of complex forms and introduce concepts
     * like concave shapes (star) and asymmetrical forms (heart).
     * 
     * @type {string[]}
     */
    hardShapes: ['octagon', 'star', 'heart', 'trapezoid'],

    /**
     * WCAG compliant color palette ensuring accessibility for all players.
     * 
     * Each color has been carefully selected to provide sufficient contrast
     * against our background and to be distinguishable by players with
     * color vision differences. We tested these with colorblind simulators
     * to ensure an inclusive experience.
     * 
     * The palette balances vibrant, engaging colors with accessibility requirements.
     * 
     * @type {string[]}
     */
    colors: [
        '#FF6B6B', // Bright red - energetic and attention-grabbing
        '#4ECDC4', // Teal - calming and easy on the eyes
        '#FFD166', // Bright yellow - cheerful and visible
        '#FF8C42', // Orange - warm and friendly
        '#6A4C93', // Purple - sophisticated and fun
        '#F72585', // Pink - playful and engaging
        '#4CC9F0', // Light blue - cool and soothing
        '#8AC926'  // Green - natural and positive
    ],

    /**
     * Difficulty level configurations that scale the challenge appropriately.
     * 
     * Each difficulty level is carefully balanced to provide a smooth learning curve.
     * We've playtested extensively to find the sweet spot where each level feels
     * challenging but fair.
     * 
     * Key design principles:
     * - Easy mode focuses on shape recognition only
     * - Medium mode introduces color matching
     * - Hard mode adds movement and time pressure
     * - Each level has distinct visual and timing characteristics
     * 
     * @type {Object}
     */
    difficulty: {
        /**
         * Easy mode: Perfect for beginners and young children.
         * 
         * Designed to build confidence while teaching basic shape recognition.
         * Colors are distinct to avoid confusion, and there's minimal rotation
         * to keep shapes easily recognizable. Generous time limits and attempt
         * resets ensure a stress-free learning experience.
         * 
         * @type {Object}
         * @property {Object} shapesCount - Range of shapes to display
         * @property {number} timeLimit - Seconds available in timed mode
         * @property {Object} timeBonus - Seconds added for correct answers
         * @property {number} timePenalty - Seconds removed for wrong answers
         * @property {boolean} distinctColors - Whether all shapes have unique colors
         * @property {Object} rotationRange - Degrees of rotation applied to shapes
         * @property {Object} movementSpeed - Speed range for moving shapes (0 = stationary)
         */
        easy: {
            shapesCount: { min: 4, max: 8 },
            timeLimit: 90,  // in seconds
            timeBonus: { correct: 5, colorMatch: 8 },
            timePenalty: 3,
            distinctColors: true,
            rotationRange: { min: 0, max: 45 },
            movementSpeed: { min: 0, max: 0 }  // No movement in easy mode
        },

        /**
         * Medium mode: The perfect middle ground for developing players.
         * 
         * Introduces color matching to add cognitive complexity. Allows similar
         * colors to appear together, teaching players to look more carefully.
         * Rotation is more pronounced to challenge shape recognition skills.
         * 
         * @type {Object}
         */
        medium: {
            shapesCount: { min: 6, max: 12 },
            timeLimit: 60,
            timeBonus: { correct: 3, colorMatch: 5 },
            timePenalty: 5,
            distinctColors: false,
            rotationRange: { min: 0, max: 180 },
            movementSpeed: { min: 0, max: 0 }  // No movement in medium mode
        },

        /**
         * Hard mode: The ultimate challenge for expert players.
         * 
         * Everything that makes the game challenging is turned up to 11!
         * Shapes move around the screen, can be rotated at any angle, and
         * time pressure is intense. Only the most dedicated players will
         * master this level.
         * 
         * @type {Object}
         */
        hard: {
            shapesCount: { min: 10, max: 18 },
            timeLimit: 45,
            timeBonus: { correct: 2, colorMatch: 3 },
            timePenalty: 7,
            distinctColors: false,
            rotationRange: { min: 0, max: 359 },
            movementSpeed: { min: 0.05, max: 0.15 }  // Much slower movement speed in hard mode
        }
    },

    /**
     * Contextual help content that explains the rules to players.
     * 
     * These tooltips are crucial for user onboarding! They appear when players
     * hover over difficulty/mode options and explain exactly what to expect.
     * The content is written in friendly, accessible language that doesn't
     * intimidate newcomers.
     * 
     * Each tooltip is formatted with HTML line breaks for better readability.
     * 
     * @type {Object}
     */
    tooltips: {
        classic: {
            easy: "4-8 shapes<br>Match shape only (color doesn't matter)<br>Distinct colors<br>Minimal rotation<br>3 attempts per round<br>Attempts reset after correct matches",
            medium: "6-12 shapes<br>Match both shape AND color<br>Similar colors allowed<br>More rotation<br>3 attempts per round<br>Attempts reset after correct matches",
            hard: "10-18 shapes<br>Match both shape AND color<br>Similar colors<br>Full rotation<br>Shapes move slowly<br>3 attempts total (no reset)"
        },
        timed: {
            easy: "4-8 shapes<br>Match shape only (color doesn't matter)<br>90 seconds time limit<br>Distinct colors<br>Minimal rotation<br>+5s per correct match<br>+8s for color match",
            medium: "6-12 shapes<br>Match both shape AND color<br>60 seconds time limit<br>Similar colors allowed<br>More rotation<br>+3s per correct match<br>+5s for color match",
            hard: "10-18 shapes<br>Match both shape AND color<br>45 seconds time limit<br>Similar colors<br>Full rotation<br>Shapes move slowly<br>+2s per correct match<br>+3s for color match"
        }
    },

    // Game modes
    mode: 'classic',  // classic or timed

    /**
     * Delay between successful match and new round generation.
     * 
     * This brief pause serves multiple purposes:
     * - Gives players time to see their success (confetti animation)
     * - Prevents accidental clicks on new shapes
     * - Creates a natural rhythm to gameplay
     * - Allows audio feedback to complete
     * 
     * Originally was 1500ms but we reduced it to 800ms based on player feedback
     * that the game felt too slow. This value hits the sweet spot of celebration
     * without impatience.
     * 
     * @type {number}
     */
    successDelay: 800,

    /**
     * Confetti animation configuration for victory celebrations.
     * 
     * Who doesn't love confetti when they get something right? These settings
     * control our particle-based celebration animation. The values are tuned
     * to be exciting without being overwhelming or causing performance issues.
     * 
     * The velocityFactor was added to slow down the initial burst, making the
     * animation feel more graceful and less chaotic.
     * 
     * @type {Object}
     * @property {number} particleCount - Number of confetti pieces to generate
     * @property {number} gravity - How quickly pieces fall (higher = faster)
     * @property {number} spread - How wide the initial burst spreads
     * @property {string[]} colors - WCAG compliant colors for confetti pieces
     * @property {number} velocityFactor - Multiplier to control initial speed
     */
    confetti: {
        particleCount: 100,
        gravity: 0.2,      // Reduced from 0.5 for slower falling
        spread: 70,
        colors: ['#FF6B6B', '#4ECDC4', '#FFD166', '#FF8C42', '#6A4C93', '#F72585'], // WCAG compliant
        velocityFactor: 0.7  // New property to slow down initial velocity
    }
};