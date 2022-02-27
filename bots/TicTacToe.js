import Bot from '../Bot.js';

class InputError extends Error {
    constructor(message) {
        super(message || '')
    }
}

class TicTacToeGame {
    gridLength;
    validPlayers = [ 'o', 'x' ];
    #grid;
    #unsetChar = '_';


    constructor(gridLength) {
        this.gridLength = gridLength;
        this.resetGrid();
    }

    resetGrid() {
        this.#grid = [];
        
        for (let i = 0; i < this.gridLength; ++i) {
            this.#grid[i] = [];
        
            for (let j = 0; j < this.gridLength; ++j)
                this.#grid[i][j] = this.#unsetChar;
        }
    }

    doMove(move) {
        // Update the grid:
        if (this.#grid[move.y][move.x] !== this.#unsetChar)
            throw new InputError("Hey! That spot's taken!");
        
        this.#grid[move.y][move.x] = move.player;
    }

    printGrid() {
        // Get the current state of the grid.
        let results = '';
        this.#grid.forEach(row => {
            results += row.join(' ') + '\n';
        });
        return results;
    }

    getWinner() {
        // Generates an array {0, 1, ..., length - 1}
        const range = (length) => {
            // Note: Array.from(Array(this.gridLength).keys()) = [0, 1, .. this.gridLength - 1]
            return Array.from(Array(length).keys());
        }
        
        // Check if there's been a winner. 
        // Check for each player.
        for (let p = 0; p < this.validPlayers.length; ++p) {
            const validPlayer = this.validPlayers[p];
            
            // Check horizontals:
            for (let r = 0; r < this.gridLength; ++r) {
                if (this.#grid[r].every(cell => cell === validPlayer))
                    return { winner: validPlayer, reason: `Won on row ${r}.` };
            }
            
            // Check verticals:
            for (let c = 0; c < this.gridLength; ++c) {
                if (range(this.gridLength).every(r => this.#grid[r][c] === validPlayer))
                    return { winner: validPlayer, reason: `Won on column ${c}.` };
            }
            
            // Check diagonal starting at 0,0
            if (range(this.gridLength).every(i => this.#grid[i][i] === validPlayer))
                return { winner: validPlayer, reason: 'Won on top-left diagonal.' };
            
            if (range(this.gridLength).every(i => this.#grid[this.gridLength - 1 - i][i] === validPlayer));
                return { winner: validPlayer, reason: 'Won on top-right diagonal.' };
        }
        
        return { winner: null };
    }

    play(move) {
        // Play the move to update the grid.
        this.doMove(move);
        
        // Stringize the current state of the grid.
        this.printGrid();
        
        // Check for a winner to see if we need to reset the game.
        const winner = this.getWinner();
        
        // Save the game state before possibly resetting.
        const grid = this.printGrid();
        
        // If there is one, report this and reset the game.
        if (winner.winner)
            this.resetGrid();
        
        return {
            grid,
            winner: winner ? winner.winner : null,
            winningReason: winner ? winner.reason : null,
        };
    }
}

class TicTacToe extends Bot {
    #game;
    #inputRegex = /[\s,]+/;    // Cache this for performance.

    constructor() {
        super({ 
            name: 'ttt', 
            description: "Play tic-tac-toe. Inputs must be of format e.g. 0,2 x, or blank, or start x to configure a new game of size x." 
        });
        
        this.#game = new TicTacToeGame(3);
    }

    getTests() {
        return [];
    }

    parseInput(content) {
        // Message syntax: x,y [x or o]
        // x,y are 0 based {0,1,2}
        
        // Split by , and whitespace
        
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
        
        const move = {
            x: getCoordinate(tokens[0]),
            y: getCoordinate(tokens[1]),
            player: tokens[2],
        };
        
        if (!this.#game.validPlayers.some(p => p === move.player))
            throw new InputError(`${move.player} should be one of ${this.#game.validPlayers.join()}`);
        
        return move;
    }

    onNewMessage({ content, from, directed }) {
        try {
            if (!directed) 
                return;
            
            if (content === '') {
                this.send(this.#game.printGrid());    // Don't include @ info as it's to everyone.
            } else if (content.startsWith('configure')) {
                // Create a new game with 
                const size = parseInt(content.substring('configure'.length + 1));
                if (isNaN(size))
                    throw new InputError('Size must be a valid integer.');
                
                this.#game = new TicTacToeGame(size);
                
                this.send(`Starting new game of size ${size}`);    // Don't include @ info as it's to everyone.
            } else {
                // Parse the input to a move object
                const move = this.parseInput(content);
                
                // Play the move to update the grid.
                const info = this.#game.play(move);
                
                const response = info.grid;
                if (info.winner)
                    response += `${info.winner} won the game! ${info.winningReason}`;
                
                this.send(response);    // Don't include @ info as it's to everyone.
            }
        } catch (err) {
            this.send(err.message, from);
        }
    }
}

export default TicTacToe;