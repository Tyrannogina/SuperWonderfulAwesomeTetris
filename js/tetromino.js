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
      y: -2,
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
    y: -3,
    x: 3
  };
}

Tetromino.prototype.allowMoveRight = function () {
  var newOffset = {
    y: this.offset.y,
    x: this.offset.x + 1
  };
  if (this.collides(newOffset)) {
    return false;
  }
  return newOffset;
};
Tetromino.prototype.allowMoveLeft = function() {
  var newOffset = {
    y: this.offset.y,
    x: this.offset.x - 1
  };
  if (this.collides(newOffset)) {
    return false;
  }
  return newOffset;
};

Tetromino.prototype.allowMoveDown = function() {
  var newOffset = {
    y: this.offset.y + 1,
    x: this.offset.x
  };
  if (this.collides(newOffset)) {
    if (newOffset.y < 0) {
      this.gameLost = true;
    } else {
      this.fix = true;
    }
    return false;
  }
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
  if (newOffset !== false) {
    this.offset = newOffset;
  }
};

Tetromino.prototype.rotateTetromino = function (direction) {
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

Tetromino.prototype.collides = function (myOffset, body) {
  if (body === undefined) {
    body = this.body;
  }
  if (myOffset === undefined) {
    myOffset = this.offset;
  }
  var length = body.length;
  //For each row of the tetromino not going over the upper edge of the board
  for (var tRow = myOffset.y < 0 ? Math.abs(myOffset.y) : 0; tRow < length; tRow++) {
    var lineNotEmpty = body[tRow].some(function(element) {return element !== false;});
    var surpasedBoardLengthDown = (myOffset.y + tRow) >= this.board.length;
    if (lineNotEmpty && surpasedBoardLengthDown) {
        return true;
    } else if (lineNotEmpty) { //We check the columns on that row
      for (var tCol = 0; tCol < length; tCol++) {
        var needToCheckTetrominoPosition = body[tRow][tCol] !== false;
      //  var to
        var insideBoardLeftAndRight = (myOffset.x + tCol) < this.board[(myOffset.y + tRow)].length &&
         (myOffset.x + tCol) >= 0;
        var boardPositionNotEmpty = this.board[(myOffset.y + tRow)][(myOffset.x + tCol)] !== false;
        if (needToCheckTetrominoPosition && !insideBoardLeftAndRight && boardPositionNotEmpty) {
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
