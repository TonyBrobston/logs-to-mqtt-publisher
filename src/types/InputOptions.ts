import {SharedOptions} from './SharedOptions';

export interface InputOptions extends SharedOptions {
    logFilePath?: string;
    logFileRegex?: string;
    mqttHost?: string;
    mqttPort?: string;
}
