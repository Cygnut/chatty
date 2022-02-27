import Bot from '../Bot.js';

class Test extends Bot {
    host;
    #from = 'Test-a-bot';

    constructor() {
        super({ 
            name: 'test', 
            description: "Tests the all installed bots." 
        });
    }

    generateTests(getBotMetadata) {
        // Get an array of tests for each bot.
        const botTests = getBotMetadata()
            .map(bot => { return bot.tests; })
    
        // Merge them all into one array.
        const allTests = [].concat.apply([], botTests);
    
        // Generate the full test suite:
        const tests = allTests;
        tests.unshift('STARTING TESTS NOW');
        tests.push('ENDING TESTS NOW');
        return tests;
    }

    getTests() {
        return [];
    }

    async onNewMessage({ content, from, directed }) {
        if (!directed) 
            return;
    
        const tests = this.generateTests(this.host.getBotMetadata);
        console.log(tests);
    
        // Copy the array into a reversed queue.
        const queue = tests.slice().reverse();
    
        let timerId = null;
        timerId = setInterval(() => {
            const message = queue.pop();
        
            if (message === undefined) {
                console.log('No messages left to send - finished sending.');
                clearInterval(timerId);
                return;
            }
        
            this.host.respond(this.#from, message);
        }, 1000);
    }
}

export default Test;
