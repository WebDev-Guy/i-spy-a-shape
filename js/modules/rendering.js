// Rendering functions for shapes and game elements
import gameState from './gameState.js';
import { elements } from './elements.js';
import { getRandomItem, getRandomNumber } from './utils.js';
import { gameConfig } from './config.js';
import { handleShapeClick } from './gameLogic.js';

// Clear all shapes from the game board
export function clearGameBoard() {
    // Remove all shape elements from the game board
    while (elements.gameBoard.firstChild) {
        elements.gameBoard.removeChild(elements.gameBoard.firstChild);
    }
    
    // Clear the shapes array in game state
    gameState.shapes = [];
    
    console.log("Game board cleared");
}

// Create target shape to display in the match area
export function createTargetShape(shapeType) {
    // Set the target shape in the game state
    gameState.targetShape = shapeType;
    
    // Select a random color for the target shape
    gameState.targetColor = getRandomItem(gameConfig.colors);
    
    // Clear the previous target shape container
    while (elements.targetShape.firstChild) {
        elements.targetShape.removeChild(elements.targetShape.firstChild);
    }
    
    // Create the target shape element
    const targetSize = 80; // Fixed size for target shape
    const targetElement = createShapeElement(shapeType, gameState.targetColor, targetSize);
    
    // Add a class for styling
    targetElement.classList.add('target-shape');
    
    // Center the shape in the target area
    targetElement.style.position = 'relative';
    targetElement.style.left = 'auto';
    targetElement.style.top = 'auto';
    
    // Add the target shape to the target area
    elements.targetShape.appendChild(targetElement);
    
    console.log(`Created target shape: ${shapeType}, color: ${gameState.targetColor}`);
    
    return targetElement;
}

