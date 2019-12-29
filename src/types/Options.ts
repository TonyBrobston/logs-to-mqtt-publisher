export interface Mqtt {
    host: string;
    port: number;
    username?: string;
    password?: string;
}

export interface LogWatch {
    filePath: string;
    regularExpressions: RegExp[];
}

export interface Options {
    logWatches: LogWatch[];
    mqtt: Mqtt;
}
