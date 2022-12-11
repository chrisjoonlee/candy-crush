const Screen = require("./screen");
const Cursor = require("./cursor");
const GameLogic = require("./game-logic");
const { matches } = require("./game-logic");

class Bejeweled {

  constructor() {

    this.playerTurn = "O";

    this.emojis = ['💦', '😩', '🍑', '🥑', '💅', '🍆', '🥵'];

    GameLogic.initializeGrid(8, 8, this.emojis);

    this.cursor = new Cursor(8, 8);

    // Screen commands
    Screen.addCommand('w', 'up', this.cursor.up);
    Screen.addCommand('s', 'down', this.cursor.down);
    Screen.addCommand('a', 'left', this.cursor.left);
    Screen.addCommand('d', 'right', this.cursor.right);
    Screen.addCommand('x', 'select', this.cursor.select);

    // Initialize screen
    Screen.initialize(8, 8);
    Screen.setGridlines(false);

    // Set screen grid
    GameLogic.setScreenGrid();

    this.cursor.setBackgroundColor();

    // Check for any matches & process them
    GameLogic.processMatches(this.emojis);
  }
}

module.exports = Bejeweled;
