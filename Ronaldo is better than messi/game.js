const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const playButton = document.getElementById('playBtn');
const restartButton = document.getElementById('restartBtn');

canvas.width = 320;
canvas.height = 480;

let bird, pipes, score, gameInterval, gravity, velocity, isGameOver;

const birdWidth = 30;
const birdHeight = 10;
const pipeWidth = 50;
const pipeGap = 250;
const pipeSpeed = 1;

// Bird class
class Bird {
  constructor() {
    this.x = 50;
    this.y = canvas.height / 2;
    this.width = birdWidth;
    this.height = birdHeight;
    this.velocity = 0;
    this.lift = -10;
  }

  update() {
    this.velocity += gravity;
    this.y += this.velocity;
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.velocity = 0;
    } else if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }

  jump() {
    this.velocity = this.lift;
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Pipe class
class Pipe {
  constructor() {
    this.x = canvas.width;
    this.topHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    this.bottomHeight = canvas.height - this.topHeight - pipeGap;
  }

  update() {
    this.x -= pipeSpeed;
  }

  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, 0, pipeWidth, this.topHeight); // Top pipe
    ctx.fillRect(this.x, canvas.height - this.bottomHeight, pipeWidth, this.bottomHeight); // Bottom pipe
  }

  isOffScreen() {
    return this.x + pipeWidth < 0;
  }

  collidesWith(bird) {
    if (bird.x + bird.width > this.x && bird.x < this.x + pipeWidth) {
      if (bird.y < this.topHeight || bird.y + bird.height > canvas.height - this.bottomHeight) {
        return true;
      }
    }
    return false;
  }
}

// Game loop and mechanics
function startGame() {
  bird = new Bird();
  pipes = [];
  score = 0;
  gravity = 1.1;
  velocity = 0;
  isGameOver = false;

  document.addEventListener('keydown', () => {
    if (!isGameOver) bird.jump();
  });

  gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
  restartButton.style.display = 'none';
  playButton.style.display = 'none';
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.update();
  bird.draw();

  // Add new pipe
  if (Math.random() < 0.01) {
    pipes.push(new Pipe());
  }

  // Update pipes
  pipes.forEach((pipe, index) => {
    pipe.update();
    pipe.draw();

    // Check for collision
    if (pipe.collidesWith(bird)) {
      gameOver();
    }

    // Remove off-screen pipes
    if (pipe.isOffScreen()) {
      pipes.splice(index, 1);
      score++;
    }
  });

  // Update score display
  scoreElement.textContent = score;

  if (isGameOver) {
    clearInterval(gameInterval);
  }
}

function gameOver() {
  isGameOver = true;
  restartButton.style.display = 'inline-block';
}

function resetGame() {
  startGame();
}

function showPlayButton() {
  playButton.style.display = 'inline-block';
  restartButton.style.display = 'none';
}

playButton.addEventListener('click', startGame);
restartButton.addEventListener('click', resetGame);

// Initialize game
showPlayButton();
