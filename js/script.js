(function() {
  // Create canvas
  const canvas = document.getElementById("canvas");
  if (window.outerWidth > 960) {
    canvas.width = Math.round(window.outerWidth / 3);
    canvas.height = Math.round(window.outerWidth / 3);
  } else {
    canvas.width = Math.round(window.outerWidth / 1.15);
    canvas.height = Math.round(window.outerWidth / 1.15);
  }

  const canvasContext = canvas.getContext("2d"),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height;

  // Colors
  const snakeWidth = 15,
    snakeHeadColor = "green",
    foodColor = "yellow",
    bodyColor = "white",
    canvasFill = "black";

  // Music Variables
  const run = document.getElementById("run"),
    die = document.getElementById("die"),
    eat = document.getElementById("eat"),
    musicSetting = document.getElementsByClassName("musicSetting");
  let muted = false;

  // Button Variables
  const startButton = document.getElementsByClassName("start"),
    resetButton = document.getElementsByClassName("reset"),
    resumeButton = document.getElementsByClassName("resume"),
    pauseButton = document.getElementsByClassName("pause"),
    homeButton = document.getElementsByClassName("home"),
    playAgainButton = document.getElementsByClassName("playAgain");

  // Various variables
  const displayScore = document.getElementById("highScore"),
    gameContainer = document.getElementsByClassName("game"),
    notificationContainer = document.getElementsByClassName("notification"),
    userScoreContainer = document.getElementsByClassName("currentScore");
  const cWsW = Math.ceil(canvasWidth / snakeWidth),
    cHsW = Math.ceil(canvasHeight / snakeWidth);
  let direction;
  let food;
  let bonusFood;
  let localHighScore;
  let loopGame;
  let snake;
  let score;
  let speed;
  let foodAte;

  gameContainer[0].style.height = `${canvas.height}px`;
  gameContainer[0].style.width = `${canvas.width}px`;

  // Get firebase score and display it
  const firebaseHighScore = new Firebase(
    "https://blinding-torch-4399.firebaseio.com/"
  );

  firebaseHighScore.child("highscore").on("value", fbScore => {
    localHighScore = fbScore.val();
    displayScore.innerHTML = localHighScore;
    userScoreContainer[0].innerHTML = "Score: 0";
  });

  function generateRandomDirection() {
    const directions = ["down", "left", "up", "right"];
    const randomDirection = Math.floor(Math.random() * directions.length) - 1;

    return randomDirection < 0 ? directions[0] : directions[randomDirection];
  }

  function createSnake() {
    let randomStartPoint = Math.round(
      Math.random() * (canvasHeight - snakeWidth) / snakeWidth
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
      x: Math.round(Math.random() * (canvasWidth - snakeWidth) / snakeWidth),
      y: Math.round(Math.random() * (canvasHeight - snakeWidth) / snakeWidth)
    };
  }

  function createBonusFood() {
    bonusFood = {
      x: Math.round(Math.random() * (canvasWidth - snakeWidth) / snakeWidth),
      y: Math.round(Math.random() * (canvasHeight - snakeWidth) / snakeWidth)
    };
  }

  function startTheGame() {
    musicSetting[0].innerHTML = "On";
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

    run.play();
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
      clearInterval(loopGame);
      gameContainer[0].style.display = "none";
      notificationContainer[0].style.display = "inline-block";
      notificationContainer[0].style.height = `${canvas.height}px`;
      notificationContainer[0].style.width = `${canvas.width}px`;
      startButton[0].style.display = "none";
      resumeButton[0].style.display = "none";
      pauseButton[0].style.display = "none";
      resetButton[0].style.display = "none";
      playAgainButton[0].style.display = "inline-block";
      homeButton[0].style.display = "inline-block";
      userScoreContainer[0].innerHTML = `TOTAL SCORE: ${score}`;
      run.pause();
      run.currentTime = 0;
      die.play();
    }
    updateScore();
  }

  function updateScore() {
    userScoreContainer[0].innerHTML = `Score: ${score}`;
    if (score > localHighScore) {
      localHighScore = parseInt(score);
      firebaseHighScore.child("highscore").set(localHighScore);
    }
    displayScore.innerHTML = localHighScore;
  }

  function eatFood(newX, newY) {
    if (newX === food.x && newY === food.y) {
      tail = { x: newX, y: newY };
      score++;
      foodAte++;

      console.log("Generate!", foodAte, bonusFood);
      if (foodAte === 7 && typeof bonusFood === "undefined") {
        createBonusFood();
      }
      eat.play();
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
      eat.play();

      if (typeof bonusFood !== "undefined") {
        removeBonus(bonusFood.x, bonusFood.y);
      }
    }

    foodAte = 0;
    if (typeof bonusFood !== undefined) {
      setTimeout(() => {
        removeBonus(bonusFood.x, bonusFood.y);
      }, 2500);
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
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(
      x * snakeWidth,
      y * snakeWidth,
      snakeWidth,
      snakeWidth
    );
    canvasContext.strokeStyle = "black";
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
    return false;
  }

  // Public functions
  window.startGame = function(e) {
    startTheGame();
    canvas.style.visibility = "visible";
    startButton[0].style.display = "none";
    resetButton[0].style.display = "inline-block";
    pauseButton[0].style.display = "inline-block";
  };

  window.resetGame = function() {
    startTheGame();
    startButton[0].style.display = "none";
    resumeButton[0].style.display = "none";
    resetButton[0].style.display = "inline-block";
    pauseButton[0].style.display = "inline-block";
    playAgainButton[0].style.display = "none";
  };

  window.resumeGame = function() {
    startButton[0].style.display = "none";
    resumeButton[0].style.display = "none";
    resetButton[0].style.display = "inline-block";
    pauseButton[0].style.display = "inline-block";
    gameContainer[0].style.display = "inline-block";
    loopGame = setInterval(render, speed);
  };

  window.pauseGame = function() {
    clearInterval(loopGame);
    run.pause();
    startButton[0].style.display = "none";
    resumeButton[0].style.display = "inline-block";
    pauseButton[0].style.display = "none";
    resetButton[0].style.display = "inline-block";
    playAgainButton[0].style.display = "none";
  };

  window.playAgain = function() {
    startTheGame();
    canvas.style.visibility = "visible";
    gameContainer[0].style.display = "inline-block";
    notificationContainer[0].style.display = "none";
    startButton[0].style.display = "none";
    resumeButton[0].style.display = "none";
    pauseButton[0].style.display = "inline-block";
    resetButton[0].style.display = "inline-block";
    playAgainButton[0].style.display = "none";
    homeButton[0].style.display = "none";
  };

  window.homeButton = function() {
    window.location.reload();
  };

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
    }
  });

  window.mobileLeft = function() {
    direction = "left";
  };
  window.mobileRight = function() {
    direction = "right";
  };
  window.mobileUp = function() {
    direction = "up";
  };
  window.mobileDown = function() {
    direction = "down";
  };

  window.muteGame = function() {
    if(muted) {
      musicSetting[0].innerHTML = "On";
      muted = false;
      run.muted = false;
      die.muted = false;
      eat.muted = false;
    } else {
      musicSetting[0].innerHTML = "Off";
      muted = true;
      run.muted = true;
      die.muted = true;
      eat.muted = true;
    }
  };
})();
