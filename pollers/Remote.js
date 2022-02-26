import request from 'request';

import Poller from '../Poller.js';

/*
    This is a simple poller that scrapes the Chat app for the latest message and responds to it if it meets certain criteria.
    This could easily be extended to make these criteria and responses more pluggable.
    
    callback should handle all exceptions.
*/

class Remote extends Poller {
    #rootUrl;
    #lastIdSeen = -1;
    #callback;

    constructor(rootUrl, callback) {
        super();
        this.#rootUrl = rootUrl;
        this.#callback = callback;
    }

    poll() {
        // Just get the last message
        return request(this.#rootUrl + 'messages?begin=-1', (error, response, body) => {
            
            //console.log('Received response, with error code ' + error + ', status code ' + response.statusCode);
            
            if (!error && response.statusCode == 200) {
                
                const bodyJson = JSON.parse(body);
                
                if (bodyJson.length === 0) return;
                
                const msg = bodyJson[0];
                                
                if (this.#lastIdSeen < msg.id)
                {
                    // Then we're looking at a new message.
                    try { this.#callback(msg); } catch (e) { }
                    
                    this.#lastIdSeen = msg.id;
                }
            }
        });
    }

    run() {
        // TODO: Ensure that this can only be run once.
        // Assume every 1/2 second is fast enough to catch every new message in poll.
        setInterval(this.poll.bind(this), 500);
    }
}

export default Remote;