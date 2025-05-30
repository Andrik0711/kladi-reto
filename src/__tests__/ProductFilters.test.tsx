import { render, screen, fireEvent } from '@testing-library/react';
import ProductFilters from '../components/ProductFilters';
import { describe, it, expect, vi } from 'vitest';

describe('ProductFilters', () => {
    it('renderiza los campos de filtro', () => {
        render(
            <ProductFilters
                searchTerm=""
                setSearchTerm={vi.fn()}
                showOnlyEdited={false}
                setShowOnlyEdited={vi.fn()}
                onOpenFilters={vi.fn()}
            />,
        );
        expect(screen.getByPlaceholderText(/Buscar/i)).toBeInTheDocument();
        expect(screen.getByText(/Filtros avanzados/i)).toBeInTheDocument();
    });

    it('llama setSearchTerm al cambiar filtro', () => {
        const setSearchTerm = vi.fn();
        render(
            <ProductFilters
                searchTerm=""
                setSearchTerm={setSearchTerm}
                showOnlyEdited={false}
                setShowOnlyEdited={vi.fn()}
                onOpenFilters={vi.fn()}
            />,
        );
        fireEvent.change(screen.getByPlaceholderText(/Buscar/i), { target: { value: 'Martillo' } });
        expect(setSearchTerm).toHaveBeenCalledWith('Martillo');
    });
});
