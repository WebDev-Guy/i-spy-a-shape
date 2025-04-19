// Game event handlers and UI interactions
import { gameState, resetGameState } from './gameState.js';
import { elements, initAudioSettings } from './elements.js';
import { gameConfig } from './config.js';
import { capitalize } from './utils.js';
import {
    applyDifficultySettings,
    startNewRound,
    startMovingShapes,
    stopMovingShapes,
    stopTimer,
    endGame,
    hideGameOverScreen,
    loadHighScores,
    startTimer,
    loadHighScoresByMode,
    generateGameShapes
} from './gameLogic.js';
import { clearGameBoard, resizeConfettiCanvas } from './rendering.js';

// Initialize all event listeners
export function initEventListeners() {
    // Restart button event listener
    elements.restartButton.addEventListener('click', restartGame);

    // Back to menu button event listener
    elements.backToMenuButton.addEventListener('click', showSetupModal);

    // Difficulty option buttons
    elements.difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove selected class from all difficulty buttons
            elements.difficultyButtons.forEach(btn => btn.classList.remove('selected'));

            // Add selected class to clicked button
            button.classList.add('selected');

            // Update current difficulty
            gameState.currentDifficulty = button.dataset.difficulty;

            // Set default shape quantities based on difficulty
            if (gameState.currentDifficulty === 'medium') {
                gameState.shapesQuantity = 15;
                elements.shapeQuantityDisplay.textContent = gameState.shapesQuantity;
            } else if (gameState.currentDifficulty === 'hard') {
                gameState.shapesQuantity = 20;
                elements.shapeQuantityDisplay.textContent = gameState.shapesQuantity;
            }
        });
    });

    // Game mode option buttons
    elements.modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove selected class from all mode buttons
            elements.modeButtons.forEach(btn => btn.classList.remove('selected'));

            // Add selected class to clicked button
            button.classList.add('selected');

            // Update current mode
            gameState.currentMode = button.dataset.mode;

            // Update tooltips based on the selected game mode
            updateDifficultyTooltips(gameState.currentMode);
        });
    });

    // Decrease shapes button
    elements.decreaseShapesBtn.addEventListener('click', () => {
        if (gameState.shapesQuantity > 3) {
            gameState.shapesQuantity--;
            elements.shapeQuantityDisplay.textContent = gameState.shapesQuantity;
        }
    });

    // Increase shapes button
    elements.increaseShapesBtn.addEventListener('click', () => {
        if (gameState.shapesQuantity < 20) {
            gameState.shapesQuantity++;
            elements.shapeQuantityDisplay.textContent = gameState.shapesQuantity;
        }
    });

    // Start game button
    elements.startGameBtn.addEventListener('click', startGameFromSetup);

    // Quit button
    // Create quit button
    const quitButton = document.getElementById('quit-game-button');

    // Add click event to end the game
    quitButton.addEventListener('click', () => {
        endGame();
    });

    // Add window resize event listener
    window.addEventListener('resize', handleWindowResize);
}

// Show setup modal
export function showSetupModal() {
    // Reset game state
    resetGameState();

    // Clear game board and messages
    clearGameBoard();

    // Stop any animations or intervals
    stopMovingShapes();
    stopTimer();
    cancelAnimationFrame(gameState.animationFrameId);

    // Hide game over screen if visible
    hideGameOverScreen();

    // Display the setup modal
    elements.setupModal.classList.remove('hidden');

    // Update high scores display
    displayHighScores();
}

