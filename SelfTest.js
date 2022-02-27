import Bot from './Bot.js';

class SelfTest extends Bot {
    #getBotMetadata;
    #respond;
    #from = 'Test-a-bot';

    constructor(getBotMetadata, respond) {
        super({ 
            name: 'test', 
            description: "Tests the all installed bots." 
        });
    
        this.#getBotMetadata = getBotMetadata;
        this.#respond = respond;
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

    onNewMessage({ content, from, directed }) {
        if (!directed) 
            return;
    
        const tests = this.generateTests(this.#getBotMetadata);
        console.log(tests);
    
        // Copy the array into a reversed queue.
        const queue = tests.slice().reverse();
    
        let timerId = null;

        const sendNext = () => {
            const message = queue.pop();
        
            if (message === undefined)
            {
                console.log('No messages left to send - finished sending.');
                clearInterval(timerId);
                return;
            }
        
            this.#respond(this.#from, message);
        };
    
        timerId = setInterval(sendNext.bind(this), 1000);
    }
}

export default SelfTest;
