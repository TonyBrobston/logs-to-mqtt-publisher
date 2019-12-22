import {watch} from 'chokidar';
import {read} from 'read-last-lines';

export const start = (): void => {
    const filePath = process.env.FILE_PATH;

    if (filePath) {
        watch(filePath.toString()).on('change', (path) => {
            read(path, 1).then((lines: string) => {
                console.log(lines)
            });
        });
    } else {
        const errorMessage = 'process.env.FILE_PATH is not valid.';
        console.log(errorMessage);
        throw new Error(errorMessage);
    }
}
