import {connectAsync} from 'async-mqtt';
import {Chance} from 'chance';
import {closeSync, openSync, unlinkSync, writeFileSync} from 'fs';
import {Server} from 'mosca';

import {start, stop} from '../src/index';

const chance = new Chance();

describe('index', () => {
    let server: any,
        client: any;
    const logFilePath = `${__dirname}/test.log`;
    const mqttHost = 'localhost';
    const mqttPort = chance.natural({
        max: 9999,
        min: 1000,
    });
    beforeAll(async () => {
        server = await createServer({
            host: mqttHost,
            port: mqttPort,
        });
        client = await connectAsync(`tcp://${mqttHost}:${mqttPort}`);
        closeSync(openSync(logFilePath, 'w'));
    });

    afterAll(async () => {
        await stop();
        unlinkSync(logFilePath);
        client.end();
        server.close();
    });

    it('should subscribe to a topic, watch a file, modify that file, and expect a message', async (done: any) => {
        const parentTopic = 'parentTopic';
        const childTopic = 'childTopic';
        const expectedTopic = `${parentTopic}/${childTopic}`;
        const expectedMessage = 'message';
        await client.subscribe(expectedTopic);

        await start({
            logFilePath,
            logFileRegex: `/${parentTopic}|${childTopic}|${expectedMessage}/g`,
            mqttHost,
            mqttPort,
        });

        writeFileSync(logFilePath, `${parentTopic},${childTopic},${expectedMessage}`);
        client.on('message', (topic: any, message: any) => {
            expect(topic).toBe(expectedTopic);
            expect(message.toString()).toBe(expectedMessage);
            done();
        });
    });
});

const createServer = (settings: any): any => {
    return new Promise((resolve: any): any => {
        const server = new Server(settings);
        server.on('ready', () => {
            resolve(server);
        });
    });
};
