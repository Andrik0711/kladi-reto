/**
 * Este archivo se encarga de sanitizar la informacion
 * de los productos obtenidos de la API de Kladi.
 * Convierte los datos a un formato más manejable y consistente.
 */

import type { Product } from '../types/Product';

function parseNumber(val: unknown): number {
    if (typeof val === 'string') {
        return Number(val.replace('val::', ''));
    }
    return Number(val);
}

function getField(obj: Record<string, unknown>, keys: string[], fallback: unknown = undefined) {
    for (const key of keys) {
        if (obj[key] !== undefined) return obj[key];
        if (obj[key.toLowerCase()] !== undefined) return obj[key.toLowerCase()];
        if (obj[key.toUpperCase()] !== undefined) return obj[key.toUpperCase()];
    }
    return fallback;
}

function randomKeyUnique(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .replace(
            /(^|[\s.,([{:;!?'"/-])([a-záéíóúüñ])/g,
            (_m: string, sep: string, char: string) => sep + char.toUpperCase(),
        );
}

function sanitizeNombre(nombre: string): string {
    let clean = nombre.replace(/^val::/i, '');
    try {
        clean = decodeURIComponent(escape(clean));
    } catch {
        // Si falla, deja el string como está
    }
    return toTitleCase(clean);
}

export function sanitizeProducts(raw: unknown[]): Product[] {
    return raw.map((itemRaw) => {
        const item = itemRaw as Record<string, unknown>;
        const id = String(getField(item, ['id', 'ID'], ''));
        let nombre = String(getField(item, ['nombre', 'NOMBRE'], ''));
        nombre = sanitizeNombre(nombre);
        const clavesArr =
            (getField(item, ['claves', 'CLAVES'], []) as Array<Record<string, unknown>>) || [];
        const inventario = clavesArr.length;
        const clave =
            typeof clavesArr[0] === 'object' && clavesArr[0] !== null
                ? (clavesArr[0].clave as string) || (clavesArr[0].CLAVE as string) || ''
                : '';
        const precioSugerido = parseNumber(
            getField(item, ['precio_sugerido', 'precioSugerido', 'PRECIO_SUGERIDO'], 0),
        );
        const impuestosArr =
            (getField(item, ['impuestos', 'IMPUESTOS'], []) as Array<Record<string, unknown>>) ||
            [];
        const satImpuestoId =
            typeof impuestosArr[0] === 'object' && impuestosArr[0] !== null
                ? impuestosArr[0].satImpuestoId || impuestosArr[0].satimpuestoid
                : undefined;
        const unidadMedida = getField(item, ['unidad_medida', 'unidadMedida', 'UNIDAD_MEDIDA'], '');
        let unidadMedidaStr = '';
        if (typeof unidadMedida === 'string' && unidadMedida.trim()) {
            unidadMedidaStr = `${unidadMedida.trim().toUpperCase()} (Unidad)`;
        }
        return {
            key_unique: randomKeyUnique(),
            id,
            nombre,
            clave,
            unidad_medida: unidadMedidaStr,
            precio_sugerido: precioSugerido,
            precio_actual: precioSugerido,
            inventario_actual: inventario,
            inventario_original: inventario,
            categoria:
                ((getField(item, ['categoria', 'CATALOGO', 'catalogo']) as Record<string, unknown>)
                    ?.nombre as string) || undefined,
            marca:
                ((getField(item, ['marca', 'MARCA'], '') as Record<string, unknown>)
                    ?.nombre as string) || undefined,
            impuesto: satImpuestoId ? Number(satImpuestoId) : undefined,
            modificado: false,
        };
    });
}
