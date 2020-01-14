import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {Chance} from 'chance';
import {closeSync, openSync, unlinkSync, writeFileSync} from 'fs';
import {Server} from 'mosca';

import {start, stop} from '../src/index';

const chance = new Chance();
const expectedUsername = chance.string();
const expectedPassword = chance.string();

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

    describe('set javascript Options variable', () => {
        it('should subscribe to a topic, watch a file, modify that file, and expect a message',
           async (done: () => void) => {
            const parentTopic = 'parentTopic1';
            const childTopic = 'childTopic1';
            const expectedTopic = `${parentTopic}/${childTopic}`;
            const expectedMessage = 'message1';
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
                    password: expectedPassword,
                    port,
                    username: expectedUsername,
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

//    describe('set environment variables', () => {
//        it('should subscribe to a topic, watch a file, modify that file, and expect a message',
//           async (done: () => void) => {
//            const parentTopic = 'parentTopic2';
//            const childTopic = 'childTopic2';
//            const expectedTopic = `${parentTopic}/${childTopic}`;
//            const expectedMessage = 'message2';
//            const regularExpression = `/${parentTopic}|${childTopic}|${expectedMessage}/g`;
//            await client.subscribe(expectedTopic);
//
//            const options = {
//                logWatches: [
//                    {
//                        filePath,
//                        regularExpressions: [
//                            regularExpression,
//                        ],
//                    },
//                ],
//                mqtt: {
//                    host,
//                    port,
//                },
//            };
//            process.env.OPTIONS = JSON.stringify(options);
//
//            await start();
//
//            writeFileSync(filePath, `${parentTopic},${childTopic},${expectedMessage}`);
//            client.on('message', (topic: string, message: string) => {
//                expect(topic).toBe(expectedTopic);
//                expect(message.toString()).toBe(expectedMessage);
//                done();
//            });
//        });
//    });
});

const createServerAsync = (settings: object): Promise<Server> => {
    return new Promise((resolve: (server: Server) => void): void  => {
        const server = new Server(settings);
        server.on('ready', () => {
            server.authenticate = (client: {}, username: any, password: any, callback: any): void => {
                callback(null, username === expectedUsername && password === expectedPassword);
            };
            resolve(server);
        });
    });
};
