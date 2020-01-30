import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {Chance} from 'chance';
import {Server} from 'mosca';

import {setupLogging} from '../../src/services/logService';
import {createServerAsync} from '../utils/moscaHelper';

const chance = new Chance();

global.console.log = jest.fn();

describe('log service', () => {
    const host = 'localhost';
    const port = chance.natural({
        max: 9999,
        min: 1000,
    });
    const mqtt = {
        host,
        port,
    };
    let server: Server,
        client: AsyncMqttClient;

    beforeEach(async (done: () => void) => {
        server = await createServerAsync(mqtt);
        client = await connectAsync(`tcp://${host}:${port}`);
        done();
    });

    afterEach((done: () => void) => {
        client.end();
        server.close();
        done();
    });

    it('should call', async () => {
        setupLogging(client);

        client.on('connect', () => {
            expect(global.console.log).toHaveBeenCalledTimes(1);
            expect(global.console.log).toHaveBeenCalledWith('CONNECTED!');
        });
    });
});
