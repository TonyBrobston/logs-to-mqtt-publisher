export interface Options extends SharedOptions {
    logFilePath: string;
    logFileRegex: RegExp;
    mqttHost: string;
    mqttPort: string;
}

export interface InputOptions extends SharedOptions {
    logFilePath?: string;
    logFileRegex?: string;
    mqttHost?: string;
    mqttPort?: string;
}

export interface SharedOptions {
    mqttUsername?: string;
    mqttPassword?: string;
}
