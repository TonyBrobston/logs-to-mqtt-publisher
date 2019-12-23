import {InputOptions} from '../types/InputOptions';
import {Options} from '../types/Options';

export const override = (inputOptions: InputOptions): Options => {
    const {
        LOG_FILE_PATH,
        LOG_FILE_REGEX,
        MQTT_HOST,
        MQTT_PORT,
        MQTT_USERNAME,
        MQTT_PASSWORD,
    } = process.env;
    return {
        logFilePath: LOG_FILE_PATH ? LOG_FILE_PATH : '',
        logFileRegex: LOG_FILE_REGEX ? LOG_FILE_REGEX : '//',
        mqttHost: MQTT_HOST ? MQTT_HOST : 'localhost',
        mqttPort: MQTT_PORT ? MQTT_PORT : '1883',
        mqttUsername: MQTT_USERNAME ? MQTT_USERNAME : '',
        mqttPassword: MQTT_PASSWORD ? MQTT_PASSWORD : '',
       ...inputOptions,
    };
};
