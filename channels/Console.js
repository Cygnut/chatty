import readline from 'readline';

import logger from '../Logger.js';
import Channel from '../Channel.js';

export default class Console extends Channel {
    #exit = 'exit';
    #callback;

    constructor(callback) {
        super();
        this.#callback = callback;
    }

    receive() {
        console.log(`Type "${this.#exit}" to exit > `)

        const io = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: ''
        });

        io.prompt();

        io.on('line', line => {
            if (line.toLowerCase() === this.#exit) {
                logger.info('Bye!');
                process.exit(0);
            } else {
                this.#callback({ from: 'console', content: line.trim() })
            }
            io.prompt();
        }).on('close', () => {
            logger.info('Exiting!');
            process.exit(0);
        });
    }

    send({ content }) {
        console.log(content);
    }
}