import {FSWatcher, watch} from 'chokidar';

export const watchAsync = (pathToWatch: string): Promise<FSWatcher> => {
    return new Promise((resolve: any): any => {
        const watcher = watch(pathToWatch);
        watcher.on('ready', () => {
            resolve(watcher);
        });
    });
};
