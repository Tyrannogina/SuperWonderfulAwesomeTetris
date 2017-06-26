var availableTetrominos = [
  function () {
    this.name = 'I';
    this.initialOffset = {
      x: 0,
      y: 0
    };
    this.body = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      ['I', 'I', 'I', 'I'],
      [0, 0, 0, 0]
    ];
  },
  function () {
    this.name = 'B';
    this.initialOffset = {
      x: 0,
      y: 0
    };
    this.body = [
      ['B', 'B'],
      ['B', 'B']
    ];
  }
];

function Tetromino () {
  this.name = undefined;
  this.initialOffset = undefined;
  this.body = undefined;
}

Tetromino.prototype.allowMoveRigth = function () {
  //TODO if moved piece does not collide, change actualTetromino position.
};
Tetromino.prototype.allowMoveLeft = function() {};
Tetromino.prototype.allowMoveDown = function() {};
Tetromino.prototype.moveTetromino = function (direction) {
  var newCoordinates;
  switch (direction) {
    case 'right':
      newCoordinates = this.allowMoveRigth();
      break;
    case 'left':
      newCoordinates = this.allowMoveLeft();
      break;
    case 'down':
      newCoordinates = this.allowMoveDown();
      break;
  }
  if (newCoordinates !== false) {

  }
};
Tetromino.prototype.rotateTetrominoClockwise = function (tetromino) {
  var length = tetromino.length;
  var result = [];
  for (var i = 0; i < length; i++) {
    result.push([]);
  }
  for (var row = 0; row < length; row++) {
      for (var col = 0; col < length; col++) {
        result[row][col] = tetromino[length - col - 1][row];
      }
  }
  return result;
};

Tetromino.prototype.rotateTetrominoCounterclockwise = function (tetromino) {
  var length = tetromino.length;
  var result = [];
  for (var i = 0; i < length; i++) {
    result.push([]);
  }
  for (var row = 0; row < length; row++) {
    for (var col = 0; col < length; col++) {
      result[row][col] = tetromino[col][length - row - 1];
    }
  }
  return result;
};
Tetromino.prototype.collides = function () {
  //TODO if rotated piece does not collide
  /*It will have to execute inside moveDown, so if on moveDown collides, then
  it calls fixToBottom. Also called from moveLeft or right and impedes
  movement if collide.*/
};
Tetromino.prototype.allowRotation = function () {
  //TODO if rotated piece does not collide, set rotated piece as actualTetromino
};

Tetromino.prototype.allowMove = function () {
  //TODO if moved piece does not collide, change actualTetromino position.
};

/* Set inheritance of all tetromino types of common tetromino function */
availableTetrominos.forEach(function(func) {
  func.prototype = Object.create(Tetromino.prototype);
});
