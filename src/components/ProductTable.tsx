import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Paper, Box, Typography, LinearProgress } from '@mui/material';
import type { Product } from '../types/Product';

interface ProductTableProps {
    products: Product[];
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 200 },
    { field: 'clave', headerName: 'Clave', width: 120 },
    { field: 'unidad_medida', headerName: 'Unidad', width: 140 },
    {
        field: 'precio_sugerido',
        headerName: 'Precio Sugerido',
        width: 140,
        type: 'number',
        valueFormatter: ({ value }) => `$${(value as number)?.toFixed(2)}`,
    },
    {
        field: 'precio_actual',
        headerName: 'Precio Actual',
        width: 140,
        type: 'number',
        valueFormatter: ({ value }) => `$${(value as number)?.toFixed(2)}`,
    },
    { field: 'inventario_actual', headerName: 'Inventario', width: 120, type: 'number' },
    { field: 'categoria', headerName: 'Categoría', width: 140 },
    { field: 'marca', headerName: 'Marca', width: 120 },
    { field: 'impuesto', headerName: 'Impuesto SAT', width: 120 },
    {
        field: 'modificado',
        headerName: 'Modificado',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (params.value ? 'Sí' : 'No'),
    },
];

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setLoading(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setLoading(false);
                    return 100;
                }
                return prev + 2;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 50%, #f3e5f5 100%)',
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        width: 400,
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #2196f3 0%, #673ab7 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <span
                                role="img"
                                aria-label="inventory"
                                style={{
                                    fontSize: 32,
                                    color: 'white',
                                    animation: 'pulse 2s infinite',
                                }}
                            >
                                📦
                            </span>
                        </Box>
                    </Box>
                    <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 1 }}>
                        Cargando productos
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Preparando la interfaz de gestión de productos...
                    </Typography>
                    <Box sx={{ width: '100%', mb: 1 }}>
                        <LinearProgress variant="determinate" value={progress} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {progress}% Completado
                    </Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: '100vw',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 50%, #f3e5f5 100%)',
                p: { xs: 1, sm: 2 },
            }}
        >
            <Paper
                elevation={1}
                sx={{
                    height: { xs: '90vh', md: '80vh' },
                    width: { xs: '98vw', md: '90vw' },
                    p: { xs: 1, sm: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.98)',
                    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.04)',
                    borderRadius: 4,
                }}
            >
                <DataGrid
                    rows={products.map((p) => ({ ...p, id: p.key_unique }))}
                    columns={columns}
                    pagination
                    pageSizeOptions={[15, 30, 50]}
                    initialState={{ pagination: { paginationModel: { pageSize: 15, page: 0 } } }}
                    disableRowSelectionOnClick
                    sx={{
                        border: 'none',
                        fontFamily: 'inherit',
                        background: 'white',
                        flex: 1,
                        '& .MuiDataGrid-columnHeaders': {
                            background: 'rgba(0,0,0,0.02)',
                            fontWeight: 600,
                            fontSize: 16,
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: 15,
                        },
                        '& .MuiDataGrid-footerContainer': {
                            background: 'rgba(0,0,0,0.01)',
                        },
                    }}
                />
            </Paper>
        </Box>
    );
};
