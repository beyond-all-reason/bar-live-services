export function parseString(str: string) : string {
    return decodeURI(str);
}

export function parseStringArray(str: string) : string[] {
    return str.split(",").map(s => parseString(s));
}

export function parseNumber(str: string) : number {
    return Number(str);
}

export function parseNumberArray(str: string) : number[] {
    return parseStringArray(str)?.map(numStr => parseNumber(numStr)!);
}

export function parseBoolean(str: string) : boolean {
    return str === "true";
}

export function parseDate(str: string) : Date {
    return new Date(str);
}
