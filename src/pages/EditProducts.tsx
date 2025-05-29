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
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slider,
    Switch,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useProductContext } from '../context/ProductContext';
import type { Product } from '../types/Product';

export default function EditProducts() {
    const theme = useTheme();
    const { products, setProducts } = useProductContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlyEdited, setShowOnlyEdited] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [openFilters, setOpenFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
    const [invRange, setInvRange] = useState<number[]>([0, 100]);

    // Encuentra los valores min/max para sliders
    const minPrecio = Math.min(...products.map((p) => p.precio_sugerido), 0);
    const maxPrecio = Math.max(...products.map((p) => p.precio_sugerido), 1000);
    const minInv = Math.min(...products.map((p) => p.inventario_actual), 0);
    const maxInv = Math.max(...products.map((p) => p.inventario_actual), 100);

    // Filtros y búsqueda
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.clave.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEditFilter = !showOnlyEdited || product.modificado;
            const matchesPrice =
                product.precio_sugerido >= priceRange[0] &&
                product.precio_sugerido <= priceRange[1];
            const matchesInv =
                product.inventario_actual >= invRange[0] &&
                product.inventario_actual <= invRange[1];
            return matchesSearch && matchesEditFilter && matchesPrice && matchesInv;
        });
    }, [products, searchTerm, showOnlyEdited, priceRange, invRange]);

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
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <Box flex={1}>
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
                                {/* Switch para mostrar solo editados */}
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 1 }}
                                >
                                    <Switch
                                        checked={showOnlyEdited}
                                        onChange={() => setShowOnlyEdited((v) => !v)}
                                        color="warning"
                                        inputProps={{
                                            'aria-label': 'Mostrar solo productos editados',
                                        }}
                                        sx={{
                                            '& .MuiSwitch-thumb': {
                                                boxShadow: '0 2px 8px rgba(255,193,7,0.18)',
                                            },
                                            '& .Mui-checked': {
                                                color: theme.palette.warning.main,
                                            },
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        color={showOnlyEdited ? 'warning.main' : 'text.secondary'}
                                        fontWeight={600}
                                    >
                                        Solo editados
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                justifyContent: { md: 'flex-end' },
                                width: { xs: '100%', md: 'auto' },
                            }}
                        >
                            {/* Botón de filtros avanzados */}
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<FilterIcon />}
                                onClick={() => setOpenFilters(true)}
                                sx={{ fontWeight: 600, borderRadius: 2 }}
                            >
                                Filtros avanzados
                            </Button>
                        </Box>
                    </Stack>
                </Paper>

                {/* Resumen */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
                    <Box flex={1}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: '#fff' }}>
                            <Typography variant="body2" color="text.secondary">
                                Total productos
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {filteredProducts.length}
                            </Typography>
                        </Paper>
                    </Box>
                    <Box flex={1}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: '#fff' }}>
                            <Typography variant="body2" color="text.secondary">
                                Modificados
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" color="warning.main">
                                {productChanges.length}
                            </Typography>
                        </Paper>
                    </Box>
                    <Box flex={1}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: '#fff' }}>
                            <Typography variant="body2" color="text.secondary">
                                Precio promedio
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                ${precioPromedio.toFixed(2)}
                            </Typography>
                        </Paper>
                    </Box>
                    <Box flex={1}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: '#fff' }}>
                            <Typography variant="body2" color="text.secondary">
                                Inventario total
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {totalInventario}
                            </Typography>
                        </Paper>
                    </Box>
                </Stack>

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
                                            <TextField
                                                type="number"
                                                value={product.inventario_actual}
                                                onChange={(e) => {
                                                    const newInv = Number(e.target.value) || 0;
                                                    setProducts(
                                                        products.map((p: Product) =>
                                                            p.key_unique === product.key_unique
                                                                ? {
                                                                      ...p,
                                                                      inventario_actual: newInv,
                                                                      modificado:
                                                                          product.precio_actual !==
                                                                              product.precio_sugerido ||
                                                                          newInv !==
                                                                              product.inventario_original,
                                                                  }
                                                                : p,
                                                        ),
                                                    );
                                                }}
                                                variant="outlined"
                                                size="small"
                                                sx={{ width: 100, fontFamily: 'monospace' }}
                                                inputProps={{ step: '1', min: '0' }}
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
                        rowsPerPageOptions={[4, 8, 16, 24, 50]}
                        component="div"
                        count={filteredProducts.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={<span>Filas por página:</span>}
                    />
                </Paper>

                {/* Modal de filtros avanzados innovador */}
                <Dialog
                    open={openFilters}
                    onClose={() => setOpenFilters(false)}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                        sx: {
                            background: 'rgb(255, 255, 255)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: 4,
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                            border: '1px solid rgba(255, 255, 255, 0.92)',
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontWeight: 700,
                            fontSize: 22,
                            pb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <FilterIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                        Filtros avanzados
                        <Tooltip title="Cerrar">
                            <span>
                                <Button
                                    onClick={() => setOpenFilters(false)}
                                    sx={{ ml: 'auto', minWidth: 0, p: 0.5 }}
                                    color="inherit"
                                >
                                    <CloseIcon />
                                </Button>
                            </span>
                        </Tooltip>
                    </DialogTitle>
                    <DialogContent dividers sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography gutterBottom fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4b0.svg" alt="Precio" width={22} style={{ verticalAlign: 'middle' }} />
                                    Rango de precio sugerido
                                    <Tooltip title="Filtra productos por su precio sugerido. Mueve los extremos para ajustar el rango.">
                                        <Box component="span" sx={{ ml: 1, color: 'primary.main', cursor: 'help', fontWeight: 700 }}>?</Box>
                                    </Tooltip>
                                </Typography>
                                <Slider
                                    value={priceRange}
                                    min={minPrecio}
                                    max={maxPrecio}
                                    onChange={(_event: Event, v: number | number[]) => setPriceRange(v as number[])}
                                    valueLabelDisplay="auto"
                                    step={1}
                                    sx={{
                                        color: 'primary.main',
                                        height: 6,
                                        '& .MuiSlider-thumb': {
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                            background: '#fff',
                                            border: '2px solid',
                                            borderColor: 'primary.main',
                                        },
                                    }}
                                />
                                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Mín: ${minPrecio}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Máx: ${maxPrecio}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Box>
                                <Typography gutterBottom fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4e6.svg" alt="Inventario" width={22} style={{ verticalAlign: 'middle' }} />
                                    Rango de inventario
                                    <Tooltip title="Filtra productos por inventario actual. Ajusta el rango según tus necesidades.">
                                        <Box component="span" sx={{ ml: 1, color: 'primary.main', cursor: 'help', fontWeight: 700 }}>?</Box>
                                    </Tooltip>
                                </Typography>
                                <Slider
                                    value={invRange}
                                    min={minInv}
                                    max={maxInv}
                                    onChange={(_event: Event, v: number | number[]) => setInvRange(v as number[])}
                                    valueLabelDisplay="auto"
                                    step={1}
                                    sx={{
                                        color: 'success.main',
                                        height: 6,
                                        '& .MuiSlider-thumb': {
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                            background: '#fff',
                                            border: '2px solid',
                                            borderColor: 'success.main',
                                        },
                                    }}
                                />
                                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Mín: {minInv}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Máx: {maxInv}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Stack>
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Los filtros se aplican automáticamente al mover los sliders.
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, pt: 1, justifyContent: 'space-between' }}>
                        <Button
                            onClick={() => {
                                setPriceRange([minPrecio, maxPrecio]);
                                setInvRange([minInv, maxInv]);
                            }}
                            color="secondary"
                            variant="outlined"
                            startIcon={<FilterIcon />}
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                        >
                            Reiniciar filtrado
                        </Button>
                        <Button
                            onClick={() => setOpenFilters(false)}
                            color="primary"
                            variant="contained"
                            startIcon={<CloseIcon />}
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                        >
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}
