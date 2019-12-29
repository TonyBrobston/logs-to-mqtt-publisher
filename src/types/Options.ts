export interface MqttOptions {
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
    mqttOptions: MqttOptions;
}
