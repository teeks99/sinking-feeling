import * as Board from './board.js';
import {Games} from './games.js';

// only exported for testing, don't call this
export function spacesAreSame(space1, space2){
  if((space1.row == space2.row) && (space1.col == space2.col))
  {
    return true;
  }
  return false;
}

// only exported for testing, don't call this
export function spaceIsOnShip(space, ships){
  for(var ship in ships)
  {
    for(let i = 0; i < Board.ship_lengths[ship]; i++) {
      var ship_space = { row: ships[ship].row, col: ships[ship].col };
      if(ships[ship].vertical){
        ship_space.row += i;
      }
      else{
        ship_space.col += i;
      }
      if(spacesAreSame(space, ship_space))
      {
        return true;
      }
    }
  }
  return false;
}

export function overlap(ship, row, col, vertical, ships) {
  for(let i = 0; i < Board.ship_lengths[ship]; i++) {
    var ship_space = { row: row, col: col };
    if(vertical){
      ship_space.row += i;
    }
    else{
      ship_space.col += i;
    }
    if(spaceIsOnShip(ship_space, ships))
    {
      return true;
    }
  }
  return false;
}

export function checkOverlap(ship_type, row, col, vertical, positions) {
  if (typeof positions[ship_type] != 'undefined'){
    // This is moving a ship, we don't want to include the pre-move ship in the
    // overlap test. This makes a copy that we can remove it from.
    positions = JSON.parse(JSON.stringify(positions));
    delete positions[ship_type];
  }
  if(overlap(ship_type, row, col, vertical, positions)){
    throw 'Ships Overlapping';
  }
}

export function placeShip(ship_type, row, col, vertical, positions) {
  checkOverlap(ship_type, row, col, vertical, positions);

  if (typeof positions[ship_type] == 'undefined') {
    positions[ship_type] = {};
  }
  if(Board.ship_types.indexOf(ship_type) < 0) {
    throw 'Unrecognised ship type';
  }

  positions[ship_type].row = row;
  positions[ship_type].col = col;
  positions[ship_type].vertical = vertical;
}

export function randomShips(game){
  //TODO: This is only random in that I randomly selected the upper-left
  // corner to place the ships at.
  // https://xkcd.com/221/

  placeShip("carrier", 0, 0, true, game.creator.ships);
  placeShip("battleship", 0, 1, true, game.creator.ships);
  placeShip("cruiser", 0, 2, true, game.creator.ships);
  placeShip("submarine", 0, 3, true, game.creator.ships);
  placeShip("destroyer", 0, 4, true, game.creator.ships);

  placeShip("carrier", 0, 0, true, game.challenger.ships);
  placeShip("battleship", 0, 1, true, game.challenger.ships);
  placeShip("cruiser", 0, 2, true, game.challenger.ships);
  placeShip("submarine", 0, 3, true, game.challenger.ships);
  placeShip("destroyer", 0, 4, true, game.challenger.ships);
}

export function create(creator, id=null){
  var game = {
    created_at: new Date(),
    turn_number: 0,
    creator_ready: false,
    challenger_ready: false,
    creator: {user: creator, ships: {}, shots: []},
    challenger: {ships: {}, shots: []},
  };

  randomShips(game);

  if(id){
    game._id = id;
  }

  Games.insert(game);
  return game;
}

export function shot(game, player, row, col){
  if (typeof game[player] == 'undefined')
  {
    game[player] = {};
  }

  if (typeof game[player].shots == 'undefined')
  {
    game[player].shots = [];
  }

  var shot = {row: row, col: col};
  game[player].shots.push(shot);
}

// only exported for testing, don't call this
export function addOwnShips(board, ships){
  for(var ship in ships)
  {
    var row = ships[ship].row;
    var col = ships[ship].col;
    for(let i = 0; i < Board.ship_lengths[ship]; i++)
    {
      board[row][col].val = 'S';
      if(ships[ship].vertical)
      {
        row++;
      }
      else
      {
        col++;
      }
    }
  }
}

// only exported for testing, don't call this
export function addShots(board, shots, ships){
  shots.forEach(function(shot){
    if(spaceIsOnShip(shot, ships))
    {
      board[shot.row][shot.col].val = 'H';
    }
    else
    {
      board[shot.row][shot.col].val = 'M';
    }
  });
}

// only exported for testing, don't call this
export function oppositeUser(user){
  var opposite_user = "";
  if(user == "creator")
  {
    opposite_user = "challenger";
  }
  else
  {
    opposite_user = "creator";
  }
  return opposite_user;
}

export function getOwnBoard(game, user){
  var board = Board.makeEmptyBoard();
  addOwnShips(board, game[user].ships);
  addShots(board, game[oppositeUser(user)].shots, game[user].ships);
  return board;
}

export function getAttackBoard(game, user){
  var board = Board.makeEmptyBoard();
  addShots(board, game[user].shots, game[oppositeUser(user)].ships);
  return board;
}
