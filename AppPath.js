import { dirname } from 'path';
import { fileURLToPath } from 'url';

// When using ES modules in Node, __dirname & __filename are not available. In place of those,
// we're advised to use this method.
//   This is also more reliable than using process.cwd(), as it will return the same value even if
// your working directory differs from the actual directory containing the path.
//   NOTE: This file must be placed in the same directory as your app.js file.
export default dirname(fileURLToPath(import.meta.url));