var game;

$(document).ready(function() {
  game = new Game(20, 10);
  game.drawBoard();
  $('#play-button').on('click', function() {
    game.start();
  });
});
