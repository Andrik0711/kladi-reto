/**
 * Este componente permite editar los productos.
 * Utiliza el contexto de productos para obtener los datos.
 * Carga los productos desde la API al iniciar.
 * Proporciona un contexto para que otros componentes puedan acceder a los productos.
 */

import { createContext, useContext, useEffect, useState } from 'react';
import type { Product } from '../types/Product';
import { fetchProducts } from '../api/KladiApi';

interface ProductContextType {
    products: Product[];
    setProducts: (products: Product[]) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchProducts().then((items: Product[]) => {
            setProducts(items);
        });
    }, []);

    return (
        <ProductContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('useProductContext must be used within a ProductProvider');
    return context;
};

// Mover la función randomInt a un archivo utilitario para evitar el warning de react-refresh
