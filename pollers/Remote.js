const request = require('request');

/*
    This is a simple poller that scrapes the Chat app for the latest message and responds to it if it meets certain criteria.
    This could easily be extended to make these criteria and responses more pluggable.
    
    callback should handle all exceptions.
*/

function Remote(rootUrl, callback)
{
    this.rootUrl = rootUrl;
    this.lastIdSeen = -1;
    this.callback = callback;
}

Remote.prototype.poll = function()
{
    var self = this;    // Use closure to capture this as we pass it as a callback here.
    
    // Just get the last message
    return request(this.rootUrl + 'messages?begin=-1', function (error, response, body) {
        
        //console.log('Received response, with error code ' + error + ', status code ' + response.statusCode);
        
        if (!error && response.statusCode == 200) {
            
            var bodyJson = JSON.parse(body);
            
            if (bodyJson.length === 0) return;
            
            var msg = bodyJson[0];
            
            //console.log(msg);
            
            if (self.lastIdSeen < msg.id)
            {
                // Then we're looking at a new message.
                try { self.callback(msg); } catch (e) { }
                
                self.lastIdSeen = msg.id;
            }
        }
    });
}

Remote.prototype.run = function()
{
    // TODO: Ensure that this can only be run once.
    // Assume every 1/2 second is fast enough to catch every new message in poll.
    setInterval(this.poll.bind(this), 500);
}

module.exports = Remote;