/**
 * I Spy a Shape - Main Application Entry Point
 * 
 * This is the heart of our educational shape-matching game! This file serves as the
 * conductor of our orchestra, bringing together all the different modules and starting
 * the game when the page loads.
 * 
 * Think of this as the "main()" function in other programming languages - it's where
 * everything begins. We keep it simple and focused: just initializing the core systems
 * and getting the game ready for players to enjoy.
 * 
 * Why we structured it this way:
 * - Separation of concerns: Each module handles its own responsibility
 * - Easy debugging: If something goes wrong, you know exactly where to look
 * - Maintainable: Adding new features doesn't require touching this core file
 * 
 * @fileoverview Main application entry point for I Spy a Shape game
 * @author Game Development Team
 * @version 1.0.0
 */

import { initEventListeners, showSetupModal } from './modules/events.js';
import { resizeConfettiCanvas } from './modules/rendering.js';

/**
 * Initializes the entire I Spy a Shape game application.
 * 
 * This is where the magic happens! When someone opens our game in their browser,
 * this function springs into action. It's like a friendly game host that makes sure
 * everything is set up perfectly before the fun begins.
 * 
 * Here's what happens behind the scenes:
 * 1. We wire up all the buttons and controls so they actually do something
 * 2. We prepare the confetti cannon (because who doesn't love confetti?)
 * 3. We open the welcome screen where players choose their settings
 * 
 * The beauty of using DOMContentLoaded is that we wait for the entire page to
 * load before we start poking around with HTML elements. This prevents those
 * annoying "element not found" errors that can happen if we're too eager.
 * 
 * @example
 * // This function is called automatically when the page loads
 * // No need to call it manually - just open index.html and watch the magic!
 * 
 * @listens DOMContentLoaded - Waits for the page to fully load before initializing
 */
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