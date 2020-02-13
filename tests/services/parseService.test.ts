import {parseLog} from '../../src/services/parseService';

import MqttPayload from '../../src/types/MqttPayload';

describe('parse service', () => {
    it('should parse simple log line out of order', () => {
        const parentTopic = 'motion';
        const childTopic = 'North Camera';
        const expectedMessage = 'start';
        const logParse = {
            messageParse: {
                output: '{0}',
                regularExpression: `/${expectedMessage}/g`,
            },
            topicParse: {
                output: '{1}/{0}',
                regularExpression: `/${childTopic}|${parentTopic}/g`,
            },
        };
        const line = `${expectedMessage}|${childTopic}|${parentTopic}`;

        const {topic, message}: MqttPayload = parseLog(line, logParse);

        expect(topic).toBe(`${parentTopic}/${childTopic}`);
        expect(message).toBe(expectedMessage);
    });

    it('should parse simple log line with topic with text in middle', () => {
        const parentTopic = 'motion';
        const text = 'Camera';
        const childTopic = 'North Camera';
        const expectedMessage = 'start';
        const logParse = {
            messageParse: {
                output: '{0}',
                regularExpression: `/${expectedMessage}/g`,
            },
            topicParse: {
                output: `{1}/${text}/{0}`,
                regularExpression: `/${childTopic}|${parentTopic}/g`,
            },
        };
        const line = `${expectedMessage}|${childTopic}|${parentTopic}`;

        const {topic, message}: MqttPayload = parseLog(line, logParse);

        expect(topic).toBe(`${parentTopic}/${text}/${childTopic}`);
        expect(message).toBe(expectedMessage);
    });

    it('should parse simple log line with topic with only text', () => {
        const parentTopic = 'motion';
        const text = 'SomeRandomText';
        const childTopic = 'North Camera';
        const expectedMessage = 'start';
        const logParse = {
            messageParse: {
                output: '{0}',
                regularExpression: `/${expectedMessage}/g`,
            },
            topicParse: {
                output: text,
                regularExpression: `/${childTopic}|${parentTopic}/g`,
            },
        };
        const line = `${expectedMessage}|${childTopic}|${parentTopic}`;

        const {topic, message}: MqttPayload = parseLog(line, logParse);

        expect(topic).toBe(text);
        expect(message).toBe(expectedMessage);
    });

    it('should parse complex log line', () => {
        const parentTopic = 'motion';
        const childTopic = 'North Camera';
        const expectedMessage = 'start';
        const logParse = {
            messageParse: {
                output: '{0}',
                regularExpression: `/${expectedMessage}/g`,
            },
            topicParse: {
                output: '{0}/{1}',
                regularExpression: `/${parentTopic}|${childTopic}/g`,
            },
        };
        const line = `1577042817.781 2019-12-22 13:26:57.781/CST: INFO   [uv.analytics.${parentTopic}] [AnalyticsService] [FCECDAD8B870|${childTopic}] MotionEvent type:${expectedMessage} event:28345 clock:10377014318 in AnalyticsEvtBus-11`;

        const {topic, message}: MqttPayload = parseLog(line, logParse);

        expect(topic).toBe(`${parentTopic}/${childTopic}`);
        expect(message).toBe(expectedMessage);
    });

    it('should fail to parse', () => {
        const line = '';
        const regularExpression = '/foo/g';
        const logParse = {
            messageParse: {
                output: '{0}',
                regularExpression: `/foo/g`,
            },
            topicParse: {
                output: '{0}',
                regularExpression: `/bar/g`,
            },
        };

        const payload: MqttPayload = parseLog(line, logParse);

        expect(payload).toEqual({});
    });
});
