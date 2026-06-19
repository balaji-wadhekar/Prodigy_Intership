// DOM Elements
const cells = document.querySelectorAll('.cell');
const statusIndicator = document.getElementById('statusIndicator');
const restartBtn = document.getElementById('restartBtn');
const btnPvP = document.getElementById('btnPvP');
const btnPvE = document.getElementById('btnPvE');

// Game State
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isPvE = false; // By default Player vs Player

// 8 Possible Winning Combinations
const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// ----------------------------------------------------
// Event Listeners
// ----------------------------------------------------
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);

// Mode Selection Toggles
btnPvP.addEventListener('click', () => setMode(false));
btnPvE.addEventListener('click', () => setMode(true));

// ----------------------------------------------------
// Game Logic Functions
// ----------------------------------------------------

/**
 * Handle Game Mode Changes (PvP vs AI)
 */
function setMode(pve) {
    isPvE = pve;
    
    // UI Button Updates
    if (isPvE) {
        btnPvE.classList.add('active');
        btnPvP.classList.remove('active');
    } else {
        btnPvP.classList.add('active');
        btnPvE.classList.remove('active');
    }
    
    // Always restart game when mode changes
    restartGame();
}

/**
 * Handle user click on a cell
 */
function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    // Prevent action if cell is filled or game is over
    if (board[index] !== '' || !gameActive) return;

    // Player makes move
    makeMove(index, currentPlayer);
    checkResult();

    // If it's Player vs AI and the game isn't over, trigger AI turn
    if (gameActive && isPvE && currentPlayer === 'O') {
        // Add a slight delay to make it feel natural
        setTimeout(makeAIMove, 400);
    }
}

/**
 * Execute a move on the board
 */
function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add('taken', player.toLowerCase());
    
    // Switch turn
    currentPlayer = player === 'X' ? 'O' : 'X';
    
    if (gameActive) {
        statusIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

/**
 * Check if the game has been won or drawn
 */
function checkResult() {
    let roundWon = false;
    let winningRow = [];

    // Loop through all winning combinations
    for (let i = 0; i < 8; i++) {
        const [a, b, c] = winningConditions[i];
        
        // Check if all 3 cells are filled and have the exact same marker
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningRow = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        // The currentPlayer variable has already swapped, so the winner is the OTHER player
        const winner = currentPlayer === 'X' ? 'O' : 'X';
        statusIndicator.textContent = `Player ${winner} Wins!`;
        gameActive = false;
        highlightWinningCells(winningRow);
        return;
    }

    // Check for draw (if no empty strings remain in the board array)
    if (!board.includes('')) {
        statusIndicator.textContent = 'Game Ended in a Draw!';
        gameActive = false;
        return;
    }
}

/**
 * Highlight the winning combination
 */
function highlightWinningCells(indices) {
    indices.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

/**
 * Restart and reset game state
 */
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusIndicator.textContent = "Player X's Turn";
    
    // Reset UI
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o', 'winning-cell');
    });
}

// ----------------------------------------------------
// AI Logic (Minimax Algorithm implementation for unbeatable AI)
// ----------------------------------------------------

function makeAIMove() {
    if (!gameActive) return;
    
    let bestScore = -Infinity;
    let bestMove;

    // Loop through available spots
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            // Try the spot
            board[i] = 'O'; 
            let score = minimax(board, 0, false);
            // Undo the spot
            board[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    // Make the best move found
    if (bestMove !== undefined) {
        makeMove(bestMove, 'O');
        checkResult();
    }
}

/**
 * The Minimax algorithm evaluates all possible moves to the end of the game
 * to determine the optimal move for the AI.
 */
function minimax(newBoard, depth, isMaximizing) {
    const result = checkWinnerForMinimax(newBoard);
    
    // Terminal states evaluation
    if (result === 'O') return 10 - depth; // AI wins
    if (result === 'X') return depth - 10; // Player wins
    if (result === 'tie') return 0;        // Draw

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'O'; // AI's turn
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'X'; // Human's turn
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

/**
 * Helper function for Minimax to quickly check terminal states
 * without modifying global variables.
 */
function checkWinnerForMinimax(b) {
    for (let i = 0; i < 8; i++) {
        const [x, y, z] = winningConditions[i];
        if (b[x] && b[x] === b[y] && b[x] === b[z]) {
            return b[x]; // Return 'X' or 'O'
        }
    }
    if (!b.includes('')) return 'tie';
    return null; // Game still ongoing
}
