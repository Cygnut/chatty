import logger from '../Logger.js';
import Bot from '../bot/Bot.js';

class InputError extends Error {
  constructor(message) {
    super(message || '')
  }
}

// Generates an array {0, 1, ..., length - 1}
const range = length => Array.from(Array(length).keys());

class Game {
  #gridLength;
  #validPlayers = [ 'o', 'x' ];
  #grid;
  #unsetChar = '_';

  constructor(gridLength) {
    this.#gridLength = gridLength;
    this.#resetGrid();
  }

  #gridRange() {
    return range(this.#gridLength);
  }

  #resetGrid() {
    this.#grid = [];

    for (const r of this.#gridRange()) {
      this.#grid[r] = [];

      for (const c of this.#gridRange()) {
        this.#grid[r][c] = this.#unsetChar;
      }
    }
  }

  #doMove(move) {
    // Validate the move
    if (!this.#validPlayers.some(p => p === move.player))
      throw new InputError(`${move.player} should be one of ${this.#validPlayers.join(', ')}`);

    [ 'x', 'y' ].forEach(c => {
      const value = move[c];

      if (isNaN(value))
        throw new InputError(`${c} must be a valid integer.`);

      if (value < 0 ||value >= this.#gridLength)
        throw new InputError(`${c} must be in {0,1,2}.`);
    });

    // Update the grid
    if (this.#grid[move.y][move.x] !== this.#unsetChar)
      throw new InputError("Hey! That spot's taken!");

    this.#grid[move.y][move.x] = move.player;
  }

  #getWinner() {
    const gridRange = this.#gridRange();
    const isWinningLine = (player, cell) => gridRange.every(i => {
      const [ r, c ] = cell(i);
      return this.#grid[r][c] === player;
    });

    return this.#validPlayers.find(player => {
      return [
        // Rows:
        gridRange.some(r => isWinningLine(player, i => [r, i])),

        // Columns:
        gridRange.some(c => isWinningLine(player, i => [i, c])),

        // Diagonal going this way: \
        isWinningLine(player, i => [i, i]),

        // Diagonal going this way: /
        isWinningLine(player, i => [this.#gridLength - 1 - i, i])
      ].some(v => v);
    });
  }

  stringizeGrid() {
    return this.#grid
      .map(row => row.join(' '))
      .join('\n');
  }

  play(move) {
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

    this.#game = new Game(this.#gameSize);
  }

  getTests() {
    return [];
  }

  parseMove(content) {
    // Message syntax: x y [x or o], x y are 0 based {0,1,2}
    const tokens = content.split(this.#inputRegex);
    if (tokens.length !== 3)
      throw new InputError(`${content} is badly formed input.`);

    return {
      x: parseInt(tokens[0]),
      y: parseInt(tokens[1]),
      player: tokens[2],
    };
  }

  async onDirectMessage({ content, from }) {
    try {
      if (!content) {
        this.reply('\n' + this.#game.stringizeGrid());    // Don't include @ info as it's to everyone.
      } else if (content.startsWith('configure')) {
        // Create a new game with the passed size
        const size = parseInt(content.substring('configure'.length + 1));
        if (isNaN(size))
          throw new InputError('Size must be a valid integer.');

        this.#game = new Game(size);

        this.reply(`Starting new game of size ${size}`);    // Don't include @ info as it's to everyone.
      } else {
        // Parse the input to a move object
        const move = this.parseMove(content);

        // Play the move to update the grid.
        const winner = this.#game.play(move);

        const response = [ 
          this.#game.stringizeGrid(), 
          winner ? `${winner} wins!` : null
        ].filter(v => v).join('\n');

        this.reply(response);    // Don't include @ info as it's to everyone.
      }
    } catch (e) {
      logger.error(e);
      this.reply(e.message, from);
    }
  }
}