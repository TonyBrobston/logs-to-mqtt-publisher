import {connectAsync} from 'async-mqtt';
import {Chance} from 'chance';
import {watch} from 'chokidar';
import {read} from 'read-last-lines';
import {start} from '../src/index';
import {MqttPayload} from '../src/types/MqttPayload';

jest.mock('async-mqtt');
jest.mock('chokidar');
jest.mock('read-last-lines');
jest.mock('mqtt');

const chance = new Chance();

describe('index', () => {
    const logFilePath = chance.string();
    const logFileRegex = new RegExp('parentTopic|childTopic|message', 'g');
    const mqttHost = chance.string();
    const mqttPort = chance.string();
    const inputOptions = {
        logFilePath,
        logFileRegex,
        mqttHost,
        mqttPort,
    };
    const publish = jest.fn();
    const client = {
        publish,
    };
    (connectAsync as jest.Mock).mockResolvedValue(client);
    const path = chance.string();
    const on = jest.fn().mockImplementation((payload: MqttPayload, onCallback: any) => {
        onCallback(path);
    });
    const watcher = {
        on,
    };
    (watch as jest.Mock).mockReturnValue(watcher);
    const line = 'parentTopic,childTopic,message';
    read.mockResolvedValue(line);

    beforeAll(async () => {
        await start(inputOptions);
    });

    it('should call chokidar watch', () => {
        expect(watch).toHaveBeenCalledTimes(1);
        expect(watch).toHaveBeenCalledWith(logFilePath.toString());
    });

    it('should call chokidar on change', () => {
        expect(on).toHaveBeenCalledTimes(1);
        expect(on).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should call read-last-lines read', () => {
        expect(read).toHaveBeenCalledTimes(1);
        expect(read).toHaveBeenCalledWith(path, 1);
    });

    it('should call async-mqtt publish', () => {
        expect(publish).toHaveBeenCalledTimes(1);
        expect(publish).toHaveBeenCalledWith('parentTopic/childTopic', 'message');
    });
});
