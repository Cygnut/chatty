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

    onNewMessage({ content, from, directed }) 
    {
        if (directed)
        {
            var idx = this.#targets.indexOf(content);
            
            var m = '';
            if (idx > -1)    // Then they're a target - remove them.
            {
                this.#targets.splice(idx, 1);
                m = `Awwww man! Gotta stop bullying ${content}.`;
            }
            else    // Then they're not a target - add them.
            {
                this.#targets.push(content);
                m = `Ooooooh yeahhh! Gonna start bullying ${content}.`;
            }
            
            this.send(m, from);
        }
        else
        {
            if (this.#targets.some(target => target === from))
                this.send(`I hate you, ${from}`, from);
        }
    }
}

export default Bully;