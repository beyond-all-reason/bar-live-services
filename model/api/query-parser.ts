export function parseString(str: string) : string {
    return str;
}

export function parseStringArray(str: string) : string[] {
    return str.split(",");
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