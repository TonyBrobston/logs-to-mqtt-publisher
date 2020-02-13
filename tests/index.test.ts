import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {Chance} from 'chance';
import {closeSync, openSync, unlinkSync, writeFileSync} from 'fs';
import {Server} from 'mosca';

import {createServerAsync} from './utils/moscaHelper';

import Mqtt from '../src/types/Mqtt';

import {start, stop} from '../src/index';

const chance = new Chance();

global.console.log = jest.fn();

describe('index', () => {
    const filePath = `${__dirname}/test.log`;
    const optionsFilePath = `${__dirname}/options.json`;
    const mqtt = {
        host: 'localhost',
        password: chance.string(),
        port: chance.natural({
            max: 9999,
            min: 1000,
        }),
        username: chance.string(),
    };

    let server: Server,
        client: AsyncMqttClient;

    beforeEach(async (done: () => void) => {
        server = await createServerAsync(mqtt);
        const {host, username, password, port}: Mqtt = mqtt;
        client = await connectAsync(`tcp://${host}:${port}`, {username, password});
        closeSync(openSync(filePath, 'w'));
        closeSync(openSync(optionsFilePath, 'w'));
        done();
    });

    afterEach(async (done: () => void) => {
        await stop();
        unlinkSync(filePath);
        unlinkSync(optionsFilePath);
        await client.end();
        server.close();
        process.env.OPTIONS = undefined;
        done();
    });

    it('should pass in options, subscribe to a topic, watch a file, modify that file, and expect a message',
      async (done: () => void) => {
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
                                output: '{0}',
                                regularExpression: `/${expectedMessage}/g`,
                            },
                            topicParse: {
                                output: '{0}/{1}',
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
            expect(topic).toBe(expectedTopic);
            expect(message.toString()).toBe(expectedMessage);
            done();
        });
    });

    it('should get options from env, subscribe to a topic, watch a file, modify that file, and expect a message',
      async (done: () => void) => {
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
                                output: '{0}',
                                regularExpression: `/${expectedMessage}/g`,
                            },
                            topicParse: {
                                output: '{0}/{1}',
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

    it('should get options from file, subscribe to a topic, watch a file, modify that file, and expect a message',
      async (done: () => void) => {
        const parentTopic = 'parentTopic3';
        const childTopic = 'childTopic3';
        const expectedTopic = `${parentTopic}/${childTopic}`;
        const expectedMessage = 'message3';
        await client.subscribe(expectedTopic);
        const options = {
            log: false,
            logWatches: [
                {
                    filePath,
                    logParses: [
                        {
                            messageParse: {
                                output: '{0}',
                                regularExpression: `/${expectedMessage}/g`,
                            },
                            topicParse: {
                                output: '{0}/{1}',
                                regularExpression: `/${parentTopic}|${childTopic}/g`,
                            },
                        },
                    ],
                },
            ],
            mqtt,
        };
        writeFileSync(optionsFilePath, JSON.stringify(options));
        process.env.OPTIONS_FILE_PATH = optionsFilePath;

        await start();

        writeFileSync(filePath, `${parentTopic},${childTopic},${expectedMessage}`);
        client.on('message', (topic: string, message: string) => {
            expect(topic).toBe(expectedTopic);
            expect(message.toString()).toBe(expectedMessage);
            done();
        });
    });
});
