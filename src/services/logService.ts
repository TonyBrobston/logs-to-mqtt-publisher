import {MqttPayload} from './../types/MqttPayload';

export const parse = (line: string, regex: RegExp): MqttPayload => {
    const found = line.match(regex);

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
