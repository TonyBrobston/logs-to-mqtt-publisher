import {watch} from 'chokidar';
import {read} from 'read-last-lines';
import {connect} from 'async-mqtt';

export const start = async (): Promise<void> => {
    const filePath = process.env.FILE_PATH;
    const host = process.env.MQTT_HOST;
    const port = process.env.MQTT_PORT ? process.env.MQTT_PORT : '1883';
    const client = connect(`tcp://${host}:${port}`);

    if (filePath) {
        watch(filePath.toString()).on('change', async (path) => {
            const lines = await read(path, 1);
            const {topic, message} = parse(lines);
            await client.publish(topic, message);
        });
    }// else {
    //    const errorMessage = 'process.env.FILE_PATH is not valid.';
    //    console.log(errorMessage);
    //    throw new Error(errorMessage);
    //}
}

const parse = () => {
    return {
        topic: 'someTopic',
        message: 'someMessage'
    };
}
