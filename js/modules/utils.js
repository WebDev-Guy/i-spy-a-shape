// Utility functions for the game

// Get a random item from an array
export function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Get a random number between min and max (inclusive)
export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle an array (Fisher-Yates algorithm)
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Capitalize first letter
export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Announce message to screen readers
export function announceTo(priority, message) {
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