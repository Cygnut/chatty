import readline from 'readline';

import logger from '../Logger.js';
import Channel from '../Channel.js';

export default class Console extends Channel {
    #callback;

    constructor(callback) {
        super();
        this.#callback = callback;
    }

    receive() {
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