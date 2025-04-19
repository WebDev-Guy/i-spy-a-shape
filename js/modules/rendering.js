// Rendering functions for shapes and game elements
import { gameState } from './gameState.js';
import { elements } from './elements.js';
import { getRandomItem, getRandomNumber } from './utils.js';
import { gameConfig } from './config.js';
import { handleShapeClick } from './gameLogic.js';

// Create a shape DOM element
export function createShapeElement(type, color, size) {
    // Adjust size based on screen width for responsive design
    let baseSize = size;
    if (window.innerWidth > 1200) {
        // For larger screens, increase the size by 50%
        baseSize = Math.floor(size * 2.0);
    } else if (window.innerWidth <= 480) {
        // For mobile screens, decrease by 30%
        baseSize = Math.floor(size * 1.1);
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

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.overflow = 'visible'; // Allow shapes to extend beyond the SVG container

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
            shapeContainer.style.width = `${size * 1.5}px`;
            shapeContainer.style.height = `${size * 0.75}px`;
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
            shapeContainer.style.width = `${size * 1.5}px`;
            shapeContainer.style.height = `${size * 0.8}px`;
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
            // Hearts are special - we'll use a path
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            shapePath.setAttribute('d', 'M50,90 C25,60 0,35 0,20 C0,5 15,0 25,0 C35,0 45,10 50,15 C55,10 65,0 75,0 C85,0 100,5 100,20 C100,35 75,60 50,90 Z');
            break;

        case 'trapezoid':
            shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapePath.setAttribute('points', '20,5 80,5 95,95 5,95');
            break;
    }

    // Set common attributes for all shape paths
    shapePath.setAttribute('fill', color);
    shapePath.setAttribute('stroke', '#4a3b84');
    shapePath.setAttribute('stroke-width', '3'); // Stroke width for shape outline
    shapePath.setAttribute('vector-effect', 'non-scaling-stroke'); // Keeps stroke width consistent

    // Add the shape path to SVG
    svg.appendChild(shapePath);

    // Add SVG to container
    shapeContainer.appendChild(svg);

    return shapeContainer;
}

// Render all shapes on the game board
export function renderShapes() {
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

// Comprehensive fix for all non-rectangular shape types 
export function fixNonRectangularShapes() {
    // Get all shape elements
    const shapeElements = document.querySelectorAll('.game-shape');

    shapeElements.forEach(shape => {
        // Get shape type from data attribute
        const shapeType = shape.getAttribute('data-shape-type');

        // For shapes that use clip-path (pentagon, hexagon, octagon, star, diamond, trapezoid)
        if (['pentagon', 'hexagon', 'octagon', 'star', 'diamond', 'trapezoid'].includes(shapeType)) {
            // Add subtle drop shadow for better visibility
            shape.style.filter = 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))';
        }

        // For circle, square, rectangle, oval - these already have normal borders
        if (['circle', 'square', 'rectangle', 'oval'].includes(shapeType)) {
            // Add subtle drop shadow for better visibility
            shape.style.filter = 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))';
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
            // Add custom filter for heart shape
            shape.style.filter = 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))';
        }
    });
}

// Create the target shape that the player needs to find
export function createTargetShape(shapeType) {
    elements.targetShape.innerHTML = '';
    gameState.targetShape = shapeType;

    const shapeElement = createShapeElement(shapeType, getRandomItem(gameConfig.colors), 80);
    shapeElement.style.transform = 'rotate(0deg)'; // No rotation for target shape

    // Add a data attribute to help with debugging
    shapeElement.setAttribute('data-shape-type', shapeType);

    elements.targetShape.appendChild(shapeElement);
}

// Clear all shapes from the game board
export function clearGameBoard() {
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

// Resize confetti canvas
export function resizeConfettiCanvas() {
    elements.confettiCanvas.width = window.innerWidth;
    elements.confettiCanvas.height = window.innerHeight;
}