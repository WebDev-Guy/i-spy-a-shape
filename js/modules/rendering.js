/**
 * Shape Rendering and Visual Effects Module
 * 
 * Welcome to the art department of our game! This module is responsible for
 * bringing all the colorful shapes to life on screen. Think of it as a combination
 * of a shape factory and a graphics studio - it knows how to create every type
 * of shape and make them look beautiful.
 * 
 * We use SVG (Scalable Vector Graphics) for rendering shapes because:
 * - They look crisp at any size (perfect for responsive design)
 * - They're lightweight and performant
 * - Easy to style with colors and borders
 * - Accessible to screen readers
 * 
 * The rendering system is designed to be flexible and maintainable. Adding a
 * new shape is as simple as adding a new case to the switch statement with
 * the appropriate SVG path or element.
 * 
 * This module also handles the confetti animation system - because what's the
 * point of getting answers right if you don't get a celebration?
 * 
 * @fileoverview Shape rendering, game board management, and visual effects
 * @author Game Development Team
 * @version 1.0.0
 */

import gameState from './gameState.js';
import { elements } from './elements.js';
import { getRandomItem, getRandomNumber } from './utils.js';
import { gameConfig } from './config.js';
import { handleShapeClick } from './gameLogic.js';

/**
 * Clears all shapes from the game board.
 * 
 * This function is like hitting the reset button on the game board. It removes
 * every shape element from the DOM and clears the shapes array in our game state.
 * We call this whenever we need a fresh start: new rounds, restarts, or when
 * returning to the main menu.
 * 
 * The function is thorough but gentle - it removes elements one by one rather
 * than using innerHTML = '' because that can sometimes cause memory leaks with
 * event listeners in some browsers.
 * 
 * @example
 * // Starting a new round
 * clearGameBoard();
 * generateNewShapes();
 * 
 * // Returning to main menu
 * clearGameBoard();
 * showSetupModal();
 * 
 * @function
 * @returns {void}
 */
export function clearGameBoard() {
    // Remove all shape elements from the game board DOM
    while (elements.gameBoard.firstChild) {
        elements.gameBoard.removeChild(elements.gameBoard.firstChild);
    }

    // Clear the shapes array in game state
    gameState.shapes = [];

    console.log("Game board cleared");
}

/**
 * Creates and displays the target shape that players need to find.
 * 
 * The target shape is like the "wanted poster" at the top of the screen - it
 * shows players exactly what they're looking for. This function creates a
 * special version of the shape that's consistently sized and positioned.
 * 
 * Why we need a separate function for target shapes:
 * - Target shapes have a fixed size (80px) for consistency
 * - They're positioned differently (centered in their container)
 * - They don't have click handlers (you can't click the target!)
 * - They need special styling to distinguish them from game shapes
 * 
 * The function also stores the target color in gameState for later reference
 * when checking if player clicks are correct.
 * 
 * @example
 * // Create a target circle for players to find
 * createTargetShape('circle');
 * 
 * // Now gameState.targetShape === 'circle' and gameState.targetColor is set
 * 
 * @function
 * @param {string} shapeType - The type of shape to create as target ('circle', 'square', etc.)
 * @returns {HTMLElement} The created target shape element
 * @throws {Error} If shapeType is not a valid shape name
 */
export function createTargetShape(shapeType) {
    if (typeof shapeType !== 'string' || shapeType.trim().length === 0) {
        throw new Error('createTargetShape requires a valid shape type string');
    }

    // Set the target shape in the game state
    gameState.targetShape = shapeType;

    // Select a random color for the target shape
    gameState.targetColor = getRandomItem(gameConfig.colors);

    // Clear the previous target shape container
    while (elements.targetShape.firstChild) {
        elements.targetShape.removeChild(elements.targetShape.firstChild);
    }

    // Create the target shape element with fixed size
    const targetSize = 80; // Fixed size for consistency
    const targetElement = createShapeElement(shapeType, gameState.targetColor, targetSize);

    // Add special styling for target shapes
    targetElement.classList.add('target-shape');

    // Center the shape in the target area (no absolute positioning needed)
    targetElement.style.position = 'relative';
    targetElement.style.left = 'auto';
    targetElement.style.top = 'auto';

    // Add the target shape to the target area
    elements.targetShape.appendChild(targetElement);

    console.log(`Created target shape: ${shapeType}, color: ${gameState.targetColor}`);

    return targetElement;
}

