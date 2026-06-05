const path = require('path');

// process.mainModule.filename = full path to the entry file (e.g. app.js)
// This log helps verify which file started the Node process
console.log('process.mainModule.filename', process.mainModule.filename);

// path.dirname() strips the filename and returns only the directory
// e.g. /project/app.js → /project
// Exporting this gives other files a reliable path to the project root,
// regardless of where they are located in the folder structure
module.exports = path.dirname(process.mainModule.filename);