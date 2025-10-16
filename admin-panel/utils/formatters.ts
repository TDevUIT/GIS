export function formatISOForInput(isoString?: string | Date): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
}

export function parseISOFromInput(inputString: string): string {
    if (!inputString) return '';
    return new Date(inputString).toISOString();
}
