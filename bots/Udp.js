const s = require('../Bot');
const dgram = require('dgram');

function Udp()
{
    s.Bot.call(this, { name: 'udp', description: "Dumps udp on receipt at a specified port." });
    
    this.listener = null;
}

Udp.prototype = Object.create(s.Bot.prototype);

Udp.prototype.getTests = function()
{
    return [];
}

Udp.prototype.createListener = function(port)
{
    var listener = dgram.createSocket('udp4');
    
    listener.on('error', function(err) {
        console.log('Udp: Error: ' + err.stack);
        listener.close();
    }.bind(this));
    
    listener.on('message', function(msg, rinfo) {
        console.log('Udp: Got: ' + msg + ' from ' + rinfo.address + ':' + rinfo.port);
    }.bind(this));
    
    listener.on('listening', function() {
        var address = listener.address();
        console.log('Udp: Listening at ' + address.address + ':' + address.port);
    }.bind(this));
    
    listener.unref();        // Prevent this object from stopping the entire application from shutting down.
    
    listener.bind(port);
    
    return listener;
}

Udp.prototype.stop = function()
{
    try
    {
        if (this.server)
        {
            this.server.close();
            this.server = null;
        }
    }
    catch (err)
    {
        console.log('Udp: Error while stopping ' + err);
        this.server = null;
    }
}

Udp.prototype.onNewMessage = function(msg) 
{
    if (!msg.directed) return;
    
    if (msg.content.startsWith('listen'))
    {
        var portStr = msg.content.substring(7);
        var port = parseInt(portStr);
        if (isNaN(port))
        {
            this.send(portStr + ' is not a valid port number.', msg.from);
            return;
        }
        
        try
        {
            this.stop();
            this.listener = this.createListener(port);
            this.send('Now listening on ' + port, msg.from);
        }
        catch (err)
        {
            console.log('Udp: Error while starting to listen on ' + port + ' ' + err);
        }
    }
    else if (msg.content.startsWith('stop'))
        this.stop();
}

module.exports = Udp;