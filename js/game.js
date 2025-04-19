import { elements, initAudioSettings, initializeConfettiContext } from './modules/elements.js';
import { resizeConfettiCanvas } from './modules/rendering.js';
import { loadHighScores } from './modules/gameLogic.js';
import {
    initEventListeners,
    showSetupModal,
    updateDifficultyTooltips
} from './modules/events.js';
import { gameState } from './modules/gameState.js';

// Global confetti context
const confettiCtx = initializeConfettiContext();

// Initialize game
function initGame() {
    // Show setup modal
    showSetupModal();

    // Set initial tooltips based on default game mode
    updateDifficultyTooltips(gameState.currentMode);

    // Init event listeners
    initEventListeners();

    // Load high scores
    loadHighScores();
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    // Initialize confetti canvas dimensions
    resizeConfettiCanvas();

    // Initialize audio settings
    initAudioSettings();

    // Initialize game
    initGame();
});