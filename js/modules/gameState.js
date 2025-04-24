// Game state object to track the current game state
const gameState = {
    isGameActive: false,
    score: 0,
    previousScore: 0, // Added to track previous score for animation
    attemptsLeft: 0,
    previousAttempts: 0, // Added to track previous attempts for animation
    timer: 0,
    timerInterval: null,
    targetShape: null,
    shapes: [],
    difficulty: 'easy',
    movementSpeed: 1,
    shapesCount: 10,
    playerName: '',
    highScores: {
        easy: [],
        medium: [],
        hard: []
    },
    // Add missing properties that are being referenced in the code
    currentDifficulty: 'easy',
    currentMode: 'classic',
    shapesQuantity: 10,
    gameOver: false,
    animationFrameId: null,
    timeRemaining: 0
};

// Function to reset the game state to default values
export function resetGameState() {
    gameState.isGameActive = false;
    gameState.score = 0;
    gameState.previousScore = 0; // Reset previousScore
    gameState.attemptsLeft = 0;
    gameState.previousAttempts = 0;
    gameState.timer = 0;
    gameState.timerInterval = null;
    gameState.targetShape = null;
    gameState.shapes = [];
    gameState.gameOver = false;
    gameState.animationFrameId = null;
    gameState.timeRemaining = 0;
    
    // Don't reset these as they are user preferences
    // gameState.currentDifficulty = 'easy';
    // gameState.currentMode = 'classic'; 
    // gameState.shapesQuantity = 10;
    // gameState.playerName = '';
}

export default gameState;