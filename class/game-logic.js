const Screen = require('./screen');
const Bejeweled = require('./bejeweled');

class GameLogic {

    constructor() {
        this.grid = [];
        this.emojis;
    }

    static freeCursor = true;

    static gravity() {
        // If the grid is full, check again for matches
        if (GameLogic.isGridFull()) {
            GameLogic.processMatches();
            return;
        }

        setTimeout(() => {
            // Otherwise, apply gravity
            // Go across the bottom row
            for (let colIndex = 0; colIndex < this.grid[0].length; colIndex++) {

                // For each column, look up for an empty cell
                for (let rowIndex = this.grid.length - 1; rowIndex >= 0; rowIndex--) {

                    // If the cell is empty
                    if (this.grid[rowIndex][colIndex] === '  ') {

                        // Find the next emoji above it
                        let validRow;
                        for (let i = rowIndex - 1; i >= 0; i--) {
                            if (this.grid[i][colIndex] !== '  ') {
                                validRow = i;
                                break;
                            }
                        }

                        // If there is one, drop it down by 1
                        if (typeof validRow === 'number') {
                            this.grid[validRow + 1][colIndex] = this.grid[validRow][colIndex];
                            this.grid[validRow][colIndex] = '  ';

                            // Keep dropping things down
                            rowIndex = validRow + 1;
                        }
                        // If not, make the top row's cell a random emoji
                        else {
                            this.grid[0][colIndex] = GameLogic.randomEmoji();
                        }
                    }
                }
            }

            GameLogic.setScreenGrid();
            // Update the screen grid

            // Keep applying gravity until the grid is full
            GameLogic.gravity();

        }, 250);
    }

    static horizontalMatches() {
        const matches = [];

        // Go through each row
        this.grid.forEach((row, rowIndex) => {
            let tally = 1;
            let possibleMatches = [[rowIndex, 0, tally]];

            for (let colIndex = 1; colIndex < row.length; colIndex++) {

                if (row[colIndex] === row[colIndex - 1]) {
                    tally++;
                }
                else {
                    tally = 1;
                    possibleMatches = [];
                }

                possibleMatches.push([rowIndex, colIndex, tally]);

                if (tally >= 3) {
                    matches.push(...possibleMatches);
                    possibleMatches = [];
                }
            }
        });

        return matches;
    }

    static initializeGrid(length, height, emojis) {
        // Initialize a grid of random emojis
        this.grid = [];
        this.emojis = emojis;
        for (let i = 0; i < height; i++) {
            this.grid.push([]);
            for (let j = 0; j < length; j++) {
                // Pick random emoji
                const emoji = GameLogic.randomEmoji();
                this.grid[i].push(emoji);
            }
        }

        // Regenerate the grid until there are no matches
        const matches = GameLogic.matches();
        if (matches[0]) {
            GameLogic.initializeGrid(length, height, emojis);
        }
    }

    static isGridFull() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] === '  ') {
                    return false;
                }
            }
        }

        return true;
    }

    // Returns an array of current matches on the grid, with duplicates removed
    static matches() {
        const verticalMatches = GameLogic.verticalMatches();
        const horizontalMatches = GameLogic.horizontalMatches();
        const allMatches = horizontalMatches.concat(verticalMatches);

        const filteredMatches = GameLogic.removeDups(allMatches);
        return filteredMatches;
    }

    static popMatches(matches) {
        // Pop the matches
        matches.forEach(match => {
            const row = match[0];
            const col = match[1];
            this.grid[row][col] = '💥';

            // Increase score by tally
            Screen.score += match[2];
        })

        // Set the screen grid
        GameLogic.setScreenGrid();

        // Remove the explosion emojis
        setTimeout(() => {
            GameLogic.removeMatches(matches);
        }, 250);
    }

    static processMatches() {
        // Get matches
        const matches = GameLogic.matches();

        // If there are any matches
        if (matches[0]) {
            setTimeout(() => {
                GameLogic.popMatches(matches)
            }, 250);
            return true;
        }
        else {
            GameLogic.freeCursor = true;
            return false;
        }
    }

    static randomEmoji() {
        const index = Math.floor(Math.random() * this.emojis.length);
        return this.emojis[index];
    }

    // Removes duplicates within an array
    static removeDups(arr) {
        const result = [arr[0]];
        // For each new element
        for (let i = 1; i < arr.length; i++) {
            let isDup = false;

            // Check if it's a duplicate
            for (let j = 0; j < result.length; j++) {
                if (result[j][0] === arr[i][0] && result[j][1] === arr[i][1]) {
                    isDup = true;

                    // Increase the score because it's a combo
                    result[j][2] += 6;
                }
            }

            if (!isDup) {
                result.push(arr[i]);
            }
        }

        return result;
    }

    static removeMatches(matches) {
        // Remove the explosion emojis
        matches.forEach(match => {
            const row = match[0];
            const col = match[1];
            this.grid[row][col] = '  ';
        })

        // Set the screen grid
        GameLogic.setScreenGrid();

        // Drop down new emojis
        GameLogic.gravity();
    }

    static setScreenGrid() {
        this.grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                Screen.setGrid(i, j, cell);
            })
        })

        Screen.render();
    }

    static swap(selected, row, col) {
        const selectedRow = selected[0];
        const selectedCol = selected[1];

        const selectedEmoji = this.grid[selectedRow][selectedCol];
        const newEmoji = this.grid[row][col];

        this.grid[row][col] = selectedEmoji;
        this.grid[selectedRow][selectedCol] = newEmoji;

        // console.log(grid);

        GameLogic.setScreenGrid();
    }

    static verticalMatches() {
        const matches = [];

        // Go down each column
        for (let colIndex = 0; colIndex < this.grid[0].length; colIndex++) {
            let tally = 1;
            let possibleMatches = [[0, colIndex, tally]];

            for (let rowIndex = 1; rowIndex < this.grid.length; rowIndex++) {
                if (this.grid[rowIndex][colIndex] === this.grid[rowIndex - 1][colIndex]) {
                    tally++;
                }
                else {
                    tally = 1;
                    possibleMatches = [];
                }

                possibleMatches.push([rowIndex, colIndex, tally]);

                if (tally >= 3) {
                    matches.push(...possibleMatches);
                    possibleMatches = [];
                }
            }
        }

        return matches;
    }
}

module.exports = GameLogic;
