# I Spy a Shape - Knowledge Base

## Project Overview
This is a web-based educational game designed to help kids learn and identify geometric shapes. The game will run locally on a computer without requiring a server.

## Technologies
- HTML5
- CSS3
- Vanilla JavaScript (no external libraries or frameworks)
- ES6 Modules

## Key Features

1. **Shape Matching Mechanic**
   - One target shape will be displayed at the top of the screen
   - Multiple random shapes will be generated and placed randomly on the screen
   - User must click on the shape that matches the target shape

2. **Random Shape Generation**
   - Shapes will include circles, squares, triangles, rectangles, etc.
   - Shapes will have random colors
   - Shapes will have random sizes
   - Shapes can be randomly rotated

3. **Feedback System**
   - Correct match: Display "GREAT JOB!" and generate a new set of shapes
   - Incorrect match: Display "Try again"
   - Three consecutive incorrect attempts: Game over with a "try again" option

4. **Score Tracking**
   - Keep count of successful matches
   - Reset score when the game ends and is restarted

5. **Difficulty Levels**
   - Easy: Fewer shapes, more time, distinct colors
   - Medium: More shapes, standard time, varied colors
   - Hard: Many shapes, less time, similar colors, more rotation

6. **Sound Effects**
   - Correct answer sound
   - Wrong answer sound
   - Game over sound

7. **Visual Animations**
   - Confetti animation for correct answers, starting at the click location
   - Confetti should fly up and then fall with gravity until off-screen

8. **Game Modes**
   - Classic Mode: Standard gameplay
   - Timed Mode: Race against the clock
     - Correct shape matches add time to the countdown
     - Matching both shape AND color adds bonus time
     - Wrong clicks decrease remaining time
   - Moving Shapes Mode: Shapes bounce around the screen in hard difficulty
   - Shape Quantity Mode: Customize number of shapes on screen

9. **User Profiles**
   - Store player names
   - Track and display high scores for each difficulty and game mode

10. **Shape Implementations**
    - Basic Shapes: circle, square, triangle, rectangle
    - Medium Difficulty: pentagon, hexagon, oval, diamond
      - Diamond shape uses custom clip-path for true diamond appearance (elongated vertically)
    - Hard Difficulty: octagon, star, heart, trapezoid

## Design Constraints
- Standalone web application (no server-side components)
- Responsive design to work on different screen sizes
- Modular code structure with separation of concerns
- WCAG compliant color schemes for accessibility

## Code Organization
- **HTML (index.html)**: Main structure and layout
- **CSS (styles.css)**: Visual styling and animations
- **JavaScript**:
  - **game.js**: Main orchestrator that imports all modules
  - **modules/config.js**: Game configuration settings
  - **modules/gameState.js**: Game state management
  - **modules/elements.js**: DOM element references
  - **modules/utils.js**: Utility functions
  - **modules/rendering.js**: Shape rendering functions
  - **modules/gameLogic.js**: Core game mechanics
  - **modules/events.js**: Event listeners and UI interactions
- **Audio Files**: Sound effects for game interactions

## Recent Updates
- Modularized JavaScript code into separate ES6 modules for better organization and maintainability
- Added support for ES6 modules using type="module" in HTML
- Fixed circular dependencies between modules
- Improved diamond shape appearance to look more like a true diamond rather than a rotated square
- Enhanced accessibility features with ARIA attributes
- Added quit button during gameplay
- Implemented leaderboard tabs for different game modes
- Improved leaderboard design with horizontal layout for header and toggle buttons
- Removed redundant header for high scores section
- Condensed game options for better space utilization
- Improved modal sizing with fixed height and proper padding
- Fixed tooltips to show relevant information based on game mode
- Added Live Server configuration for consistent development
- Fixed file encoding issues for better compatibility

