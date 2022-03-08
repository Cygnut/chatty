
import path from 'path';
import { readFileSync } from 'fs';

import appPath from './AppPath.js';

const filepath = path.join(appPath, 'config.json');
const content = readFileSync(filepath);
const config = JSON.parse(content);

export default config;