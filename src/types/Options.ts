export interface Options extends SharedOptions {
    logFileRegex: RegExp;
    mqttHost: string;
    mqttPort: string;
}

export interface InputOptions extends SharedOptions {
    logFileRegex: string;
    mqttHost?: string;
    mqttPort?: string;
}

export interface SharedOptions {
    logFilePath: string;
    mqttUsername?: string;
    mqttPassword?: string;
}
