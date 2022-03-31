const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;

const playerStart = [230, 10];
let currentPosition = playerStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

let timerId;
let xDirection = -2;
let yDirection = 2;

let score = 0

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

// all my blocks //
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

// draw all the blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}

addBlocks();

// add and draw the player
const player = document.createElement("div");
player.classList.add("player");
drawPlayer();
grid.appendChild(player);

function drawPlayer() {
  player.style.left = currentPosition[0] + "px";
  player.style.bottom = currentPosition[1] + "px";
}

// move the player :
function movePlayer(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawPlayer();
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        drawPlayer();
      }
      break;
  }
}
document.addEventListener("keydown", movePlayer);

// add and draw the ball :
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}

// move the ball
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}

timerId = setInterval(moveBall, 30);

// check if there are coliisions
function checkForCollisions() {
  // with the blocks
  for (let i = 0; i < blocks.length; i++) {
    if (
      (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
      ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block")
      blocks.splice(i, 1)
      changeDirection()
      score++
      scoreDisplay.innerHTML = score

      if (blocks.length === 0) {
        scoreDisplay.innerHTML = "YOU WIN !!!"
        clearInterval(timerId)
        document.removeEventListener('keydown', movePlayer)
      }
    }
  }

  // with the player bar
  if (
    (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
  ) {
    changeDirection()
  }

  // with the walls
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    changeDirection();
  }

  // game over
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = "You lose, you sucker";
    document.removeEventListener("keydown", movePlayer);
  }
}

function changeDirection() {
  // the ball is going to the top right
  if (xDirection === 2 && yDirection === 2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    xDirection = 2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
}
