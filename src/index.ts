import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {FSWatcher} from 'chokidar';
import {read} from 'read-last-lines';
import {MqttPayload} from './types/MqttPayload';
import {LogOption, Options} from './types/Options';

import {parse} from './services/logService';
import {override} from './services/optionService';
import {watchAsync} from './services/watchService';

let client: AsyncMqttClient;
const watchers: FSWatcher[] = [];

export const start = async ({
        logOptions,
        mqttOptions: {
            host,
            port,
        },
    }: Options): Promise<void> => {
    client = await connectAsync(`tcp://${host}:${port}`);

    await Promise.all(logOptions.map(async ({
        filePath,
        regularExpressions,
    }: LogOption) => {
        const watcher = await watchAsync(filePath);
        watchers.push(watcher);
        watcher.on('change', async (path: string): Promise<void> => {
            regularExpressions.forEach(async (regularExpression: RegExp) => {
                const line = await read(path, 1);
                const {topic, message}: MqttPayload = parse(line, regularExpression);

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
