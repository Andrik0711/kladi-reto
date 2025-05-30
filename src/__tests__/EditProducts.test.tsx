import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductProvider } from '../context/ProductContext';
import EditProducts from '../pages/EditProducts';

// Mock productos de ejemplo
const mockProducts = [
    {
        key_unique: '1',
        nombre: 'Martillo',
        clave: 'MART-001',
        categoria: 'Herramientas',
        marca: 'Truper',
        precio_sugerido: 100,
        precio_actual: 100,
        inventario_actual: 10,
        inventario_original: 10,
        modificado: false,
    },
    {
        key_unique: '2',
        nombre: 'Desarmador',
        clave: 'DESA-002',
        categoria: 'Herramientas',
        marca: 'Pretul',
        precio_sugerido: 50,
        precio_actual: 50,
        inventario_actual: 20,
        inventario_original: 20,
        modificado: false,
    },
];

// Mock del contexto
vi.mock('../context/ProductContext', async () => {
    const actual = await vi.importActual<typeof import('../context/ProductContext')>(
        '../context/ProductContext',
    );
    return {
        ...actual,
        useProductContext: () => ({
            products: mockProducts,
            setProducts: vi.fn(),
        }),
    };
});

describe('EditProducts', () => {
    it('renderiza el título y la tabla', async () => {
        render(
            <ProductProvider>
                <EditProducts />
            </ProductProvider>,
        );
        // Esperar a que desaparezca la pantalla de carga
        await waitFor(() =>
            expect(screen.queryByText(/Cargando productos/i)).not.toBeInTheDocument(),
        );
        expect(
            screen.getByText((content) => content.includes('Catálogo de productos')),
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Buscar por nombre o clave/i)).toBeInTheDocument();
        expect(screen.getByText(/Martillo/i)).toBeInTheDocument();
        expect(screen.getByText(/Desarmador/i)).toBeInTheDocument();
    });

    it('filtra productos por nombre', async () => {
        render(
            <ProductProvider>
                <EditProducts />
            </ProductProvider>,
        );
        await waitFor(() =>
            expect(screen.queryByText(/Cargando productos/i)).not.toBeInTheDocument(),
        );
        const search = screen.getByPlaceholderText(/Buscar por nombre o clave/i);
        fireEvent.change(search, { target: { value: 'Martillo' } });
        expect(screen.getByText(/Martillo/i)).toBeInTheDocument();
        expect(screen.queryByText(/Desarmador/i)).not.toBeInTheDocument();
    });

    it('muestra el switch de solo editados', async () => {
        render(
            <ProductProvider>
                <EditProducts />
            </ProductProvider>,
        );
        await waitFor(() =>
            expect(screen.queryByText(/Cargando productos/i)).not.toBeInTheDocument(),
        );
        expect(
            screen.getByText((content) => content.includes('Solo editados')),
        ).toBeInTheDocument();
    });

    it('muestra el botón de filtros avanzados', async () => {
        render(
            <ProductProvider>
                <EditProducts />
            </ProductProvider>,
        );
        await waitFor(() =>
            expect(screen.queryByText(/Cargando productos/i)).not.toBeInTheDocument(),
        );
        expect(
            screen.getByText((content) => content.includes('Filtros avanzados')),
        ).toBeInTheDocument();
    });

    it('muestra el resumen de productos', async () => {
        render(
            <ProductProvider>
                <EditProducts />
            </ProductProvider>,
        );
        await waitFor(() =>
            expect(screen.queryByText(/Cargando productos/i)).not.toBeInTheDocument(),
        );
        expect(
            screen.getByText((content) => content.includes('Total productos')),
        ).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('Modificados'))).toBeInTheDocument();
        expect(
            screen.getByText((content) => content.includes('Precio promedio')),
        ).toBeInTheDocument();
        expect(
            screen.getByText((content) => content.includes('Inventario total')),
        ).toBeInTheDocument();
    });
});
