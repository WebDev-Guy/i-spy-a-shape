// Game logic functions
import { gameState } from './gameState.js';
import { elements } from './elements.js';
import { gameConfig } from './config.js';
import { getRandomItem, getRandomNumber, shuffleArray, announceTo } from './utils.js';
import { clearGameBoard, createTargetShape, renderShapes, resizeConfettiCanvas } from './rendering.js';

// Get available shapes based on current difficulty
export function getAvailableShapes() {
    let availableShapes = [...gameConfig.basicShapes]; // Start with basic shapes

    if (gameState.currentDifficulty === 'medium' || gameState.currentDifficulty === 'hard') {
        availableShapes = [...availableShapes, ...gameConfig.mediumShapes]; // Add medium shapes
    }

    if (gameState.currentDifficulty === 'hard') {
        availableShapes = [...availableShapes, ...gameConfig.hardShapes]; // Add hard shapes
    }

    return availableShapes;
}

// Apply difficulty settings
export function applyDifficultySettings() {
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

// Generate random shapes for the game board
export function generateGameShapes(count, targetShapeType) {
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

    // Adjust base size range based on screen width for responsive design
    let minSize = 60; // Increased from 55
    let maxSize = 100; // Increased from 95

    // Adjust sizes for different screen sizes
    if (window.innerWidth > 1200) {
        // For larger screens, increase the size further
        minSize = 75;
        maxSize = 120;
    } else if (window.innerWidth <= 768) {
        // For tablet screens, use medium sizes
        minSize = 50;
        maxSize = 85;
    } else if (window.innerWidth <= 480) {
        // For mobile screens, decrease sizes
        minSize = 40;
        maxSize = 70;
    }

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

        const shapeSize = getRandomNumber(minSize, maxSize);
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

// Start a new round with a new target shape and new game shapes
export function startNewRound() {
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

// Handle moving shapes and make them properly clickable
export function startMovingShapes() {
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
export function stopMovingShapes() {
    if (gameState.animationFrameId) {
        cancelAnimationFrame(gameState.animationFrameId);
        gameState.animationFrameId = null;
    }
}

// Handle shape click
export function handleShapeClick(shape, event) {
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

// Update the score and attempts display
export function updateScoreDisplay() {
    elements.score.textContent = gameState.score;
    elements.attempts.textContent = gameState.attemptsLeft;
}

// Launch confetti animation
export function launchConfetti(x, y) {
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

    // Get confetti canvas context
    const confettiCtx = elements.confettiCanvas.getContext('2d');

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
export function playSound(type) {
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

// End the game
export function endGame() {
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
export function hideGameOverScreen() {
    elements.gameOverScreen.classList.add('hidden');
}

// Start the timer for timed mode
export function startTimer() {
    // Clear any existing timer
    stopTimer();

    // Start new timer interval
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        elements.timer.textContent = gameState.timeRemaining;

        // Check for time up
        if (gameState.timeRemaining <= 0) {
            stopTimer();
            endGame();
        }
    }, 1000);
}

// Stop the timer
export function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// Save high score and return position information
export function saveHighScore() {
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
export function showLeaderboardPosition(position) {
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
export function loadHighScoresByMode(mode) {
    return JSON.parse(localStorage.getItem(`shapeGameHighScores_${mode}`) || '[]');
}

// Load all high scores (legacy function for backward compatibility)
export function loadHighScores() {
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