const s = require('../Bot');
const request = require("request");

function UrbanDictionary()
{
    s.Bot.call(this, { name: 'urban', description: "Looks up shit from UrbanDictionary." });
}

UrbanDictionary.prototype = Object.create(s.Bot.prototype);

UrbanDictionary.prototype.getTests = function()
{
    return [
        this.name + " poop"
    ];
}

UrbanDictionary.prototype.onNewMessage = function(msg)
{
    if (!msg.directed) return;
    
    // Get the search result for this search term, specifically, the top related book.
    
    var url = 'http://api.urbandictionary.com/v0/define?term=' + msg.content;
    
    request(url, function (error, response, body) {
        
        try
        {
            if (!error && response.statusCode == 200) 
            {
                var result = JSON.parse(body);
                this.send(result.list[0].definition, msg.from);
            }
            else
            {
                console.log('HTTP request failed with error ' + error + ' status code ' + response.statusCode);
                this.send("Couldn't ask UrbanDictionary about it..", msg.from);
            }
        }
        catch (e)
        {
            console.log('Error handling response ' + e);
            this.send("Couldn't ask UrbanDictionary about it..", msg.from);
        }
    }.bind(this));
}

module.exports = UrbanDictionary;