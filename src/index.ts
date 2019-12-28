import {connectAsync} from 'async-mqtt';
import {watch} from 'chokidar';
import {read} from 'read-last-lines';

import {MqttPayload} from './types/MqttPayload';
import {InputOptions} from './types/Options';
import {Options} from './types/Options';

import {parse} from './services/logService';
import {override} from './services/optionService';

let client: any,
    watcher: any;

export const start = async (inputOptions: InputOptions): Promise<void> => {
    const {
        logFilePath,
        logFileRegex,
        mqttHost,
        mqttPort,
    }: Options = override(inputOptions);
    client = await connectAsync(`tcp://${mqttHost}:${mqttPort}`);
    console.log('must be connected');

    watcher = watch(logFilePath);
    watcher.on('change', (path: string): void => {
        console.log('I see a change!');
        read(path, 1).then((line: string) => {
            console.log('before parse');
            const {topic, message}: MqttPayload = parse(line, logFileRegex);
            console.log('after parse');

            if (topic && message) {
                console.log('before publish:', topic, message);
                client.publish(topic, message);
                console.log('after publish:', topic, message);
            }
        });
    });
};

export const stop = async (): Promise<void> => {
    await watcher.close();
    client.end();
};
