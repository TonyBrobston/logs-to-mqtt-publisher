import {MqttPayload} from './../types/MqttPayload';

export const parse = (line: string, regularExpression: string): MqttPayload => {
    const found = line.match(convertToRegex(regularExpression));

    if (found) {
        const message = found[2];
        const parentTopic = found[0];
        const childTopic = found[1];

        return {
            message,
            topic: `${parentTopic}/${childTopic}`,
        };
    }

    return {};
};

const convertToRegex = (regularExpression: string): RegExp => {
    const split = regularExpression.split('/');

    return new RegExp(split[1], split[2]);
};
