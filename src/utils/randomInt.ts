/**
 * Genera un número entero aleatorio entre los valores min y max (incluidos).
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
