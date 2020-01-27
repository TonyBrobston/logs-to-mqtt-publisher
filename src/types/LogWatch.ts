import LogParse from './LogParse';

export default interface LogWatch {
    filePath: string;
    logParses: LogParse[];
}
