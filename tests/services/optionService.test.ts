import {Chance} from 'chance';

import {override} from '../../src/services/optionService';
import {InputOptions} from '../../src/types/InputOptions';
import {Options} from '../../src/types/Options';

const chance = new Chance();

describe('optionService', () => {
    describe('set through options', () => {
        const scenarios = [
            {
                expectedOptions: {
                    logFilePath: '',
                    logFileRegex: '',
                    mqttHost: 'localhost',
                    mqttPort: '1883',
                    mqttUsername: '',
                    mqttPassword: '',
                } as Options,
                inputOptions: {} as InputOptions,
                name: 'should not override any inputOptions',
            },
            {
                expectedOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: '/blah/g',
                    mqttHost: '127.0.0.1',
                    mqttPort: '1337',
                    mqttUsername: 'root',
                    mqttPassword: 'password',
                } as Options,
                inputOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: '/blah/g',
                    mqttHost: '127.0.0.1',
                    mqttPort: '1337',
                    mqttUsername: 'root',
                    mqttPassword: 'password',
                } as InputOptions,
                name: 'should override all inputOptions',
            },
            {
                expectedOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: '/blah/g',
                    mqttHost: '127.0.0.1',
                    mqttPort: '1337',
                    mqttUsername: '',
                    mqttPassword: '',
                } as Options,
                inputOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: '/blah/g',
                    mqttHost: '127.0.0.1',
                    mqttPort: '1337',
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
            const logFileRegex = chance.string();
            process.env.LOG_FILE_REGEX = logFileRegex;
            const mqttHost = chance.string();
            process.env.MQTT_HOST = mqttHost;
            const mqttPort = chance.string();
            process.env.MQTT_PORT = mqttPort;
            const mqttUsername = chance.string();
            process.env.MQTT_USERNAME = mqttUsername;
            const mqttPassword = chance.string();
            process.env.MQTT_PASSWORD = mqttPassword;
            const inputOptions = {
            };

            const mergedOptions = override(inputOptions);

            const expectedOptions = {
                logFilePath,
                logFileRegex,
                mqttHost,
                mqttPort,
                mqttUsername,
                mqttPassword,
            };
            expect(mergedOptions).toEqual(expectedOptions);
        });
    });
});
