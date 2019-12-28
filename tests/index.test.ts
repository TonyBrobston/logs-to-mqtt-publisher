import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {Chance} from 'chance';
import {closeSync, openSync, unlinkSync, writeFileSync} from 'fs';
import {Server} from 'mosca';

import {start, stop} from '../src/index';

const chance = new Chance();

describe('index', () => {
    let server: Server,
        client: AsyncMqttClient;
    const logFilePath = `${__dirname}/test.log`;
    const mqttHost = 'localhost';
    const mqttPort = chance.natural({
        max: 9999,
        min: 1000,
    });

    beforeEach(async () => {
        server = await createServerAsync({
            host: mqttHost,
            port: mqttPort,
        });
        client = await connectAsync(`tcp://${mqttHost}:${mqttPort}`);
        closeSync(openSync(logFilePath, 'w'));
    });

    afterEach(async () => {
        await stop();
        unlinkSync(logFilePath);
        client.end();
        server.close();
    });

    it('should subscribe to a topic, watch a file, modify that file, and expect a message',
       async (done: () => void) => {
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
        client.on('message', (topic: string, message: string) => {
            expect(topic).toBe(expectedTopic);
            expect(message.toString()).toBe(expectedMessage);
            done();
        });
    });
});

const createServerAsync = (settings: object): Promise<Server> => {
    return new Promise((resolve: (server: Server) => void): void  => {
        const server = new Server(settings);
        server.on('ready', () => {
            resolve(server);
        });
    });
};
