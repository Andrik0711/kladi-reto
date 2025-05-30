/**
 * Este archivo define un componente de React que muestra un panel de resumen de productos.
 * Muestra el total de productos, los productos editados y los filtrados.
 */

import { useState } from 'react';
import type { Product } from '../types/Product';

export function useMassEdit(products: Product[], setProducts: (p: Product[]) => void) {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [massEditField, setMassEditField] = useState<'precio' | 'inventario' | ''>('');
    const [massEditValue, setMassEditValue] = useState<number>(0);
    const [massEditTarget, setMassEditTarget] = useState<'seleccion' | 'categoria' | 'marca'>(
        'seleccion',
    );
    const [massEditCategory, setMassEditCategory] = useState<string>('');
    const [massEditBrand, setMassEditBrand] = useState<string>('');

    const handleMassEdit = () => {
        setProducts(
            products.map((product) => {
                let match = false;
                if (massEditTarget === 'seleccion') {
                    match = selectedKeys.includes(product.key_unique);
                } else if (massEditTarget === 'categoria') {
                    match = product.categoria === massEditCategory;
                } else if (massEditTarget === 'marca') {
                    match = product.marca === massEditBrand;
                }
                if (!match) return product;
                if (massEditField === 'precio') {
                    return {
                        ...product,
                        precio_actual: massEditValue,
                        modificado:
                            massEditValue !== product.precio_sugerido ||
                            product.inventario_actual !== product.inventario_original,
                    };
                } else if (massEditField === 'inventario') {
                    return {
                        ...product,
                        inventario_actual: massEditValue,
                        modificado:
                            product.precio_actual !== product.precio_sugerido ||
                            massEditValue !== product.inventario_original,
                    };
                }
                return product;
            }),
        );
        setMassEditValue(0);
        setMassEditField('');
        setMassEditCategory('');
        setMassEditBrand('');
        setSelectedKeys([]);
    };

    return {
        selectedKeys,
        setSelectedKeys,
        massEditField,
        setMassEditField,
        massEditValue,
        setMassEditValue,
        massEditTarget,
        setMassEditTarget,
        massEditCategory,
        setMassEditCategory,
        massEditBrand,
        setMassEditBrand,
        handleMassEdit,
    };
}
