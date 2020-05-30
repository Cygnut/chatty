const s = require('../Subbot');
const os = require('os');

function HostSubbot()
{
    s.Subbot.call(this, { name: 'host', description: "Provides information on the host machine." });
}

HostSubbot.prototype = Object.create(s.Subbot.prototype);

HostSubbot.prototype.getTests = function()
{
    return [this.name];
}

function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000; // or 1024 for binary
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function toHHMMSS(secs)
{
    var sec_num = parseInt(secs, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

HostSubbot.prototype.onNewMessage = function(msg) 
{
    if (!msg.directed) return;
    
    this.send(
        'The OS is ' + os.platform() + ' with ' + os.cpus().length + ' CPU/s.\n' + 
        'The amount of free memory is ' + formatBytes(os.freemem()) + '.\n' + 
        'The amount of total memory is ' + formatBytes(os.totalmem()) + '.\n' + 
        'The total system uptime is ' + toHHMMSS(os.uptime()) + '.\n'
    );
}

module.exports = HostSubbot;