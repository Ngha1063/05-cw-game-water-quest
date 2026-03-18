const GOAL_CANS = 10;
let score = 0;
let gameActive = false;
let spawnInterval;

const scoreDisplay = document.getElementById('score');
const message = document.getElementById('message');

// Create grid
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';

    cell.addEventListener('click', () => handleClick(cell));

    grid.appendChild(cell);
  }
}

createGrid();

// Spawn items
function spawnItem() {
  if (!gameActive) return;

  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => (cell.innerHTML = ''));

  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  const isObstacle = Math.random() < 0.3; // 30% chance

  if (isObstacle) {
    randomCell.innerHTML = `<div class="obstacle"></div>`;
    randomCell.dataset.type = "obstacle";
  } else {
    randomCell.innerHTML = `<div class="water-can"></div>`;
    randomCell.dataset.type = "can";
  }
}

// Handle clicks
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

  if (score >= GOAL_CANS) {
    winGame();
  }

  cell.innerHTML = '';
  cell.dataset.type = '';
}

// Visual feedback
function flash(cell, className) {
  cell.classList.add(className);
  setTimeout(() => cell.classList.remove(className), 200);
}

// Start game
function startGame() {
  if (gameActive) return;

  gameActive = true;
  score = 0;
  scoreDisplay.textContent = score;
  message.textContent = '';

  createGrid();
  spawnInterval = setInterval(spawnItem, 800);
}

// Reset game
function resetGame() {
  gameActive = false;
  clearInterval(spawnInterval);

  score = 0;
  scoreDisplay.textContent = score;
  message.textContent = '';

  createGrid();
}

// Win condition
function winGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  message.textContent = "You win! 🎉";
  launchConfetti();
}

// Confetti effect
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];

  for (let i = 0; i < 100; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 5 + 5,
      speed: Math.random() * 3 + 2
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.y += p.speed;

      if (p.y > canvas.height) p.y = 0;
    });

    requestAnimationFrame(update);
  }

  update();

  setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 3000);
}

// Buttons
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);
