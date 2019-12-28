import {connectAsync} from 'async-mqtt';
import {Chance} from 'chance';
import {Server} from 'mosca';

const chance = new Chance();

describe('index', () => {
    let server: any,
        client: any;

    beforeAll(async () => {
        const host = 'localhost';
        const port = chance.natural({
            max: 9999,
            min: 1000,
        });
        server = await createServer({
            host,
            port,
        });
        client = await connectAsync(`tcp://${host}:${port}`);
    });

    afterAll(async () => {
        await client.end();
        server.close();
    });

    it('should stand up a mqtt broker, subscriber, publish, and receive message', async (done: any) => {
        await client.subscribe('presence');

        await client.publish('presence', 'It works!');

        client.on('message', (topic: any, message: any) => {
            expect(topic).toBe('presence');
            expect(message.toString()).toBe('It works!');
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
