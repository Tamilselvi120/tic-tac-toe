const home = document.getElementById("home");
const mode = document.getElementById("mode");
const game = document.getElementById("game");
const board = document.getElementById("board");
const statusText = document.querySelector(".status");
const playerXDisplay = document.getElementById("playerX");
const playerODisplay = document.getElementById("playerO");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameMode = ""; // 'computer' or 'player'

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function goToMode() {
  home.classList.add("hidden");
  mode.classList.remove("hidden");
}

function startGame(modeChoice) {
  gameMode = modeChoice;
  mode.classList.add("hidden");
  game.classList.remove("hidden");
  restartGame();
}

function createBoard() {
  board.innerHTML = "";
  gameState.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.dataset.index = index;
    cellElement.addEventListener("click", handleCellClick);
    board.appendChild(cellElement);
  });
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (gameState[index] !== "" || !gameActive) return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add("taken");

  checkResult();

  if (gameMode === "computer" && gameActive && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  let available = [];
  gameState.forEach((val, idx) => {
    if (val === "") available.push(idx);
  });
  if (available.length > 0) {
    let randomIndex = available[Math.floor(Math.random() * available.length)];
    gameState[randomIndex] = "O";
    const cell = document.querySelector(`[data-index='${randomIndex}']`);
    cell.textContent = "O";
    cell.classList.add("taken");
    checkResult();
  }
}

function checkResult() {
  let roundWon = false;
  let winningLine = [];
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      roundWon = true;
      winningLine = [a, b, c];
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
    highlightWin(winningLine);
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "It's a Draw! 🤝";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function highlightWin(line) {
  line.forEach(index => {
    document.querySelector(`[data-index='${index}']`).classList.add("win");
  });
}

function updateTurnDisplay() {
  if (currentPlayer === "X") {
    playerXDisplay.classList.add("active");
    playerODisplay.classList.remove("active");
  } else {
    playerODisplay.classList.add("active");
    playerXDisplay.classList.remove("active");
  }
}

function restartGame() {
  currentPlayer = "X";
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  playerXDisplay.classList.add("active");
  playerODisplay.classList.remove("active");
  createBoard();
}

function resetGame() {
  game.classList.add("hidden");
  home.classList.remove("hidden");
}

createBoard();
