import {InputOptions} from '../types/Options';
import {Options} from '../types/Options';

export const override = ({
    logFilePath,
    logFileRegex,
    mqttHost,
    mqttPort,
    mqttUsername,
    mqttPassword,
}: InputOptions): Options => {
    return {
        logFilePath: determineLogFilePath(logFilePath),
        logFileRegex: determineLogFileRegex(logFileRegex),
        mqttHost: determineMqttHost(mqttHost),
        mqttPassword: determineMqttPassword(mqttPassword),
        mqttPort: determineMqttPort(mqttPort),
        mqttUsername: determineMqttUsername(mqttUsername),
    };
};

const determineLogFilePath = (logFilePath?: string): string => {
    if (process.env.LOG_FILE_PATH) {
        return process.env.LOG_FILE_PATH;
    } else if (logFilePath) {
        return logFilePath;
    }

    return '';
};

const determineLogFileRegex = (logFileRegex?: string): RegExp => {
    if (process.env.LOG_FILE_REGEX) {
        return convertToRegex(process.env.LOG_FILE_REGEX);
    } else if (logFileRegex) {
        return convertToRegex(logFileRegex);
    }

    return new RegExp('');
};

const determineMqttHost = (mqttHost?: string): string => {
    if (process.env.MQTT_HOST) {
        return process.env.MQTT_HOST;
    } else if (mqttHost) {
        return mqttHost;
    }

    return 'localhost';
};

const determineMqttPassword = (mqttPassword?: string): string|undefined => {
    if (process.env.MQTT_PASSWORD) {
        return process.env.MQTT_PASSWORD;
    } else if (mqttPassword) {
        return mqttPassword;
    }

    return undefined;
};

const determineMqttPort = (mqttPort?: string): string => {
    if (process.env.MQTT_PORT) {
        return process.env.MQTT_PORT;
    } else if (mqttPort) {
        return mqttPort;
    }

    return '1883';
};

const determineMqttUsername = (mqttUsername?: string): string|undefined => {
    if (process.env.MQTT_USERNAME) {
        return process.env.MQTT_USERNAME;
    } else if (mqttUsername) {
        return mqttUsername;
    }

    return undefined;
};

const convertToRegex = (regex: string): RegExp => {
    const regexSplit = regex.split('/');

    return new RegExp(regexSplit[1], regexSplit[2]);
};
