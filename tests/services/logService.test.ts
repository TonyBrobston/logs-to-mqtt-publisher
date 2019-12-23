import {parse} from '../../src/services/logService';

import {MqttPayload} from '../../src/types/MqttPayload';

describe('log service', () => {
    it('should parse', () => {
        const parentTopic = 'motion';
        const childTopic = 'North Camera';
        const expectedMessage = 'start';
        const line = `1577042817.781 2019-12-22 13:26:57.781/CST: INFO   [uv.analytics.${parentTopic}] [AnalyticsService] [FCECDAD8B870|${childTopic}] MotionEvent type:${expectedMessage} event:28345 clock:10377014318 in AnalyticsEvtBus-11`;
        const regex = /(?<=\[uv.analytics.)[a-z]+(?=\])|(?<=\[[0-9A-Z]{12}\|).*(?=\])|(?<=type:)[a-zA-Z0-9]+/g;

        const {topic, message}: MqttPayload = parse(line, regex);

        expect(topic).toBe(`${parentTopic}/${childTopic}`);
        expect(message).toBe(expectedMessage);
    });

    it('should fail to parse', () => {
        const line = '';
        const regex = /foo/g;

        const payload: MqttPayload = parse(line, regex);

        expect(payload).toEqual({});
    });
});
