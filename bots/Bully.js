import Bot from '../Bot.js';

class Bully extends Bot {
    #targets = [];

    constructor() {
        super({ 
            name: 'bully', 
            description: "Bullies a specific user."
        });
    }

    getTests() {
        return [
            this.name + " me"
        ];
    }

    async onNewMessage({ content, from, directed }) 
    {
        if (directed) {
            const index = this.#targets.indexOf(content);
            
            let message = '';
            if (index > -1) {
                // Then they're a target - remove them.
                this.#targets.splice(index, 1);
                message = `Awwww man! Gotta stop bullying ${content}.`;
            } else {
                // Then they're not a target - add them.
                this.#targets.push(content);
                message = `Ooooooh yeahhh! Gonna start bullying ${content}.`;
            }
            
            this.send(message, from);
        } else {
            if (this.#targets.some(target => target === from)) {
                this.send(`I hate you, ${from}`, from);
            }
        }
    }
}

export default Bully;