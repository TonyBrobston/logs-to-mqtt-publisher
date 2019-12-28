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
        client.on('connect', () => {
            console.log('client connected');
        });
        client.on('connectAsync', () => {
            console.log('client connected async');
        });
        client.on('error', () => {
            console.log('client errored');
        });
        client.on('message', (topic: any, message: any) => {
            console.log('topic:', topic);
            console.log('message:', message.toString());
        });
    });

    afterAll(async () => {
        await client.end();
        server.close();
    });

    it('should stand up a mqtt broker, subscriber, publish, and receive message', async () => {
        console.log('in test');
        const subscribed = await client.subscribe('presence');
        await client.publish('presence', 'It works!');
        console.log('subscribed', subscribed);
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
