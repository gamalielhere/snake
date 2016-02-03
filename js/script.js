$(document).ready(function() {
  // CANVAS PART
  var canvas = $("#canvas")[0];
  var canvasContext = canvas.getContext("2d");
  var canvasWidth = $("#canvas").width();
  var canvasHeight = $("#canvas").height();


  // CREATING THE SNAKE
  var snakeWidth = 15;
  var direction;
  var food;
  var snake;
  var score;
<<<<<<< HEAD
  var highscore = localStorage.topScore;
=======
>>>>>>> master
  var speed;
  var highscore = 0;
  var headColor = "green",
      colorFood = "yellow",
      bodyColor = "white",
      canvasFill = "black";
  var run = $("#run")[0];
  var die = $("#die")[0];
  var eat = $("#eat")[0];

  function startGame(){
    score = 0;
    speed = 70;
    direction = "right";
    snakeMake();
    randomGoods();
    if(typeof loop_game !== "undefined")
      clearInterval(loop_game);
      loop_game = setInterval(render, speed);
    run.play();
  };


  // BUTTON FUNCTIONS
  $(".start").on("click", function(event) {
    startGame();
    $("#canvas").css("visibility", "100");
    $(".start").css("display", "none");
    $(".reset").css("display", "inline-block");
    $(".pause").css("display", "inline-block");
  });

  $(".reset").on("click", function(event) {
    startGame();
    $(".start").css("display", "none");
    $(".resume").css("display", "none");
    $(".pause").css("display", "inline-block");
    $(".reset").css("display", "inline-block");

  });

  $(".resume").on("click", function(event) {
    $(".start").css("display", "none");
    $(".pause").css("display", "inline-block");
    $(".resume").css("display", "none");
    $(".reset").css("display", "inline-block");
    $(".game").css("display", "inline-block");
    loop_game = setInterval(render, speed);
  });

  $(".pause").on("click", function(event) {
    clearInterval(loop_game);
    $(".start").css("display", "none");
    $(".resume").css("display", "inline-block");
    $(".pause").css("display", "none");
    $(".reset").css("display", "inline-block");
    $(".playAgain").css("display", "none");
  });

  $(".playAgain").on("click", function(event) {
    startGame();
    $("#canvas").css("visibility", "100");
    $(".game").css("display", "inline-block");
    $(".notification").css("display", "none");
    $(".start").css("display", "none");
    $(".resume").css("display", "none");
    $(".pause").css("display", "inline-block");
    $(".reset").css("display", "inline-block");
    $(".playAgain").css("display", "none");
    $(".home").css("display", "none");
  });

  $(".home").on('click', function(event) {
    location.reload(true);
  });

  function snakeMake(){
    var length = 10;
    snake = [];
    for (var i = length - 1; i >= 0; i--) {
      snake.push({x:i , y:0});
    };
  }

  function randomGoods() {
    food = {
      x: Math.round(Math.random()*(canvasWidth-snakeWidth)/snakeWidth),
      y: Math.round(Math.random()*(canvasHeight-snakeWidth)/snakeWidth),
    }
  }
  function render(){
    canvasContext.fillStyle = canvasFill;
    canvasContext.fillRect(0,0,canvasWidth,canvasHeight);
    canvasContext.strokeStyle = canvasFill;
    canvasContext.strokeRect(0,0,canvasWidth,canvasHeight);

    // Make snake go faster
    clearInterval(loop_game);
    speed = Math.max(15, 70 - (score * 2));
    loop_game = setInterval(render, speed);

    // Making the snake move.
    var newX = snake[0].x;
    var newY = snake[0].y;
    var tail;
    var color;

    if(direction === "right"){
        newX ++;
    } else if(direction === "left"){
        newX --;
    } else if(direction === "up"){
        newY --;
    } else if(direction === "down"){
        newY ++;
    }
    // GAME OVER CONDITION
    if(newX === -1 || newX === canvasWidth/snakeWidth || newY === -1 || newY === canvasHeight/snakeWidth || collide(newX,newY,snake)){
      $(".game").css("display", "none");
      $(".notification").css("display", "inline-block");
      $(".start").css("display", "none");
      $(".resume").css("display", "none");
      $(".pause").css("display", "none");
      $(".reset").css("display", "none");
      $(".playAgain").css("display", "inline-block");
      $(".home").css("display", "inline-block");
      $(".score").text("TOTAL SCORE: " + score);
      run.pause();
      die.pause();
      die.play();
    }
    var storedHighscore = 0;
        localStorage.setItem("highscore", highscore);
        $(".currentScore").text("Your score: " + score);
        if(score > highscore) {
          highscore ++;
          if (score > storedHighscore && localStorage.highscore !== undefined) {
            localStorage.highscore = storedHighscore;
          } else if(score > storedHighscore && localStorage.highscore === undefined){
            storedHighscore++;
            localStorage.highscore = storedHighscore;
          }
        }
        $("#highScore").text(highscore);

    if(newX === food.x && newY === food.y){
      tail = {x: newX, y: newY};
      score ++;
      eat.play();
      randomGoods();
    } else {
      tail = snake.pop();
      tail.x = newX;
      tail.y = newY;
    };
    snake.unshift(tail); //move the end of the snake to the head to make it move
    /* Coloring each array of the snake
    and adding a white stroke so it looks like a solid snake*/
    for (var i = 1; i < snake.length; i++) {
      color1 = snake[0];
      color2 = snake[i];
      snakeColor(color2.x, color2.y);
      snakeHeadColor(color1.x, color1.y);

    };
    foodColor(food.x, food.y);
  }

  function foodColor(x,y){
    canvasContext.fillStyle = colorFood;
    canvasContext.fillRect(x*snakeWidth,y*snakeWidth,snakeWidth,snakeWidth);
    canvasContext.strokeStyle = colorFood;
    canvasContext.strokeRect(x*snakeWidth,y*snakeWidth,snakeWidth,snakeWidth);
  }
  function snakeColor(x,y){
    canvasContext.fillStyle = bodyColor;
    canvasContext.fillRect(x*snakeWidth,y*snakeWidth,snakeWidth,snakeWidth);
    canvasContext.strokeStyle = bodyColor;
    canvasContext.strokeRect(x*snakeWidth,y*snakeWidth,snakeWidth,snakeWidth);
  }
  function snakeHeadColor(x,y){
    canvasContext.fillStyle = headColor;
    canvasContext.fillRect(x*snakeWidth,y*snakeWidth,snakeWidth,snakeWidth);
    canvasContext.strokeStyle = headColor;
    canvasContext.strokeRect(x*snakeWidth,y*snakeWidth,snakeWidth,snakeWidth);
  }

  function collide(x, y, array){
    for (var i = 0; i < array.length; i++) {
      if (x === array[i].x && y === array[i].y)
        return true;
    }
    return false;
  }


  $(document).keydown(function(event) {
    var arrow = event.which; // return which key was pressed
    if(arrow === 37 && direction !== "right"){
      direction = "left";
    } else if(arrow === 38 && direction !== "down"){
      direction = "up";
    } else if(arrow === 39 && direction !== "left"){
      direction = "right";
    } else if(arrow === 40 && direction !== "up"){
      direction = "down";
    }
  });
});
