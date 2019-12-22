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
        const logFileRegex = '/parentTopic|childTopic|message/g';
        process.env.LOG_FILE_REGEX = logFileRegex;
        const publish = jest.fn();
        const client = {
            publish
        };
        (connectAsync as jest.Mock).mockResolvedValue(client);
        const path = chance.string();
        const on = jest.fn().mockImplementation((topic, onCallback) => {
            onCallback(path);
        });
        const watcher = {
            on
        };
        (watch as jest.Mock).mockReturnValue(watcher);
        const line = 'parentTopic,childTopic,message';
        read.mockResolvedValue(line);

        await start();

        expect(watch).toHaveBeenCalledTimes(1);
        expect(watch).toHaveBeenCalledWith(logFilePath.toString());
        expect(on).toHaveBeenCalledTimes(1);
        expect(on).toHaveBeenCalledWith('change', expect.any(Function));
        expect(read).toHaveBeenCalledTimes(1);
        expect(read).toHaveBeenCalledWith(path, 1);
        expect(publish).toHaveBeenCalledTimes(1);
        expect(publish).toHaveBeenCalledWith('parentTopic/childTopic', 'message');
    });

    it('should parse', () => {
        const parentTopic = 'motion';
        const childTopic = 'North Camera';
        const expectedMessage = 'start';
        const line = `1577042817.781 2019-12-22 13:26:57.781/CST: INFO   [uv.analytics.${parentTopic}] [AnalyticsService] [FCECDAD8B870|${childTopic}] MotionEvent type:${expectedMessage} event:28345 clock:10377014318 in AnalyticsEvtBus-11`;
        const regex = /(?<=\[uv.analytics.)[a-z]+(?=\])|(?<=\[[0-9A-Z]{12}\|).*(?=\])|(?<=type:)[a-zA-Z0-9]+/g;

        const {topic, message} = parse(line, regex);

        expect(topic).toBe(`${parentTopic}/${childTopic}`);
        expect(message).toBe(expectedMessage);
    });
});
