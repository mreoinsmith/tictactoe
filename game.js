// Game State
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let timerInterval = null;
let seconds = 0;
let gameMode = null; // 'two-player' or 'vs-computer'
let isComputerThinking = false;
let christmasMode = false;

// DOM Elements
const cells = document.querySelectorAll('.cell');
const currentTurnDisplay = document.getElementById('current-turn');
const gameStatusDisplay = document.getElementById('game-status');
const newGameBtn = document.getElementById('new-game-btn');
const timerDisplay = document.getElementById('timer');
const modeSelection = document.getElementById('mode-selection');
const gameContainer = document.getElementById('game-container');
const twoPlayerBtn = document.getElementById('two-player-btn');
const vsComputerBtn = document.getElementById('vs-computer-btn');
const changeModeBtn = document.getElementById('change-mode-btn');
const christmasToggle = document.getElementById('christmas-toggle');

// Win Conditions
const winConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// Initialize Game
function initGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    seconds = 0;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'taken', 'winning');
    });

    gameStatusDisplay.textContent = '';
    gameStatusDisplay.classList.remove('winner', 'draw');
    updateCurrentTurnDisplay();

    // Start timer
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

// Update Timer
function updateTimer() {
    if (!gameActive) {
        clearInterval(timerInterval);
        return;
    }

    seconds++;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update Current Turn Display
function updateCurrentTurnDisplay() {
    currentTurnDisplay.textContent = currentPlayer;
    currentTurnDisplay.className = currentPlayer === 'X' ? 'player-x' : 'player-o';
}

// Handle Cell Click
function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

    // Check if cell is already taken or game is not active
    if (gameBoard[cellIndex] !== '' || !gameActive || isComputerThinking) {
        return;
    }

    // In vs-computer mode, only allow player X (human) to click
    if (gameMode === 'vs-computer' && currentPlayer === 'O') {
        return;
    }

    // Make the move
    makeMove(cellIndex);

    // If vs computer and game is still active, let computer play
    if (gameMode === 'vs-computer' && gameActive && currentPlayer === 'O') {
        isComputerThinking = true;
        setTimeout(() => {
            computerMove();
            isComputerThinking = false;
        }, 500); // Small delay for better UX
    }
}

// Make a move
function makeMove(cellIndex) {
    const cell = cells[cellIndex];

    // Update game state
    gameBoard[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase(), 'taken');

    // Check for win or draw
    checkResult();
}

// Check Game Result
function checkResult() {
    let roundWon = false;
    let winningCombination = null;

    // Check all win conditions
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];

        if (gameBoard[a] === '' || gameBoard[b] === '' || gameBoard[c] === '') {
            continue;
        }

        if (gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        gameStatusDisplay.textContent = `Player ${currentPlayer} Wins! 🎉`;
        gameStatusDisplay.classList.add('winner');
        gameActive = false;
        clearInterval(timerInterval);

        // Highlight winning cells
        if (winningCombination) {
            winningCombination.forEach(index => {
                cells[index].classList.add('winning');
            });
        }
        return;
    }

    // Check for draw
    if (!gameBoard.includes('')) {
        gameStatusDisplay.textContent = "It's a Draw! 🤝";
        gameStatusDisplay.classList.add('draw');
        gameActive = false;
        clearInterval(timerInterval);
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateCurrentTurnDisplay();
}

// Computer AI Move
function computerMove() {
    if (!gameActive) return;

    // Try to win
    let move = findWinningMove('O');
    if (move !== -1) {
        makeMove(move);
        return;
    }

    // Block player from winning
    move = findWinningMove('X');
    if (move !== -1) {
        makeMove(move);
        return;
    }

    // Take center if available
    if (gameBoard[4] === '') {
        makeMove(4);
        return;
    }

    // Take a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameBoard[i] === '');
    if (availableCorners.length > 0) {
        const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        makeMove(randomCorner);
        return;
    }

    // Take any available space
    const availableCells = gameBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (availableCells.length > 0) {
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        makeMove(randomCell);
    }
}

// Find winning move for a player
function findWinningMove(player) {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        const line = [gameBoard[a], gameBoard[b], gameBoard[c]];

        // Count player marks and empty spaces in this line
        const playerCount = line.filter(cell => cell === player).length;
        const emptyCount = line.filter(cell => cell === '').length;

        // If player has 2 marks and 1 empty space, return the empty space
        if (playerCount === 2 && emptyCount === 1) {
            if (gameBoard[a] === '') return a;
            if (gameBoard[b] === '') return b;
            if (gameBoard[c] === '') return c;
        }
    }
    return -1;
}

// Mode Selection
function selectMode(mode) {
    gameMode = mode;
    modeSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    initGame();
}

function showModeSelection() {
    gameMode = null;
    modeSelection.style.display = 'block';
    gameContainer.style.display = 'none';
    clearInterval(timerInterval);
}

// Christmas Mode
function toggleChristmasMode() {
    christmasMode = !christmasMode;
    document.body.classList.toggle('christmas-mode', christmasMode);

    if (christmasMode) {
        createSnowflakes();
        christmasToggle.textContent = '🎄 Christmas Mode';
    } else {
        removeSnowflakes();
        christmasToggle.textContent = '❄️ Christmas Mode';
    }
}

function createSnowflakes() {
    const snowflakeCount = 50;
    for (let i = 0; i < snowflakeCount; i++) {
        setTimeout(() => {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.textContent = '❄';
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 3 + 5) + 's';
            snowflake.style.animationDelay = Math.random() * 5 + 's';
            snowflake.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
            document.body.appendChild(snowflake);

            // Remove snowflake after animation
            setTimeout(() => {
                if (snowflake.parentNode) {
                    snowflake.remove();
                }
            }, parseFloat(snowflake.style.animationDuration) * 1000 + parseFloat(snowflake.style.animationDelay) * 1000);
        }, i * 100);
    }

    // Keep creating snowflakes
    if (christmasMode) {
        setTimeout(createSnowflakes, 5000);
    }
}

function removeSnowflakes() {
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach(snowflake => snowflake.remove());
}

// Event Listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

newGameBtn.addEventListener('click', initGame);
twoPlayerBtn.addEventListener('click', () => selectMode('two-player'));
vsComputerBtn.addEventListener('click', () => selectMode('vs-computer'));
changeModeBtn.addEventListener('click', showModeSelection);
christmasToggle.addEventListener('click', toggleChristmasMode);

// Show mode selection on start
showModeSelection();
