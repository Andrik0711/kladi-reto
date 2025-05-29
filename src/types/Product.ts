/**
 * Este archivo contiene interfaces y los tipos de datos
 * para los productos se envian del api
 * Porque una interfaz y no una clase?
 * * - Las interfaces son más ligeras y no generan código adicional en tiempo de ejecución.
 * * - Las interfaces son ideales para definir la forma de los objetos y no necesitan lógica adicional.
 */

export interface Product {
    key_unique: string; // clave única generada aleatoriamente
    id: string; // id del producto en la base de datos
    nombre: string;
    clave: string;
    unidad_medida: string;
    precio_sugerido: number;
    precio_actual: number;
    inventario_actual: number;
    inventario_original: number;
    modificado: boolean;
    categoria?: string; // opcional
    marca?: string; // opcional
    impuesto?: number; // opcional, id del SAT para el impuesto
}
