[logs-to-mqtt-publisher](../README.md) › ["index"](_index_.md)

# External module: "index"

## Index

### Variables

* [client](_index_.md#let-client)
* [watchers](_index_.md#const-watchers)

### Functions

* [start](_index_.md#const-start)
* [stop](_index_.md#const-stop)

## Variables

### `Let` client

• **client**: *AsyncMqttClient*

*Defined in [index.ts:15](https://github.com/TonyBrobston/logs-to-mqtt-publisher/blob/36765fa/src/index.ts#L15)*

___

### `Const` watchers

• **watchers**: *FSWatcher[]* = []

*Defined in [index.ts:16](https://github.com/TonyBrobston/logs-to-mqtt-publisher/blob/36765fa/src/index.ts#L16)*

## Functions

### `Const` start

▸ **start**(`options`: [Options](../interfaces/_types_options_.options.md)): *Promise‹void›*

*Defined in [index.ts:18](https://github.com/TonyBrobston/logs-to-mqtt-publisher/blob/36765fa/src/index.ts#L18)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [Options](../interfaces/_types_options_.options.md) | parseOptions(process.env.OPTIONS) |

**Returns:** *Promise‹void›*

___

### `Const` stop

▸ **stop**(): *Promise‹void›*

*Defined in [index.ts:54](https://github.com/TonyBrobston/logs-to-mqtt-publisher/blob/36765fa/src/index.ts#L54)*

**Returns:** *Promise‹void›*
