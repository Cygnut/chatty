import fetch from "node-fetch";

import logger from '../Logger.js';
import Poller from '../Poller.js';

/*
    This is a simple poller that scrapes the Chat app for the latest message and responds to it if it meets certain criteria.
    This could easily be extended to make these criteria and responses more pluggable.

    callback should handle all exceptions.
*/

export default class Remote extends Poller {
    #rootUrl;
    #lastIdSeen = -1;
    #callback;

    constructor(rootUrl, callback) {
        super();
        this.#rootUrl = rootUrl;
        this.#callback = callback;
    }

    async poll() {
        try {
            // Just get the last message
            const response = await fetch(`${this.#rootUrl}messages?begin=-1`);
            const body = await response.json();
            const msg = body[0];

            if (this.#lastIdSeen < msg.id) {
                // Then we're looking at a new message.
                try {
                    this.#callback(msg);
                } catch (e) {}
                this.#lastIdSeen = msg.id;
            }
        } catch (e) {
            //logger.error(e);
        }
    }

    run() {
        // TODO: Ensure that this can only be run once.
        // Assume every 1/2 second is fast enough to catch every new message in poll.
        setInterval(this.poll.bind(this), 500);
    }
}