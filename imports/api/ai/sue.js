import { Meteor } from 'meteor/meteor';

/**
 * Symbolic name of this AI.
 * @constant {String}
 * @default
 */
export const name = 'sue';

/**
 * User-friendly name of this AI.
 * @constant {String}
 * @default
 */
export const full_name = 'Sequential Sue';

/**
 * Return the move that Sue would like to make next.
 *
 * @param {Object[][]} board - Two-dimensional array representing the board.
 * @param {string} board[][].state - State value for a board square.
 * @param {Object} state - Opaque internal state maintained by AI.
 *
 * @returns {number[]} Two-element array representing [row,col] of move.
 *
 * @throws {Meteor.error} No more moves are possible
 */
export function makeMove(board) {
  const squares = board.squares;
  let row = 0;
  let col = 0;
  // Look for the first empty square in row-column order
  for (row = 0; row < squares.length; row++) {
    for (col = 0; col < squares[row].length; col++) {
      if (squares[row][col].state === "E") return {row: row, col: col};
    }
  }
  throw new Meteor.Error('no-moves-left', 'No more moves are possible');
}