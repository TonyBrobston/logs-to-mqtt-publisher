import {connectAsync} from 'async-mqtt';
import {watch} from 'chokidar';
import {read} from 'read-last-lines';

export const start = async (): Promise<void> => {
    const host = process.env.MQTT_HOST;
    const port = process.env.MQTT_PORT;
    const {publish} = await connectAsync(`tcp://${host}:${port}`);
    const filePath = process.env.FILE_PATH;

    if (filePath) {
        await watch(filePath.toString()).on('change', async (path) => {
            const lines = await read(path, 1);
            const {topic, message} = parse(lines);
            await publish(topic, message);
        });
    }
}

const parse = (lines: string) => {
    return {
        topic: 'someTopic',
        message: 'someMessage'
    };
}
