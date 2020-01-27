import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {FSWatcher} from 'chokidar';
import {read} from 'read-last-lines';

import {LogParse} from './types/LogParse';
import {LogWatch} from './types/LogWatch';
import {MqttPayload} from './types/MqttPayload';
import {Options} from './types/Options';

import {parseLog} from './services/logService';
import {parseOptions} from './services/optionService';
import {watchAsync} from './services/watchService';

let client: AsyncMqttClient;
const watchers: FSWatcher[] = [];

export const start = async (
    options: Options = parseOptions(process.env.OPTIONS),
): Promise<void> => {
    const {
        logWatches,
        mqtt: {
            host,
            password,
            port,
            username,
        },
    }: Options = options;

    client = await connectAsync(`tcp://${host}:${port}`, {username, password});

    await Promise.all(logWatches.map(async ({
        filePath,
        logParses,
    }: LogWatch) => {
        const watcher = await watchAsync(filePath);
        watchers.push(watcher);
        watcher.on('change', async (path: string): Promise<void> => {
            logParses.forEach(async (logParse: LogParse) => {
                const logLine = await read(path, 1);
                const {topic, message}: MqttPayload = parseLog(logLine, logParse);

                topic && message && client.publish(topic, message);
            });
        });
    }));
};

export const stop = async (): Promise<void> => {
    await Promise.all(watchers.map(async (watcher: FSWatcher) => {
        await watcher.close();
    }));
    client.end();
};
