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
  this.firstMove  = true;
  this.gameLost   = false;
  this.offset = {
    y: /*-3*/15,
    x: 3
  };
}

Tetromino.prototype.allowMoveRigth = function () {
  //TODO if moved piece does not collide, change actualTetromino position.
};
Tetromino.prototype.allowMoveLeft = function() {};

Tetromino.prototype.allowMoveDown = function() {
  var newOffset = this.offset;
  newOffset.y++;
  if (this.collides(newOffset)) {
    if (this.firstMove && newOffset.y < 0) {
      this.gameLost = true;
    } else {
      this.fix = true;
      this.firstMove = false;
      return false;
    }
  }
  return newOffset;
};

Tetromino.prototype.moveTetromino = function (direction) {
  var newOffset;
  switch (direction) {
    case 'right':
      newOffset = this.allowMoveRigth();
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
  for (var tRow = offset.y < 0 ? Math.abs(offset.y) : 0; tRow < length; tRow++) {
    for (var tCol = 0; tCol < length; tCol++) {
      if (body[tRow][tCol] !== false) {
        if (offset.y + tRow > this.board.length - 1 ||
          offset.x + tCol > this.board[offset.y + tRow] - 1 ||
          offset.x + tCol < 0 ||
          this.board[offset.y + tRow][offset.x + tCol] !== false) {
          return true;
        }
      }
    }
  }
/*  body.forEach(function(tRow, tRowIndex) {
    if (tRowIndex >= 0 && tRow.some(function(element) {return })) {
      row.forEach(function (tCol, tColIndex) {

      });
    }
  });*/
  return false;
};



/* Set inheritance of all tetromino types of common tetromino function */
availableTetrominos.forEach(function(tetrConstr) {
  tetrConstr.prototype = Object.create(Tetromino.prototype);
});
