// Game state management
import { gameConfig } from './config.js';

// Initial game state
export const gameState = {
    score: 0,
    attemptsLeft: gameConfig.maxAttempts,
    targetShape: null,
    shapes: [],
    gameOver: false,
    playerName: '',
    currentDifficulty: 'easy',
    currentMode: 'classic',
    shapesQuantity: 10,
    timerInterval: null,
    timeRemaining: 0,
    animationFrameId: null,
    movingShapesInterval: null
};

// Reset game state to initial values
export function resetGameState() {
    gameState.score = 0;
    gameState.attemptsLeft = gameConfig.maxAttempts;
    gameState.gameOver = false;
    gameState.shapes = [];
    gameState.timeRemaining = 0;
}