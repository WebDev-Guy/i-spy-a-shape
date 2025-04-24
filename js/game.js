import gameState from './modules/gameState.js';
import { elements } from './modules/elements.js';
import { gameConfig } from './modules/config.js';
import { initEventListeners, showSetupModal } from './modules/events.js';
import { resizeConfettiCanvas } from './modules/rendering.js';

// Initialize the application when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Game initializing...');
    
    // Initialize event listeners for all buttons and controls
    initEventListeners();
    
    // Set up the confetti canvas for victory animations
    resizeConfettiCanvas();
    
    // Show the game setup modal to start
    showSetupModal();
    
    console.log('Game initialized and ready to play!');
});