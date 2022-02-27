import os from 'os';

import Bot from '../Bot.js';

class Host extends Bot {
    constructor() {
        super({ 
            name: 'host', 
            description: "Provides information on the host machine." 
        });
    }

    getTests() {
        return [
            this.name
        ];
    }

    formatBytes(bytes,decimals) {
        if (bytes == 0) 
            return '0 Bytes';

        const k = 1000; // or 1024 for binary
        const dm = decimals + 1 || 3;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    toHHMMSS(secs) {
        const secNum = parseInt(secs, 10);
        const hours = Math.floor(secNum / 3600);
        const minutes = Math.floor((secNum - (hours * 3600)) / 60);
        const seconds = secNum - (hours * 3600) - (minutes * 60);

        if (hours < 10) { 
            hours = `0${hours}`; 
        }
        if (minutes < 10) { 
            minutes = `0${minutes}`; 
        }
        if (seconds < 10) { 
            seconds = `0${seconds}`; 
        }
        return `${hours}:${minutes}:${seconds}`;
    }

    onNewMessage({ content, from, directed }) {
        if (!directed) 
            return;
        
        this.send([
            `The OS is ${os.platform()} with ${os.cpus().length} CPU/s.`, 
            `The amount of free memory is ${formatBytes(os.freemem())}.`,
            `The amount of total memory is ${this.formatBytes(os.totalmem())}.`,
            `The total system uptime is ${this.toHHMMSS(os.uptime())}.`
        ].join('\n'));
    }
}

export default Host;