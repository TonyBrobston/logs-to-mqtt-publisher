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
    const client = await connectAsync(`tcp://${mqttHost}:${mqttPort}`);

    watch(logFilePath).on('change', (path: string): void => {
        read(path, 1).then((line: string) => {
            const {topic, message}: MqttPayload = parse(line, logFileRegex);

            if (topic && message) {
                client.publish(topic, message);
            }
        });
    });
};
