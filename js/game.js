var BOARD_SIZE = {
  height: 20,
  width: 10
};
function I () {
  Tetromino.call(this); //This passes all the atributes from Tetromino.
  this.body = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    ['I', 'I', 'I', 'I'],
    [0, 0, 0, 0]
  ];
}

I.prototype = Object.create(Tetromino.prototype);
var B = [
  ['B', 'B'],
  ['B', 'B']
];

function Game() {
  this.board = this.generateBoard();
  //QUESTION should I do this or just create it inside the start function?
  this.intervalID = undefined;

}
Game.prototype.generateBoard = function () {
  for (var i = 0; i < BOARD_SIZE.height; i++) {
    for (var j = 0; j < BOARD_SIZE.width; j++) {
      //TODO generate board
    }
  }
  return board;
};
Game.prototype.start = function () {
  //TODO on click for start-button. Sets interval and executes moveDown and
  //collides in an interval. Returns the interval ID .    (100)
  this.actualTetromino = new Tetromino();
};

function Tetromino () {
  //QUESTION Should be Tetromino the parent object of longPiece and Block Objects?
  this.initialCoordinates = {
    x: 0,
    y: 0
  };
  this.generateRandomTetromino();
}

//TODO Implement this functions
Tetromino.prototype.generateRandomTetromino();
Tetromino.prototype.allowMoveRigth = function () {
  //TODO if moved piece does not collide, change actualTetromino position.
};
Tetromino.prototype.allowMoveLeft();
Tetromino.prototype.allowMoveDown();
Tetromino.prototype.moveTetromino = function (direction) {
  var newCoordinates;
  switch (direction) {
    case 'right':
      newCoordinates = allowMoveRigth();
      break;
    case 'left':
      newCoordinates = allowMoveLeft();
      break;
    case 'down':
      newCoordinates = allowMoveDown();
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
