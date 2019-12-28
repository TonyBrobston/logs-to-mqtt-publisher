import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {FSWatcher} from 'chokidar';
import {read} from 'read-last-lines';
import {MqttPayload} from './types/MqttPayload';
import {InputOptions} from './types/Options';
import {Options} from './types/Options';

import {parse} from './services/logService';
import {override} from './services/optionService';
import {watchAsync} from './services/watchService';

let client: AsyncMqttClient,
    watcher: FSWatcher;

export const start = async (inputOptions: InputOptions): Promise<void> => {
    const {
        logFilePath,
        logFileRegex,
        mqttHost,
        mqttPort,
    }: Options = override(inputOptions);
    client = await connectAsync(`tcp://${mqttHost}:${mqttPort}`);

    watcher = await watchAsync(logFilePath);
    watcher.on('change', async (path: string): Promise<void> => {
        const line = await read(path, 1);
        const {topic, message}: MqttPayload = parse(line, logFileRegex);

        topic && message && client.publish(topic, message);
    });
};

export const stop = async (): Promise<void> => {
    await watcher.close();
    client.end();
};
