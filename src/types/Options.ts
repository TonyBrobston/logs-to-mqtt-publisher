import LogWatch from '../types/LogWatch';
import Mqtt from '../types/Mqtt';

export default interface Options {
    logWatches: LogWatch[];
    mqtt: Mqtt;
}
