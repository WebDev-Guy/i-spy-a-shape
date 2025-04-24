// DOM Elements management
export const elements = {
    score: document.getElementById('score-centered'), // Updated to match actual HTML ID
    attempts: document.getElementById('hearts'), // Changed to hearts since that's the element showing attempts
    targetShape: document.getElementById('target-shape'),
    gameBoard: document.getElementById('game-board'),
    gameOverScreen: document.getElementById('game-over'),
    finalScore: document.getElementById('final-score'),
    restartButton: document.getElementById('restart-button'),
    backToMenuButton: document.getElementById('back-to-menu-button'),
    confettiCanvas: document.getElementById('confetti-canvas'),
    setupModal: document.getElementById('game-setup-modal'),
    playerNameInput: document.getElementById('player-name'),
    nameErrorMessage: document.createElement('div'), // Will be added to DOM when needed
    difficultyButtons: document.querySelectorAll('.option-btn[data-difficulty]'),
    modeButtons: document.querySelectorAll('.option-btn[data-mode]'),
    decreaseShapesBtn: document.getElementById('decrease-shapes'),
    increaseShapesBtn: document.getElementById('increase-shapes'),
    shapeQuantityDisplay: document.getElementById('shape-quantity-display'),
    startGameBtn: document.getElementById('start-game-btn'),
    highScoresList: document.getElementById('high-scores-list'),
    timerDisplay: document.getElementById('timer-display'),
    timer: document.getElementById('timer'),
    
    // Find shape text element
    findShapeText: document.getElementById('find-shape-text'),

    // Leaderboard elements
    leaderboardTabs: null, // Will be created dynamically
    classicScoresContainer: null, // Will be created dynamically
    timedScoresContainer: null, // Will be created dynamically
    leaderboardContainer: document.getElementById('high-scores-list'),

    // Audio elements
    correctSound: document.getElementById('correct-sound'),
    wrongSound: document.getElementById('wrong-sound'),
    gameoverSound: document.getElementById('gameover-sound'),

    quitButton: document.getElementById('quit-game-button')
};

// Initialize confetti context
export function initializeConfettiContext() {
    return elements.confettiCanvas.getContext('2d');
}

// Initialize audio settings
export function initAudioSettings() {
    // Set volume levels for different sounds
    elements.correctSound.volume = 0.5; // Reduced from default 1.0
    elements.wrongSound.volume = 0.7;   // Keep this a bit louder for feedback
    elements.gameoverSound.volume = 0.8;
}