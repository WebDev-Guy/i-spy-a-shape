# I Spy a Shape 🔷 🔺 ⭐

> An interactive educational game to help children learn geometric shapes through fun matching challenges.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://www.ecma-international.org/ecma-262/)
[![HTML5](https://img.shields.io/badge/HTML-5-orange.svg)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS-3-blue.svg)](https://www.w3.org/Style/CSS/)

## 📋 Table of Contents

- [Overview](#overview)
- [Game Configuration](#game-configuration)
- [Features](#features)
- [Installation](#installation)
- [How to Play](#how-to-play)
- [Game Modes](#game-modes)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Recent Updates](#recent-updates)

## 🔍 Overview

I Spy a Shape is a web-based educational game designed to help children recognize and identify various geometric shapes. With multiple difficulty levels and game modes, it offers an engaging way for kids to learn shape recognition through interactive gameplay.

Built using vanilla JavaScript with ES6 modules, HTML5, and CSS3, this game runs entirely in the browser with a minimal local server requirement for the ES6 module functionality.

Note: This project was built entirely using prompt templates and Github Copilot Agent (Claude 3.7)

## ⚙️ Game Configuration

You can customize various game behaviors by modifying the configuration values in the `js/modules/config.js` file. Here's a breakdown of the available configuration options:

### Basic Configuration

| Config Property | Description | Default Value |
|----------------|-------------|---------------|
| `maxShapes` | Maximum number of shapes to display at once | 10 |
| `minShapes` | Minimum number of shapes to display | 5 |
| `maxAttempts` | Number of attempts allowed before game over | 3 |
| `successDelay` | Delay in milliseconds before showing new shapes after a successful match | 800 |
| `mode` | Default game mode ('classic' or 'timed') | 'classic' |

### Shape Settings

The game includes different sets of shapes based on difficulty level:

- `basicShapes`: Shapes available in all difficulty levels (circle, square, triangle, rectangle)
- `mediumShapes`: Additional shapes in medium and hard difficulties (pentagon, hexagon, oval, diamond)
- `hardShapes`: Shapes only available in hard difficulty (octagon, star, heart, trapezoid)

### Color Settings

The game uses a WCAG compliant color palette stored in the `colors` array. You can modify these colors to create custom themes while maintaining accessibility standards.

### Difficulty Settings

Each difficulty level has customizable parameters:

#### Easy Mode
```javascript
easy: {
    shapesCount: { min: 4, max: 8 },     // Range of shapes to display
    timeLimit: 90,                        // Time limit in seconds (for timed mode)
    timeBonus: { correct: 5, colorMatch: 8 }, // Time added for correct answers
    timePenalty: 3,                       // Time deducted for wrong answers
    distinctColors: true,                 // Whether shapes have unique colors
    rotationRange: { min: 0, max: 45 },   // Shape rotation angles
    movementSpeed: { min: 0, max: 0 }     // No movement in easy mode
}
```

#### Medium Mode
```javascript
medium: {
    shapesCount: { min: 6, max: 12 },
    timeLimit: 60,
    timeBonus: { correct: 3, colorMatch: 5 },
    timePenalty: 5,
    distinctColors: false,
    rotationRange: { min: 0, max: 180 },
    movementSpeed: { min: 0, max: 0 }     // No movement in medium mode
}
```

#### Hard Mode
```javascript
hard: {
    shapesCount: { min: 10, max: 18 },
    timeLimit: 45,
    timeBonus: { correct: 2, colorMatch: 3 },
    timePenalty: 7,
    distinctColors: false,
    rotationRange: { min: 0, max: 359 },
    movementSpeed: { min: 0.05, max: 0.15 } // Shapes move in hard mode
}
```

### Visual Effects

Confetti animation settings can be customized:

```javascript
confetti: {
    particleCount: 100,       // Number of confetti particles
    gravity: 0.2,             // How fast particles fall
    spread: 70,               // How wide particles spread
    colors: ['#FF6B6B', ...], // Particle colors
    velocityFactor: 0.7       // Speed of particle movement
}
```

### How to Modify Configuration

To modify any of these settings:

1. Open the `js/modules/config.js` file in a text editor
2. Locate the `gameConfig` object
3. Change the desired values
4. Save the file and refresh the game in your browser

Example: To make the game easier, you could increase the `maxAttempts` value or extend the time limits in each difficulty level.

## ✨ Features

- **10+ Different Shapes**: From basic shapes like circles and squares to more advanced ones like trapezoids and hearts
- **Multiple Difficulty Levels**: Easy, Medium, and Hard modes with increasing complexity
- **Various Game Modes**: Classic, Timed, Moving Shapes, and customizable Shape Quantity
- **Scoring System**: Track progress and compete for high scores
- **Audio Feedback**: Sound effects for correct and incorrect answers
- **Visual Effects**: Confetti animations for successful matches
- **Responsive Design**: Works on desktops, tablets, and mobile devices
- **Accessibility Features**: ARIA attributes and WCAG compliant color schemes
- **Local Leaderboards**: Save your high scores across different game modes
- **Modular Code Structure**: ES6 modules for better organization and maintainability

## 💻 Installation

As the game uses ES6 modules, a local development server is required to run the application:

### Option 1: Using VS Code and Live Server (Recommended)

1. Clone this repository:
```bash
git clone https://github.com/webdev-guy/shape-identification-game.git
```

2. Navigate to the project directory:
```bash
cd shape-identification-game
```

3. Open the project in VS Code:
```bash
code .
```

4. Install the Live Server extension in VS Code if you don't have it already.

5. Right-click on `index.html` and select "Open with Live Server".

6. The game will open in your default browser.

### Option 2: Using Python's built-in HTTP server

1. Clone this repository as shown above.

2. Navigate to the project directory.

3. Start a Python HTTP server:
```bash
# For Python 3.x
python -m http.server

# For Python 2.x
python -m SimpleHTTPServer
```

4. Open your browser and go to `http://localhost:8000`.

### Option 3: Using Node.js http-server

1. Install http-server globally if you don't have it:
```bash
npm install -g http-server
```

2. Navigate to the project directory.

3. Start the server:
```bash
http-server
```

4. Open your browser and go to the URL shown in the terminal.

> **Note**: Simply opening the HTML file directly will not work due to ES6 module security restrictions in browsers.

## 🎯 How to Play

1. Select a difficulty level (Easy, Medium, Hard)
2. Choose a game mode (Classic, Timed, Moving Shapes, Shape Quantity)
3. A target shape will appear at the top of the screen
4. Click on the matching shape among the options displayed on the screen
5. Score points for correct matches
6. Avoid three consecutive incorrect answers to prevent game over
7. Try to beat your high score!

## 🎲 Game Modes

| Mode | Description |
|------|-------------|
| **Classic** | Standard gameplay. Match shapes to earn points. |
| **Timed** | Race against the clock! Correct matches add time, wrong answers subtract time. |
| **Moving Shapes** | Shapes bounce around the screen, increasing the challenge. |
| **Shape Quantity** | Customize how many shapes appear on screen at once. |

## 🛠️ Development

This project is built with:

- **HTML5** for structure
- **CSS3** for styling and animations
- **Vanilla JavaScript** with ES6 modules for game logic

### Project Structure

```
shape-identification-game/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # All styling and animations
├── js/
│   ├── game.js         # Main JS file that imports modules
│   └── modules/
│       ├── config.js       # Game configuration settings
│       ├── elements.js     # DOM element references
│       ├── events.js       # Event handlers and UI interactions
│       ├── gameLogic.js    # Core game mechanics
│       ├── gameState.js    # Game state management
│       ├── rendering.js    # Shape rendering functions
│       └── utils.js        # Utility functions
├── .vscode/            # VS Code configuration
│   └── settings.json   # Live Server settings
├── audio/              # Sound effects
│   ├── correct.mp3     # Played on correct match
│   ├── wrong.mp3       # Played on incorrect match
│   └── gameover.mp3    # Played when game ends
└── README.md           # This documentation
```

### Module Responsibilities

- **config.js**: Contains all game configuration settings like colors, shapes, difficulties
- **gameState.js**: Maintains the game state object and reset functionality
- **elements.js**: Stores references to DOM elements and initializes audio settings
- **utils.js**: Houses utility functions like random number generation
- **rendering.js**: Handles all shape rendering and canvas operations
- **gameLogic.js**: Contains core game mechanics like scoring and game flow
- **events.js**: Manages all event listeners and UI interactions
- **game.js**: Main entry point that orchestrates the modules

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate comments.

### Development Roadmap

Future enhancements planned:
- [ ] Add more complex shapes
- [ ] Implement a tutorial mode
- [ ] Add multiplayer functionality
- [ ] Create a progressive learning mode

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- Font Awesome for icons
- Sound effects from [Freesound.org](https://freesound.org)
- Inspiration from educational psychology research on shape recognition in early childhood development

## 🆕 Recent Updates

- **Modular JavaScript Structure**: Refactored the codebase into ES6 modules for better organization and maintainability
- **Module System Support**: Added proper module loading with type="module" in HTML
- **Fixed Dependencies**: Resolved circular dependencies between modules
- **Live Server Configuration**: Added .vscode settings for consistent development environment
- **Fixed Encoding Issues**: Addressed character encoding problems for better compatibility
- **Dynamic Tooltips**: Tooltips now update based on the selected game mode
- **Improved Leaderboard**: Redesigned with modern toggle buttons and better alignment
- **Condensed UI**: Game options have been streamlined for better space utilization
- **Enhanced Diamond Shape**: Improved appearance to look more like a true diamond
- **Accessibility Improvements**: Enhanced with ARIA attributes for better screen reader support
- **Game Controls**: Added quit button functionality during gameplay
