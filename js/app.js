var game;

$(document).ready(function() {
  var rows = 20;
  var cols = 10;
  game = new Game(rows, cols);
  game.drawBoard();
  $('.instructions ul').hide();
  $('.next-tetrominos .next').hide();
  $('#play-button').on('click', function() {
    game.assignControlsToKeys();
    game.start();
    $(this).prop('disabled', true);
    $('#reset-button').prop('disabled', false);
    $('.next-tetrominos .next').show();
  });
  $('#pause-button').on('click', function(e) {
    e.preventDefault();
    game.togglePause();
  });
  $('#reset-button').on('click', function(e) {
    e.preventDefault();
    game.reset(rows, cols);
    $('.next-tetrominos .next').show();

  });
  $('.instructions').on('click', function() {
    $('.instructions ul').toggle();
  });
});