/**
 * Creates a complete shape DOM element with SVG rendering.
 * 
 * This is the heart of our shape rendering system! This function is like a
 * skilled craftsperson who can make any type of shape you ask for. Give it
 * a shape type, color, and size, and it returns a beautiful, interactive
 * DOM element ready to be placed on the game board.
 * 
 * The function handles responsive design by adjusting sizes based on screen
 * width - shapes get bigger on large screens and smaller on mobile devices.
 * This ensures the game feels natural on any device.
 * 
 * Here's how the magic works:
 * 1. Create a container div for positioning and styling
 * 2. Create an SVG element for crisp, scalable graphics
 * 3. Generate the specific shape path/element based on type
 * 4. Apply colors, borders, and styling
 * 5. Package it all up in a clickable container
 * 
 * Each shape type has carefully crafted SVG coordinates that make it look
 * just right. The diamond shape is particularly special - it uses a custom
 * approach to look like a real gem rather than just a rotated square.
 * 
 * @example
 * // Create a medium red circle
 * const circle = createShapeElement('circle', '#FF6B6B', 80);
 * gameBoard.appendChild(circle);
 * 
 * // Create a small blue triangle for mobile
 * const triangle = createShapeElement('triangle', '#4ECDC4', 50);
 * 
 * @function
 * @param {string} type - Shape type ('circle', 'square', 'triangle', etc.)
 * @param {string} color - Hex color code for the shape fill
 * @param {number} size - Base size in pixels (will be adjusted for responsive design)
 * @returns {HTMLElement} Complete DOM element containing the rendered shape
 * @throws {Error} If type is not a string, color is invalid, or size is not a positive number
 */
