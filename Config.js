
import path from 'path';
import { readFileSync } from 'fs';

export default JSON.parse(readFileSync(`${process.cwd()}${path.sep}config.json`));