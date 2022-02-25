const s = require('./Bot');

function SelfTest(getBotMetadata, respond)
{
    s.Bot.call(this, { name: 'test', description: "Tests the all installed bots." });
    this.getBotMetadata = getBotMetadata;
    this.respond = respond;
    this.from = 'Test-a-bot';
}

function generateTests(getBotMetadata)
{
    // Get an array of tests for each bot.
    var botTests = getBotMetadata()
        .map(function(bot) { return bot.tests; })
    
    // Merge them all into one array.
    var allTests = [].concat.apply([], botTests);
    
    // Generate the full test suite:
    var tests = allTests;
    tests.unshift('STARTING TESTS NOW');
    tests.push('ENDING TESTS NOW');
    return tests;
}

SelfTest.prototype = Object.create(s.Bot.prototype);

SelfTest.prototype.getTests = function()
{
    return [];
}

SelfTest.prototype.onNewMessage = function(msg)
{
    if (!msg.directed) return;
    
    var tests = generateTests(this.getBotMetadata);
    console.log(tests);
    
    // Copy the array into a reversed queue.
    var queue = tests.slice().reverse();
    
    function sendNext()
    {
        var message = queue.pop();
        
        if (message === undefined)
        {
            console.log('No messages left to send - finished sending.');
            clearInterval(timerId);
            return;
        }
        
        this.respond(this.from, message);
    }
    
    var timerId = setInterval(sendNext.bind(this), 1000);
}

module.exports.SelfTest = SelfTest;
