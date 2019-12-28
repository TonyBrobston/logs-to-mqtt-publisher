import {watch} from 'chokidar';

export const watchAsync = (pathToWatch: string): any => {
    return new Promise((resolve: any): any => {
        const watcher = watch(pathToWatch);
        watcher.on('ready', () => {
            resolve(watcher);
        });
    });
};