// Start game from setup
export function startGameFromSetup() {
    // Get player name (validate it's not empty)
    const playerNameValue = elements.playerNameInput.value.trim();

    // Check if player name is empty
    if (!playerNameValue) {
        // Show error message
        const errorMessage = document.getElementById('name-error-message') || createNameErrorMessage();
        errorMessage.style.display = 'block';
        // Focus on the input field
        elements.playerNameInput.focus();
        return; // Don't proceed
    }

    // Hide error message if it exists
    const errorMessage = document.getElementById('name-error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }

    // Set player name
    gameState.playerName = playerNameValue;

    // Hide setup modal
    elements.setupModal.classList.add('hidden');

    // Start the game
    startGame();
}

// Create error message for empty player name
export function createNameErrorMessage() {
    const errorMessage = document.createElement('div');
    errorMessage.id = 'name-error-message';
    errorMessage.style.color = '#FF6B6B';
    errorMessage.style.marginTop = '5px';
    errorMessage.style.fontSize = '0.9em';
    errorMessage.textContent = 'Please enter your name before starting';
    errorMessage.style.display = 'none';

    // Insert after player name input
    elements.playerNameInput.parentNode.insertBefore(
        errorMessage,
        elements.playerNameInput.nextSibling
    );

    return errorMessage;
}

// Start the game
export function startGame() {
    // Reset game state
    resetGameState();

    // Update score display
    updateScoreDisplay();

    // Hide game over screen
    hideGameOverScreen();

    // Apply difficulty settings
    applyDifficultySettings();

    // Set up based on game mode
    setupGameMode();

    // Start first round
    startNewRound();
}

// Setup game mode (classic, timed)
export function setupGameMode() {
    switch (gameState.currentMode) {
        case 'timed':
            // Set initial time from difficulty settings
            gameState.timeRemaining = gameConfig.difficulty[gameState.currentDifficulty].timeLimit;

            // Show timer display
            elements.timerDisplay.classList.remove('hidden');
            elements.timer.textContent = gameState.timeRemaining;

            // Start timer
            startTimer();
            break;

        case 'classic':
        default:
            // Standard mode - no special setup
            // Hide timer if it was previously shown
            elements.timerDisplay.classList.add('hidden');
            break;
    }
}

// Update score display
export function updateScoreDisplay() {
    elements.score.textContent = gameState.score;
    elements.attempts.textContent = gameState.attemptsLeft;
}

// Restart the game
export function restartGame() {
    // Hide game over screen
    hideGameOverScreen();

    // Start new game with same settings
    startGame();
}

// Handle window resize
export function handleWindowResize() {
    // Resize confetti canvas
    resizeConfettiCanvas();

    // If we're in the middle of a game, regenerate the shapes to fit the new window size
    if (!gameState.gameOver && gameState.shapes.length > 0) {
        // Preserve the current target shape type
        const currentTargetShape = gameState.targetShape;

        // Clear and regenerate with same target type but new positions
        clearGameBoard();
        generateGameShapes(gameState.shapesQuantity, currentTargetShape);
    }
}

// Display high scores
export function displayHighScores() {
    // Clear existing content
    elements.highScoresList.innerHTML = '';

    // Create a header container for the leaderboard
    const headerContainer = document.createElement('div');
    headerContainer.className = 'leaderboard-header-container';

    // Add the heading
    const heading = document.createElement('h3');
    heading.textContent = 'High Scores';
    headerContainer.appendChild(heading);

    // Create the tab container for leaderboard modes
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'leaderboard-tabs';

    // Create classic mode tab
    const classicTab = document.createElement('div');
    classicTab.className = 'leaderboard-tab' + (gameState.currentMode === 'classic' ? ' active' : '');
    classicTab.textContent = 'Classic Mode';
    classicTab.addEventListener('click', () => {
        // Update active tab
        document.querySelectorAll('.leaderboard-tab').forEach(tab => tab.classList.remove('active'));
        classicTab.classList.add('active');

        // Show classic scores, hide timed scores
        if (elements.classicScoresContainer) elements.classicScoresContainer.style.display = 'block';
        if (elements.timedScoresContainer) elements.timedScoresContainer.style.display = 'none';
    });

    // Create timed mode tab
    const timedTab = document.createElement('div');
    timedTab.className = 'leaderboard-tab' + (gameState.currentMode === 'timed' ? ' active' : '');
    timedTab.textContent = 'Timed Mode';
    timedTab.addEventListener('click', () => {
        // Update active tab
        document.querySelectorAll('.leaderboard-tab').forEach(tab => tab.classList.remove('active'));
        timedTab.classList.add('active');

        // Show timed scores, hide classic scores
        if (elements.timedScoresContainer) elements.timedScoresContainer.style.display = 'block';
        if (elements.classicScoresContainer) elements.classicScoresContainer.style.display = 'none';
    });

    // Add tabs to container
    tabsContainer.appendChild(classicTab);
    tabsContainer.appendChild(timedTab);

    // Add tabs to the header container
    headerContainer.appendChild(tabsContainer);

    // Add the header container to the high scores list
    elements.highScoresList.appendChild(headerContainer);

    // Create containers for each mode's scores
    elements.classicScoresContainer = document.createElement('div');
    elements.classicScoresContainer.className = 'scores-container';
    elements.classicScoresContainer.style.display = gameState.currentMode === 'classic' ? 'block' : 'none';

    elements.timedScoresContainer = document.createElement('div');
    elements.timedScoresContainer.className = 'scores-container';
    elements.timedScoresContainer.style.display = gameState.currentMode === 'timed' ? 'block' : 'none';

    // Add score containers to leaderboard
    elements.highScoresList.appendChild(elements.classicScoresContainer);
    elements.highScoresList.appendChild(elements.timedScoresContainer);

    // Store tabs for future reference
    elements.leaderboardTabs = tabsContainer;

    // Load and display Classic mode scores
    const classicScores = loadHighScoresByMode('classic');
    displayModeScores(classicScores, elements.classicScoresContainer);

    // Load and display Timed mode scores
    const timedScores = loadHighScoresByMode('timed');
    displayModeScores(timedScores, elements.timedScoresContainer);
}

// Helper function to display scores for a specific mode
export function displayModeScores(scores, container) {
    if (scores.length === 0) {
        container.innerHTML = '<p class="no-scores">No high scores yet!</p>';
        return;
    }

    // Create leaderboard header
    const leaderboardHeader = document.createElement('div');
    leaderboardHeader.classList.add('high-score-header');
    leaderboardHeader.innerHTML = `
        <span class="rank-col">Rank</span>
        <span class="name-col">Player</span>
        <span class="score-col">Score</span>
        <span class="details-col">Difficulty</span>
    `;
    container.appendChild(leaderboardHeader);

    // Create high score entries
    scores.forEach((score, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.classList.add('high-score-item');

        // Add special classes for top 3 ranks
        if (index === 0) scoreItem.classList.add('gold');
        if (index === 1) scoreItem.classList.add('silver');
        if (index === 2) scoreItem.classList.add('bronze');

        // Format the score entry - now just showing difficulty in Details column since mode is in the tab
        scoreItem.innerHTML = `
            <span class="rank-col">${index + 1}</span>
            <span class="name-col">${score.name}</span>
            <span class="score-col">${score.score}</span>
            <span class="details-col">${capitalize(score.difficulty)}</span>
        `;

        container.appendChild(scoreItem);
    });
}

// Function to update difficulty tooltips based on game mode
export function updateDifficultyTooltips(mode) {
    // Get all difficulty buttons
    const difficultyButtons = document.querySelectorAll('.option-btn[data-difficulty]');

    // Update tooltip content for each difficulty level
    difficultyButtons.forEach(button => {
        const difficulty = button.dataset.difficulty;
        const tooltipElement = button.querySelector('.tooltip');

        if (tooltipElement && gameConfig.tooltips[mode] && gameConfig.tooltips[mode][difficulty]) {
            // Set tooltip content based on game mode and difficulty
            tooltipElement.innerHTML = gameConfig.tooltips[mode][difficulty];
        }
    });

    // Also update the mode-specific tooltips
    const modeButtons = document.querySelectorAll('.option-btn[data-mode]');
    modeButtons.forEach(button => {
        const buttonMode = button.dataset.mode;
        const tooltipElement = button.querySelector('.tooltip');

        // Basic tooltips for game modes
        if (tooltipElement) {
            if (buttonMode === 'classic') {
                tooltipElement.innerHTML = "Standard gameplay<br>Find matching shapes<br>3 attempts per round";
            } else if (buttonMode === 'timed') {
                tooltipElement.innerHTML = "Race against the clock<br>Gain time for correct matches<br>Lose time for mistakes<br>Bonus time for color matches";
            }
        }
    });
}