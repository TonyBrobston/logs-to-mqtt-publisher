import {AsyncMqttClient} from 'async-mqtt';

export const setupLogging = (client: AsyncMqttClient): void => {
    client.on('connect', () => {
        console.log('CONNECTED!');
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
};
