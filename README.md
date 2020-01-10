# logs-to-mqtt-publisher
A server-side JavaScript tool that converts log statements to topics and publishes them to an mqtt broker.

[![npm version](https://badge.fury.io/js/logs-to-mqtt-publisher.svg)](https://badge.fury.io/js/logs-to-mqtt-publisher)
[![Build Status](https://travis-ci.com/TonyBrobston/logs-to-mqtt-publisher.svg?branch=master)](https://travis-ci.org/TonyBrobston/logs-to-mqtt-publisher)
[![codecov](https://codecov.io/gh/TonyBrobston/logs-to-mqtt-publisher/branch/master/graph/badge.svg)](https://codecov.io/gh/tonybrobston/logs-to-mqtt-publisher)
[![Dependencies](https://david-dm.org/tonybrobston/logs-to-mqtt-publisher/status.svg)](https://david-dm.org/tonybrobston/logs-to-mqtt-publisher)
[![Dev Dependencies](https://david-dm.org/tonybrobston/logs-to-mqtt-publisher/dev-status.svg)](https://david-dm.org/tonybrobston/logs-to-mqtt-publisher?type=dev)
[![Peer Dependencies](https://david-dm.org/tonybrobston/logs-to-mqtt-publisher/peer-status.svg)](https://david-dm.org/tonybrobston/logs-to-mqtt-publisher?type=peer)
[![Known Vulnerabilities](https://snyk.io/test/github/TonyBrobston/logs-to-mqtt-publisher/badge.svg?targetFile=package.json)](https://snyk.io/test/github/TonyBrobston/logs-to-mqtt-publisher?targetFile=package.json)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg)](#contributors)

## Parameter example
``` 
{
    logWatches: [
        {
            filePath: '/var/log/unifi-video/motion.log',
            regularExpressions: [
                '/motion|House West|start/g',
                '/motion|House West|stop/g'
            ]
        }
    ],
    mqtt: {
        host: 'localhost',
        port: '1883'
    }
}
```

## Feedback
Do you have an idea for making logs-to-mqtt-publisher better? Add your idea under the issues tab, we'd love to hear about it!

## Contributors
Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/4724577?v=4" width="100px;" alt="Tony Brobston"/><br /><sub><b>Tony Brobston</b></sub>](https://github.com/TonyBrobston)<br />[💻](https://github.com/TonyBrobston/logs-to-mqtt-publisher/commits?author=TonyBrobston "Code") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
