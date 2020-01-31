import LogWatch from '../types/LogWatch';
import Mqtt from '../types/Mqtt';

export default interface Options {
    log: boolean;
    logWatches: LogWatch[];
    mqtt: Mqtt;
}
