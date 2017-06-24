var matrix = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15]
];
var longPiece = [
  [0,0,0,0],
  [0,0,0,0],
  [1,1,1,1],
  [0,0,0,0]
];

function rotateMatrixClockwise(matrix) {
  var length = matrix.length;
  var result = [];
  for (var i = 0; i < length; i++) {
    result3.push([]);
  }
  for (var row = 0; row < length; row++) {
      for (var col = 0; col < length; col++) {
        result[row][col] = matrix[length - col - 1][row];
      }
  }
  return result;
}

function rotateMatrixCounterclockwise(matrix) {
  var length = matrix.length;
  var result = [];
  for (var i = 0; i < length; i++) {
    result.push([]);
  }
  for (var row = 0; row < length; row++) {
    for (var col = 0; col < length; col++) {
      result[row][col] = matrix[col][length - row - 1];
    }
  }
  return result;
}

var rotated = rotateMatrixClockwise(matrix);
console.table(rotated);
