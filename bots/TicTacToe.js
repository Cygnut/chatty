import logger from '../Logger.js';
import Bot from '../bot/Bot.js';

class InputError extends Error {
  constructor(message) {
    super(message || '')
  }
}

const range = length => Array.from(Array(length).keys());

class TicTacToeGame {
  gridLength;
  #validPlayers = [ 'o', 'x' ];
  #grid;
  #unsetChar = '_';

  constructor(gridLength) {
    this.gridLength = gridLength;
    this.#resetGrid();
  }

  #resetGrid() {
    this.#grid = [];

    for (const r of range(this.gridLength)) {
      this.#grid[r] = [];

      for (const c of range(this.gridLength)) {
        this.#grid[r][c] = this.#unsetChar;
      }
    }
  }

  #doMove(move) {
    // Update the grid:
    if (this.#grid[move.y][move.x] !== this.#unsetChar)
      throw new InputError("Hey! That spot's taken!");

    this.#grid[move.y][move.x] = move.player;
  }

  #getWinner() {
    // Generates an array {0, 1, ..., length - 1}
    const gridRange = range(this.gridLength);
    const every = predicate => gridRange.every(predicate);

    // Check for each player.
    for (const player of this.#validPlayers) {
      // Check rows:
      for (const r of gridRange) {
        if (every(c => this.#grid[r][c] === player)) {
          return { player, reason: `Won on row ${r}.` };
        }
      }

      // Check columns:
      for (const c of gridRange) {
        if (every(r => this.#grid[r][c] === player))
          return { player, reason: `Won on column ${c}.` };
      }

      // Check diagonal going this way \
      if (every(d => this.#grid[d][d] === player)) {
        return { player, reason: 'Won on top-left diagonal.' };
      }

      // Check diagonal going this way /
      if (every(d => this.#grid[this.gridLength - 1 - d][d] === player)) {
        return { player, reason: 'Won on top-right diagonal.' };
      }
    }
    
    return null;
  }

  stringizeGrid() {
    return this.#grid
      .map(row => row.join(' '))
      .join('\n');
  }

  play(move) {
    if (!this.#validPlayers.some(p => p === move.player))
      throw new InputError(`${move.player} should be one of ${this.#validPlayers.join(', ')}`);

    // Play the move to update the grid.
    this.#doMove(move);

    // Check for a winner to see if we need to reset the game.
    const winner = this.#getWinner();

    // If there is one, report this and reset the game.
    if (winner)
      this.#resetGrid();

    return winner;
  }
}

export default class TicTacToe extends Bot {
  #game;
  #inputRegex = /[\s,]+/;    // Cache this for performance.
  #gameSize = 3;

  constructor() {
    super({
      name: 'ttt',
      description: "Play tic-tac-toe. Inputs must be of format e.g. 0,2 x, or blank, or start x to configure a new game of size x."
    });

    this.#game = new TicTacToeGame(this.#gameSize);
  }

  getTests() {
    return [];
  }

  parseInput(content) {
    // Message syntax: x y [x or o], x y are 0 based {0,1,2}
    const tokens = content.split(this.#inputRegex);
    if (tokens.length !== 3)
      throw new InputError(`${content} is badly formed input.`);

    const getCoordinate = c => {
      const i = parseInt(c);

      if (isNaN(i))
        throw new InputError(`${c} must be a valid integer.`);

      if (i < 0 || i >= this.#game.gridLength)
        throw new InputError(`${c} must be in {0,1,2}.`);

      return i;
    }

    return {
      x: getCoordinate(tokens[0]),
      y: getCoordinate(tokens[1]),
      player: tokens[2],
    };
  }

  async onDirectMessage({ content, from }) {
    try {
      if (content === '') {
        this.reply('\n' + this.#game.stringizeGrid());    // Don't include @ info as it's to everyone.
      } else if (content.startsWith('configure')) {
        // Create a new game with
        const size = parseInt(content.substring('configure'.length + 1));
        if (isNaN(size))
          throw new InputError('Size must be a valid integer.');

        this.#game = new TicTacToeGame(size);

        this.reply(`Starting new game of size ${size}`);    // Don't include @ info as it's to everyone.
      } else {
        // Parse the input to a move object
        const move = this.parseInput(content);

        // Play the move to update the grid.
        const winner = this.#game.play(move);

        let response = this.#game.stringizeGrid();
        if (winner)
          response += `${winner.player} won the game! ${winner.reason}`;

        this.reply(response);    // Don't include @ info as it's to everyone.
      }
    } catch (e) {
      logger.error(e);
      this.reply(e.message, from);
    }
  }
}