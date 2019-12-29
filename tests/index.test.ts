import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {Chance} from 'chance';
import {closeSync, openSync, unlinkSync, writeFileSync} from 'fs';
import {Server} from 'mosca';

import {start, stop} from '../src/index';

const chance = new Chance();

describe('index', () => {
    let server: Server,
        client: AsyncMqttClient;
    const host = 'localhost';
    const port = chance.natural({
        max: 9999,
        min: 1000,
    });
    const filePath = `${__dirname}/test.log`;

    beforeEach(async () => {
        server = await createServerAsync({
            host,
            port,
        });
        client = await connectAsync(`tcp://${host}:${port}`);
        closeSync(openSync(filePath, 'w'));
    });

    afterEach(() => {
        stop();
        unlinkSync(filePath);
        client.end();
        server.close();
    });

    it('should subscribe to a topic, watch a file, modify that file, and expect a message',
       async (done: () => void) => {
        const parentTopic = 'parentTopic';
        const childTopic = 'childTopic';
        const expectedTopic = `${parentTopic}/${childTopic}`;
        const expectedMessage = 'message';
        const regularExpression = `/${parentTopic}|${childTopic}|${expectedMessage}/g`;
        await client.subscribe(expectedTopic);

        await start({
            logWatches: [
                {
                    filePath,
                    regularExpressions: [
                        regularExpression,
                    ],
                },
            ],
            mqtt: {
                host,
                port,
            },
        });

        writeFileSync(filePath, `${parentTopic},${childTopic},${expectedMessage}`);
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
