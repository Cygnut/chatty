import logger from '../Logger';
import Bot from '../bot/Bot';
import { DirectMessage } from '../bot/Bot.d';

type Player = 'o' | 'x';

type Position = {
  x: number,
  y: number
}

type Move = {
  position: Position,
  player: Player
}

class InputError extends Error {
}

// Generates an array {0, 1, ..., length - 1}
const range = (length: number) => Array.from(Array(length).keys());

class Game {
  #gridLength;
  static #validPlayers: Player[] = [ 'o', 'x' ];
  #grid: string[][] = [];
  #unsetChar = '_';

  constructor(gridLength: number) {
    this.#gridLength = gridLength;
    this.reset();
  }

  #gridRange() {
    return range(this.#gridLength);
  }

  reset() {
    const gridRange = this.#gridRange();
    // Ensure each row is initialised with a distinct *copy* to avoid changing one row affecting
    // other rows.
    this.#grid = gridRange.map(() => gridRange.map(() => this.#unsetChar).slice());
  }

  static #parseCoordinate(value: string) {
    const number = parseInt(value);

    if (isNaN(number))
      throw new InputError(`${value} must be a valid integer.`);

    return number;
  }

  static parseMove(content: string): Move {
    // Message syntax: x y [x or o], x y are 0 based {0,1,2}
    const tokens = content.split(/[\s,]+/);
    if (tokens.length !== 3)
      throw new InputError(`${content} is badly formed input.`);

    const player = tokens[2] as Player;
    if (!Game.#validPlayers.includes(player))
      throw new InputError(`${player} should be one of ${Game.#validPlayers.join(', ')}`);

    return {
      position: {
        x: Game.#parseCoordinate(tokens[0]),
        y: Game.#parseCoordinate(tokens[1])
      },
      player
    };
  }

  #doMove(move: Move) {
    Object.entries(move.position).forEach(([k, v]) => {
      if (v < 0) {
        throw new InputError(`${k} must be greater than 0.`);
      }

      if (v >= this.#gridLength) {
        throw new InputError(`${k} must be less than or equal to ${this.#gridLength}.`);
      }
    });

    if (this.#grid[move.position.y][move.position.x] !== this.#unsetChar)
      throw new InputError("Hey! That spot's taken!");

    // Update the grid
    this.#grid[move.position.y][move.position.x] = move.player;
  }

  #getWinner() {
    const gridRange = this.#gridRange();
    const isWinningLine = (player: Player, cell: (i: number) => number[]) => gridRange.every(i => {
      const [ r, c ] = cell(i);
      return this.#grid[r][c] === player;
    });

    return Game.#validPlayers.find(player => {
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

  play(move: Move) {
    // Play the move to update the grid.
    this.#doMove(move);

    // Check for a winner to see if we need to reset the game.
    return this.#getWinner();
  }
}

export default class TicTacToe extends Bot {
  #game;
  #configureText = 'configure';
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

  onConfigure(content: string) {
    // Create a new game with the passed size
    const size = parseInt(content.substring(this.#configureText.length + 1));
    if (isNaN(size))
      throw new InputError('Size must be a valid integer.');

    this.#game = new Game(size);

    this.context.reply(`Starting new game of size ${size}`);
  }

  onMove(content: string) {
    // Parse the input to a move object
    const move = Game.parseMove(content);

    // Play the move to update the grid.
    const winner = this.#game.play(move);

    const response = [
      this.#game.stringizeGrid(),
      winner ? `${winner} wins!` : null
    ].filter(v => v).join('\n');

    // If there's a winner, reset the game.
    if (winner)
      this.#game.reset();

    this.context.reply(response);
  }

  async onDirectMessage({ content, from }: DirectMessage) {
    try {
      if (!content) {
        this.context.reply('\n' + this.#game.stringizeGrid());
      } else if (content.startsWith(this.#configureText)) {
        this.onConfigure(content)
      } else {
        this.onMove(content);
      }
    } catch (e) {
      logger.error(e);
      this.context.reply(e.message, from);
    }
  }
}