const Screen = require("./screen");
const Bejeweled = require("./bejeweled");
const GameLogic = require('./game-logic')

class Cursor {

  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;

    this.row = 0;
    this.col = 0;

    this.gridColor = 'black';
    this.cursorColor = 'yellow';
    this.selectColor = 'green';

    this.selected = null;
  }

  confirmSelection = () => {
    this.deselectBackgroundColor();
    this.selected = [this.row, this.col];
    this.selectBackgroundColor();
  }

  deselectBackgroundColor() {
    if (this.selected) {
      Screen.setBackgroundColor(this.selected[0], this.selected[1], this.gridColor);
    }
  }

  down = () => {
    if (GameLogic.freeCursor
      && this.row < this.numRows - 1) {
      this.resetBackgroundColor();
      this.row++;
      this.setBackgroundColor();
    }
  }

  left = () => {
    if (GameLogic.freeCursor
      && this.col > 0) {
      this.resetBackgroundColor();
      this.col--;
      this.setBackgroundColor();
    }
  }

  // Processes any matches after a swap, or reverse the swap
  // if there are no matches
  processSwap = oldSelected => {
    const result = GameLogic.processMatches();
    GameLogic.freeCursor = false;

    if (!result) {
      setTimeout(() => {
        GameLogic.swap(oldSelected, this.row, this.col);
        GameLogic.freeCursor = true;
      }, 250);
    }
  }

  resetBackgroundColor() {
    // Only reset color if the cell is not selected
    if (!this.selectedIsTheSame()) {
      Screen.setBackgroundColor(this.row, this.col, this.gridColor);
    }
  }

  right = () => {
    if (GameLogic.freeCursor
      && this.col < this.numCols - 1) {
      this.resetBackgroundColor();
      this.col++;
      this.setBackgroundColor();
    }
  }

  select = () => {
    if (this.selected) {
      // If you select the same cell again, deselect
      if (this.selected[0] === this.row && this.selected[1] === this.col) {
        this.selected = null;
      }
      // If you select an adjacent cell, swap
      else if (this.selectedIsAdjacent()) {
        this.swap();
      }
      // Otherwise, select the new cell and deselect the old one
      else {
        this.confirmSelection();
      }
    }
    // If you select a totally new cell, just select it
    else {
      this.confirmSelection();
    }
  }

  selectBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.selectColor);
  }

  selectedIsAdjacent = () => {
    if (this.selectedIsTheSame()) {
      return false;
    }

    let adjacentRow = this.selectedIsAdjacentRow();
    let adjacentCol = this.selectedIsAdjacentCol();

    if (adjacentRow && adjacentCol) {
      return false;
    }
    else if (adjacentRow && this.selected[1] === this.col) {
      return true;
    }
    else if (adjacentCol && this.selected[0] === this.row) {
      return true;
    }
    else {
      return false;
    }
  }

  selectedIsAdjacentCol = () => {
    return this.selected[1] === this.col + 1
      || this.selected[1] === this.col - 1;
  }

  selectedIsAdjacentRow = () => {
    return this.selected[0] === this.row + 1
      || this.selected[0] === this.row - 1;
  }

  selectedIsTheSame = () => {
    if (this.selected === null)
      return false;
    else if (this.selected[0] === this.row && this.selected[1] === this.col) {
      return true;
    }
    else {
      return false;
    }
  }

  setBackgroundColor() {
    // Only set color if the cell is not selected
    if (this.selected === null
      || this.row !== this.selected[0]
      || this.col !== this.selected[1]) {
      Screen.setBackgroundColor(this.row, this.col, this.cursorColor);
    }
  }

  swap = () => {
    GameLogic.swap(this.selected, this.row, this.col);
    this.deselectBackgroundColor();

    // Process any matches or reverse swap if there are no matches
    this.processSwap(this.selected);
    this.selected = null;
  }

  up = () => {
    if (GameLogic.freeCursor
      && this.row > 0) {
      this.resetBackgroundColor();
      this.row--;
      this.setBackgroundColor();
    }
  }
}

module.exports = Cursor;
