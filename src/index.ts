import {watch} from 'chokidar';
import {read} from 'read-last-lines';

const filePath = process.env.FILE_PATH;

if (filePath) {
    watch(filePath.toString()).on('all', (event, path) => {
        if (event === 'change') {
            read(path, 1).then((lines: string) => {
                console.log(lines)
            });
        }
    });
} else {
    const errorMessage = 'process.env.FILE_PATH is not valid.';
    console.log(errorMessage);
    throw new Error(errorMessage);
}

