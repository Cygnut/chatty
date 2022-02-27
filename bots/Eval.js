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

    onNewMessage({ content, from, directed}) {
        if (!directed) 
            return;
        
        let result = '';
        
        try {
            result = eval(content);
        } catch (e) {
            const error = `Error handling Eval message ${content} from ${from} with error ${e}`;
            console.log(error);
            this.send(error, from);
            return;
        }
        
        this.send(result, from);
    }
}

export default Eval;