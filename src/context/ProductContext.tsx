// src/context/ProductContext.tsx
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
    interface FetchProductsResponse {
      __ITEMS__: Product[];
      [key: string]: unknown;
    }

    fetchProducts().then((response: FetchProductsResponse) => {
      const items = response.__ITEMS__ || [];
      const formatted = items.map((p: Product) => ({
        // Generamos un key único para cada producto
        key_unique: randomInt(1, 1000000).toString(),
        id: p.id,
        nombre: p.nombre,
        clave: p.clave,
        unidad_medida: '', 
        precio_sugerido: p.precio_sugerido,
        precio_actual: p.precio_actual,
        inventario_actual: 0,
        inventario_original: 0,
        categoria: '', 
        modificado: false,
      }));
      setProducts(formatted);
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


function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
