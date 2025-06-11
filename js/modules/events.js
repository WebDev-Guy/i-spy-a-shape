/**
 * Event Handling and User Interface Module
 * 
 * This module is the bridge between the player and the game - it listens for
 * every button click, key press, and interaction, then translates those into
 * meaningful game actions. Think of it as the game's nervous system, constantly
 * monitoring for player input and responding appropriately.
 * 
 * The event system is designed with user experience as the top priority:
 * - Immediate visual feedback for all interactions
 * - Smooth transitions between game states
 * - Robust error handling that guides users to success
 * - Accessibility features for screen reader users
 * - Responsive behavior that adapts to different screen sizes
 * 
 * This module also manages the complex modal system that handles game setup,
 * high scores, and game over screens. Each modal has its own lifecycle and
 * state management to ensure a polished user experience.
 * 
 * @fileoverview Event listeners, UI interactions, and modal management
 * @author Game Development Team
 * @version 1.0.0
 */

// Game event handlers and UI interactions
import gameState, { resetGameState } from './gameState.js';
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
    generateGameShapes,
    ensureGameBoardDimensions
} from './gameLogic.js';
import { clearGameBoard, resizeConfettiCanvas } from './rendering.js';

/**
 * Initializes all event listeners for the game interface.
 * 
 * This function is like setting up the control panel of a spaceship - it connects
 * every button and control to its corresponding action. We call this once during
 * game initialization to wire up all the interactive elements.
 * 
 * The event listeners are organized by functionality:
 * - Game control buttons (restart, quit, back to menu)
 * - Setup and configuration (difficulty, mode, shape quantity)
 * - Responsive design (window resize handling)
 * - Modal dialogs (confirmations and setup)
 * 
 * Each event listener includes proper error handling and user feedback to ensure
 * a smooth experience even when things go wrong.
 * 
 * @example
 * // Called during game initialization
 * document.addEventListener('DOMContentLoaded', () => {
 *   initEventListeners(); // Now all buttons work!
 * });
 * 
 * @function
 * @returns {void}
 * @throws {Error} If critical DOM elements are missing
 */
export function initEventListeners() {
    try {
        // Game control event listeners
        elements.restartButton.addEventListener('click', restartGame);
        elements.backToMenuButton.addEventListener('click', showSetupModal);

        // Difficulty selection buttons
        elements.difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Visual feedback: update selected state
                elements.difficultyButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');

                // Update game state
                gameState.currentDifficulty = button.dataset.difficulty;

                // Apply difficulty-specific settings
                applyDifficultySettings();

                // Auto-adjust shape quantities for new difficulty
                if (gameState.currentDifficulty === 'medium') {
                    gameState.shapesQuantity = 15;
                    elements.shapeQuantityDisplay.textContent = gameState.shapesQuantity;
                } else if (gameState.currentDifficulty === 'hard') {
                    gameState.shapesQuantity = 20;
                    elements.shapeQuantityDisplay.textContent = gameState.shapesQuantity;
                }

                console.log(`Difficulty changed to: ${gameState.currentDifficulty}`);
            });
        });

        // Game mode selection buttons
        elements.modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Visual feedback: update selected state
                elements.modeButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');

                // Update game state
                gameState.currentMode = button.dataset.mode;

                // Show/hide timer based on selected mode
                if (gameState.currentMode === 'timed') {
                    elements.timerDisplay.classList.remove('hidden');
                } else {
                    elements.timerDisplay.classList.add('hidden');
                }

                // Update tooltips to match selected mode
                updateDifficultyTooltips(gameState.currentMode);

                console.log(`Game mode changed to: ${gameState.currentMode}`);
            });
        });

        // Shape quantity adjustment controls
        elements.decreaseShapesBtn.addEventListener('click', () => {
            if (gameState.shapesQuantity > 3) {
                gameState.shapesQuantity--;
                elements.shapeQuantityDisplay.textContent = gameState.shapesQuantity;
            }
        });

        elements.increaseShapesBtn.addEventListener('click', () => {
            if (gameState.shapesQuantity < 20) {
                gameState.shapesQuantity++;
                elements.shapeQuantityDisplay.textContent = gameState.shapesQuantity;
            }
        });

        // Game start and quit controls
        elements.startGameBtn.addEventListener('click', startGameFromSetup);
        elements.quitButton.addEventListener('click', () => {
            showEndGameConfirmation();
        });

        // End game confirmation dialog buttons
        document.getElementById('cancel-end-game').addEventListener('click', () => {
            hideEndGameConfirmation();
        });

        document.getElementById('confirm-end-game').addEventListener('click', () => {
            hideEndGameConfirmation();
            endGame();
        });

        // Responsive design: handle window resize
        window.addEventListener('resize', handleWindowResize);

        console.log('All event listeners initialized successfully');
    } catch (error) {
        console.error('Failed to initialize event listeners:', error);
        throw new Error('Critical UI elements are missing - cannot initialize game');
    }
}

