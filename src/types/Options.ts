import {SharedOptions} from './SharedOptions';

export interface Options extends SharedOptions {
    logFilePath: string;
    logFileRegex: string;
    mqttHost: string;
    mqttPort: string;
}