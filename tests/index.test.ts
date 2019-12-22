import {Chance} from 'chance';
import {connectAsync} from 'async-mqtt';
import {watch} from 'chokidar';
import {read} from 'read-last-lines';
import {start, parse} from '../src/index';

jest.mock('async-mqtt');
jest.mock('chokidar');
jest.mock('read-last-lines');
jest.mock('mqtt');

const chance = new Chance();

describe('index', () => {
    it('should start', async () => {
        const logFilePath = chance.string();
        process.env.LOG_FILE_PATH = logFilePath;
        const mqttHost = chance.string();
        process.env.MQTT_HOST = mqttHost;
        const mqttPort = chance.string();
        process.env.MQTT_PORT = mqttPort;
        const logFileRegex = '/event|camera|message/g';
        process.env.LOG_FILE_REGEX = logFileRegex;
        const publish = jest.fn();
        const client = {
            publish
        };
        (connectAsync as jest.Mock).mockResolvedValue(client);
        const path = chance.string();
        const on = jest.fn().mockImplementation((event, onCallback) => {
            onCallback(path);
        });
        const watcher = {
            on
        };
        (watch as jest.Mock).mockReturnValue(watcher);
        const line = 'event,camera,message';
        read.mockResolvedValue(line);

        await start();

        expect(watch).toHaveBeenCalledTimes(1);
        expect(watch).toHaveBeenCalledWith(logFilePath.toString());
        expect(on).toHaveBeenCalledTimes(1);
        expect(on).toHaveBeenCalledWith('change', expect.any(Function));
        expect(read).toHaveBeenCalledTimes(1);
        expect(read).toHaveBeenCalledWith(path, 1);
        expect(publish).toHaveBeenCalledTimes(1);
        expect(publish).toHaveBeenCalledWith('event/camera', 'message');
    });

    it('should parse', () => {
        const event = 'motion';
        const camera = 'House Northeast';
        const expectedMessage = 'start';
        const line = `1577042817.781 2019-12-22 13:26:57.781/CST: INFO   [uv.analytics.${event}] [AnalyticsService] [FCECDAD8B870|${camera}] MotionEvent type:${expectedMessage} event:28345 clock:10377014318 in AnalyticsEvtBus-11`;
        const regex = /motion|House Northeast|start/g;

        const {topic, message} = parse(line, regex);

        expect(topic).toBe(`${event}/${camera}`);
        expect(message).toBe(expectedMessage);
    });
});
