import {run} from '../src/index';

describe('index', () => {
    it('should return hello world', async () => {
        expect(run()).toBe('Hello World');
    });
});
