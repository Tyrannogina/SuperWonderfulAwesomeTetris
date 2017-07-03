# Super Wonderful Awesome Tetris
First individual project on the Ironhack web-dev summer bootcamp, in which we have to create a game from scratch. I decided to go with Tetris. We had one week to do that.
  - Analysis: 23-25th of June.
  - Development: 26-30th of June. The version of 30th of June 2017 is the one uploaded in Github pages.

For playing, you just have to go to https://tyrannogina.github.io/SuperWonderfulAwesomeTetris/

## Game status (30th of June 2017):
### Implemented features:
  - All different tetrominos (tetris pieces).
  - Tetromino rotation clockwise and counterclockwise.
  - Tetrominos moving down, left and right.
  - Tetrominos not colliding or going out of the board.
  - Erasure of full lines.
  - Next 3 tetrominos display.
  - Pause functionality.
  - Reset game: starts a new game.
  - Level updating the speed of the game gradually.
  - Score
  - Give the game a theme and make it visually appealing.

### Known bugs:
  - If you move one tetromino to the right or left before it appears on the screen and it goes out of limits and a game over is triggered when the automatic moveDown function is executed.
  - The displayed level is always one level short of what it should be (level 1 stays for two levels).
  - The points for erasing full lines are not adding properly. It sums 130 instead of 330 for 3 lines.

### Future features:
Features I would like to implement:
  - Automatic dropdown with the space bar.
  - Start modal that allows to select different starting difficulties and start the game.
  - Reset button really reseting to a clean state, not starting a new game.
  - Game over modal with a start new game button.
  - Implement different styles for the tetrominos depending on the level range.
  - Implement security checks to avoid player updating level through browser console.

### Code refactoring:
  - SASS and maybe Skeleton so it is easier to do the layout responsive.
  - Reduce image sizes to improve load time.
  - Change background image of .metal-box class to add the pink hue instead of doing that through javascript.
  - Maybe try functional programming, if I can wrap my head around it.
