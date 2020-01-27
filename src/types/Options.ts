import {LogWatch} from '../types/LogWatch';
import {Mqtt} from '../types/Mqtt';

export interface Options {
    logWatches: LogWatch[];
    mqtt: Mqtt;
}
