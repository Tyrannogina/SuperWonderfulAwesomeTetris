function Game(rows, columns) {
  this.rows = rows;
  this.columns = columns;
  this.board = this._generateBoard();
  this._assignControlsToKeys();
  this.intervalID = undefined;
  this.isPaused = false;
  this.score = 0;
  this.level = 1;
}

Game.prototype._assignControlsToKeys = function() {
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
  $('.game-area').css({"min-width": (this.columns * 8) + 'rem'});
  $('.panel').css({"min-width": (this.columns * 2.5) + 'rem'});
  $('.panel-center').css({"min-width": (this.columns * 3) + 'rem'});
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
  $('.cell').attr('class', 'cell');
  this._drawTetromino();
  this.board.forEach(function (row, rowIndex) {
    row.forEach(function (col, colIndex) {
      if (this.board[rowIndex][colIndex] !== false) {
        var selector = '[data-row=' + rowIndex + ']' +
                       '[data-col=' + colIndex + ']';
        $(selector).addClass('tetro' + this.board[rowIndex][colIndex]);
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

Game.prototype.start = function () {
  this._generateRandomTetromino();
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
  }.bind(this), 500);
};

Game.prototype.togglePause = function () {
  if (this.isPaused) {
    this.isPaused = false;
  } else {
    this.isPaused = true;
  }
};

Game.prototype._generateRandomTetromino = function () {
  var tetrominoConstructor = availableTetrominos[Math.floor(Math.random() * availableTetrominos.length)];
  this.actualTetromino = new tetrominoConstructor();
  this.actualTetromino.board = this.board;
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
    if (linesToDelete.length > 5) {
      //Add 100 bonus points for every 5 lines
      this._addToScore(Math.floor(linesToDelete.length / 5)*100);
    }
    linesToDelete.forEach(function (lineIndex) {
      this.board.splice(lineIndex, 1);
      this.board.unshift([]);
      for (var j = 0; j < this.columns; j++) {
        this.board[0].push(false);
      }
      this._addToScore(100);
    }.bind(this));
    this._refreshBoard();
  }
};

Game.prototype._gameOver = function () {
    clearInterval(this.intervalID);
    alert("GAME OVER");
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
  this._generateRandomTetromino();
};

Game.prototype._addToScore = function (valueToAdd) {
  this.score += valueToAdd;
  var tempLevel = Math.floor(this.score / 5000);
  if (tempLevel > this.level) {
    this._levelUp(tempLevel);
  }
  this._updateScoreboard();
};

Game.prototype._updateScoreboard = function () {
  $('#scoreboard').text(this.score);
};

Game.prototype._levelUp = function (newLevel) {
  this.level = newLevel;
  this._refreshLevel();
};

Game.prototype._refreshLevel = function () {
  $('#level').text(this.level);
};
