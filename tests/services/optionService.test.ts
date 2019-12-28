import {Chance} from 'chance';

import {override} from '../../src/services/optionService';
import {InputOptions} from '../../src/types/Options';
import {Options} from '../../src/types/Options';

const chance = new Chance();

describe('optionService', () => {
    describe('set through options', () => {
        const scenarios = [
            {
                expectedOptions: {
                    logFilePath: '',
                    logFileRegex: new RegExp(''),
                    mqttHost: 'localhost',
                    mqttPassword: undefined,
                    mqttPort: 1883,
                    mqttUsername: undefined,
                } as Options,
                inputOptions: {} as InputOptions,
                name: 'should not override any inputOptions',
            },
            {
                expectedOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: new RegExp('blah', 'g'),
                    mqttHost: '127.0.0.1',
                    mqttPassword: 'password',
                    mqttPort: 1337,
                    mqttUsername: 'root',
                } as Options,
                inputOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: '/blah/g',
                    mqttHost: '127.0.0.1',
                    mqttPassword: 'password',
                    mqttPort: 1337,
                    mqttUsername: 'root',
                } as InputOptions,
                name: 'should override all inputOptions',
            },
            {
                expectedOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: new RegExp('blah', 'g'),
                    mqttHost: '127.0.0.1',
                    mqttPassword: undefined,
                    mqttPort: 1337,
                    mqttUsername: undefined,
                } as Options,
                inputOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: '/blah/g',
                    mqttHost: '127.0.0.1',
                    mqttPort: 1337,
                } as InputOptions,
                name: 'should override only the main ones used',
            },
        ];

        scenarios.forEach((scenario: {
            expectedOptions: Options,
            inputOptions: InputOptions,
            name: string,
        }) => {
            it(scenario.name, () => {
                const mergedOptions = override(scenario.inputOptions);

                expect(mergedOptions).toEqual(scenario.expectedOptions);
            });
        });
    });

    describe('set through environment variables', () => {
        it('should choose environment variables over default', () => {
            const logFilePath = chance.string();
            process.env.LOG_FILE_PATH = logFilePath;
            const logFileRegex = '/blah/g';
            process.env.LOG_FILE_REGEX = logFileRegex;
            const mqttHost = chance.string();
            process.env.MQTT_HOST = mqttHost;
            const mqttPassword = chance.string();
            process.env.MQTT_PASSWORD = mqttPassword;
            const mqttPort = chance.natural();
            process.env.MQTT_PORT = mqttPort.toString();
            const mqttUsername = chance.string();
            process.env.MQTT_USERNAME = mqttUsername;
            const inputOptions = {
                logFilePath: '/var/log/',
                logFileRegex: '/blah/g',
                mqttHost: '127.0.0.1',
                mqttPassword: 'password',
                mqttPort: 1337,
                mqttUsername: 'root',
            } as InputOptions;

            const mergedOptions = override(inputOptions);

            const expectedOptions = {
                logFilePath,
                logFileRegex: new RegExp('blah', 'g'),
                mqttHost,
                mqttPassword,
                mqttPort,
                mqttUsername,
            };
            expect(mergedOptions).toEqual(expectedOptions);
        });
    });
});
