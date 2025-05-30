import { render, screen, fireEvent } from '@testing-library/react';
import MassEditPanel from '../components/MassEditPanel';
import { describe, it, expect, vi } from 'vitest';

describe('MassEditPanel', () => {
    it('renderiza el panel y botones', () => {
        render(
            <MassEditPanel
                selectedCount={0}
                onEdit={vi.fn()}
                onClear={vi.fn()}
                isEditing={false}
                colorAccent="#f00"
            />,
        );
        expect(screen.getByText(/Editar seleccionados/i)).toBeInTheDocument();
        expect(screen.getByText(/Limpiar selección/i)).toBeInTheDocument();
    });

    it('no llama callbacks si no hay seleccionados', () => {
        const onEdit = vi.fn();
        const onClear = vi.fn();
        render(
            <MassEditPanel
                selectedCount={0}
                onEdit={onEdit}
                onClear={onClear}
                isEditing={false}
                colorAccent="#f00"
            />,
        );
        fireEvent.click(screen.getByText(/Editar seleccionados/i));
        expect(onEdit).not.toHaveBeenCalled();
        fireEvent.click(screen.getByText(/Limpiar selección/i));
        expect(onClear).not.toHaveBeenCalled();
    });

    it('llama callbacks si hay seleccionados', () => {
        const onEdit = vi.fn();
        const onClear = vi.fn();
        render(
            <MassEditPanel
                selectedCount={2}
                onEdit={onEdit}
                onClear={onClear}
                isEditing={false}
                colorAccent="#f00"
            />,
        );
        fireEvent.click(screen.getByText(/Editar seleccionados/i));
        expect(onEdit).toHaveBeenCalled();
        fireEvent.click(screen.getByText(/Limpiar selección/i));
        expect(onClear).toHaveBeenCalled();
    });
});
