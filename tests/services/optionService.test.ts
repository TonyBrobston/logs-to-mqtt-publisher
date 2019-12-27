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
                    logFilePath: '/',
                    logFileRegex: new RegExp(''),
                    mqttHost: 'localhost',
                    mqttPort: '1883',
                } as Options,
                inputOptions: {
                    logFilePath: '/',
                    logFileRegex: new RegExp(''),
                } as InputOptions,
                name: 'should not override any inputOptions',
            },
            {
                expectedOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: new RegExp('blah', 'g'),
                    mqttHost: '127.0.0.1',
                    mqttPassword: 'password',
                    mqttPort: '1337',
                    mqttUsername: 'root',
                } as Options,
                inputOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: new RegExp('blah', 'g'),
                    mqttHost: '127.0.0.1',
                    mqttPassword: 'password',
                    mqttPort: '1337',
                    mqttUsername: 'root',
                } as InputOptions,
                name: 'should override all inputOptions',
            },
            {
                expectedOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: new RegExp('blah', 'g'),
                    mqttHost: '127.0.0.1',
                    mqttPort: '1337',
                } as Options,
                inputOptions: {
                    logFilePath: '/var/log/',
                    logFileRegex: new RegExp('blah', 'g'),
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
});
