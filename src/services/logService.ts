import {AsyncMqttClient} from 'async-mqtt';

export const setupLogging = (client: AsyncMqttClient): void => {
    client.on('connect', () => {
        console.log('CONNECTED!');
    });
    client.on('reconnect', () => {
        console.log('RECONNECTED!');
    });
    client.on('disconnect', () => {
        console.log('DISCONNECTED!');
    });
    client.on('message', () => {
        console.log('MESSAGE SENT!');
    });
    client.on('packetreceive', () => {
        console.log('PACKET RECEIVED!');
    });
    client.on('packetsend', () => {
        console.log('PACKET SENT!');
    });
    client.on('error', () => {
        console.log('ERROR!');
    });
    client.on('offline', () => {
        console.log('OFFLINE!');
    });
    client.on('close', () => {
        console.log('CLOSE!');
    });
    client.on('end', () => {
        console.log('END!');
    });
};
