const chai = require('chai');
const expect = chai.expect;
const GameLogic = require('../class/game-logic');

describe("GameLogic class", () => {
    let grid1;
    let grid2;
    let grid3;

    beforeEach(() => {
        grid1 =
            [['💅', '🥑', '💅', '🥑', '💦', '🥑', '💦', '😩'],
            ['💦', '💋', '💦', '🥑', '💅', '💅', '💋', '😩'],
            ['💅', '😩', '💦', '😩', '😩', '💦', '😩', '🥑'],
            ['💋', '💅', '💅', '😩', '💦', '🥑', '💅', '🥑'],
            ['💦', '🥑', '💋', '💋', '💅', '💋', '😩', '💅'],
            ['💅', '🥑', '💋', '💅', '😩', '💋', '💦', '💦'],
            ['💋', '🥑', '💅', '💅', '💦', '😩', '💅', '💅'],
            ['🥑', '💋', '😩', '💋', '💋', '💋', '💦', '😩']];

        grid2 =
            [['😩', '💋', '🥑', '💦', '💅', '😩', '🥑', '🥑'],
            ['😩', '💅', '😩', '🥑', '💦', '😩', '💦', '😩'],
            ['💅', '🥑', '💦', '💋', '💅', '🥑', '😩', '💦'],
            ['💦', '🥑', '🥑', '💦', '🥑', '😩', '😩', '💦'],
            ['💋', '💦', '🥑', '💦', '💋', '🥑', '😩', '🥑'],
            ['🥑', '🥑', '🥑', '💦', '💦', '💦', '💅', '😩'],
            ['💋', '💅', '💦', '😩', '💅', '💦', '💋', '💋'],
            ['💋', '💋', '💋', '💋', '💋', '💅', '😩', '💦']];

        grid3 =
            [['💅', '🥑', '💅', '🥑', '💦', '🥑', '💦', '😩'],
            ['💦', '💋', '💦', '🥑', '💅', '💅', '💋', '😩'],
            ['💅', '😩', '💦', '😩', '😩', '💦', '😩', '🥑'],
            ['💋', '💅', '💅', '😩', '💦', '🥑', '💅', '🥑'],
            ['💦', '🥑', '💋', '💋', '💅', '💋', '😩', '💅'],
            ['💅', '💦', '💋', '💅', '😩', '💋', '💦', '💦'],
            ['💋', '🥑', '💅', '💅', '💦', '😩', '💅', '💅'],
            ['🥑', '💋', '😩', '💋', '😩', '💋', '💦', '😩']];
    });

    describe("horizontalMatches(grid) static method", () => {
        it("Should return an array of cells [row, col] that belong to horizontal matches", () => {
            const actual1 = GameLogic.horizontalMatches(grid1);
            const actual2 = GameLogic.horizontalMatches(grid2);

            expect(actual1).to.deep.equal(
                [[7, 3], [7, 4], [7, 5]]
            );
            expect(actual2).to.deep.equal(
                [[5, 0], [5, 1], [5, 2],
                [5, 3], [5, 4], [5, 5],
                [7, 0], [7, 1], [7, 2], [7, 3], [7, 4]]
            );
        });

        it("Should return an empty array if there are no matches", () => {
            const actual = GameLogic.horizontalMatches(grid3);
            expect(actual).to.deep.equal([]);
        });
    });

    describe("verticalMatches(grid) static method", () => {
        it("Should return an array of cells [row, col] that belong to vertical matches", () => {
            const actual1 = GameLogic.verticalMatches(grid1);
            const actual2 = GameLogic.verticalMatches(grid2);

            expect(actual1).to.deep.equal(
                [[4, 1], [5, 1], [6, 1]]
            );
            expect(actual2).to.deep.equal(
                [[3, 2], [4, 2], [5, 2],
                [3, 3], [4, 3], [5, 3],
                [2, 6], [3, 6], [4, 6]]
            );
        });

        it("Should return an empty array if there are no matches", () => {
            const actual = GameLogic.horizontalMatches(grid3);
            expect(actual).to.deep.equal([]);
        });
    });

    describe("matches(grid) static method", () => {
        it("Should return an array of cells [row, col] that belong to all matches without duplicates", () => {
            const actual1 = GameLogic.matches(grid1);
            const actual2 = GameLogic.matches(grid2);

            expect(actual1).to.deep.equal(
                [[7, 3], [7, 4], [7, 5], [4, 1], [5, 1], [6, 1]]
            );
            expect(actual2).to.deep.equal(
                [[5, 0], [5, 1], [5, 2],
                [5, 3], [5, 4], [5, 5],
                [7, 0], [7, 1], [7, 2], [7, 3], [7, 4],
                [3, 2], [4, 2],
                [3, 3], [4, 3],
                [2, 6], [3, 6], [4, 6]]
            );
        });
    });
});
