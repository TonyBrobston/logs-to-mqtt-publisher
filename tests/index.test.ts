import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {Chance} from 'chance';
import {closeSync, openSync, unlinkSync, writeFileSync} from 'fs';
import {Server} from 'mosca';

import {Mqtt} from '../src/types/Options';

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
    const username = chance.string();
    const password = chance.string();

    beforeEach(async () => {
        server = await createServerAsync({
                host,
                password,
                port,
                username,
            },
        );
        client = await connectAsync(`tcp://${host}:${port}`, {username, password});
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
                    password,
                    port,
                    username,
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

    describe('set environment variables', () => {
        it('should subscribe to a topic, watch a file, modify that file, and expect a message',
           async (done: () => void) => {
            const parentTopic = 'parentTopic2';
            const childTopic = 'childTopic2';
            const expectedTopic = `${parentTopic}/${childTopic}`;
            const expectedMessage = 'message2';
            const regularExpression = `/${parentTopic}|${childTopic}|${expectedMessage}/g`;
            await client.subscribe(expectedTopic);

            const options = {
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
                    password,
                    port,
                    username,
                },
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

const createServerAsync = ({
    host,
    password,
    port,
    username,
}: Mqtt): Promise<Server> => {
    return new Promise((resolve: (server: Server) => void): void  => {
        const server = new Server({
            host,
            port,
        });
        server.on('ready', () => {
            server.authenticate = (client: {}, actualUsername: any, actualPassword: any, callback: any): void => {
                const authenticated = actualUsername === username && actualPassword.toString() === password;
                callback(null, authenticated);
            };
            resolve(server);
        });
    });
};