/**
 * Displays the game setup modal for player configuration.
 * 
 * This function is like rolling out the red carpet for new players - it presents
 * them with a beautiful, organized interface where they can customize their
 * game experience. The setup modal is the first thing players see, so it needs
 * to be welcoming, intuitive, and informative.
 * 
 * The function performs a complete reset and initialization:
 * - Cleans up any ongoing games or animations
 * - Resets the game state while preserving user preferences
 * - Updates the high scores display with latest data
 * - Ensures all modal elements are properly visible
 * 
 * This is also called when players want to return to the main menu from an
 * active game, providing a clean transition back to the starting point.
 * 
 * @example
 * // When game first loads
 * document.addEventListener('DOMContentLoaded', () => {
 *   showSetupModal(); // Welcome screen appears
 * });
 * 
 * // When player clicks "Back to Menu"
 * backToMenuButton.addEventListener('click', showSetupModal);
 * 
 * @function
 * @returns {void}
 */
export function showSetupModal() {
    // Clean up any active game state
    resetGameState();
    clearGameBoard();

    // Stop any running animations or timers to prevent interference
    stopMovingShapes();
    stopTimer();
    if (gameState.animationFrameId) {
        cancelAnimationFrame(gameState.animationFrameId);
    }

    // Hide any other screens that might be visible
    hideGameOverScreen();

    // Show the setup modal with updated information
    elements.setupModal.classList.remove('hidden');

    // Refresh the high scores display with latest data
    displayHighScores();

    console.log('Setup modal displayed - ready for player configuration');
}

/**
 * Initiates a new game from the setup modal with validation.
 * 
 * This function is the gatekeeper between setup and gameplay - it ensures
 * everything is configured correctly before allowing the game to start. It
 * performs thorough validation and provides clear feedback when things aren't
 * quite right.
 * 
 * The validation process includes:
 * - Player name presence and validity
 * - Graceful error handling with user-friendly messages
 * - Focus management for accessibility
 * - Smooth modal transitions
 * 
 * Only after all validation passes does it hand control over to the main
 * game startup process.
 * 
 * @example
 * // Called when player clicks "Start Game"
 * startGameBtn.addEventListener('click', startGameFromSetup);
 * 
 * @function
 * @returns {void} Either starts the game or shows validation errors
 */
