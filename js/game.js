function Game(rows, columns) {
  this.rows = rows;
  this.columns = columns;
  this.board = this._generateBoard();
  this.intervalID = undefined;
  this.isPaused = false;
  this.score = 0;
  this.level = 1;
  this.actualTetromino = undefined;
  this.followingTetrominos = [];
  this.speed = 500;
}

Game.prototype.start = function () {
  this._generateTetrominos();
  this._resetMovementInterval();
};

Game.prototype._resetMovementInterval = function () {
  clearInterval(this.intervalID);
  this.intervalID = setInterval(function () {
    if (!this.isPaused) {
      this.actualTetromino.moveTetromino('down');
      this._drawTetromino();
      if (this.actualTetromino.fix) {
        this._fixToBottom();
      }
      if (this.actualTetromino.gameLost) {
        this._gameOver();
      }
      this._deleteLines();
    }
  }.bind(this), this.speed);
};

Game.prototype.togglePause = function () {
  if (this.isPaused) {
    this.isPaused = false;
  } else {
    this.isPaused = true;
  }
};

Game.prototype._generateRandomTetromino = function () {
  return availableTetrominos[Math.floor(Math.random() * availableTetrominos.length)];
};

Game.prototype._generateTetrominos = function () {
  for (var i = 0; i < 4; i++) {
    var tetrominoConstructor = this._generateRandomTetromino();
    if (i === 3) {
      this.actualTetromino = new tetrominoConstructor();
      this.actualTetromino.board = this.board;
    } else {
      this.followingTetrominos[i] = new tetrominoConstructor();
    }
  }
  this._drawNextTetrominos();
};

Game.prototype._updateTetromino = function () {
  this.actualTetromino = this.followingTetrominos[0];
  this.actualTetromino.board = this.board;
  var length = this.followingTetrominos.length;
  for (var i = 0; i < length; i++) {
    if (i === length - 1) {
      this.followingTetrominos[i] = new (this._generateRandomTetromino())();
    } else {
      this.followingTetrominos[i] = this.followingTetrominos[i + 1];
    }
  }
  this._drawNextTetrominos();
};

Game.prototype._thereAreFullLines = function () {
  var fullLines = this.board.reduce(function (fullLinesAcc, line, lineIndex) {
    var lineNotFull = line.some(function(element) {return element === false;});
    if (!lineNotFull) {
      fullLinesAcc.push(lineIndex);
    }
    return fullLinesAcc;
  }, []);
  if (fullLines.length > 0) {
    return fullLines;
  }
  return false;
};

Game.prototype._deleteLines = function () {
  var linesToDelete = this._thereAreFullLines();
  if (linesToDelete !== false) {
    //Add 100 points per line + bonus of number of lines (20 per 2 lines, 30 per 3...)
    //Add 160 bonus points for every 4 lines so it is 600 points
    var lineCount = linesToDelete.length;
    var gotScore = (1 + (lineCount / 10)) * 100 + ( lineCount === 4? 160 : 0);
    this._addToScore(gotScore);
    linesToDelete.forEach(function (lineIndex) {
      this.board.splice(lineIndex, 1);
      this.board.unshift([]);
      for (var j = 0; j < this.columns; j++) {
        this.board[0].push(false);
      }
    }.bind(this));
    this._refreshBoard();
  }
};

Game.prototype._gameOver = function () {
  clearInterval(this.intervalID);
  alert("GAME OVER");
  return false;
};

Game.prototype.reset = function (rows, columns) {
  this.rows = rows;
  this.columns = columns;
  this.board = this._generateBoard();

  this.isPaused = false;
  this.score = 0;
  this._refreshScoreboard();
  this.level = 1;
  this._refreshLevel();
  this.speed = 500;
  this.actualTetromino = undefined;
  this.followingTetrominos = [];
  $('.actual').removeClass('actual');

  this.start();

  this._refreshBoard();
  return false;
};

Game.prototype._removeKeyAssignments = function () {
  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 38: // arrow up
        if (this.actualTetromino.name !== 'B') {
          this.actualTetromino.rotateTetromino("clockwise");
        }
        break;
      case 40: // arrow down
        this.actualTetromino.moveTetromino("down");
        this._addToScore(1);
        break;
      case 37: // arrow left
        this.actualTetromino.moveTetromino("left");
        break;
      case 39: // arrow right
        this.actualTetromino.moveTetromino("right");
        break;
      case 67: // c key
        if (this.actualTetromino.name !== 'B') {
          this.actualTetromino.rotateTetromino("counterclockwise");
        }
        break;
      case 80: // p pause
        this.togglePause();
        break;
    }
    this._drawTetromino();
  }.bind(this));
  return false;
};
Game.prototype._fixToBottom = function () {
  var rowStart = this.actualTetromino.offset.y < 0 ? Math.abs(this.actualTetromino.offset.y) : 0;
  var length = this.actualTetromino.body.length;
  for (var tRow = rowStart; tRow < length; tRow++) {
    var lineNotEmpty = this.actualTetromino.body[tRow].some(function(element) {return element !== false;});
    if (lineNotEmpty) {
      for (var tCol = 0; tCol < length; tCol++) {
        if (this.actualTetromino.body[tRow][tCol] !== false) {
          this.board[(this.actualTetromino.offset.y + tRow)][this.actualTetromino.offset.x + tCol] = this.actualTetromino.name;
        }
      }
    }
  }
  $('.actual').removeClass('actual');
  this._addToScore(5);
  this._updateTetromino();
};

