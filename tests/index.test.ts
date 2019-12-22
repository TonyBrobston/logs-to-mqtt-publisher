import Chance from 'chance';
import {watch} from 'chokidar';
import {read} from 'read-last-lines';
import {connect} from 'async-mqtt';
import {start} from '../src/index';

jest.mock('chokidar');
jest.mock('read-last-times');
jest.mock('mqtt');

const chance = new Chance();

describe('index', () => {
    it('should return hello world', async () => {
        const filePath = chance.string();
        process.env.FILE_PATH = filePath;
        const mqttHost = chance.string();
        process.env.MQTT_HOST = mqttHost;
        const mqttPort = chance.string();
        process.env.MQTT_PORT = mqttPort;
        const publish = jest.fn();
        const client = {
            publish
        }
        connect.mockReturnValue(client);
        const path = chance.string();
        const on = jest.fn().mockImplementation((event, onCallback) => {
            onCallback(path);
        });
        const watcher = {
            on
        };
        watch.mockReturnValue(watcher);
        const lines = chance.string();
        read.mockResolvedValue(lines);

        await start();

        expect(watch)
            .toHaveBeenCalledTimes(1)
            .toHaveBeenCalledWith(filePath.toString());
        expect(on)
            .toHaveBeenCalledTimes(1)
            .toHaveBeenCalledWith('chance', expect.any(Function));
        expect(read)
            .toHaveBeenCalledTimes(1)
            .toHaveBeenCalledWith(path, 1);
    });
});
