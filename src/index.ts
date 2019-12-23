import {connectAsync} from 'async-mqtt';
import {watch} from 'chokidar';
import {read} from 'read-last-lines';

import {InputOptions} from './types/InputOptions';
import {MqttPayload} from './types/MqttPayload';
import {Options} from './types/Options';

import {parse} from './services/logService';
import {override} from './services/optionService';

export const start = async (inputOptions: InputOptions): Promise<void> => {
    const {
        logFilePath,
        logFileRegex,
        mqttHost,
        mqttPort,
    }: Options = override(inputOptions);
    const {publish} = await connectAsync(`tcp://${mqttHost}:${mqttPort}`);

    await watch(logFilePath).on('change', async (path: string): Promise<void> => {
        const line = await read(path, 1);
        const {topic, message}: MqttPayload = parse(line, logFileRegex);

        if (topic && message) {
            await publish(topic, message);
        }
    });
};
