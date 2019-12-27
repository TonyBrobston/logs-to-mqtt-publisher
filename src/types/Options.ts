export interface Options extends SharedOptions {
    mqttHost: string;
    mqttPort: number;
}

export interface InputOptions extends SharedOptions {
    mqttHost?: string;
    mqttPort?: number;
}

export interface SharedOptions {
    logFilePath: string;
    logFileRegex: RegExp;
    mqttUsername?: string;
    mqttPassword?: string;
}
