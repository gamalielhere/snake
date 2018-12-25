(function() {
  // Create canvas
  const canvas = document.getElementById("canvas");
  canvas.width = Math.round(window.innerWidth);
  canvas.height = Math.round(window.innerHeight - 80);
  const canvasContext = canvas.getContext("2d"),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height;

  // Colors
  const snakeWidth = 15,
    snakeHeadColor = "green",
    foodColor = "yellow",
    bodyColor = "#fafafa",
    canvasFill = "#0e0e0e";

  // Button Variables
  const startButton = document.getElementById("start"),
    controlsButton = document.getElementById("controls"),
    resetButton = document.getElementById("reset"),
    continueButton = document.getElementById("continue"),
    backButton = document.getElementById("back");

  // Various variables
  const gameContainer = document.getElementsByClassName("game"),
    headerContainer = document.getElementById("header"),
    controlsInfo = document.getElementById("controlsInfo"),
    currentScore = document.getElementById("currentScore"),
    infoContainer = document.getElementById("infoContainer");
  const cWsW = Math.ceil(canvasWidth / snakeWidth),
    cHsW = Math.ceil(canvasHeight / snakeWidth);
  let direction;
  let food;
  let bonusFood;
  let loopGame;
  let snake;
  let score;
  let speed;
  let foodAte;
  let gameStarted = "no";
  let stats = {};

  gameContainer[0].style.height = `${canvas.height}px`;
  gameContainer[0].style.width = `${canvas.width}px`;

  function generateRandomDirection() {
    const directions = ["down", "left", "up", "right"];
    const randomDirection = Math.floor(Math.random() * directions.length) - 1;

    return randomDirection < 0 ? directions[0] : directions[randomDirection];
  }

  function createSnake() {
    let randomStartPoint = Math.round(
      (Math.random() * (canvasHeight - snakeWidth)) / snakeWidth
    );
    snake = [];
    for (var i = 6 - 1; i >= 0; i--) {
      snake.push({
        x: randomStartPoint - 1,
        y: randomStartPoint
      });
    }
  }

  function createFood() {
    food = {
      x: Math.round((Math.random() * (canvasWidth - snakeWidth)) / snakeWidth),
      y: Math.round((Math.random() * (canvasHeight - snakeWidth)) / snakeWidth)
    };
  }

  function createBonusFood() {
    bonusFood = {
      x: Math.round((Math.random() * (canvasWidth - snakeWidth)) / snakeWidth),
      y: Math.round((Math.random() * (canvasHeight - snakeWidth)) / snakeWidth)
    };
  }

  function startTheGame() {
    gameStarted = "playing";
    score = 0;
    foodAte = 0;
    speed = 70;
    createSnake();
    createFood();
    direction = generateRandomDirection();
    if (typeof loopGame !== "undefined") {
      clearInterval(loopGame);
    }
    loopGame = setInterval(render, speed);
  }

  function render() {
    createCanvas();
    speedUpSnake();
    moveSnake();
  }

  function speedUpSnake() {
    clearInterval(loopGame);
    speed = Math.max(15, 70 - score * 1.5);
    loopGame = setInterval(render, speed);
  }

  function moveSnake() {
    let newX = snake[0].x,
      newY = snake[0].y;

    switch (direction) {
      case "right":
        newX++;
        break;
      case "left":
        newX--;
        break;
      case "up":
        newY--;
        break;
      default:
        newY++;
    }
    checkIfGameOver(newX, newY);
    eatFood(newX, newY);
    if (typeof bonusFood !== "undefined") eatBonusFood(newX, newY);
  }

  function checkIfGameOver(newX, newY) {
    if (
      newX === -1 ||
      newX === cWsW ||
      newY === -1 ||
      newY === cHsW ||
      collide(newX, newY, snake)
    ) {
      stats["totalScore"] = score;
      displayDeathScreen();
      clearInterval(loopGame);
    }
  }

  function eatFood(newX, newY) {
    if (newX === food.x && newY === food.y) {
      tail = { x: newX, y: newY };
      score++;
      foodAte++;

      stats["foodAte"] += 1;

      if (foodAte === 7 && typeof bonusFood === "undefined") {
        createBonusFood();
      }
      createFood();
    } else {
      tail = snake.pop();
      tail.x = newX;
      tail.y = newY;
    }
    snake.unshift(tail);
    updateSnakeColor();
    colorFood(food.x, food.y);
    if (typeof bonusFood !== "undefined") colorBonus(bonusFood.x, bonusFood.y);
  }

  function eatBonusFood(newX, newY) {
    if (newX === bonusFood.x && newY === bonusFood.y) {
      tail = { x: newX, y: newY };

      score += 5;
      stats["bonusFood"] += 1;

      if (typeof bonusFood !== "undefined") {
        removeBonus(bonusFood.x, bonusFood.y);
      }
    }

    foodAte = 0;
    if (typeof bonusFood !== undefined) {
      setTimeout(() => {
        removeBonus(bonusFood.x, bonusFood.y);
      }, 5000);
    }
  }

  function updateSnakeColor() {
    for (let i = 1; i < snake.length; i++) {
      snakeColor(snake[i].x, snake[i].y);
      colorSnakeHead(snake[0].x, snake[0].y);
    }
  }

  function createCanvas() {
    canvasContext.fillStyle = canvasFill;
    canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
    canvasContext.strokeStyle = canvasFill;
    canvasContext.strokeRect(0, 0, canvasWidth, canvasHeight);
  }

  function colorFood(x, y) {
    canvasContext.fillStyle = foodColor;
    canvasContext.fillRect(
      x * snakeWidth,
      y * snakeWidth,
      snakeWidth,
      snakeWidth
    );
    canvasContext.strokeStyle = foodColor;
    canvasContext.strokeRect(
      x * snakeWidth,
      y * snakeWidth,
      snakeWidth,
      snakeWidth
    );
  }

  function colorBonus(x, y) {
    canvasContext.fillStyle = "red";
    canvasContext.fillRect(
      x * snakeWidth,
      y * snakeWidth,
      snakeWidth,
      snakeWidth
    );
    canvasContext.strokeStyle = foodColor;
    canvasContext.strokeRect(
      x * snakeWidth,
      y * snakeWidth,
      snakeWidth,
      snakeWidth
    );
  }

  function removeBonus(x, y) {
    bonusFood = undefined;
    canvasContext.fillStyle = "#0e0e0e";
    canvasContext.fillRect(
      x * snakeWidth,
      y * snakeWidth,
      snakeWidth,
      snakeWidth
    );
    canvasContext.strokeStyle = "#0e0e0e";
    canvasContext.strokeRect(
      x * snakeWidth,
      y * snakeWidth,
      snakeWidth,
      snakeWidth
    );
  }

  function snakeColor(x, y) {
    canvasContext.fillStyle = bodyColor;
    canvasContext.fillRect(
      x * snakeWidth,
      y * snakeWidth,
      snakeWidth,
      snakeWidth
    );
    canvasContext.strokeStyle = bodyColor;
    canvasContext.strokeRect(
      x * snakeWidth,
      y * snakeWidth,
      snakeWidth,
      snakeWidth
    );
  }

  function colorSnakeHead(x, y) {
    canvasContext.fillStyle = snakeHeadColor;
    canvasContext.fillRect(
      x * snakeWidth,
      y * snakeWidth,
      snakeWidth,
      snakeWidth
    );
    canvasContext.strokeStyle = snakeHeadColor;
    canvasContext.strokeRect(
      x * snakeWidth,
      y * snakeWidth,
      snakeWidth,
      snakeWidth
    );
  }

  function collide(x, y, array) {
    for (let i = 0; i < array.length; i++) {
      if (x === array[i].x && y === array[i].y) {
        return true;
      }
    }
    updateScore();
    return false;
  }

  function updateScore() {
    currentScore.innerHTML = score;
  }

  function startGameOnEvent() {
    gameStarted = "playing";
    headerContainer.style.display = "flex";
    infoContainer.style.display = "none";
    startTheGame();
    canvas.style.visibility = "visible";
  }

  function pauseGame() {
    gameStarted = "paused";
    clearInterval(loopGame);
    headerContainer.style.display = "none";
    startButton.style.display = "none";
    controlsButton.style.display = "none";
    resetButton.style.display = "block";
    continueButton.style.display = "block";
    headerContainer.style.display = "none";
    infoContainer.style.display = "block";
  }

  function displayDeathScreen() {
    const temp = `
      <div>Food Ate: ${stats["foodAte"]}</div>
      <div>Bonus Food Ate: ${stats["bonusFood"]}</div>
      <div>Total Score: ${stats["totalScore"]}</div>
    `;
    gameStarted = "no";
    resetButton.innerHTML = "PLAY AGAIN";
    headerContainer.style.display = "none";
    resetButton.style.display = "none";
    continueButton.style.display = "none";
    headerContainer.style.display = "none";
    startButton.style.display = "none";
    controlsButton.style.display = "none";
    infoContainer.style.display = "block";
  }

  // Public functions

  function resumeGame() {
    gameStarted = "playing";
    loopGame = setInterval(render, speed);
    headerContainer.style.display = "flex";
    infoContainer.style.display = "none";
    startButton.style.display = "none";
    controlsButton.style.display = "none";
    resetButton.style.display = "none";
    continueButton.style.display = "none";
  }

  window.document.addEventListener("keydown", event => {
    const arrow = event.which;
    if (arrow === 37 && direction !== "right") {
      direction = "left";
    } else if (arrow === 38 && direction !== "down") {
      direction = "up";
    } else if (arrow === 39 && direction !== "left") {
      direction = "right";
    } else if (arrow === 40 && direction !== "up") {
      direction = "down";
    } else if (arrow === 32) {
      switch (gameStarted) {
        case "no":
          startGameOnEvent();
          break;
        case "paused":
          resumeGame();
          break;
        default:
          pauseGame();
      }
    }
  });

  resetButton.addEventListener("click", e => {
    e.stopPropagation();
    startGameOnEvent();
  });

  controlsButton.addEventListener("click", e => {
    e.stopPropagation();
    startButton.style.display = "none";
    e.target.style.display = "none";
    controlsInfo.style.display = "block";
    backButton.style.display = "block";
  });

  backButton.addEventListener("click", e => {
    e.stopPropagation();
    startButton.style.display = "block";
    controlsButton.style.display = "block";
    controlsInfo.style.display = "none";
    e.target.style.display = "none";
  });

  startButton.addEventListener("click", e => {
    e.stopPropagation();
    startGameOnEvent();
  });

  continueButton.addEventListener("click", e => {
    e.stopPropagation();
    resumeGame();
  });
})();
