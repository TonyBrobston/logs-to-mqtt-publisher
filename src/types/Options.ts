export interface Mqtt {
    host: string;
    port: number;
    username?: string;
    password?: string;
}

export interface LogOption {
    filePath: string;
    regularExpressions: RegExp[];
}

export interface Options {
    logOptions: LogOption[];
    mqtt: Mqtt;
}
