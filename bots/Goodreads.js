import fs from 'fs';

import request from 'request';
import xml2js from 'xml2js';

import s from './Bot.js';

function Goodreads(goodreadsApiKey)
{
    s.Bot.call(this, { name: 'goodreads', description: "Finds the top related book for a given search term."});
    
    this.apiKey = goodreadsApiKey;
    this.rootUrl = 'https://www.goodreads.com/';
}

Goodreads.prototype = Object.create(s.Bot.prototype);

Goodreads.prototype.getTests = function()
{
    return [
        this.name + " mistborn"
        ];
}

// For debugging purposes only
function writeJsonObject(o, path)
{
    fs.writeFile(path, JSON.stringify(o, null, 2), function(err) {
        if(err) {
            return console.log(err);
        }
    
    //console.log("The file was saved!");
    }); 
}

Goodreads.prototype.onNewMessage = function(msg)
{
    if (!msg.directed) return;
    
    // Get the search result for this search term, specifically, the top related book.
    
    var url = this.rootUrl + 'search/index.xml?key=' + this.apiKey + '&q=' + msg.content
    //console.log(url);
    
    request(url, function (error, response, body) {
        
        try
        {
            if (!error && response.statusCode == 200) 
            {
                var parser = new xml2js.Parser();
                parser.parseString(body, function(err, result) 
                {
                    try
                    {
                        if (err)
                            this.send("Couldn't ask Goodreads about it, " + msg.from + "..", msg.from);
                        else
                        {
                            var result = result.GoodreadsResponse.search[0].results[0].work[0].best_book[0].title[0];
                            this.send('So.. were you looking for ' + result + '?', msg.from);
                        }
                    }
                    catch (e)
                    {
                        console.log('Error handling response ' + e);
                        this.send("Couldn't ask Goodreads about it..", msg.from);
                    }
                }.bind(this));
            }
            else
            {
                console.log('HTTP request failed with error ' + error + ' status code ' + response.statusCode);
                this.send("Couldn't ask Goodreads about it..", msg.from);
            }
        }
        catch (e)
        {
            console.log('Error handling response ' + e);
            this.send("Couldn't ask Goodreads about it..", msg.from);
        }
    }.bind(this));
}

module.exports = Goodreads;