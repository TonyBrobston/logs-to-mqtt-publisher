import {AsyncMqttClient, connect} from 'async-mqtt';
import {Chance} from 'chance';

import {setupLogging} from '../../src/services/logService';
import {createServerAsync} from '../utils/moscaHelper';

const chance = new Chance();

global.console.log = jest.fn();

describe('log service', () => {
    let client: AsyncMqttClient;

    beforeEach(async (done: () => void) => {
        client = {} as AsyncMqttClient;
        client.on = jest.fn().mockImplementation((event: string, callback: () => {}) => {
            callback();
        });

        setupLogging(client);

        done();
    });

    it('should call client on x times', () => {
        expect(client.on).toHaveBeenCalledTimes(10);
    });

    it('should call console log x times', () => {
        expect(global.console.log).toHaveBeenCalledTimes(20);
    });

    it('should call on connect', () => {
        expect(client.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(global.console.log).toHaveBeenCalledWith('CONNECTED!');
    });

    it('should call on reconnect', () => {
        expect(client.on).toHaveBeenCalledWith('reconnect', expect.any(Function));
        expect(global.console.log).toHaveBeenCalledWith('RECONNECTED!');
    });

    it('should call on disconnect', () => {
        expect(client.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
        expect(global.console.log).toHaveBeenCalledWith('DISCONNECTED!');
    });

    it('should call on message', () => {
        expect(client.on).toHaveBeenCalledWith('message', expect.any(Function));
        expect(global.console.log).toHaveBeenCalledWith('MESSAGE SENT!');
    });

    it('should call on packetreceive', () => {
        expect(client.on).toHaveBeenCalledWith('packetreceive', expect.any(Function));
        expect(global.console.log).toHaveBeenCalledWith('PACKET RECEIVED!');
    });

    it('should call on packetsend', () => {
        expect(client.on).toHaveBeenCalledWith('packetsend', expect.any(Function));
        expect(global.console.log).toHaveBeenCalledWith('PACKET SENT!');
    });

    it('should call on error', () => {
        expect(client.on).toHaveBeenCalledWith('error', expect.any(Function));
        expect(global.console.log).toHaveBeenCalledWith('ERROR!');
    });

    it('should call on offline', () => {
        expect(client.on).toHaveBeenCalledWith('offline', expect.any(Function));
        expect(global.console.log).toHaveBeenCalledWith('OFFLINE!');
    });

    it('should call on close', () => {
        expect(client.on).toHaveBeenCalledWith('close', expect.any(Function));
        expect(global.console.log).toHaveBeenCalledWith('CLOSE!');
    });

    it('should call on end', () => {
        expect(client.on).toHaveBeenCalledWith('end', expect.any(Function));
        expect(global.console.log).toHaveBeenCalledWith('END!');
    });
});