Game.prototype._addToScore = function (valueToAdd) {
  this.score += valueToAdd;
  var tempLevel = Math.floor(this.score / 5000);
  if (tempLevel + 1 > this.level) {
    this._levelUp(tempLevel);
  }
  this._refreshScoreboard();
};

Game.prototype._levelUp = function (newLevel) {
  this.level = newLevel;
  var newSpeed = (500 - 20 * this.level);
  this.speed = newSpeed > 20 ? newSpeed : 20;
  this._resetMovementInterval();
  this._refreshLevel();
};

/******************************************************************/
/*********************** INTERFACE ********************************/
/******************************************************************/

Game.prototype.assignControlsToKeys = function() {
  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 38: // arrow up
        if (this.actualTetromino.name !== 'B') {
          this.actualTetromino.rotateTetromino("clockwise");
        }
        break;
      case 40: // arrow down
        this.actualTetromino.moveTetromino("down");
        this._addToScore(1);
        break;
      case 37: // arrow left
        this.actualTetromino.moveTetromino("left");
        break;
      case 39: // arrow right
        this.actualTetromino.moveTetromino("right");
        break;
      case 67: // c key
        if (this.actualTetromino.name !== 'B') {
          this.actualTetromino.rotateTetromino("counterclockwise");
        }
        break;
      case 80: // p pause
        this.togglePause();
        break;
    }
    this._drawTetromino();
  }.bind(this));
};

Game.prototype._generateBoard = function () {
  var board = [];
  for (var i = 0; i < this.rows; i++) {
    board.push([]);
    for (var j = 0; j < this.columns; j++) {
      board[i].push(false);
    }
  }
  return board;
};

Game.prototype.drawBoard = function () {
  //$('.game-area').css({"min-width": (this.columns * 8) + 'rem'});
  //$('.panel').css({"min-width": (this.columns * 2.5) + 'rem'});
  //$('.panel-center').css({"min-width": (this.columns * 3) + 'rem'});
  $('#game-board').css({ "width": (this.columns * 2.5) + "rem", "height": (this.rows * 2.5) + "rem"});
  this.board.forEach(function (row, rowIndex) {
    row.forEach(function (col, colIndex) {
      $('#game-board').append(
        $('<div>').addClass('cell').attr('data-row', rowIndex).attr('data-col', colIndex)
      );
    });
  });
};

Game.prototype._refreshBoard = function () {
  this._drawTetromino();
  this.board.forEach(function (row, rowIndex) {
    row.forEach(function (col, colIndex) {
      var selector = '[data-row=' + rowIndex + ']' +
                     '[data-col=' + colIndex + ']';
      if (this.board[rowIndex][colIndex] !== false) {
        $(selector).addClass('tetro' + this.board[rowIndex][colIndex]);
      } else {
        $(selector).attr('class', 'cell');
      }
    }.bind(this));
  }.bind(this));
};

Game.prototype._clearActualTetromino = function () {
  $('.actual').removeClass('actual ' + 'tetro' + this.actualTetromino.name);
};

Game.prototype._drawTetromino = function () {
  var rowStart = this.actualTetromino.offset.y < 0 ? Math.abs(this.actualTetromino.offset.y) : 0;
  var length = this.actualTetromino.body.length;
  this._clearActualTetromino();
  for (var tRow = rowStart; tRow < length; tRow++) {
    for (var tCol = 0; tCol < length; tCol++) {
      if (this.actualTetromino.body[tRow][tCol] !== false) {
        var selector = '[data-row=' + (this.actualTetromino.offset.y + tRow) + ']' +
                       '[data-col=' + (this.actualTetromino.offset.x + tCol) + ']';
        $(selector).addClass('actual ' + 'tetro' + this.actualTetromino.name);
      }
    }
  }
};

Game.prototype._drawNextTetrominos = function () {
  this.followingTetrominos.forEach(function (tetromino, index) {
    var height = tetromino.displayBody.length;
    var width = tetromino.displayBody[0].length;
    $('[next=' + (index + 1) + ']').empty().css({ "width": (width * 2.5) + "rem", "height": (height * 2.5) + "rem"});
    if (index + 1  === 1) {
      $('[next=' + (index + 1) + ']').attr('class', 'next well upcoming');
      $('[next=' + (index + 1) + ']').addClass('tetro' + tetromino.name + 'border');
    }
    for (var row = 0; row < height; row++) {
      for (var col = 0; col < width; col++) {
        if (tetromino.displayBody[row][col] !== false) {
          $('[next=' + (index + 1) + ']').append($('<div>').addClass('cell-next tetro' + tetromino.name));
        } else {
          $('[next=' + (index + 1) + ']').append($('<div>').addClass('cell-next'));
        }
      }
    }
  });
};

Game.prototype._refreshLevel = function () {
  $('#level').text(this.level);
};

Game.prototype._refreshScoreboard = function () {
  $('#scoreboard').text(this.score);
};
