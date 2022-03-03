
import path from 'path';
import { readFileSync } from 'fs';

const filepath = path.join(process.cwd(), 'config.json');
const content = readFileSync(filepath);
const config = JSON.parse(content);

export default config;