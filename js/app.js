var game;

$(document).ready(function() {
  game = new Game(20, 10);
  $('#play-button').on('click', function() {
    game.start();
  });
});
