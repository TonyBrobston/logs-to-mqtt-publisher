import {closeSync, openSync, unlinkSync, writeFileSync} from 'fs';

import {getOptionsFromEnvironmentOrFile} from '../../src/services/optionService';

describe('option service', () => {
    const optionsFilePath = `${__dirname}/options.json`;

    beforeEach(() => {
        closeSync(openSync(optionsFilePath, 'w'));
    });

    afterEach(() => {
        unlinkSync(optionsFilePath);
    });

    it('should parse from file with OPTIONS_FILE_PATH env', () => {
        process.env.OPTIONS_FILE_PATH = optionsFilePath;
        delete process.env.OPTIONS;
        const expectedOptions = {
            logWatches: [
                {
                    filePath: '/foo/bar.log',
                    regularExpressions: [
                        '/foo/g',
                    ],
                },
            ],
            mqtt: {
                host: 'localhost',
                port: 1883,
            },
        };
        writeFileSync(optionsFilePath, JSON.stringify(expectedOptions));

        const actualOptions = getOptionsFromEnvironmentOrFile();

        expect(actualOptions).toEqual(expectedOptions);
    });

    it('should parse from OPTIONS env', () => {
        delete process.env.OPTIONS_FILE_PATH;
        const expectedOptions = {
            logWatches: [
                {
                    filePath: '/foo/bar.log',
                    regularExpressions: [
                        '/foo/g',
                    ],
                },
            ],
            mqtt: {
                host: 'localhost',
                port: 1883,
            },
        };
        process.env.OPTIONS = JSON.stringify(expectedOptions);

        const actualOptions = getOptionsFromEnvironmentOrFile();

        expect(actualOptions).toEqual(expectedOptions);
    });

    it('should parse empty object', () => {
        delete process.env.OPTIONS_FILE_PATH;
        delete process.env.OPTIONS;

        const actualOptions = getOptionsFromEnvironmentOrFile();

        expect(actualOptions).toEqual({});
    });
});
