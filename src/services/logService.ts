export const parse = (line: string, regex: RegExp) => {
    const found = line.match(regex);
    if (found) {
        const parentTopic = found[0];
        const childTopic = found[1];
        const message = found[2];
        return {
            topic: `${parentTopic}/${childTopic}`,
            message
        }
    }
    return undefined;
}