// Create a shape DOM element
export function createShapeElement(type, color, size) {
    // Adjust size based on screen width for responsive design
    let baseSize = size;
    if (window.innerWidth > 1200) {
        // For larger screens, increase the size by 50%
        baseSize = Math.floor(size * 1.5);
    } else if (window.innerWidth <= 480) {
        // For mobile screens, decrease by 30%
        baseSize = Math.floor(size * 0.7);
    } else if (window.innerWidth <= 768) {
        // For tablets, slight decrease by 15%
        baseSize = Math.floor(size * 0.85);
    }

    const shapeContainer = document.createElement('div');
    shapeContainer.classList.add('game-shape');

    // Set common styles for container
    shapeContainer.style.width = `${baseSize}px`;
    shapeContainer.style.height = `${baseSize}px`;
    shapeContainer.style.position = 'absolute';
    shapeContainer.style.border = 'none'; // Remove container border
    shapeContainer.style.backgroundColor = 'transparent'; // Ensure transparent background
    shapeContainer.style.overflow = 'visible'; // Allow shape to extend beyond container boundaries
    shapeContainer.style.display = 'flex'; // Ensure proper display
    shapeContainer.style.justifyContent = 'center'; // Center horizontally
    shapeContainer.style.alignItems = 'center'; // Center vertically

    // Create SVG element with proper namespace
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.overflow = 'visible'; // Allow shapes to extend beyond the SVG container
    svg.style.display = 'block'; // Ensure the SVG displays properly

    // Apply shape-specific SVG content
    let shapePath;

    switch (type) {
        case 'circle':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shapePath.setAttribute('cx', '50');
            shapePath.setAttribute('cy', '50');
            shapePath.setAttribute('r', '45');
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
            shapePath.setAttribute('points', '50,5 5,95 95,95');
            break;

        case 'rectangle':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shapePath.setAttribute('x', '5');
            shapePath.setAttribute('y', '20');
            shapePath.setAttribute('width', '90');
            shapePath.setAttribute('height', '60');
            // Adjust container size
            shapeContainer.style.width = `${baseSize * 1.5}px`;
            shapeContainer.style.height = `${baseSize * 0.75}px`;
            break;

        case 'pentagon':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapePath.setAttribute('points', '50,5 95,35 80,95 20,95 5,35');
            break;

        case 'hexagon':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapePath.setAttribute('points', '25,5 75,5 95,50 75,95 25,95 5,50');
            break;

        case 'oval':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            shapePath.setAttribute('cx', '50');
            shapePath.setAttribute('cy', '50');
            shapePath.setAttribute('rx', '45');
            shapePath.setAttribute('ry', '30');
            // Adjust container size
            shapeContainer.style.width = `${baseSize * 1.5}px`;
            shapeContainer.style.height = `${baseSize * 0.8}px`;
            break;

        case 'diamond':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapePath.setAttribute('points', '50,5 95,50 50,95 5,50');
            break;

        case 'octagon':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapePath.setAttribute('points', '30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30');
            break;

        case 'star':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapePath.setAttribute('points', '50,5 61,35 95,35 68,55 79,90 50,70 21,90 32,55 5,35 39,35');
            break;

        case 'heart':
            // Hearts need a path
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            shapePath.setAttribute('d', 'M50,90 C25,60 0,35 0,20 C0,5 15,0 25,0 C35,0 45,10 50,15 C55,10 65,0 75,0 C85,0 100,5 100,20 C100,35 75,60 50,90 Z');
            break;

        case 'trapezoid':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
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

    // Set common attributes for all shape paths
    shapePath.setAttribute('fill', color);
    shapePath.setAttribute('stroke', '#4a3b84');
    shapePath.setAttribute('stroke-width', '3');
    shapePath.setAttribute('vector-effect', 'non-scaling-stroke');

    // Important: Make sure the SVG is properly added to the DOM
    svg.appendChild(shapePath);
    shapeContainer.appendChild(svg);
    
    // Add debugging information
    console.log(`Created shape: ${type}, color: ${color}, size: ${baseSize}`);

    return shapeContainer;
}

// Render all shapes on the game board
export function renderShapes() {
    // Check if the game board is empty and needs initialization
    if (elements.gameBoard.children.length === 0) {
        console.log("Game board is empty, initializing shapes");
    }
    
    // First create any shape elements that don't exist yet
    gameState.shapes.forEach(shape => {
        if (!shape.element) {
            // Create the DOM element for this shape
            const shapeElement = createShapeElement(shape.type, shape.color, shape.size);
            shape.element = shapeElement;

            // Add data attributes to help with debugging
            shapeElement.setAttribute('data-shape-type', shape.type);
            shapeElement.setAttribute('data-is-match', shape.isMatch);
            shapeElement.setAttribute('data-shape-color', shape.color);

            shapeElement.classList.add('shape');

            // Add moving class if in hard mode
            if (gameState.currentDifficulty === 'hard') {
                shapeElement.classList.add('moving-shape');
            }

            // Apply z-index from the shape object (matching shapes have higher z-index)
            shapeElement.style.zIndex = shape.zIndex || 5;

            // Ensure pointer-events explicitly set to auto for clickability
            shapeElement.style.pointerEvents = 'auto';

            // Add click event handler - only once when element is created
            shapeElement.addEventListener('click', function (event) {
                handleShapeClick(shape, event);
            });

            // Add to game board - IMPORTANT: This is where we add the element to the DOM
            elements.gameBoard.appendChild(shapeElement);
            
            console.log(`Added shape to board: ${shape.type}, color: ${shape.color}, isMatch: ${shape.isMatch}`);
        }

        // Update position, rotation, and z-index for all shapes
        if (shape.element) {
            shape.element.style.left = `${shape.x}px`;
            shape.element.style.top = `${shape.y}px`;
            shape.element.style.transform = `rotate(${shape.rotation}deg)`;
            shape.element.style.zIndex = shape.zIndex || 5;
            
            // Ensure shape is visible
            shape.element.style.display = 'flex';
            shape.element.style.visibility = 'visible';
            shape.element.style.opacity = '1';
        }
    });
    
    // Log the total number of shapes rendered
    console.log(`Rendered a total of ${gameState.shapes.length} shapes on the game board`);
}

// Resize the confetti canvas to match window dimensions
export function resizeConfettiCanvas() {
    if (!elements.confettiCanvas) {
        console.warn('Confetti canvas element not found');
        return;
    }
    
    // Set canvas dimensions to match window size
    elements.confettiCanvas.width = window.innerWidth;
    elements.confettiCanvas.height = window.innerHeight;
    
    // Ensure the canvas covers the full viewport
    elements.confettiCanvas.style.position = 'fixed';
    elements.confettiCanvas.style.top = '0';
    elements.confettiCanvas.style.left = '0';
    elements.confettiCanvas.style.width = '100%';
    elements.confettiCanvas.style.height = '100%';
    elements.confettiCanvas.style.pointerEvents = 'none'; // Allow clicks to pass through
    
    console.log(`Resized confetti canvas to ${elements.confettiCanvas.width}x${elements.confettiCanvas.height}`);
}