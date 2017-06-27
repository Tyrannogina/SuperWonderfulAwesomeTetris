function Game(rows, columns) {
  this.rows = rows;
  this.columns = columns;
  this.board = this._generateBoard();
  this.intervalID = undefined;
}

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
  }.bind(this), 1000);
};


Game.prototype._generateRandomTetromino = function () {
  var tetrominoConstructor = availableTetrominos[Math.floor(Math.random() * availableTetrominos.length)];
  this.actualTetromino = new tetrominoConstructor();
  this.actualTetromino.board = this.board;
};

Game.prototype.thereAreFullLines = function () {
  //TODO returns lines that are full (aka don't have any false value) else returns false
};

Game.prototype.deleteLine = function () {
  var linesToDelete = this.thereAreFullLines();
  if (linesToDelete !== false) {
    //TODO delete the line and keep the board height correctly
  }
};

Game.prototype._gameOver = function () {
    clearInterval(this.intervalID);
    alert("GAME OVER");
};

Game.prototype._fixToBottom = function () {
  var rowStart = this.actualTetromino.offset.y < 0 ? Math.abs(this.actualTetromino.offset.y) : 0;
  var length = this.actualTetromino.body.length;
  clearInterval(this.intervalID);
  for (var tRow = rowStart; tRow < length; tRow++) {
    for (var tCol = 0; tCol < length; tCol++) {
      if (this.actualTetromino.body[tRow][tCol] !== false) {
        this.board[this.actualTetromino.offset.y + tRow][this.actualTetromino.offset.x + tCol] = this.actualTetromino.name;
      }
    }
  }
  $('.actual').removeClass('actual');
  this._generateRandomTetromino();
};
