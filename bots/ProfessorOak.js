import request from 'request';

import s from '../Bot.js';

function ProfessorOak()
{
    s.Bot.call(this, { name: 'oak', description: "Ask Professor Oak about pokemon." });
}

ProfessorOak.prototype = Object.create(s.Bot.prototype);

ProfessorOak.prototype.getTests = function()
{
    return [
        this.name + " mewtwo"
    ];
}

function getEnFlavourText(result)
{
    for (var i = 0; i < result.flavor_text_entries.length; i++)
    {
        var f = result.flavor_text_entries[i];
        
        if (f.language.name === "en")
        {
            // Could filter on f.version.name - the game name - for now though, just use the first one.
            return f.flavor_text + ' (' + f.version.name + ')';
        }
    }
    
    return '';
}

ProfessorOak.prototype.onNewMessage = function(msg)
{
    if (!msg.directed) return;
    
    var url = 'http://pokeapi.co/api/v2/pokemon-species/' + msg.content;
    
    request(url, function (error, response, body) {
        
        try
        {
            if (!error && response.statusCode == 200) 
            {
                var result = JSON.parse(body);
                
                this.send(result.name + ' is a ' + 
                    result.color.name + ' ' + 
                    result.shape.name + ' ' + 
                    result.generation.name + ' pokemon. ' +
                    getEnFlavourText(result), 
                    msg.from
                );
            }
            else
            {
                console.log('HTTP request failed with error ' + error + ' status code ' + response.statusCode);
                this.send("Couldn't ask Professor Oak about it..", msg.from);
            }
        }
        catch (e)
        {
            console.log('Error handling response ' + e);
            this.send("Couldn't ask Professor Oak about it..", msg.from);
        }
    }.bind(this));
}

module.exports = ProfessorOak;