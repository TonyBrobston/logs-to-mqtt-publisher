import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {FSWatcher} from 'chokidar';
import {read} from 'read-last-lines';
import {MqttPayload} from './types/MqttPayload';
import {LogOption, Options} from './types/Options';

import {parse} from './services/logService';
import {override} from './services/optionService';
import {watchAsync} from './services/watchService';

let client: AsyncMqttClient,
    watcher: FSWatcher;

export const start = async ({
        logOptions,
        mqttOptions: {
            host,
            port,
        },
    }: Options): Promise<void> => {
    client = await connectAsync(`tcp://${host}:${port}`);

    logOptions.forEach(async ({
        filePath,
        regularExpressions,
    }: LogOption) => {
        watcher = await watchAsync(filePath);
        watcher.on('change', async (path: string): Promise<void> => {
            Promise.all(
                regularExpressions.map(async (regularExpression: RegExp) => {
                    const line = await read(path, 1);
                    const {topic, message}: MqttPayload = parse(line, regularExpression);

                    topic && message && client.publish(topic, message);
                }),
            );
        });
    });
};

export const stop = async (): Promise<void> => {
    await watcher.close();
    client.end();
};
