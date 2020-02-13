import LogParse from './../types/LogParse';
import MqttPayload from './../types/MqttPayload';
import Parse from './../types/Parse';

export const parseLog = (line: string, logParse: LogParse): MqttPayload => {
    const {messageParse, topicParse}: LogParse = logParse;
    const topicMatches = line.match(convertToRegex(topicParse.regularExpression));
    const messageMatches = line.match(convertToRegex(messageParse.regularExpression));

    if (topicMatches && messageMatches) {
        const message = replaceOutputWithMatches(messageMatches, messageParse.output);
        const topic = replaceOutputWithMatches(topicMatches, topicParse.output);

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

const replaceOutputWithMatches = (matches: string[], output: string): string => {
    let replacedOutput = output;
    matches.forEach((match: string, index: number) => {
        replacedOutput = replacedOutput.replace(`{${index}}`, match);
    });
    return replacedOutput;
};
