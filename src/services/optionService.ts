import {InputOptions} from '../types/Options';
import {Options} from '../types/Options';

export const override = (inputOptions: InputOptions): Options => {
    return {
        logFilePath: determineLogFilePath(inputOptions),
        logFileRegex: determineLogFileRegex(inputOptions),
        mqttHost: determineMqttHost(inputOptions),
        mqttPassword: determineMqttPassword(inputOptions),
        mqttPort: determineMqttPort(inputOptions),
        mqttUsername: determineMqttUsername(inputOptions),
    };
};

const determineLogFilePath = (inputOptions: InputOptions): string => {
    if (process.env.LOG_FILE_PATH) {
        return process.env.LOG_FILE_PATH;
    } else if (inputOptions.logFilePath) {
        return inputOptions.logFilePath;
    }

    return '';
};

const determineLogFileRegex = (inputOptions: InputOptions): RegExp => {
    if (process.env.LOG_FILE_REGEX) {
        return convertToRegex(process.env.LOG_FILE_REGEX);
    } else if (inputOptions.logFileRegex) {
        return convertToRegex(inputOptions.logFileRegex);
    }

    return new RegExp('');
};

const determineMqttHost = (inputOptions: InputOptions): string => {
    if (process.env.MQTT_HOST) {
        return process.env.MQTT_HOST;
    } else if (inputOptions.mqttHost) {
        return inputOptions.mqttHost;
    }

    return 'localhost';
};

const determineMqttPassword = (inputOptions: InputOptions): string|undefined => {
    if (process.env.MQTT_PASSWORD) {
        return process.env.MQTT_PASSWORD;
    } else if (inputOptions.mqttPassword) {
        return inputOptions.mqttPassword;
    }

    return undefined;
};

const determineMqttPort = (inputOptions: InputOptions): number => {
    if (process.env.MQTT_PORT) {
        return Number(process.env.MQTT_PORT);
    } else if (inputOptions.mqttPort) {
        return inputOptions.mqttPort;
    }

    return 1883;
};

const determineMqttUsername = (inputOptions: InputOptions): string|undefined => {
    if (process.env.MQTT_USERNAME) {
        return process.env.MQTT_USERNAME;
    } else if (inputOptions.mqttUsername) {
        return inputOptions.mqttUsername;
    }

    return undefined;
};

const convertToRegex = (regex: string): RegExp => {
    const regexSplit = regex.split('/');

    return new RegExp(regexSplit[1], regexSplit[2]);
};
