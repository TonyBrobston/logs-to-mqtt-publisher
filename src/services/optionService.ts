import Options from './../types/Options';

export const parseOptions = (options?: string): Options => {
    return JSON.parse(options || '{}');
};
