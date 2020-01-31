[logs-to-mqtt-publisher](../README.md) › ["services/parseService"](_services_parseservice_.md)

# External module: "services/parseService"

## Index

### Functions

* [convertToRegex](_services_parseservice_.md#const-converttoregex)
* [parseAndJoin](_services_parseservice_.md#const-parseandjoin)
* [parseLog](_services_parseservice_.md#const-parselog)

## Functions

### `Const` convertToRegex

▸ **convertToRegex**(`regularExpression`: string): *RegExp*

*Defined in [services/parseService.ts:23](https://github.com/TonyBrobston/logs-to-mqtt-publisher/blob/195afce/src/services/parseService.ts#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`regularExpression` | string |

**Returns:** *RegExp*

___

### `Const` parseAndJoin

▸ **parseAndJoin**(`found`: string[], `__namedParameters`: object): *string*

*Defined in [services/parseService.ts:29](https://github.com/TonyBrobston/logs-to-mqtt-publisher/blob/195afce/src/services/parseService.ts#L29)*

**Parameters:**

▪ **found**: *string[]*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`delimiter` | string |
`order` | number[] |

**Returns:** *string*

___

### `Const` parseLog

▸ **parseLog**(`line`: string, `logParse`: [LogParse](../interfaces/_types_logparse_.logparse.md)): *[MqttPayload](../interfaces/_types_mqttpayload_.mqttpayload.md)*

*Defined in [services/parseService.ts:5](https://github.com/TonyBrobston/logs-to-mqtt-publisher/blob/195afce/src/services/parseService.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`line` | string |
`logParse` | [LogParse](../interfaces/_types_logparse_.logparse.md) |

**Returns:** *[MqttPayload](../interfaces/_types_mqttpayload_.mqttpayload.md)*
