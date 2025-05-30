import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Product } from '../types/Product';

vi.mock('@mui/x-data-grid', () => ({
    DataGrid: (props: { rows: Product[] }) => (
        <table data-testid="mock-datagrid">
            <tbody>
                {props.rows.map((row) => (
                    <tr key={row.key_unique}>
                        <td>{row.nombre}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ),
}));

import { ProductTable } from '../components/ProductTable';

const mockProducts: Product[] = [
    {
        key_unique: '1',
        id: '1',
        nombre: 'Martillo',
        clave: 'MART-001',
        unidad_medida: 'pz',
        precio_sugerido: 120,
        precio_actual: 100,
        inventario_actual: 10,
        inventario_original: 10,
        modificado: false,
        categoria: 'Herramientas',
        marca: 'Truper',
        impuesto: 16,
    },
    {
        key_unique: '2',
        id: '2',
        nombre: 'Desarmador',
        clave: 'DESA-002',
        unidad_medida: 'pz',
        precio_sugerido: 60,
        precio_actual: 50,
        inventario_actual: 20,
        inventario_original: 20,
        modificado: true,
        categoria: 'Herramientas',
        marca: 'Pretul',
        impuesto: 16,
    },
];

describe('ProductTable', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renderiza productos en la tabla (modo sin loading)', () => {
        render(<ProductTable products={mockProducts} disableLoading={true} />);

        expect(screen.getByText('Martillo')).toBeInTheDocument();
        expect(screen.getByText('Desarmador')).toBeInTheDocument();
    });
});
