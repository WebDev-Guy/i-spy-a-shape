// Game configuration
export const gameConfig = {
    // Shape settings
    maxShapes: 10,         // Maximum number of shapes to display at once
    minShapes: 5,          // Minimum number of shapes to display
    maxAttempts: 3,        // Number of attempts allowed before game over

    // Basic shapes available in all difficulty levels
    basicShapes: ['circle', 'square', 'triangle', 'rectangle'],

    // Medium difficulty adds these shapes
    mediumShapes: ['pentagon', 'hexagon', 'oval', 'diamond'],

    // Hard difficulty adds these additional shapes
    hardShapes: ['octagon', 'star', 'heart', 'trapezoid'],

    // WCAG compliant colors with improved contrast
    colors: [
        '#FF6B6B', // Bright red
        '#4ECDC4', // Teal
        '#FFD166', // Bright yellow
        '#FF8C42', // Orange
        '#6A4C93', // Purple
        '#F72585', // Pink
        '#4CC9F0', // Light blue
        '#8AC926'  // Green
    ],

    // Difficulty settings
    difficulty: {
        easy: {
            shapesCount: { min: 4, max: 8 },
            timeLimit: 90,  // in seconds
            timeBonus: { correct: 5, colorMatch: 8 },
            timePenalty: 3,
            distinctColors: true,
            rotationRange: { min: 0, max: 45 },
            movementSpeed: { min: 0, max: 0 }  // No movement in easy mode
        },
        medium: {
            shapesCount: { min: 6, max: 12 },
            timeLimit: 60,
            timeBonus: { correct: 3, colorMatch: 5 },
            timePenalty: 5,
            distinctColors: false,
            rotationRange: { min: 0, max: 180 },
            movementSpeed: { min: 0, max: 0 }  // No movement in medium mode
        },
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

    // Tooltip content for different game modes
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

    // Success delay - reduced from 1500ms to 800ms for quicker shape regeneration
    successDelay: 800,

    // Confetti settings
    confetti: {
        particleCount: 100,
        gravity: 0.2,      // Reduced from 0.5 for slower falling
        spread: 70,
        colors: ['#FF6B6B', '#4ECDC4', '#FFD166', '#FF8C42', '#6A4C93', '#F72585'], // WCAG compliant
        velocityFactor: 0.7  // New property to slow down initial velocity
    }
};