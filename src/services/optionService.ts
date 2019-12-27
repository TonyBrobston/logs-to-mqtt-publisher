import {InputOptions} from '../types/Options';
import {Options} from '../types/Options';

export const override = (inputOptions: InputOptions): Options => {
    return {
        mqttHost: 'localhost',
        mqttPort: 1883,
        ...inputOptions,
    };
};
