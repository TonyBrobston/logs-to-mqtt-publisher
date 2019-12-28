import {connectAsync} from 'async-mqtt';
import {Server} from 'mosca';

describe('index', () => {
    let server: any,
        client: any;

    beforeAll(async () => {
        server = await createServer({
            host: 'localhost',
            port: 1883,
        });
        client = await connectAsync('tcp://localhost:1883');
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
