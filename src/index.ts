import {connectAsync} from 'async-mqtt';
import {watch} from 'chokidar';
import {read} from 'read-last-lines';

import {InputOptions} from './types/InputOptions';

import {override} from './services/optionService';
import {parse} from './services/logService';

export const start = async (inputOptions: InputOptions): Promise<void> => {
    const {
        logFilePath,
        logFileRegex,
        mqttHost,
        mqttPort,
    } = override(inputOptions);
    const {publish} = await connectAsync(`tcp://${mqttHost}:${mqttPort}`);

    await watch(logFilePath.toString()).on('change', async (path) => {
        const line = await read(path, 1);
        const payload = parse(line, logFileRegex);

        if (payload) {
            const {topic, message} = payload;

            await publish(topic, message);
        }
    });
}

