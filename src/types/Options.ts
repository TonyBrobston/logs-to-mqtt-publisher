import {SharedOptions} from './SharedOptions';

export interface Options extends SharedOptions {
    logFilePath: string;
    logFileRegex: RegExp;
    mqttHost: string;
    mqttPort: string;
}
