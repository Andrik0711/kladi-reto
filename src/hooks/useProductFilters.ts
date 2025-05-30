import { useState, useMemo, useEffect } from 'react';
import type { Product } from '../types/Product';

export function useProductFilters(products: Product[]) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlyEdited, setShowOnlyEdited] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
    const [invRange, setInvRange] = useState<number[]>([0, 100]);

    // Encuentra los valores min/max para sliders
    const minPrecio = products.length > 0 ? Math.min(...products.map((p) => p.precio_sugerido)) : 0;
    const maxPrecio =
        products.length > 0 ? Math.max(...products.map((p) => p.precio_sugerido)) : 1000;
    const minInv = products.length > 0 ? Math.min(...products.map((p) => p.inventario_actual)) : 0;
    const maxInv =
        products.length > 0 ? Math.max(...products.map((p) => p.inventario_actual)) : 100;

    useEffect(() => {
        if (products.length > 0) {
            setPriceRange([minPrecio, maxPrecio]);
            setInvRange([minInv, maxInv]);
        }
    }, [products.length, minPrecio, maxPrecio, minInv, maxInv]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.clave.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEditFilter = !showOnlyEdited || product.modificado;
            const matchesPrice =
                product.precio_sugerido >= priceRange[0] &&
                product.precio_sugerido <= priceRange[1];
            const matchesInv =
                product.inventario_actual >= invRange[0] &&
                product.inventario_actual <= invRange[1];
            return matchesSearch && matchesEditFilter && matchesPrice && matchesInv;
        });
    }, [products, searchTerm, showOnlyEdited, priceRange, invRange]);

    const paginatedProducts = filteredProducts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    return {
        searchTerm,
        setSearchTerm,
        showOnlyEdited,
        setShowOnlyEdited,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        priceRange,
        setPriceRange,
        invRange,
        setInvRange,
        filteredProducts,
        paginatedProducts,
        minPrecio,
        maxPrecio,
        minInv,
        maxInv,
    };
}