export function createShapeElement(type, color, size) {
    // Input validation
    if (typeof type !== 'string' || type.trim().length === 0) {
        throw new Error('createShapeElement requires a valid shape type string');
    }

    if (typeof color !== 'string' || !color.match(/^#[0-9A-Fa-f]{6}$/)) {
        throw new Error('createShapeElement requires a valid hex color string');
    }

    if (typeof size !== 'number' || size <= 0) {
        throw new Error('createShapeElement requires a positive number for size');
    }

    // Responsive size adjustment based on screen width
    let baseSize = size;
    if (window.innerWidth > 1200) {
        // For larger screens, increase the size by 50% for better visibility
        baseSize = Math.floor(size * 1.5);
    } else if (window.innerWidth <= 480) {
        // For mobile screens, decrease by 30% to fit more shapes
        baseSize = Math.floor(size * 0.7);
    } else if (window.innerWidth <= 768) {
        // For tablets, slight decrease by 15%
        baseSize = Math.floor(size * 0.85);
    }

    // Create the container div for positioning and interaction
    const shapeContainer = document.createElement('div');
    shapeContainer.classList.add('game-shape');

    // Set common styles for container
    shapeContainer.style.width = `${baseSize}px`;
    shapeContainer.style.height = `${baseSize}px`;
    shapeContainer.style.position = 'absolute';
    shapeContainer.style.border = 'none'; // Remove container border
    shapeContainer.style.backgroundColor = 'transparent'; // Ensure transparent background
    shapeContainer.style.overflow = 'visible'; // Allow shape to extend beyond container boundaries
    shapeContainer.style.display = 'flex';
    shapeContainer.style.justifyContent = 'center';
    shapeContainer.style.alignItems = 'center';

    // Create SVG element with proper namespace for cross-browser compatibility
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 100 100'); // Standardized coordinate system
    svg.style.overflow = 'visible'; // Allow shapes to extend beyond the SVG container
    svg.style.display = 'block';

    // Create the specific shape path/element based on type
    let shapePath;

    switch (type) {
        case 'circle':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shapePath.setAttribute('cx', '50'); // Center X
            shapePath.setAttribute('cy', '50'); // Center Y
            shapePath.setAttribute('r', '45');  // Radius (leave some padding)
            break;

        case 'square':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shapePath.setAttribute('x', '5');
            shapePath.setAttribute('y', '5');
            shapePath.setAttribute('width', '90');
            shapePath.setAttribute('height', '90');
            break;

        case 'triangle':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            // Equilateral triangle pointing up
            shapePath.setAttribute('points', '50,5 5,95 95,95');
            break;

        case 'rectangle':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shapePath.setAttribute('x', '5');
            shapePath.setAttribute('y', '20');
            shapePath.setAttribute('width', '90');
            shapePath.setAttribute('height', '60');
            // Adjust container size for rectangle's aspect ratio
            shapeContainer.style.width = `${baseSize * 1.5}px`;
            shapeContainer.style.height = `${baseSize * 0.75}px`;
            break;

        case 'pentagon':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            // Regular pentagon with point at top
            shapePath.setAttribute('points', '50,5 95,35 80,95 20,95 5,35');
            break;

        case 'hexagon':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            // Regular hexagon with flat top and bottom
            shapePath.setAttribute('points', '25,5 75,5 95,50 75,95 25,95 5,50');
            break;

        case 'oval':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            shapePath.setAttribute('cx', '50');
            shapePath.setAttribute('cy', '50');
            shapePath.setAttribute('rx', '45'); // Horizontal radius
            shapePath.setAttribute('ry', '30'); // Vertical radius (smaller for oval shape)
            // Adjust container size for oval's aspect ratio
            shapeContainer.style.width = `${baseSize * 1.5}px`;
            shapeContainer.style.height = `${baseSize * 0.8}px`;
            break;

        case 'diamond':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            // True diamond shape (not just a rotated square)
            shapePath.setAttribute('points', '50,5 95,50 50,95 5,50');
            break; case 'octagon':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            // Regular octagon with symmetrical angles
            shapePath.setAttribute('points', '30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30');
            break;

        case 'star':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            // Five-pointed star with alternating inner and outer points
            shapePath.setAttribute('points', '50,5 61,35 95,35 68,55 79,90 50,70 21,90 32,55 5,35 39,35');
            break;

        case 'heart':
            // Hearts need a path element for their curved shape
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            // Heart shape using Bézier curves for realistic appearance
            shapePath.setAttribute('d', 'M50,90 C25,60 0,35 0,20 C0,5 15,0 25,0 C35,0 45,10 50,15 C55,10 65,0 75,0 C85,0 100,5 100,20 C100,35 75,60 50,90 Z');
            break;

        case 'trapezoid':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            // Trapezoid with parallel top and bottom edges
            shapePath.setAttribute('points', '20,5 80,5 95,95 5,95');
            break;

        default:
            // Fallback to a circle if shape type not recognized
            console.warn(`Unknown shape type: ${type}, defaulting to circle`);
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shapePath.setAttribute('cx', '50');
            shapePath.setAttribute('cy', '50');
            shapePath.setAttribute('r', '45');
            break;
    }

    // Apply consistent styling to all shape paths
    shapePath.setAttribute('fill', color);
    shapePath.setAttribute('stroke', '#4a3b84'); // Deep purple border for all shapes
    shapePath.setAttribute('stroke-width', '3');
    shapePath.setAttribute('vector-effect', 'non-scaling-stroke'); // Keep border width consistent

    // Assemble the complete shape element
    svg.appendChild(shapePath);
    shapeContainer.appendChild(svg);

    // Add debugging information for development
    console.log(`Created shape: ${type}, color: ${color}, size: ${baseSize}`);

    return shapeContainer;
}

/**
 * Renders all shapes from gameState onto the game board.
 * 
 * This function is like a stage manager in a theater - it takes all the shapes
 * that have been planned and actually puts them on stage (the game board) where
 * players can see and interact with them.
 * 
 * The function is designed to be efficient and safe:
 * - It only creates DOM elements for shapes that don't have them yet
 * - It updates positions and styling for all shapes
 * - It handles the case where shapes might be moving around (hard mode)
 * - It ensures all shapes are properly clickable and visible
 * 
 * Each shape gets important metadata attached:
 * - data-shape-type: For debugging and testing
 * - data-is-match: Whether this shape matches the target
 * - data-shape-color: The shape's color value
 * - Proper z-index for layering (matching shapes appear on top)
 * 
 * @example
 * // After generating shape data, render them on screen
 * generateGameShapes(10, 'circle');
 * renderShapes(); // Now players can see and click the shapes
 * 
 * // Update positions after shapes move (in hard mode)
 * updateShapePositions();
 * renderShapes(); // Refresh the display
 * 
 * @function
 * @returns {void}
 */
export function renderShapes() {
    // Check if the game board is empty and needs initialization
    if (elements.gameBoard.children.length === 0) {
        console.log("Game board is empty, initializing shapes");
    }

    // Create DOM elements for shapes that don't have them yet
    gameState.shapes.forEach(shape => {
        if (!shape.element) {
            // Create the DOM element for this shape
            const shapeElement = createShapeElement(shape.type, shape.color, shape.size);
            shape.element = shapeElement;

            // Add metadata attributes for debugging and testing
            shapeElement.setAttribute('data-shape-type', shape.type);
            shapeElement.setAttribute('data-is-match', shape.isMatch);
            shapeElement.setAttribute('data-shape-color', shape.color);

            // Add CSS class for styling
            shapeElement.classList.add('shape');

            // Add moving class if in hard mode for special styling
            if (gameState.currentDifficulty === 'hard') {
                shapeElement.classList.add('moving-shape');
            }

            // Apply z-index from the shape object (matching shapes have higher z-index)
            shapeElement.style.zIndex = shape.zIndex || 5;

            // Ensure the element is clickable
            shapeElement.style.pointerEvents = 'auto';

            // Add click event handler - only once when element is created
            shapeElement.addEventListener('click', function (event) {
                handleShapeClick(shape, event);
            });

            // Add to game board - this is where the element becomes visible
            elements.gameBoard.appendChild(shapeElement);

            console.log(`Added shape to board: ${shape.type}, color: ${shape.color}, isMatch: ${shape.isMatch}`);
        }

        // Update position, rotation, and z-index for all shapes (including existing ones)
        if (shape.element) {
            shape.element.style.left = `${shape.x}px`;
            shape.element.style.top = `${shape.y}px`;
            shape.element.style.transform = `rotate(${shape.rotation}deg)`;
            shape.element.style.zIndex = shape.zIndex || 5;

            // Ensure shape is visible and properly displayed
            shape.element.style.display = 'flex';
            shape.element.style.visibility = 'visible';
            shape.element.style.opacity = '1';
        }
    });

    // Log the total number of shapes rendered for debugging
    console.log(`Rendered a total of ${gameState.shapes.length} shapes on the game board`);
}

/**
 * Resizes the confetti canvas to match the current window dimensions.
 * 
 * The confetti animation needs to cover the entire screen to look impressive,
 * so whenever the window size changes, we need to update our canvas dimensions.
 * This function ensures the confetti canvas always perfectly overlays the
 * entire viewport.
 * 
 * Key aspects of confetti canvas setup:
 * - Fixed positioning to stay in place during scrolling
 * - Full viewport coverage (100% width and height)
 * - Pointer events disabled so clicks pass through to game elements
 * - High z-index to appear above other elements during animation
 * 
 * This function is called during initialization and whenever the window
 * is resized to maintain perfect coverage.
 * 
 * @example
 * // During game initialization
 * resizeConfettiCanvas();
 * 
 * // When window is resized
 * window.addEventListener('resize', resizeConfettiCanvas);
 * 
 * @function
 * @returns {void}
 * @throws {Error} If confetti canvas element is not found
 */
export function resizeConfettiCanvas() {
    if (!elements.confettiCanvas) {
        console.warn('Confetti canvas element not found');
        return;
    }

    try {
        // Set canvas dimensions to match window size exactly
        elements.confettiCanvas.width = window.innerWidth;
        elements.confettiCanvas.height = window.innerHeight;

        // Ensure the canvas covers the full viewport with proper positioning
        elements.confettiCanvas.style.position = 'fixed';
        elements.confettiCanvas.style.top = '0';
        elements.confettiCanvas.style.left = '0';
        elements.confettiCanvas.style.width = '100%';
        elements.confettiCanvas.style.height = '100%';
        elements.confettiCanvas.style.pointerEvents = 'none'; // Allow clicks to pass through

        console.log(`Resized confetti canvas to ${elements.confettiCanvas.width}x${elements.confettiCanvas.height}`);
    } catch (error) {
        console.error('Failed to resize confetti canvas:', error);
        throw new Error('Could not resize confetti canvas');
    }
}