import {connectAsync} from 'async-mqtt';
import {watch} from 'chokidar';
import {read} from 'read-last-lines';

import {InputOptions} from './types/InputOptions';

import {parse} from './services/logService';
import {override} from './services/optionService';

export const start = async (inputOptions: InputOptions): Promise<void> => {
    const {
        logFilePath,
        logFileRegex,
        mqttHost,
        mqttPort,
    } = override(inputOptions);
    const {publish} = await connectAsync(`tcp://${mqttHost}:${mqttPort}`);

    await watch(logFilePath).on('change', async (path: string): Promise<void> => {
        const line = await read(path, 1);
        const payload = parse(line, logFileRegex);

        if (payload) {
            const {topic, message} = payload;

            await publish(topic, message);
        }
    });
};