export function startGameFromSetup() {
    // Validate player name input
    const playerNameValue = elements.playerNameInput.value.trim();

    // Check if player name is empty or invalid
    if (!playerNameValue) {
        // Show helpful error message
        const errorMessage = document.getElementById('name-error-message') || createNameErrorMessage();
        errorMessage.style.display = 'block';

        // Focus on the input field for immediate correction
        elements.playerNameInput.focus();

        console.log('Game start blocked: Player name is required');
        return; // Don't proceed with game startup
    }

    // Hide any existing error messages
    const errorMessage = document.getElementById('name-error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }

    // Store the validated player name
    gameState.playerName = playerNameValue;

    // Smooth transition: hide setup modal
    elements.setupModal.classList.add('hidden');

    // Start the actual game
    startGame();

    console.log(`Game starting for player: ${gameState.playerName}`);
}

/**
 * Creates a dynamic error message element for player name validation.
 * 
 * This function creates a user-friendly error message that appears when players
 * try to start the game without entering their name. The message is styled
 * consistently with the rest of the UI and positioned logically near the
 * input field.
 * 
 * The error message uses accessible design principles:
 * - Clear, non-threatening language
 * - Appropriate color contrast for visibility
 * - Positioned near the related input for context
 * - Hidden by default to avoid visual clutter
 * 
 * @example
 * // Usually called internally when validation fails
 * const errorMessage = createNameErrorMessage();
 * errorMessage.style.display = 'block'; // Show the error
 * 
 * @function
 * @returns {HTMLElement} The created error message element
 */
export function createNameErrorMessage() {
    const errorMessage = document.createElement('div');
    errorMessage.id = 'name-error-message';

    // Styling for clear, non-threatening error display
    errorMessage.style.color = '#FF6B6B'; // WCAG compliant red from our color palette
    errorMessage.style.marginTop = '5px';
    errorMessage.style.fontSize = '0.9em';
    errorMessage.textContent = 'Please enter your name before starting';
    errorMessage.style.display = 'none'; // Hidden by default

    // Insert the error message right after the player name input
    elements.playerNameInput.parentNode.insertBefore(
        errorMessage,
        elements.playerNameInput.nextSibling
    );

    console.log('Name error message element created');
    return errorMessage;
}

/**
 * Starts a new game session with current settings.
 * 
 * This function is the conductor of the game startup orchestra - it coordinates
 * all the different systems to create a smooth transition from menu to gameplay.
 * Every aspect of the game needs to be properly initialized for a great
 * player experience.
 * 
 * The startup sequence includes:
 * 1. Game state initialization (score, attempts, timers)
 * 2. Visual display updates (UI elements, instructions)
 * 3. Game board preparation and dimension validation
 * 4. Mode-specific setup (timers for timed mode)
 * 5. First round generation with a small delay for smooth transitions
 * 
 * The function handles both classic and timed modes, applying the appropriate
 * settings and UI configurations for each.
 * 
 * @example
 * // Called after successful setup validation
 * startGameFromSetup() -> startGame();
 * 
 * // Can also be called directly for restarts
 * restartButton.addEventListener('click', () => {
 *   hideGameOverScreen();
 *   startGame();
 * });
 * 
 * @function
 * @returns {void}
 */
export function startGame() {
    // Initialize core game state
    gameState.gameOver = false;
    gameState.score = 0;
    gameState.attemptsLeft = gameConfig.maxAttempts;
    gameState.targetShape = null;
    gameState.shapes = [];

    // Clear any leftover shapes from previous games
    clearGameBoard();

    // Ensure game board has proper dimensions before proceeding
    ensureGameBoardDimensions();

    // Update all display elements
    updateScoreDisplay();

    // Configure mode-specific settings
    if (gameState.currentMode === 'timed') {
        // Set up timed mode
        const diffSettings = gameConfig.difficulty[gameState.currentDifficulty];
        gameState.timeRemaining = diffSettings.timeLimit;
        elements.timer.textContent = gameState.timeRemaining;
        elements.timerDisplay.classList.remove('hidden');
        startTimer();
    } else {
        // Classic mode: hide timer display
        elements.timerDisplay.classList.add('hidden');
    }

    // Ensure setup modal is hidden
    elements.setupModal.classList.add('hidden');

    // Brief delay to ensure DOM is ready and transitions are smooth
    setTimeout(() => {
        startNewRound();
    }, 100);
    console.log(`Game started in ${gameState.currentMode} mode, ${gameState.currentDifficulty} difficulty`);
}

/**
 * Configures game mode-specific settings and UI elements.
 * 
 * This function handles the unique requirements of different game modes,
 * particularly the differences between classic and timed modes. It ensures
 * that the UI and game mechanics are properly configured for the selected mode.
 * 
 * @function
 * @returns {void}
 */
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

/**
 * Updates the score and attempts display with visual feedback.
 * 
 * This function refreshes the player's score and remaining attempts display,
 * providing visual feedback through animations and heart symbols.
 * 
 * @function
 * @returns {void}
 */
export function updateScoreDisplay() {
    elements.score.textContent = gameState.score;

    // Update hearts display based on attempts left
    const heartSymbol = '❤️';
    elements.attempts.textContent = heartSymbol.repeat(gameState.attemptsLeft);
}

/**
 * Restarts the current game with the same settings.
 * 
 * This function provides a quick restart option for players who want to
 * try again with the same configuration.
 * 
 * @function
 * @returns {void}
 */
export function restartGame() {
    // Hide game over screen
    hideGameOverScreen();

    // Start new game with same settings
    startGame();
}

/**
 * Handles window resize events for responsive design.
 * 
 * This function ensures the game adapts properly to window size changes,
 * updating visual elements and repositioning shapes as needed.
 * 
 * @function
 * @returns {void}
 */
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

/**
 * Displays and manages the high scores leaderboard interface.
 * 
 * This function creates a sophisticated, tabbed leaderboard interface that
 * showcases player achievements across different game modes. It's like building
 * a hall of fame that celebrates the best performances while motivating
 * players to improve.
 * 
 * The leaderboard system includes:
 * - Tabbed interface for Classic and Timed modes
 * - Dynamic content loading based on stored scores
 * - Interactive tab switching with visual feedback
 * - Responsive design that works on all screen sizes
 * - Proper handling of empty leaderboards
 * 
 * The function completely rebuilds the leaderboard each time it's called,
 * ensuring that new scores are always reflected and the interface is
 * consistent with the current game state.
 * 
 * @example
 * // Called when showing setup modal
 * showSetupModal() -> displayHighScores();
 * 
 * // Called after saving a new high score
 * saveHighScore() -> displayHighScores();
 * 
 * @function
 * @returns {void}
 */
export function displayHighScores() {
    // Clear existing content for fresh rebuild
    elements.highScoresList.innerHTML = '';

    // Create a header container for the leaderboard
    const headerContainer = document.createElement('div');
    headerContainer.className = 'leaderboard-header-container';

    // Add the main heading
    const heading = document.createElement('h3');
    heading.textContent = 'High Scores';
    headerContainer.appendChild(heading);

    // Create the tab container for mode switching
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'leaderboard-tabs';

    // Create Classic mode tab with appropriate active state
    const classicTab = document.createElement('div');
    classicTab.className = 'leaderboard-tab' + (gameState.currentMode === 'classic' ? ' active' : '');
    classicTab.textContent = 'Classic Mode';
    classicTab.addEventListener('click', () => {
        // Update visual state of tabs
        document.querySelectorAll('.leaderboard-tab').forEach(tab => tab.classList.remove('active'));
        classicTab.classList.add('active');

        // Switch visible content
        if (elements.classicScoresContainer) elements.classicScoresContainer.style.display = 'block';
        if (elements.timedScoresContainer) elements.timedScoresContainer.style.display = 'none';
    });

    // Create Timed mode tab with appropriate active state
    const timedTab = document.createElement('div');
    timedTab.className = 'leaderboard-tab' + (gameState.currentMode === 'timed' ? ' active' : '');
    timedTab.textContent = 'Timed Mode';
    timedTab.addEventListener('click', () => {
        // Update visual state of tabs
        document.querySelectorAll('.leaderboard-tab').forEach(tab => tab.classList.remove('active'));
        timedTab.classList.add('active');

        // Switch visible content
        if (elements.timedScoresContainer) elements.timedScoresContainer.style.display = 'block';
        if (elements.classicScoresContainer) elements.classicScoresContainer.style.display = 'none';
    });

    // Assemble the tab system
    tabsContainer.appendChild(classicTab);
    tabsContainer.appendChild(timedTab);
    headerContainer.appendChild(tabsContainer);
    elements.highScoresList.appendChild(headerContainer);

    // Create containers for each mode's scores
    elements.classicScoresContainer = document.createElement('div');
    elements.classicScoresContainer.className = 'scores-container';
    elements.classicScoresContainer.style.display = gameState.currentMode === 'classic' ? 'block' : 'none';

    elements.timedScoresContainer = document.createElement('div');
    elements.timedScoresContainer.className = 'scores-container';
    elements.timedScoresContainer.style.display = gameState.currentMode === 'timed' ? 'block' : 'none';    // Add score containers to leaderboard
    elements.highScoresList.appendChild(elements.classicScoresContainer);
    elements.highScoresList.appendChild(elements.timedScoresContainer);

    // Store tabs for future reference
    elements.leaderboardTabs = tabsContainer;

    // Load and display scores for both modes
    const classicScores = loadHighScoresByMode('classic');
    displayModeScores(classicScores, elements.classicScoresContainer);

    const timedScores = loadHighScoresByMode('timed');
    displayModeScores(timedScores, elements.timedScoresContainer);

    console.log('High scores display updated');
}

/**
 * Displays scores for a specific game mode in the provided container.
 * 
 * This helper function renders the actual score entries for either Classic
 * or Timed mode. It creates a beautiful, organized table-like layout with
 * special styling for top performers.
 * 
 * The function handles both empty and populated leaderboards gracefully:
 * - Empty leaderboards show an encouraging "No high scores yet!" message
 * - Populated leaderboards display a professional ranking table
 * - Top 3 positions get special gold/silver/bronze styling
 * - All entries show rank, player name, score, and difficulty
 * 
 * @example
 * // Display classic mode scores
 * const classicScores = loadHighScoresByMode('classic');
 * displayModeScores(classicScores, classicContainer);
 * 
 * // Display timed mode scores
 * const timedScores = loadHighScoresByMode('timed');
 * displayModeScores(timedScores, timedContainer);
 * 
 * @function
 * @param {Array} scores - Array of score objects to display
 * @param {HTMLElement} container - DOM element to render scores into
 * @returns {void}
 * @throws {Error} If container is not a valid DOM element
 */
export function displayModeScores(scores, container) {
    if (!container || !container.appendChild) {
        throw new Error('displayModeScores requires a valid DOM container element');
    }

    // Handle empty leaderboard case
    if (!scores || scores.length === 0) {
        container.innerHTML = '<p class="no-scores">No high scores yet!</p>';
        return;
    }

    // Create leaderboard table header
    const leaderboardHeader = document.createElement('div');
    leaderboardHeader.classList.add('high-score-header');
    leaderboardHeader.innerHTML = `
        <span class="rank-col">Rank</span>
        <span class="name-col">Player</span>
        <span class="score-col">Score</span>
        <span class="details-col">Difficulty</span>
    `;
    container.appendChild(leaderboardHeader);

    // Create individual score entries
    scores.forEach((score, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.classList.add('high-score-item');

        // Apply special styling for top 3 positions
        if (index === 0) scoreItem.classList.add('gold');
        if (index === 1) scoreItem.classList.add('silver');
        if (index === 2) scoreItem.classList.add('bronze');

        // Format the score entry with proper data
        scoreItem.innerHTML = `
            <span class="rank-col">${index + 1}</span>
            <span class="name-col">${score.name}</span>
            <span class="score-col">${score.score}</span>
            <span class="details-col">${capitalize(score.difficulty)}</span>
        `;

        container.appendChild(scoreItem);
    });

    console.log(`Displayed ${scores.length} scores in leaderboard`);
}

/**
 * Updates difficulty tooltips based on the selected game mode.
 * 
 * This function ensures that the helpful tooltip information stays relevant
 * to the player's current mode selection. Since Classic and Timed modes have
 * different rules and mechanics, the tooltips need to reflect these differences.
 * 
 * The function updates two sets of tooltips:
 * - Difficulty button tooltips (show what each difficulty level means)
 * - Mode button tooltips (explain the differences between Classic and Timed)
 * 
 * Tooltips are crucial for onboarding new players and helping them understand
 * what to expect from their selections.
 * 
 * @example
 * // Called when player switches to timed mode
 * gameState.currentMode = 'timed';
 * updateDifficultyTooltips('timed'); // Tooltips now show timed mode rules
 * 
 * // Called when player switches to classic mode
 * gameState.currentMode = 'classic';
 * updateDifficultyTooltips('classic'); // Tooltips show classic mode rules
 * 
 * @function
 * @param {string} mode - The game mode to display tooltips for ('classic' or 'timed')
 * @returns {void}
 * @throws {Error} If mode is not a valid game mode string
 */
export function updateDifficultyTooltips(mode) {
    if (typeof mode !== 'string' || !['classic', 'timed'].includes(mode)) {
        throw new Error('updateDifficultyTooltips requires a valid mode: "classic" or "timed"');
    }

    // Update difficulty button tooltips
    const difficultyButtons = document.querySelectorAll('.option-btn[data-difficulty]');
    difficultyButtons.forEach(button => {
        const difficulty = button.dataset.difficulty;
        const tooltipElement = button.querySelector('.tooltip');

        if (tooltipElement && gameConfig.tooltips[mode] && gameConfig.tooltips[mode][difficulty]) {
            // Set tooltip content based on current game mode and difficulty
            tooltipElement.innerHTML = gameConfig.tooltips[mode][difficulty];
        }
    });

    // Update mode-specific tooltips for better user understanding
    const modeButtons = document.querySelectorAll('.option-btn[data-mode]');
    modeButtons.forEach(button => {
        const buttonMode = button.dataset.mode;
        const tooltipElement = button.querySelector('.tooltip');

        if (tooltipElement) {
            if (buttonMode === 'classic') {
                tooltipElement.innerHTML = "Standard gameplay<br>Find matching shapes<br>3 attempts per round";
            } else if (buttonMode === 'timed') {
                tooltipElement.innerHTML = "Race against the clock<br>Gain time for correct matches<br>Lose time for mistakes<br>Bonus time for color matches";
            }
        }
    });

    console.log(`Updated tooltips for ${mode} mode`);
}

/**
 * Shows the end game confirmation dialog.
 * 
 * This function presents players with a confirmation dialog when they try to
 * quit an active game. This prevents accidental quits and gives players a
 * chance to continue if they clicked quit by mistake.
 * 
 * While the dialog is shown, the game is paused to prevent any unfair
 * time loss or unwanted game state changes.
 * 
 * @function
 * @returns {void}
 */
export function showEndGameConfirmation() {
    // Pause the game while confirmation is shown
    if (gameState.currentMode === 'timed') {
        stopTimer();
    }
    stopMovingShapes();
    // Show the confirmation dialog and overlay
    document.getElementById('confirmation-overlay').style.display = 'block';
    document.getElementById('end-game-dialog').style.display = 'block';

    console.log('End game confirmation dialog shown');
}

/**
 * Hides the end game confirmation dialog and resumes gameplay.
 * 
 * This function is called when players cancel the quit action or after they
 * confirm they want to end the game. It cleans up the modal interface and
 * resumes the game exactly where it left off.
 * 
 * The function intelligently resumes only the appropriate game systems:
 * - Timers are only restarted in timed mode
 * - Shape movement is only restarted if the game isn't over
 * - The game state remains unchanged (no progress is lost)
 * 
 * This ensures that canceling the quit dialog returns players to exactly
 * the same game state they were in before.
 * 
 * @function
 * @returns {void}
 */
export function hideEndGameConfirmation() {
    // Hide the confirmation dialog and overlay
    document.getElementById('confirmation-overlay').style.display = 'none';
    document.getElementById('end-game-dialog').style.display = 'none';

    // Resume the game only if it's still active
    if (!gameState.gameOver) {
        if (gameState.currentMode === 'timed') {
            startTimer();
        }
        if (gameState.currentDifficulty === 'hard') {
            startMovingShapes();
        }
    }

    console.log('End game confirmation dialog hidden, game resumed');
}