/**
 * Este archivo contiene el panel de resumen de productos.
 * Muestra el total de productos, los editados y los filtrados.
 * Utiliza Material-UI para el diseño y estilos.
 */

import React from 'react';
import GridLegacy from '@mui/material/GridLegacy';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Se genero una interfaz para las propiedades del componente
interface ProductSummaryPanelProps {
    total: number;
    edited: number;
    filtered: number;
    colorPrimary: string;
    colorAccent: string;
}

const ProductSummaryPanel: React.FC<ProductSummaryPanelProps> = ({
    total,
    edited,
    filtered,
    colorPrimary,
    colorAccent,
}) => (
    <GridLegacy container spacing={2} sx={{ mb: 2 }}>
        <GridLegacy item xs={12} sm={4}>
            <Paper
                elevation={2}
                sx={{ p: 2, bgcolor: colorPrimary, color: '#fff', borderRadius: 3 }}
            >
                <Typography variant="subtitle2">Total productos</Typography>
                <Typography variant="h5" fontWeight={700}>
                    {total}
                </Typography>
            </Paper>
        </GridLegacy>
        <GridLegacy item xs={12} sm={4}>
            <Paper
                elevation={2}
                sx={{ p: 2, bgcolor: colorAccent, color: '#fff', borderRadius: 3 }}
            >
                <Typography variant="subtitle2">Editados</Typography>
                <Typography variant="h5" fontWeight={700}>
                    {edited}
                </Typography>
            </Paper>
        </GridLegacy>
        <GridLegacy item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.900', color: '#fff', borderRadius: 3 }}>
                <Typography variant="subtitle2">Filtrados</Typography>
                <Typography variant="h5" fontWeight={700}>
                    {filtered}
                </Typography>
            </Paper>
        </GridLegacy>
    </GridLegacy>
);

export default ProductSummaryPanel;
