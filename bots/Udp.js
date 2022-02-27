import dgram from 'dgram';

import Bot from '../Bot.js';

class Udp extends Bot {
    #listener;

    constructor() {
        super({ 
            name: 'udp', 
            description: "Dumps udp on receipt at a specified port." 
        });
    }

    getTests() {
        return [];
    }

    createListener(port) {
        const listener = dgram.createSocket('udp4');
        
        listener.on('error', err => {
            console.log(`Udp: Error: ${err.stack}`);
            listener.close();
        });
        
        listener.on('message', (msg, rinfo) => {
            console.log(`Udp: Got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        });
        
        listener.on('listening', () => {
            const address = listener.address();
            console.log(`Udp: Listening at ${address.address}:${address.port}`);
        });
        
        listener.unref();        // Prevent this object from stopping the entire application from shutting down.
        
        listener.bind(port);
        
        return listener;
    }

    stop() {
        try {
            if (this.#listener) {
                this.#listener.close();
                this.#listener = null;
            }
        } catch (err) {
            console.log(`Udp: Error while stopping ${err}`);
            this.#listener = null;
        }
    }

    async onNewMessage({ content, from, directed }) {
        if (!directed) 
            return;
        
        if (content.startsWith('listen')) {
            const portStr = content.substring(7);
            const port = parseInt(portStr);
            if (isNaN(port)) {
                this.send(`${portStr} is not a valid port number.`, from);
                return;
            }
            
            try {
                this.stop();
                this.#listener = this.createListener(port);
                this.send(`Now listening on ${port}`, from);
            } catch (err) {
                console.log(`Udp: Error while starting to listen on ${port} ${err}`);
            }
        }
        else if (content.startsWith('stop')) {
            this.stop();
        }
    }
}

export default Udp;