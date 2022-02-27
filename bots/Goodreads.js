import fs from 'fs';

import request from 'request';
import xml2js from 'xml2js';

import Bot from '../Bot.js';

class Goodreads extends Bot {
    #rootUrl = 'https://www.goodreads.com/';
    #apiKey;

    constructor(goodreadsApiKey) {
        super({ 
            name: 'goodreads', 
            description: "Finds the top related book for a given search term."
        });
        
        this.#apiKey = goodreadsApiKey;
    }

    getTests() {
        return [
            this.name + " mistborn"
        ];
    }

    // For debugging purposes only
    writeJsonObject(o, path) {
        fs.writeFile(path, JSON.stringify(o, null, 2), err => {
            if (err) {
                console.log(err);
            }        
        }); 
    }

    async onNewMessage({ content, from, directed }) {
        if (!directed) 
            return;
        
        // Get the search result for this search term, specifically, the top related book.
        const url = `${this.#rootUrl}search/index.xml?key=${this.#apiKey}&q=${content}`;
        
        request(url, (error, response, body) => {
            try {
                if (!error && response.statusCode == 200) {
                    const parser = new xml2js.Parser();
                    parser.parseString(body, (err, result) => {
                        try {
                            if (err) {
                                this.send(`Couldn't ask Goodreads about it, ${from}..`, from);
                            } else {
                                const title = result.GoodreadsResponse.search[0].results[0].work[0].best_book[0].title[0];
                                this.send(`So.. were you looking for ${title}?`, from);
                            }
                        } catch (e) {
                            console.log(`Error handling response ${e}`);
                            this.send("Couldn't ask Goodreads about it..", from);
                        }
                    });
                } else {
                    console.log(`HTTP request failed with error ${error} status code ${response.statusCode}`);
                    this.send("Couldn't ask Goodreads about it..", from);
                }
            } catch (e) {
                console.log(`Error handling response ${e}`);
                this.send("Couldn't ask Goodreads about it..", from);
            }
        });
    }
}

export default Goodreads;