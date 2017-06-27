var availableTetrominos = [
  function () {
    Tetromino.call(this);
    this.name = 'I';
    this.body = [
      [false, false, false, false],
      [false, false, false, false],
      ['I', 'I', 'I', 'I'],
      [false, false, false, false]
    ];
    this.cssClass = 'tetroI';
  },
  function () {
    Tetromino.call(this);
    this.name = 'B';
    this.offset = {
      y: /*-2*/15,
      x: 4
    };
    this.body = [
      ['B', 'B'],
      ['B', 'B']
    ];
    this.cssClass = 'tetroB';
  }
];

function Tetromino () {
  this.fix        = false;
  this.gameLost   = false;
  this.offset = {
    y: /*-3*/15,
    x: 3
  };
}

Tetromino.prototype.allowMoveRight = function () {
  //TODO if moved piece does not collide, change actualTetromino position.
};
Tetromino.prototype.allowMoveLeft = function() {};

Tetromino.prototype.allowMoveDown = function() {
  var newOffset = this.offset;
  newOffset.y++;
  if (this.collides(newOffset)) {
    if (newOffset.y < 0) {
      this.gameLost = true;
    } else {
      this.fix = true;
    }
    console.log('moveDown not allowed');
    return false;
  }
  console.log('moveDown allowed');
  return newOffset;
};

Tetromino.prototype.moveTetromino = function (direction) {
  var newOffset;
  switch (direction) {
    case 'right':
      newOffset = this.allowMoveRight();
      break;
    case 'left':
      newOffset = this.allowMoveLeft();
      break;
    case 'down':
      newOffset = this.allowMoveDown();
      break;
  }
  console.log(newOffset);
  if (newOffset !== false) {
    this.offset = newOffset;
  }
};

Tetromino.prototype.allowRotation = function (direction) {
  var rotatedTetromino;
  switch (direction) {
    case 'clockwise':
      rotatedTetromino = rotateTetrominoClockwise();
      break;
    case 'counterclockwise':
      rotatedTetromino = rotateTetrominoCounterclockwise();
      break;
  }
  if (this.collides(undefined, rotatedTetromino)) {
    return false;
  }
  this.body = rotatedTetromino;
};

Tetromino.prototype.rotateTetrominoClockwise = function () {
  var length = this.body.length;
  var rotatedTetromino = [];
  for (var i = 0; i < length; i++) {
    rotatedTetromino.push([]);
  }
  for (var row = 0; row < length; row++) {
      for (var col = 0; col < length; col++) {
        rotatedTetromino[row][col] = this.body[length - col - 1][row];
      }
  }
  return rotatedTetromino;
};

Tetromino.prototype.rotateTetrominoCounterclockwise = function () {
  var length = this.body.length;
  var rotatedTetromino = [];
  for (var i = 0; i < length; i++) {
    rotatedTetromino.push([]);
  }
  for (var row = 0; row < length; row++) {
    for (var col = 0; col < length; col++) {
      rotatedTetromino[row][col] = this.body[col][length - row - 1];
    }
  }
  return rotatedTetromino;
};

Tetromino.prototype.collides = function (offset, body) {
  if (body === undefined) {
    body = this.body;
  }
  if (offset === undefined) {
    offset = this.offset;
  }
  var length = body.length;
  //For each row of the tetromino not going over the upper edge of the board
  for (var tRow = offset.y < 0 ? Math.abs(offset.y) : 0; tRow < length; tRow++) {
    var lineNotEmpty = body[tRow].some(function(element) {return element !== false;});
    var surpasedBoardLengthDown = (offset.y + tRow) >= this.board.length;
    if (lineNotEmpty && surpasedBoardLengthDown) {
        return true;
    } else if (lineNotEmpty) { //We check the columns on that row
      for (var tCol = 0; tCol < body[tRow].length; tCol++) {
        var needToCheckTetrominoPosition = body[tRow][tCol] !== false;
        var insideBoardLeftAndRight = (offset.x + tCol) < this.board[(offset.y + tRow)].length &&
         (offset.x + tCol) >= 0;
        var boardPositionNotEmpty = this.board[(offset.y + tRow)][(offset.x + tCol)] !== false;
        if (needToCheckTetrominoPosition && insideBoardLeftAndRight && boardPositionNotEmpty) {
          return true;
        }
      }
    }
  }
  return false;
};

/* Set inheritance of all tetromino types of common tetromino function */
availableTetrominos.forEach(function(tetrConstr) {
  tetrConstr.prototype = Object.create(Tetromino.prototype);
});
