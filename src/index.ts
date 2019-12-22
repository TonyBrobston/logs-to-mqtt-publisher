import {connectAsync} from 'async-mqtt';
import {watch} from 'chokidar';
import {read} from 'read-last-lines';

import {parse} from './services/logService';

export const start = async (): Promise<void> => {
    const logFilePath = process.env.LOG_FILE_PATH;
    const logFileRegex = process.env.LOG_FILE_REGEX;
    if (logFilePath && logFileRegex) {
        const host = process.env.MQTT_HOST;
        const port = process.env.MQTT_PORT;
        const {publish} = await connectAsync(`tcp://${host}:${port}`);
        const logFileRegexSplit = logFileRegex.split('/');
        const regex = new RegExp(logFileRegexSplit[1], logFileRegexSplit[2])
        await watch(logFilePath.toString()).on('change', async (path) => {
            const line = await read(path, 1);
            const {topic, message} = parse(line, regex);
            if (topic && message) {
                await publish(topic, message);
            }
        });
    }
}

