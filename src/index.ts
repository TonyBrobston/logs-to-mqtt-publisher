import {connectAsync} from 'async-mqtt';
import {watch} from 'chokidar';
import {read} from 'read-last-lines';

import {MqttPayload} from './types/MqttPayload';
import {InputOptions} from './types/Options';
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
    const {publish}: any = await connectAsync(`tcp://${mqttHost}:${mqttPort}`);

    await watch(logFilePath).on('change', async (path: string): Promise<void> => {
        const line = await read(path, 1);
        const {topic, message}: MqttPayload = parse(line, logFileRegex);

        await publish(topic, message);
    });
};
