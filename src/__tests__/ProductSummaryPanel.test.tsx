import { render, screen } from '@testing-library/react';
import ProductSummaryPanel from '../components/ProductSummaryPanel';
import { describe, it, expect } from 'vitest';

describe('ProductSummaryPanel', () => {
    it('muestra el resumen correctamente', () => {
        render(
            <ProductSummaryPanel
                total={2}
                edited={1}
                filtered={1}
                colorPrimary="#1976d2"
                colorAccent="#fbc02d"
            />,
        );
        expect(screen.getByText(/Total productos/i)).toBeInTheDocument();
        expect(screen.getByText(/Editados/i)).toBeInTheDocument();
        expect(screen.getByText(/Filtrados/i)).toBeInTheDocument();
    });
});
