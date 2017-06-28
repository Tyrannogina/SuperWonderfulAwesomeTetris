var game;

$(document).ready(function() {
  game = new Game(20, 10);
  game.drawBoard();
  $('#play-button').on('click', function() {
    game.start();
    $(this).prop('disabled', true);
  });
  $('#pause-button').on('click', function(e) {
    e.preventDefault();
    game.togglePause();
  });
});
