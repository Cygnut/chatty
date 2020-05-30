const s = require('../Subbot');

//-----------------------------------------------------------------------

function InputError(message) {
    this.name = "InputError";
    this.message = (message || "");
}
InputError.prototype = Object.create(Error.prototype);

//-----------------------------------------------------------------------

function TicTacToeGame(gridLength)
{
    this.gridLength = gridLength;
    this.grid = null;
    
    this.validPlayers = [ 'o', 'x', ];
    this.unsetChar = '_';
    
    this.resetGrid();
}

TicTacToeGame.prototype.resetGrid = function()
{
    this.grid = [];
    
    for (var i = 0; i < this.gridLength; ++i)
    {
        this.grid[i] = [];
    
        for (var j = 0; j < this.gridLength; ++j)
            this.grid[i][j] = this.unsetChar;
    }
}

TicTacToeGame.prototype.doMove = function(move)
{
    // Update the grid:
    if (this.grid[move.y][move.x] !== this.unsetChar)
        throw new InputError("Hey! That spot's taken!");
    
    this.grid[move.y][move.x] = move.player;
}

TicTacToeGame.prototype.printGrid = function()
{
    // Get the current state of the grid.
    var results = '';
    this.grid.forEach(function(row) {
        results += row.join(' ') + '\n';
    }.bind(this));
    return results;
}

TicTacToeGame.prototype.getWinner = function()
{
    // Generates an array {0, 1, ..., length - 1}
    function range(length)
    {
        // Note: Array.from(Array(this.gridLength).keys()) = [0, 1, .. this.gridLength - 1]
        return Array.from(Array(length).keys());
    }
    
    // Check if there's been a winner. 
    // Check for each player.
    for (var p = 0; p < this.validPlayers.length; ++p)
    {
        var validPlayer = this.validPlayers[p];
        
        // Check horizontals:
        for (var r = 0; r < this.gridLength; ++r)
        {
            if (this.grid[r].every(function(cell) { 
                return cell === validPlayer; 
            }.bind(this)))
                return { winner: validPlayer, reason: 'Won on row ' + r + '.', };
        }
        
        // Check verticals:
        for (var c = 0; c < this.gridLength; ++c)
        {
            if (range(this.gridLength).every(function(r) {
                return this.grid[r][c] === validPlayer; 
                }.bind(this)))
                return { winner: validPlayer, reason: 'Won on column ' + c + '.', };
        }
        
        // Check diagonal starting at 0,0
        if (range(this.gridLength).every(function(i) { 
            return this.grid[i][i] === validPlayer; 
            }.bind(this)))
            return { winner: validPlayer, reason: 'Won on top-left diagonal.' };
        
        if (range(this.gridLength).every(function(i) {
            return this.grid[this.gridLength - 1 - i][i] === validPlayer; 
            }.bind(this) ))
            return { winner: validPlayer, reason: 'Won on top-right diagonal.' };
    }
    
    return { winner: null };
}

TicTacToeGame.prototype.play = function(move)
{
    // Play the move to update the grid.
    this.doMove(move);
    
    // Stringize the current state of the grid.
    var results = this.printGrid();
    
    // Check for a winner to see if we need to reset the game.
    var winner = this.getWinner();
    
    // Save the game state before resetting possibly.
    var g = this.printGrid();
    
    // If there is one, report this and reset the game.
    if (winner.winner)
        this.resetGrid();
    
    var r = 
    {
        grid: g,
        winner: winner ? winner.winner : null,
        winningReason: winner ? winner.reason : null,
    };
    return r;
}

//-----------------------------------------------------------------------

function TicTacToeSubbot()
{
    s.Subbot.call(this, { name: 'ttt', description: "Play tic-tac-toe. Inputs must be of format e.g. 0,2 x, or blank, or start x to configure a new game of size x." });
    
    this.game = new TicTacToeGame(3);
    
    this.inputRegex = /[\s,]+/;    // Cache this for performance.
}

TicTacToeSubbot.prototype = Object.create(s.Subbot.prototype);

TicTacToeSubbot.prototype.getTests = function()
{
    return [];
}

TicTacToeSubbot.prototype.parseInput = function(msg)
{
    // Message syntax: x,y [x or o]
    // x,y are 0 based {0,1,2}
    
    // Split by , and whitespace
    
    var tokens = msg.content.split(this.inputRegex);
    if (tokens.length !== 3)
        throw new InputError(msg.content + ' is badly formed input.');
    
    function getCoordinate(c)
    {
        var i = parseInt(c);
        
        if (isNaN(i))
            throw new InputError(c + ' must be a valid integer.');
        
        if (i < 0 || i >= this.gridLength)
            throw new InputError(c + ' must be in {0,1,2}.');
        
        return i;
    }
    
    var move = 
    {
        x: getCoordinate(tokens[0]),
        y: getCoordinate(tokens[1]),
        player: tokens[2],
    };
    
    if (!this.game.validPlayers.some(function(p) { return p === move.player; }))
        throw new InputError(move.player + ' should be one of ' + this.validPlayers.join());
    
    return move;
}

TicTacToeSubbot.prototype.onNewMessage = function(msg) 
{
    try
    {
        if (!msg.directed) return;
        
        if (msg.content === '')
            this.send(this.game.printGrid());    // Don't include @ info as it's to everyone.
        else if (msg.content.startsWith('configure'))
        {
            // Create a new game with 
            var size = parseInt(msg.content.substring('configure'.length + 1));
            if (isNaN(size))
                throw new InputError('Size must be a valid integer.');
            
            this.game = new TicTacToeGame(size);
            
            this.send('Starting new game of size ' + size);    // Don't include @ info as it's to everyone.
        }
        else
        {
            // Parse the input to a move object
            var move = this.parseInput(msg);
            
            // Play the move to update the grid.
            var info = this.game.play(move);
            
            var response = info.grid;
            if (info.winner)
                response += info.winner + ' won the game! ' + info.winningReason;
            
            this.send(response);    // Don't include @ info as it's to everyone.
        }
    }
    catch (err)
    {
        this.send(err.message, msg.from);
    }
}

module.exports = TicTacToeSubbot;