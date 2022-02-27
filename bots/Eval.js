import Bot from '../Bot.js';

class Eval extends Bot {
    constructor() {
        super({ 
            name: 'eval', 
            description: "Evaluates a javascript expression."
        });
    }

    getTests() {
        return [
            this.name + " 1+1"
        ];
    }

    async onNewMessage({ content, from, directed}) {
        if (!directed) 
            return;
        
        let result = '';
        
        try {
            result = eval(content);
        } catch (e) {
            result = `Error handling Eval message ${content} from ${from} with error ${e}`;
            console.error(result);
        }
        
        this.send(result, from);
    }
}

export default Eval;