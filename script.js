
// GAME CONFIG

let GOAL_CANS = 10;
let spawnSpeed = 800;

let score = 0;
let gameActive = false;
let spawnInterval;


// DOM ELEMENTS

const scoreDisplay = document.getElementById('score');
const message = document.getElementById('message');
const grid = document.querySelector('.game-grid');
const difficultySelect = document.getElementById('difficulty');


// CREATE GRID

function createGrid() {
  grid.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';

    cell.addEventListener('click', () => handleClick(cell));

    grid.appendChild(cell);
  }
}

// Run on load
createGrid();


// SPAWN ITEM 

function spawnItem() {
  if (!gameActive) return;

  const cells = document.querySelectorAll('.grid-cell');

  cells.forEach(cell => {
    cell.innerHTML = '';
    cell.dataset.type = '';
  });

  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  const isObstacle = Math.random() < 0.3;

  if (isObstacle) {
    randomCell.innerHTML = `<div class="obstacle"></div>`;
    randomCell.dataset.type = "obstacle";
  } else {
    randomCell.innerHTML = `<div class="water-can"></div>`;
    randomCell.dataset.type = "can";
  }
}


// HANDLE CLICK

function handleClick(cell) {
  if (!gameActive || !cell.dataset.type) return;

  if (cell.dataset.type === "can") {
    score++;
    flash(cell, "correct");
  } else {
    score = Math.max(0, score - 1);
    flash(cell, "wrong");
  }

  scoreDisplay.textContent = score;

  cell.innerHTML = '';
  cell.dataset.type = '';

  if (score >= GOAL_CANS) {
    winGame();
  }
}


// VISUAL FEEDBACK

function flash(cell, className) {
  cell.classList.add(className);
  setTimeout(() => {
    cell.classList.remove(className);
  }, 200);
}


// DIFFICULTY SYSTEM

function setDifficulty() {
  const diff = difficultySelect.value;

  if (diff === "easy") {
    GOAL_CANS = 5;
    spawnSpeed = 1200;
  } 
  else if (diff === "normal") {
    GOAL_CANS = 10;
    spawnSpeed = 800;
  } 
  else if (diff === "hard") {
    GOAL_CANS = 20;
    spawnSpeed = 500;
  } 
  else if (diff === "extreme") {
    GOAL_CANS = 30;
    spawnSpeed = 300;
  }
}


// START GAME

function startGame() {
  if (gameActive) return;

  gameActive = true;
  score = 0;
  scoreDisplay.textContent = score;
  message.textContent = '';

  createGrid();

  setDifficulty(); 

  spawnInterval = setInterval(spawnItem, spawnSpeed);
}


// END GAME

function endGame() {
  gameActive = false;
  clearInterval(spawnInterval);
}


// RESET GAME
function resetGame() {
  endGame();

  score = 0;
  scoreDisplay.textContent = score;
  message.textContent = '';

  createGrid();
}


// WIN GAME

function winGame() {
  endGame();
  message.textContent = "You win! 🎉";
  launchConfetti();
}


// CONFETTI

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 3 + 2
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.y += p.speed;

      if (p.y > canvas.height) {
        p.y = 0;
        p.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(update);
  }

  update();

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 3000);
}


// BUTTON EVENTS

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);
