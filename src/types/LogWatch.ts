import {LogParse} from './LogParse';

export interface LogWatch {
    filePath: string;
    logParses: LogParse[];
}
