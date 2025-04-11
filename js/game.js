// Shape Identification Game - Main JavaScript

// Game configuration
const gameConfig = {
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
            easy: "4-8 shapes<br>Distinct colors<br>Minimal rotation<br>3 attempts per round<br>Attempts reset after correct matches",
            medium: "6-12 shapes<br>Similar colors allowed<br>More rotation<br>3 attempts per round<br>Attempts reset after correct matches",
            hard: "10-18 shapes<br>Similar colors<br>Full rotation<br>Shapes move slowly<br>3 attempts total (no reset)"
        },
        timed: {
            easy: "4-8 shapes<br>90 seconds time limit<br>Distinct colors<br>Minimal rotation<br>+5s per correct match<br>+8s for color match",
            medium: "6-12 shapes<br>60 seconds time limit<br>Similar colors allowed<br>More rotation<br>+3s per correct match<br>+5s for color match",
            hard: "10-18 shapes<br>45 seconds time limit<br>Similar colors<br>Full rotation<br>Shapes move slowly<br>+2s per correct match<br>+3s for color match"
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

// Game state
const gameState = {
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

// DOM Elements
const elements = {
    score: document.getElementById('score'),
    attempts: document.getElementById('attempts'),
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

    // New leaderboard elements
    leaderboardTabs: null, // Will be created dynamically
    classicScoresContainer: null, // Will be created dynamically
    timedScoresContainer: null, // Will be created dynamically
    leaderboardContainer: document.getElementById('high-scores-list'),

    // Audio elements
    correctSound: document.getElementById('correct-sound'),
    wrongSound: document.getElementById('wrong-sound'),
    gameoverSound: document.getElementById('gameover-sound'),

    quitButton: document.createElement('button')
};

// Confetti context
const confettiCtx = elements.confettiCanvas.getContext('2d');

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

// Initialize all event listeners
function initEventListeners() {
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
function showSetupModal() {
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
function startGameFromSetup() {
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
function createNameErrorMessage() {
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

// Announce message to screen readers
function announceTo(priority, message) {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('role', 'status');
    announcer.className = 'sr-only';
    announcer.textContent = message;

    document.body.appendChild(announcer);

    // Remove after announcement (after a delay)
    setTimeout(() => {
        document.body.removeChild(announcer);
    }, 1000);
}

// Start the game
function startGame() {
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

// Apply difficulty settings
function applyDifficultySettings() {
    const difficulty = gameConfig.difficulty[gameState.currentDifficulty];

    // Set shape count based on difficulty, but respect the user's selection if it's within range
    if (gameState.shapesQuantity < difficulty.shapesCount.min) {
        gameState.shapesQuantity = difficulty.shapesCount.min;
    } else if (gameState.shapesQuantity > difficulty.shapesCount.max) {
        gameState.shapesQuantity = difficulty.shapesCount.max;
    }

    // Update display
    elements.shapeQuantityDisplay.textContent = gameState.shapesQuantity;
}

// Setup game mode (classic, timed)
function setupGameMode() {
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

// Start the timer for timed mode
function startTimer() {
    // Clear any existing timer
    stopTimer();

    // Start new timer interval
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        elements.timer.textContent = gameState.timeRemaining;

        // In hard mode, increase shape speed as timer gets lower
        if (gameState.currentDifficulty === 'hard' && gameState.currentMode === 'timed') {
            updateShapeSpeedBasedOnTime();
        }

        // Check for time up
        if (gameState.timeRemaining <= 0) {
            stopTimer();
            endGame();
        }
    }, 1000);
}

// Update shape speed based on remaining time (for hard mode)
function updateShapeSpeedBasedOnTime() {
    // This function is no longer used since we're removing the speed-up effect
    return;
}

// Stop the timer
function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// Reset game state
function resetGameState() {
    gameState.score = 0;
    gameState.attemptsLeft = gameConfig.maxAttempts;
    gameState.gameOver = false;
    gameState.shapes = [];
    gameState.timeRemaining = 0;
}

// Handle window resize
function handleWindowResize() {
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

// Resize confetti canvas
function resizeConfettiCanvas() {
    elements.confettiCanvas.width = window.innerWidth;
    elements.confettiCanvas.height = window.innerHeight;
}

// Get available shapes based on current difficulty
function getAvailableShapes() {
    let availableShapes = [...gameConfig.basicShapes]; // Start with basic shapes

    if (gameState.currentDifficulty === 'medium' || gameState.currentDifficulty === 'hard') {
        availableShapes = [...availableShapes, ...gameConfig.mediumShapes]; // Add medium shapes
    }

    if (gameState.currentDifficulty === 'hard') {
        availableShapes = [...availableShapes, ...gameConfig.hardShapes]; // Add hard shapes
    }

    return availableShapes;
}

// Start a new round with a new target shape and new game shapes
function startNewRound() {
    clearGameBoard();

    // Get available shapes for current difficulty
    const availableShapes = getAvailableShapes();

    // Generate a random target shape
    const randomShapeType = getRandomItem(availableShapes);
    createTargetShape(randomShapeType);

    // Generate random shapes for the game board
    generateGameShapes(gameState.shapesQuantity, randomShapeType);

    // Start moving shapes if in hard mode
    if (gameState.currentDifficulty === 'hard') {
        startMovingShapes();
    }
}

// Create the target shape that the player needs to find
function createTargetShape(shapeType) {
    elements.targetShape.innerHTML = '';
    gameState.targetShape = shapeType;

    const shapeElement = createShapeElement(shapeType, getRandomItem(gameConfig.colors), 80);
    shapeElement.style.transform = 'rotate(0deg)'; // No rotation for target shape

    // Add a data attribute to help with debugging
    shapeElement.setAttribute('data-shape-type', shapeType);

    elements.targetShape.appendChild(shapeElement);
}

// Generate random shapes for the game board
function generateGameShapes(count, targetShapeType) {
    gameState.shapes = [];

    // Get current game board dimensions
    const boardWidth = elements.gameBoard.clientWidth;
    const boardHeight = elements.gameBoard.clientHeight;

    // Get difficulty settings
    const diffSettings = gameConfig.difficulty[gameState.currentDifficulty];

    // Get available shapes for current difficulty
    const availableShapes = getAvailableShapes();

    // Prepare colors array for this round
    let roundColors = [...gameConfig.colors];
    if (diffSettings.distinctColors) {
        // Shuffle to ensure random selection
        shuffleArray(roundColors);
        // Limit to count+1 distinct colors (for target and all shapes)
        roundColors = roundColors.slice(0, count + 1);
    }

    // Target shape color
    const targetShapeColor = getRandomItem(roundColors);

    // Ensure we always include at least one matching shape
    let matchingShapeAdded = false;

    // Generate shapes
    for (let i = 0; i < count; i++) {
        let shapeType, isMatch, shapeColor;

        // For the first shape, always make it a match
        if (i === 0) {
            shapeType = targetShapeType;
            isMatch = true;
            matchingShapeAdded = true;
            // 50% chance to match color too
            shapeColor = Math.random() > 0.5 ? targetShapeColor : getRandomItem(roundColors);
        } else {
            // For other shapes, occasionally include the target shape
            if (i < count / 3 || Math.random() < 0.7) {
                do {
                    shapeType = getRandomItem(availableShapes);
                } while (shapeType === targetShapeType);
                isMatch = false;
            } else {
                shapeType = targetShapeType;
                isMatch = true;
                matchingShapeAdded = true;
            }
            shapeColor = getRandomItem(roundColors);
        }

        const shapeSize = getRandomNumber(40, 80);
        const shape = {
            type: shapeType,
            color: shapeColor,
            size: shapeSize,
            rotation: getRandomNumber(
                diffSettings.rotationRange.min,
                diffSettings.rotationRange.max
            ),
            isMatch: isMatch,
            x: getRandomNumber(10, boardWidth - shapeSize - 10),
            y: getRandomNumber(10, boardHeight - shapeSize - 10),
            // For moving shapes mode
            vx: 0,
            vy: 0,
            element: null // Reference to DOM element
        };

        // Special case for shapes with different width/height ratio
        if (shape.type === 'rectangle' || shape.type === 'oval') {
            shape.x = getRandomNumber(10, boardWidth - (shape.size * 1.5) - 10);
        }

        gameState.shapes.push(shape);
    }

    // Double-check that we have at least one matching shape
    // This is a fallback in case somehow all random selections avoided the target shape
    if (!matchingShapeAdded) {
        console.log("No matching shape was added - adding one now");

        // Replace the last shape with a matching one
        const lastIndex = gameState.shapes.length - 1;
        const lastShape = gameState.shapes[lastIndex];

        lastShape.type = targetShapeType;
        lastShape.isMatch = true;

        // If it's a rectangle or oval, adjust position
        if (lastShape.type === 'rectangle' || lastShape.type === 'oval') {
            lastShape.x = getRandomNumber(10, boardWidth - (lastShape.size * 1.5) - 10);
        }
    }

    // Shuffle the shapes array to randomize their layout
    shuffleArray(gameState.shapes);

    // Assign velocity for moving shapes mode if active
    if (gameState.currentDifficulty === 'hard') {
        const diffSettings = gameConfig.difficulty[gameState.currentDifficulty];
        gameState.shapes.forEach(shape => {
            shape.vx = getRandomNumber(
                diffSettings.movementSpeed.min,
                diffSettings.movementSpeed.max
            ) * (Math.random() > 0.5 ? 1 : -1);

            shape.vy = getRandomNumber(
                diffSettings.movementSpeed.min,
                diffSettings.movementSpeed.max
            ) * (Math.random() > 0.5 ? 1 : -1);
        });
    }

    // Render all shapes on the game board
    renderShapes();
}

// Handle moving shapes and make them properly clickable
function startMovingShapes() {
    // Stop any existing movement
    stopMovingShapes();

    // Animation function for moving shapes
    function moveShapes() {
        // Get board dimensions
        const boardWidth = elements.gameBoard.clientWidth;
        const boardHeight = elements.gameBoard.clientHeight;

        // Move each shape
        gameState.shapes.forEach(shape => {
            // Update position
            shape.x += shape.vx;
            shape.y += shape.vy;

            // Boundary collision detection
            let shapeWidth = shape.size;
            let shapeHeight = shape.size;

            // Adjust dimensions for non-square shapes
            if (shape.type === 'rectangle' || shape.type === 'oval') {
                shapeWidth = shape.size * 1.5;
                shapeHeight = shape.size * 0.75;
            }

            // Check horizontal boundaries
            if (shape.x <= 0 || shape.x + shapeWidth >= boardWidth) {
                shape.vx *= -1; // Reverse horizontal direction

                // Ensure shape is within bounds
                if (shape.x <= 0) shape.x = 0;
                if (shape.x + shapeWidth >= boardWidth) shape.x = boardWidth - shapeWidth;
            }

            // Check vertical boundaries
            if (shape.y <= 0 || shape.y + shapeHeight >= boardHeight) {
                shape.vy *= -1; // Reverse vertical direction

                // Ensure shape is within bounds
                if (shape.y <= 0) shape.y = 0;
                if (shape.y + shapeHeight >= boardHeight) shape.y = boardHeight - shapeHeight;
            }

            // Update position of the existing DOM element
            if (shape.element) {
                shape.element.style.left = `${shape.x}px`;
                shape.element.style.top = `${shape.y}px`;
            }
        });

        // Continue animation if game is not over
        if (!gameState.gameOver) {
            gameState.animationFrameId = requestAnimationFrame(moveShapes);
        }
    }

    // Start animation
    gameState.animationFrameId = requestAnimationFrame(moveShapes);
}

// Stop moving shapes
function stopMovingShapes() {
    if (gameState.animationFrameId) {
        cancelAnimationFrame(gameState.animationFrameId);
        gameState.animationFrameId = null;
    }
}

// Create a comprehensive fix for all non-rectangular shape types 
function fixNonRectangularShapes() {
    // Get all shape elements
    const shapeElements = document.querySelectorAll('.game-shape');

    // Define consistent border style for all shapes
    const borderStyle = '3px solid #4a3b84';

    shapeElements.forEach(shape => {
        // Get shape type from data attribute
        const shapeType = shape.getAttribute('data-shape-type');

        // For shapes that use clip-path (pentagon, hexagon, octagon, star, diamond, trapezoid)
        if (['pentagon', 'hexagon', 'octagon', 'star', 'diamond', 'trapezoid'].includes(shapeType)) {
            // Apply the consistent border
            shape.style.border = borderStyle;
            // Add subtle drop shadow for better visibility
            shape.style.filter = 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))';
        }

        // For circle, square, rectangle, oval - these already have normal borders
        if (['circle', 'square', 'rectangle', 'oval'].includes(shapeType)) {
            shape.style.border = borderStyle;
        }

        // Special case for triangles since they use border properties for their shape
        if (shapeType === 'triangle') {
            // For triangles, we can't use normal borders since the shape itself is created with borders
            // Instead we'll adjust the transparency of the borders to create a similar effect
            const color = shape.style.borderBottom.split(' ')[2];

            // Create a lighter border effect around the triangle
            shape.style.filter = `drop-shadow(0 0 3px #4a3b84)`;

            // Increase triangle border width slightly for consistency with other shapes
            const size = parseInt(shape.style.borderBottom.split('px')[0]);
            shape.style.borderLeft = `${size * 0.55}px solid transparent`;
            shape.style.borderRight = `${size * 0.55}px solid transparent`;
            shape.style.borderBottom = `${size * 1.1}px solid ${color}`;
            shape.style.borderTop = 'none'; // Remove top border to avoid double border effect
        }

        // Special case for heart since it uses pseudo-elements
        if (shapeType === 'heart') {
            shape.style.border = borderStyle;
            // Add custom filter for heart shape
            shape.style.filter = 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))';
        }
    });
}

// Render all shapes on the game board
function renderShapes() {
    // First create any shape elements that don't exist yet
    gameState.shapes.forEach(shape => {
        if (!shape.element) {
            // Create the DOM element for this shape
            const shapeElement = createShapeElement(shape.type, shape.color, shape.size);
            shape.element = shapeElement;

            // Add data attributes to help with debugging
            shapeElement.setAttribute('data-shape-type', shape.type);
            shapeElement.setAttribute('data-is-match', shape.isMatch);

            shapeElement.classList.add('shape');

            // Add moving class if in moving mode
            if (gameState.currentDifficulty === 'hard') {
                shapeElement.classList.add('moving-shape');
            }

            // IMPORTANT: Set higher z-index for moving shapes to ensure they're clickable
            if (gameState.currentDifficulty === 'hard') {
                shapeElement.style.zIndex = '10';
            }

            // Ensure pointer-events explicitly set to auto
            shapeElement.style.pointerEvents = 'auto';

            // Add click event handler - only once when element is created
            shapeElement.addEventListener('click', function (event) {
                handleShapeClick(shape, event);
            });

            // Add to game board
            elements.gameBoard.appendChild(shapeElement);
        }

        // Update position and rotation for all shapes
        shape.element.style.left = `${shape.x}px`;
        shape.element.style.top = `${shape.y}px`;
        shape.element.style.transform = `rotate(${shape.rotation}deg)`;
    });

    // Fix all non-rectangular shapes
    fixNonRectangularShapes();
}

// Create a shape DOM element
function createShapeElement(type, color, size) {
    const shape = document.createElement('div');
    shape.classList.add('game-shape');

    // Set common styles
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.backgroundColor = color;
    shape.style.border = `3px solid #4a3b84`; // Add solid border with specified color

    // Apply shape-specific styles
    switch (type) {
        case 'circle':
            shape.style.borderRadius = '50%';
            break;
        case 'square':
            // Default is already a square
            break;
        case 'triangle':
            // Use clip-path instead of borders for triangles to fix the rounded corners issue
            shape.style.backgroundColor = color;
            shape.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            // Remove any borders that might interfere with the shape
            shape.style.border = 'none';
            // Add drop shadow to simulate the border effect for consistent look
            shape.style.filter = `drop-shadow(0 0 3px #4a3b84)`;
            shape.setAttribute('data-shape-type', 'triangle');
            break;
        case 'rectangle':
            shape.style.width = `${size * 1.5}px`;
            shape.style.height = `${size * 0.75}px`;
            break;
        case 'pentagon':
            shape.style.clipPath = `polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)`;
            break;
        case 'hexagon':
            shape.style.clipPath = `polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)`;
            break;
        case 'oval':
            shape.style.borderRadius = '50%';
            shape.style.width = `${size * 1.5}px`;
            shape.style.height = `${size * 0.8}px`;
            break;
        case 'diamond':
            // Modified diamond shape - more elongated vertically (30% taller)
            shape.style.clipPath = `polygon(50% 0%, 100% 50%, 50% 130%, 0% 50%)`;
            // Adjust width-to-height ratio for better diamond appearance
            shape.style.width = `${size * 0.8}px`;
            shape.style.height = `${size * 1.1}px`;
            break;
        case 'octagon':
            shape.style.clipPath = `polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)`;
            break;
        case 'star':
            shape.style.clipPath = `polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)`;
            break;
        case 'heart':
            shape.style.backgroundColor = 'transparent';
            shape.style.backgroundImage = `radial-gradient(${color} 60%, transparent 61%)`;
            shape.style.backgroundSize = '100% 100%';
            shape.style.backgroundPosition = 'center';
            shape.style.position = 'relative';

            // Create the heart shape using pseudo-elements
            shape.style.setProperty('--color', color);
            shape.style.overflow = 'visible';

            // Use special CSS for heart shape
            const heartStyleTag = document.createElement('style');
            heartStyleTag.innerHTML = `
                .game-shape[data-shape-type="heart"]:before,
                .game-shape[data-shape-type="heart"]:after {
                    content: '';
                    background-color: var(--color);
                    border-radius: 50% 50% 0 0;
                    position: absolute;
                    width: 50%;
                    height: 80%;
                    top: 10%;
                }
                .game-shape[data-shape-type="heart"]:before {
                    left: 5%;
                    transform: rotate(-45deg);
                    transform-origin: 100% 100%;
                }
                .game-shape[data-shape-type="heart"]:after {
                    right: 5%;
                    transform: rotate(45deg);
                    transform-origin: 0 100%;
                }
            `;
            document.head.appendChild(heartStyleTag);
            shape.setAttribute('data-shape-type', 'heart');
            break;
        case 'trapezoid':
            shape.style.clipPath = `polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)`;
            break;
    }

    return shape;
}

// Handle shape click
function handleShapeClick(shape, event) {
    if (gameState.gameOver) return;

    // Prevent event bubbling to avoid multiple clicks
    event.stopPropagation();

    console.log('Clicked shape:', shape.type);
    console.log('Target shape:', gameState.targetShape);

    if (shape.type === gameState.targetShape) {
        // Correct match
        gameState.score++;

        // Reset attempts in Easy and Medium modes
        if (gameState.currentDifficulty !== 'hard') {
            gameState.attemptsLeft = gameConfig.maxAttempts;
        }

        updateScoreDisplay();

        // Play correct sound
        playSound('correct');

        // Launch confetti at click location
        launchConfetti(event.clientX, event.clientY);

        // Add time bonus in timed mode
        if (gameState.currentMode === 'timed') {
            const diffSettings = gameConfig.difficulty[gameState.currentDifficulty];
            let bonus = diffSettings.timeBonus.correct;

            // Check for color match bonus
            const targetShapeElement = elements.targetShape.firstChild;
            const targetShapeColor = targetShapeElement.style.backgroundColor;

            if (shape.color === targetShapeColor) {
                bonus += diffSettings.timeBonus.colorMatch;
            }

            gameState.timeRemaining += bonus;
            elements.timer.textContent = gameState.timeRemaining;
        }

        // Start new round after a short delay
        setTimeout(() => {
            // Only start a new round if the game is still active
            if (!gameState.gameOver) {
                startNewRound();
            }
        }, gameConfig.successDelay);
    } else {
        // Incorrect match
        gameState.attemptsLeft--;
        updateScoreDisplay();

        // Play wrong sound
        playSound('wrong');

        // Reduce time in timed mode
        if (gameState.currentMode === 'timed') {
            const penalty = gameConfig.difficulty[gameState.currentDifficulty].timePenalty;
            gameState.timeRemaining = Math.max(1, gameState.timeRemaining - penalty);
            elements.timer.textContent = gameState.timeRemaining;
        }

        if (gameState.attemptsLeft <= 0) {
            // Game over
            endGame();
        }
    }
}

// Launch confetti animation
function launchConfetti(x, y) {
    // Make sure canvas is properly sized
    resizeConfettiCanvas();

    // Show canvas
    elements.confettiCanvas.classList.remove('hidden');

    // Create confetti particles
    const particles = [];
    const particleCount = gameConfig.confetti.particleCount;
    const gravity = gameConfig.confetti.gravity;
    const colors = gameConfig.confetti.colors;
    const spread = gameConfig.confetti.spread;
    const velocityFactor = gameConfig.confetti.velocityFactor;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocity: {
                x: (Math.random() * spread - spread / 2) * velocityFactor,
                y: (Math.random() * -15 - 10) * velocityFactor
            },
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }

    // Animation function
    function animateConfetti() {
        confettiCtx.clearRect(0, 0, elements.confettiCanvas.width, elements.confettiCanvas.height);

        let stillActive = false;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Only animate if particle is visible
            if (p.y < elements.confettiCanvas.height) {
                stillActive = true;

                // Draw particle
                confettiCtx.save();
                confettiCtx.translate(p.x, p.y);
                confettiCtx.rotate(p.rotation * Math.PI / 180);
                confettiCtx.fillStyle = p.color;
                confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                confettiCtx.restore();

                // Update position
                p.x += p.velocity.x;
                p.y += p.velocity.y;

                // Apply gravity
                p.velocity.y += gravity;

                // Update rotation
                p.rotation += p.rotationSpeed;
            }
        }

        // Continue animation if there are still visible particles
        if (stillActive) {
            requestAnimationFrame(animateConfetti);
        } else {
            // Hide canvas when animation is complete
            elements.confettiCanvas.classList.add('hidden');
        }
    }

    // Start animation
    animateConfetti();
}

// Play sound effect
function playSound(type) {
    switch (type) {
        case 'correct':
            elements.correctSound.currentTime = 0;
            elements.correctSound.play().catch(e => console.log('Sound play error:', e));
            break;
        case 'wrong':
            elements.wrongSound.currentTime = 0;
            elements.wrongSound.play().catch(e => console.log('Sound play error:', e));
            break;
        case 'gameover':
            elements.gameoverSound.currentTime = 0;
            elements.gameoverSound.play().catch(e => console.log('Sound play error:', e));
            break;
    }
}

// Update the score and attempts display
function updateScoreDisplay() {
    elements.score.textContent = gameState.score;
    elements.attempts.textContent = gameState.attemptsLeft;
}

// Clear all shapes from the game board
function clearGameBoard() {
    // Instead of removing elements, just hide them when they're not needed
    gameState.shapes.forEach(shape => {
        if (shape.element) {
            // Just remove from DOM, don't destroy the element reference
            if (shape.element.parentNode) {
                shape.element.parentNode.removeChild(shape.element);
            }
        }
    });

    // In case there are any orphaned elements (unlikely but possible)
    const orphanedShapes = elements.gameBoard.querySelectorAll('.game-shape');
    orphanedShapes.forEach(shape => {
        shape.parentNode.removeChild(shape);
    });
}

// End the game
function endGame() {
    gameState.gameOver = true;

    // Stop any timers or animations
    stopTimer();
    stopMovingShapes();

    // Update final score
    elements.finalScore.textContent = gameState.score;

    // Play game over sound
    playSound('gameover');

    // Show game over screen
    elements.gameOverScreen.classList.remove('hidden');

    // Save high score
    saveHighScore();
}

// Hide game over screen
function hideGameOverScreen() {
    elements.gameOverScreen.classList.add('hidden');
}

// Restart the game
function restartGame() {
    // Hide game over screen
    hideGameOverScreen();

    // Start new game with same settings
    startGame();
}

// Save high score and return position information
function saveHighScore() {
    // Only save if score is greater than 0
    if (gameState.score > 0) {
        // Get existing high scores for the current mode
        let highScores = loadHighScoresByMode(gameState.currentMode);

        // Create new score entry
        const scoreEntry = {
            name: gameState.playerName,
            score: gameState.score,
            difficulty: gameState.currentDifficulty,
            mode: gameState.currentMode,
            date: new Date().toISOString()
        };

        // Add new score
        highScores.push(scoreEntry);

        // Sort by score (descending)
        highScores.sort((a, b) => b.score - a.score);

        // Get player's position in leaderboard
        const playerPosition = highScores.findIndex(score =>
            score.name === scoreEntry.name &&
            score.score === scoreEntry.score &&
            score.date === scoreEntry.date
        ) + 1;

        // Keep only top 10
        highScores = highScores.slice(0, 10);

        // Save back to local storage with mode prefix
        localStorage.setItem(`shapeGameHighScores_${gameState.currentMode}`, JSON.stringify(highScores));

        // Show leaderboard position message on game over screen
        if (playerPosition <= 10) {
            showLeaderboardPosition(playerPosition);
        }

        return playerPosition;
    }

    return 0;
}

// Show the player's position on the leaderboard on the game over screen
function showLeaderboardPosition(position) {
    // Check if an element already exists
    let leaderboardPositionElement = document.getElementById('leaderboard-position');

    if (!leaderboardPositionElement) {
        // Create the element
        leaderboardPositionElement = document.createElement('div');
        leaderboardPositionElement.id = 'leaderboard-position';
        leaderboardPositionElement.className = 'leaderboard-position';
        // Add ARIA attributes for accessibility
        leaderboardPositionElement.setAttribute('role', 'status');
        leaderboardPositionElement.setAttribute('aria-live', 'polite');

        // Insert it after the final score
        const finalScoreParent = elements.finalScore.parentNode;
        finalScoreParent.parentNode.insertBefore(leaderboardPositionElement, finalScoreParent.nextSibling);
    }

    // Set the text and class based on position
    let positionText = '';
    let ariaLabel = '';

    if (position === 1) {
        positionText = '🏆 You got 1st place on the leaderboard! 🏆';
        ariaLabel = 'Congratulations! You achieved first place on the leaderboard!';
        leaderboardPositionElement.classList.add('top-three');
    } else if (position === 2) {
        positionText = '🥈 You got 2nd place on the leaderboard! 🥈';
        ariaLabel = 'Great job! You achieved second place on the leaderboard!';
        leaderboardPositionElement.classList.add('top-three');
    } else if (position === 3) {
        positionText = '🥉 You got 3rd place on the leaderboard! 🥉';
        ariaLabel = 'Well done! You achieved third place on the leaderboard!';
        leaderboardPositionElement.classList.add('top-three');
    } else {
        positionText = `You ranked #${position} on the leaderboard!`;
        ariaLabel = `You ranked number ${position} on the leaderboard!`;
        leaderboardPositionElement.classList.remove('top-three');
    }

    leaderboardPositionElement.textContent = positionText;
    leaderboardPositionElement.setAttribute('aria-label', ariaLabel);

    // Announce the leaderboard position to screen readers
    announceTo('assertive', ariaLabel);
}

// Load high scores by game mode
function loadHighScoresByMode(mode) {
    return JSON.parse(localStorage.getItem(`shapeGameHighScores_${mode}`) || '[]');
}

// Load all high scores (legacy function for backward compatibility)
function loadHighScores() {
    // Try to get high scores by current mode first
    const modeScores = loadHighScoresByMode(gameState.currentMode);

    // For backward compatibility, check the old storage key
    const legacyScores = JSON.parse(localStorage.getItem('shapeGameHighScores') || '[]');

    if (modeScores.length > 0) {
        return modeScores;
    } else if (legacyScores.length > 0) {
        // Migrate old scores to the new format
        const classicScores = legacyScores.filter(score => score.mode === 'classic');
        const timedScores = legacyScores.filter(score => score.mode === 'timed');

        if (classicScores.length > 0) {
            localStorage.setItem('shapeGameHighScores_classic', JSON.stringify(classicScores));
        }

        if (timedScores.length > 0) {
            localStorage.setItem('shapeGameHighScores_timed', JSON.stringify(timedScores));
        }

        // Return the scores for the current mode
        return gameState.currentMode === 'classic' ? classicScores : timedScores;
    }

    return [];
}

// Display high scores
function displayHighScores() {
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
function displayModeScores(scores, container) {
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

// Utility Functions

// Get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Get a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Capitalize first letter
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize audio settings
function initAudioSettings() {
    // Set volume levels for different sounds
    elements.correctSound.volume = 0.5; // Reduced from default 1.0
    elements.wrongSound.volume = 0.7;   // Keep this a bit louder for feedback
    elements.gameoverSound.volume = 0.8;
}

// Function to update difficulty tooltips based on game mode
function updateDifficultyTooltips(mode) {
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

// Initialize the game when the page loads
window.addEventListener('load', () => {
    // Initialize confetti canvas dimensions
    resizeConfettiCanvas();

    // Initialize audio settings
    initAudioSettings();

    // Initialize game
    initGame();
});

