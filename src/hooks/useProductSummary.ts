/**
 * Este archivo contiene un hook personalizado para manejar la edición masiva de productos.
 * Permite seleccionar productos, aplicar cambios masivos y manejar el estado de edición.
 */

import { useMemo } from 'react';
import type { Product } from '../types/Product';

export function useProductSummary(products: Product[], filteredProducts: Product[]) {
    const productChanges = useMemo(() => {
        return products.filter((p) => p.modificado);
    }, [products]);

    const totalInventario = filteredProducts.reduce((sum, p) => sum + p.inventario_actual, 0);
    const precioPromedio =
        filteredProducts.reduce((sum, p) => sum + p.precio_actual, 0) /
        (filteredProducts.length || 1);

    return {
        productChanges,
        totalInventario,
        precioPromedio,
    };
}
