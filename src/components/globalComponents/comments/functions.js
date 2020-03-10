export const avatarColors = [
    "#00AA55",
    "#009FD4",
    "#B381B3",
    "#939393",
    "#E3BC00",
    "#D47500",
    "#DC2A2A",
    "#ff4d94",
    "#7AC474"];

export function numberFromText(text) {
    const charCodes = text
        .split('')
        .map(char => char.charCodeAt(0))
        .join('');
    return parseInt(charCodes, 10);
}