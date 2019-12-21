import * as chokidar from 'chokidar';
const readLastLines = require('read-last-lines');

const filePath = process.env.FILE_PATH;

if (filePath) {
    chokidar.watch(filePath.toString()).on('all', (event, path) => {
        readLastLines.read(path, 1).then((lines: string) => {
            console.log(lines)
        });
    });
} else {
    const errorMessage = 'process.env.FILE_PATH is not valid.';
    console.log(errorMessage);
    throw new Error(errorMessage);
}

