export interface Options extends SharedOptions {
    mqttHost: string;
    mqttPort: string;
}

export interface InputOptions extends SharedOptions {
    mqttHost?: string;
    mqttPort?: string;
}

export interface SharedOptions {
    logFilePath: string;
    logFileRegex: RegExp;
    mqttUsername?: string;
    mqttPassword?: string;
}
