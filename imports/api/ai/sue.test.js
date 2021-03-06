import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import * as Board from '../board.js';
import * as AI from './sue.js';

describe('Sequential Sue AI', function() {
  describe('constant name', function() {
    it('should be "sue"', function() {
      assert(AI.name, 'sue');
    });
  });
  describe('constant full_name', function() {
    it('should be "Sequential Sue"', function() {
      assert(AI.name, 'Sequential Sue');
    });
  });
  describe('function makeMove', function() {
    it('returns 0,0 for first move', function() {
      const board = Board.makeEmptyBoard();
      const state = {};
      const move = AI.makeMove(board, state);
      assert.deepEqual(move, [0, 0]);
    });
    it('returns 0,9 for tenth move', function() {
      const board = Board.makeEmptyBoard();
      Board.setRange(board, 0, 0, 1, 9, 'X');
      const state = {};
      const move = AI.makeMove(board, state);
      assert.deepEqual(move, [0, 9]);
    });
    it('returns 1,0 for eleventh move', function() {
      const board = Board.makeEmptyBoard();
      Board.setRange(board, 0, 0, 1, 10, 'X');
      const state = {};
      const move = AI.makeMove(board, state);
      assert.deepEqual(move, [1, 0]);
    });
    it('returns 9,9 for hundredth move', function() {
      const board = Board.makeEmptyBoard();
      Board.setRange(board, 0, 0, 10, 10, 'X');
      Board.setRange(board, 9, 9, 1, 1, 'E');
      const state = {};
      const move = AI.makeMove(board, state);
      assert.deepEqual(move, [9, 9]);
    });
    it('throws error when board full', function() {
      const board = Board.makeEmptyBoard();
      Board.setRange(board, 0, 0, 10, 10, 'X');
      const state = {};
      const makeMove = function() {
        AI.makeMove(board, state);
      };
      assert.throws(makeMove, Meteor.error, 'no-moves-left');
    });
  });
});