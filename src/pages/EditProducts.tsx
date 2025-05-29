/**
 * Este archivo contiene el componente EditProducts
 * que muestra una lista de productos editables.
 * Utiliza el contexto de productos para obtener los datos.
 */

import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Container,
    TextField,
    Button,
    InputAdornment,
    Tooltip,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    useTheme,
    Grid,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { useProductContext } from '../context/ProductContext';
import type { Product } from '../types/Product';

export default function EditProducts() {
    const theme = useTheme();
    const { products, setProducts } = useProductContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlyEdited, setShowOnlyEdited] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    // Filtros y búsqueda
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.clave.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEditFilter = !showOnlyEdited || product.modificado;
            return matchesSearch && matchesEditFilter;
        });
    }, [products, searchTerm, showOnlyEdited]);

    // Paginación
    const paginatedProducts = filteredProducts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    // Resumen de cambios
    const productChanges = useMemo(() => {
        return products.filter((p) => p.modificado);
    }, [products]);

    // Estadísticas
    const totalInventario = filteredProducts.reduce((sum, p) => sum + p.inventario_actual, 0);
    const precioPromedio =
        filteredProducts.reduce((sum, p) => sum + p.precio_actual, 0) /
        (filteredProducts.length || 1);

    // Handlers
    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(0);
    };
    const handlePriceChange = (key_unique: string, newPrice: string) => {
        const price = Number.parseFloat(newPrice) || 0;
        setProducts(
            products.map((product: Product) =>
                product.key_unique === key_unique
                    ? {
                          ...product,
                          precio_actual: price,
                          modificado: price !== product.precio_sugerido,
                      }
                    : product,
            ),
        );
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                minWidth: '100vw',
                width: '100vw',
                height: '100vh',
                bgcolor: '#f8fafc',
                position: 'fixed',
                left: 0,
                top: 0,
                overflow: 'auto',
            }}
        >
            <Container maxWidth="xl" disableGutters sx={{ py: 4, bgcolor: 'transparent' }}>
                {/* Filtros */}
                <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, background: '#fff' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    placeholder="Buscar por nombre o clave..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    size="small"
                                />
                                <Button
                                    variant={showOnlyEdited ? 'contained' : 'outlined'}
                                    color="primary"
                                    onClick={() => setShowOnlyEdited((v) => !v)}
                                    startIcon={<EditIcon />}
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    {showOnlyEdited ? 'Ver todos' : 'Solo editados'}
                                </Button>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{ display: 'flex', justifyContent: { md: 'flex-end' } }}
                        >
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<FilterIcon />}
                                >
                                    Filtros avanzados
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Resumen */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: '#fff' }}>
                            <Typography variant="body2" color="text.secondary">
                                Total productos
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {filteredProducts.length}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: '#fff' }}>
                            <Typography variant="body2" color="text.secondary">
                                Modificados
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" color="warning.main">
                                {productChanges.length}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: '#fff' }}>
                            <Typography variant="body2" color="text.secondary">
                                Precio promedio
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                ${precioPromedio.toFixed(2)}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: '#fff' }}>
                            <Typography variant="body2" color="text.secondary">
                                Inventario total
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {totalInventario}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Tabla */}
                <Paper
                    elevation={3}
                    sx={{ borderRadius: 2, overflow: 'hidden', background: '#fff' }}
                >
                    <Box sx={{ p: 3, pb: 1 }}>
                        <Typography variant="h5" component="h2" fontWeight="medium" gutterBottom>
                            Catálogo de productos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Edita los precios en tiempo real
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                    {/* <TableCell sx={{ fontWeight: 'bold' }}>Clave</TableCell> */}
                                    <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Marca</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        Precio sugerido
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Precio actual</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Inventario</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                        Estado
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedProducts.map((product) => (
                                    <TableRow
                                        key={product.key_unique}
                                        sx={{
                                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            sx={{ fontWeight: 'medium' }}
                                        >
                                            {product.nombre}
                                        </TableCell>
                                        {/* <TableCell>{product.clave}</TableCell> */}
                                        <TableCell>
                                            <Chip
                                                label={product.categoria}
                                                size="small"
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>
                                            {product.marca}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace' }}>
                                            ${product.precio_sugerido.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={product.precio_actual}
                                                onChange={(e) =>
                                                    handlePriceChange(
                                                        product.key_unique,
                                                        e.target.value,
                                                    )
                                                }
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            $
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ width: 120, fontFamily: 'monospace' }}
                                                inputProps={{ step: '0.01', min: '0' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`${product.inventario_actual} unidades`}
                                                size="small"
                                                color={
                                                    product.inventario_actual < 5
                                                        ? 'error'
                                                        : 'default'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {product.modificado ? (
                                                <Tooltip title="Modificado">
                                                    <Box
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: '50%',
                                                            backgroundColor:
                                                                theme.palette.warning.main,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            margin: '0 auto',
                                                        }}
                                                    >
                                                        <EditIcon
                                                            sx={{ fontSize: 16, color: 'white' }}
                                                        />
                                                    </Box>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Sin cambios">
                                                    <Box
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: '50%',
                                                            backgroundColor:
                                                                theme.palette.success.main,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            margin: '0 auto',
                                                        }}
                                                    >
                                                        <EditIcon
                                                            sx={{
                                                                fontSize: 16,
                                                                color: 'white',
                                                                opacity: 0.3,
                                                            }}
                                                        />
                                                    </Box>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[8, 16, 24]}
                        component="div"
                        count={filteredProducts.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Container>
        </Box>
    );
}
