const s = require('../Subbot');
const request = require("request");

function UrbanDictionarySubbot()
{
    s.Subbot.call(this, { name: 'urban', description: "Looks up shit from UrbanDictionary." });
}

UrbanDictionarySubbot.prototype = Object.create(s.Subbot.prototype);

UrbanDictionarySubbot.prototype.getTests = function()
{
    return [
        this.name + " poop"
    ];
}

UrbanDictionarySubbot.prototype.onNewMessage = function(msg)
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

module.exports = UrbanDictionarySubbot;