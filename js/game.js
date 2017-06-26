function Game(rows, columns) {
  this.rows = rows;
  this.columns = columns;
  this.generateBoard();
  this.intervalID = undefined;
}

Game.prototype.generateBoard = function () {
  $('.game-area').css({"min-width": (this.columns * 8) + 'rem'});
  $('.panel').css({"min-width": (this.columns * 2.5) + 'rem'});
  $('.panel-center').css({"min-width": (this.columns * 3) + 'rem'});
  $('#game-board').css({ "width": (this.columns * 2.5) + "rem", "height": (this.rows * 2.5) + "rem"});
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.columns; j++) {
      $('#game-board').append(
        $('<div>').addClass('cell').attr('data-row', i).attr('data-col', j)
      );
    }
  }
};

Game.prototype.start = function () {
  this.actualTetromino = undefined;
  this.generateRandomTetromino(); //Sets actualTetromino
  this.intervalID = setInterval(this.actualTetromino.moveTetromino('down'), 100);
};

Game.prototype.generateRandomTetromino = function () {
  var tetrominoConstructor = availableTetrominos[Math.floor(Math.random() * availableTetrominos.length)];
  this.actualTetromino = new tetrominoConstructor();
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

Game.prototype.fixToBottom = function () {
  /*TODO fix actual piece to grid and call to generateRandomTetromino again to
  set a new actual piece*/
};
