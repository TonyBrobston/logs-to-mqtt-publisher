import {LogParse} from './../types/LogParse';
import {MqttPayload} from './../types/MqttPayload';
import {Parse} from './../types/Parse';

export const parseLog = (line: string, logParse: LogParse): MqttPayload => {
    const {messageParse, topicParse}: LogParse = logParse;
    const topicFound = line.match(convertToRegex(topicParse.regularExpression));
    const messageFound = line.match(convertToRegex(messageParse.regularExpression));

    if (topicFound && messageFound) {
        const topic = parseAndJoin(topicFound, topicParse);
        const message = parseAndJoin(messageFound, messageParse);

        return {
            message,
            topic,
        };
    }

    return {};
};

const convertToRegex = (regularExpression: string): RegExp => {
    const split = regularExpression.split('/');

    return new RegExp(split[1], split[2]);
};

const parseAndJoin = (found: string[], parse: Parse): string => {
    return parse.order.map((index: number) => found[index]).join(parse.delimiter);
};
