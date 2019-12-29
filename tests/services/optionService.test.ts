import {parseOptions} from '../../src/services/optionService';

describe('option service', () => {
    it('should parse into Options', () => {
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

        const actualOptions = parseOptions(JSON.stringify(expectedOptions));

        expect(actualOptions).toEqual(expectedOptions);
    });

    it('should throws', () => {
        const expectedOptions = undefined;

        const actualOptions = parseOptions(expectedOptions);

        expect(actualOptions).toEqual({});
    });
});
