import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {Chance} from 'chance';
import {closeSync, openSync, unlinkSync, writeFileSync} from 'fs';
import {Server} from 'mosca';

import {createServerAsync} from './utils/moscaHelper';

import Mqtt from '../src/types/Mqtt';

import {start, stop} from '../src/index';

const chance = new Chance();

describe('index', () => {
    const filePath = `${__dirname}/test.log`;
    const unauthenticatedMqtt = {
        host: 'localhost',
        port: chance.natural({
            max: 9999,
            min: 1000,
        }),
    };
    const authenticatedMqtt = {
        ...unauthenticatedMqtt,
        password: chance.string(),
        username: chance.string(),
    };

    let server: Server,
        client: AsyncMqttClient;

    const before = async (mqtt: Mqtt): Promise<void> => {
        server = await createServerAsync(mqtt);
        const {host, username, password, port}: Mqtt = mqtt;
        const options = username && password ? {username, password} : {};
        client = await connectAsync(`tcp://${host}:${port}`, options);
        closeSync(openSync(filePath, 'w'));
    };

    afterEach(async (done: () => void) => {
        await stop();
        unlinkSync(filePath);
        await client.end();
        server.close();
        process.env.OPTIONS = undefined;
        done();
    });

    describe('set javascript Options variable', () => {
        it('should subscribe to a topic on authenticated broker, watch a file, modify that file, and expect a message',
          async (done: () => void) => {
            const mqtt = unauthenticatedMqtt;
            await before(mqtt);
            const parentTopic = 'parentTopic1';
            const childTopic = 'childTopic1';
            const expectedTopic = `${parentTopic}/${childTopic}`;
            const expectedMessage = 'message1';
            await client.subscribe(expectedTopic);

            await start({
                log: true,
                logWatches: [
                    {
                        filePath,
                        logParses: [
                            {
                                messageParse: {
                                    delimiter: '',
                                    order: [0],
                                    regularExpression: `/${expectedMessage}/g`,
                                },
                                topicParse: {
                                    delimiter: '/',
                                    order: [0, 1],
                                    regularExpression: `/${parentTopic}|${childTopic}/g`,
                                },
                            },
                        ],
                    },
                ],
                mqtt,
            });

            writeFileSync(filePath, `${parentTopic},${childTopic},${expectedMessage}`);
            client.on('message', (topic: string, message: string) => {
                console.log('topic:', topic);
                expect(topic).toBe(expectedTopic);
                console.log('message:', message);
                expect(message.toString()).toBe(expectedMessage);
                done();
            });
        });
    });

    describe('set environment variables', () => {
        it('should subscribe to a topic on an unauthenticated broker, watch a file, modify that file, and expect a message',
          async (done: () => void) => {
            const mqtt = authenticatedMqtt;
            await before(mqtt);
            const parentTopic = 'parentTopic2';
            const childTopic = 'childTopic2';
            const expectedTopic = `${parentTopic}/${childTopic}`;
            const expectedMessage = 'message2';
            await client.subscribe(expectedTopic);

            const options = {
                log: false,
                logWatches: [
                    {
                        filePath,
                        logParses: [
                            {
                                messageParse: {
                                    delimiter: '',
                                    order: [0],
                                    regularExpression: `/${expectedMessage}/g`,
                                },
                                topicParse: {
                                    delimiter: '/',
                                    order: [0, 1],
                                    regularExpression: `/${parentTopic}|${childTopic}/g`,
                                },
                            },
                        ],
                    },
                ],
                mqtt,
            };
            process.env.OPTIONS = JSON.stringify(options);

            await start();

            writeFileSync(filePath, `${parentTopic},${childTopic},${expectedMessage}`);
            client.on('message', (topic: string, message: string) => {
                expect(topic).toBe(expectedTopic);
                expect(message.toString()).toBe(expectedMessage);
                done();
            });
        });
    });
});
