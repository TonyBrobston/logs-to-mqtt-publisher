import {connectAsync} from 'async-mqtt';
import {watch} from 'chokidar';
import {read} from 'read-last-lines';

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

export const parse = (line: string, regex: RegExp) => {
    const found = line.match(regex);
    if (found) {
        const event = found[0];
        const camera = found[1];
        const message = found[2];
        return {
            topic: `${event}/${camera}`,
            message
        }
    }
    return {};
}
