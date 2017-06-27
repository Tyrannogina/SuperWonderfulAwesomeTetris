function Game(rows, columns) {
  this.rows = rows;
  this.columns = columns;
  this.board = this._generateBoard();
  this._assignControlsToKeys();
  this.intervalID = undefined;
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
        /*if (this.intervalId) {
          this.stop();
        } else {
          this.start();
        }*/
        break;
    }
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
Game.prototype._clearActualTetromino = function () {
  $('.actual').removeClass('actual ' + this.actualTetromino.cssClass);
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
        $(selector).addClass('actual ' + this.actualTetromino.cssClass);
      }
    }
  }
};

Game.prototype.start = function () {
  this._generateRandomTetromino();
  this.intervalID = setInterval(function () {
    this.actualTetromino.moveTetromino('down');
    this._drawTetromino();
    if (this.actualTetromino.fix) {
      this._fixToBottom();
    }
    if (this.actualTetromino.gameLost) {
      this._gameOver();
    }
    this._deleteLines();
  }.bind(this), 1000);
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
    linesToDelete.forEach(function (lineIndex) {
      this.board.splice(lineIndex, 1);
      this.board.unshift([]);
      for (var j = 0; j < this.columns; j++) {
        this.board[0].push(false);
      }
    }.bind(this));
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
  this._generateRandomTetromino();
};
