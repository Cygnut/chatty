import readline from 'readline';

import logger from '../Logger.js';
import Poller from '../Poller.js';

export default class Console extends Poller {
    #callback;

    constructor(callback) {
        super();
        this.#callback = callback;
    }

    run() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'Type "exit" to exit the app > '
        });

        rl.prompt();

        rl.on('line', (line) => {
            if (line.toLowerCase() === "exit") {
                logger.info('Bye!');
                process.exit(0);
            } else {
                this.#callback({ from: 'console', content: line.trim() })
            }
            rl.prompt();
        }).on('close', () => {
            logger.info('Exiting!');
            process.exit(0);
        });
    }
}