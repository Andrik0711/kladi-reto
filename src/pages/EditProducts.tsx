/**
 * Este archivo contiene el componente EditProducts
 * que muestra una lista de productos editables.
 * Utiliza el contexto de productos para obtener los datos.
 */

import React, { useState, useMemo, useEffect } from 'react';
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
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    LinearProgress,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Edit as EditIcon,
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon,
    // ListOutlined as ListIcon,
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useProductContext } from '../context/ProductContext';
import type { Product } from '../types/Product';

// Paleta base
const COLOR_PRIMARY = '#2196f3'; // azul
const COLOR_PRIMARY_DARK = '#1565c0';
const COLOR_ACCENT = '#fffff'; // fondo de filtros y botones
const COLOR_BG = '#fffff'; // color general
const COLOR_WHITE = '#fff';
const COLOR_SUCCESS = '#43a047';
const COLOR_SUCCESS_BG = '#e8f5e9';
// const COLOR_WARNING = '#ffb300';
const COLOR_WARNING_BG = '#fffde7';
const COLOR_HEADER_BG = COLOR_PRIMARY;
const COLOR_HEADER_TEXT = COLOR_WHITE;
const COLOR_TABLE_HEADER_BG = '#e3f2fd';
const COLOR_TABLE_HEADER_TEXT = COLOR_PRIMARY_DARK;
const COLOR_CHIP_CAT_BG = COLOR_SUCCESS_BG;
const COLOR_CHIP_CAT_TEXT = COLOR_SUCCESS;
const COLOR_CHIP_MARCA_BG = COLOR_TABLE_HEADER_BG;
const COLOR_CHIP_MARCA_TEXT = COLOR_PRIMARY_DARK;

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
    const [openSummary, setOpenSummary] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    // NUEVO: Estado para selección múltiple y edición masiva
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [massEditField, setMassEditField] = useState<'precio' | 'inventario' | ''>('');
    const [massEditValue, setMassEditValue] = useState<number>(0);
    const [massEditTarget, setMassEditTarget] = useState<'seleccion' | 'categoria' | 'marca'>(
        'seleccion',
    );
    const [massEditCategory, setMassEditCategory] = useState<string>('');
    const [massEditBrand, setMassEditBrand] = useState<string>('');

    // Estado de carga
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // Estado y handler para ordenamiento
    const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc');
    const [orderField, setOrderField] = useState<'nombre' | 'precio_actual' | 'inventario_actual'>(
        'nombre',
    );

    // Simular progreso de carga
    useEffect(() => {
        if (!loading) return;
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev; // No pasar de 90% hasta que productos estén listos
                return prev + 5;
            });
        }, 80);
        return () => clearInterval(interval);
    }, [loading]);

    // Detectar cuando los productos ya están cargados
    useEffect(() => {
        if (products.length > 0) {
            setProgress(100);
            setTimeout(() => setLoading(false), 500); // Pequeño delay para UX
        }
    }, [products.length]);

    // Encuentra los valores min/max para sliders
    const minPrecio = products.length > 0 ? Math.min(...products.map((p) => p.precio_sugerido)) : 0;
    const maxPrecio =
        products.length > 0 ? Math.max(...products.map((p) => p.precio_sugerido)) : 1000;
    const minInv = products.length > 0 ? Math.min(...products.map((p) => p.inventario_actual)) : 0;
    const maxInv =
        products.length > 0 ? Math.max(...products.map((p) => p.inventario_actual)) : 100;

    // Ajustar el estado inicial de los sliders al cargar productos
    useEffect(() => {
        if (products.length > 0) {
            setPriceRange([minPrecio, maxPrecio]);
            setInvRange([minInv, maxInv]);
        }
    }, [products.length, minPrecio, maxPrecio, minInv, maxInv]);

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

    // Función de ordenamiento extendida
    const sortedProducts = [...paginatedProducts].sort((a, b) => {
        if (orderField === 'nombre') {
            if (orderBy === 'asc') {
                return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
            } else {
                return b.nombre.localeCompare(a.nombre, 'es', { sensitivity: 'base' });
            }
        } else if (orderField === 'precio_actual') {
            return orderBy === 'asc'
                ? a.precio_actual - b.precio_actual
                : b.precio_actual - a.precio_actual;
        } else if (orderField === 'inventario_actual') {
            return orderBy === 'asc'
                ? a.inventario_actual - b.inventario_actual
                : b.inventario_actual - a.inventario_actual;
        }
        return 0;
    });

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

    // NUEVO: Handler para aplicar edición masiva
    const handleMassEdit = () => {
        setProducts(
            products.map((product) => {
                let match = false;
                if (massEditTarget === 'seleccion') {
                    match = selectedKeys.includes(product.key_unique);
                } else if (massEditTarget === 'categoria') {
                    match = product.categoria === massEditCategory;
                } else if (massEditTarget === 'marca') {
                    match = product.marca === massEditBrand;
                }
                if (!match) return product;
                if (massEditField === 'precio') {
                    return {
                        ...product,
                        precio_actual: massEditValue,
                        modificado:
                            massEditValue !== product.precio_sugerido ||
                            product.inventario_actual !== product.inventario_original,
                    };
                } else if (massEditField === 'inventario') {
                    return {
                        ...product,
                        inventario_actual: massEditValue,
                        modificado:
                            product.precio_actual !== product.precio_sugerido ||
                            massEditValue !== product.inventario_original,
                    };
                }
                return product;
            }),
        );
        setMassEditValue(0);
        setMassEditField('');
        setMassEditCategory('');
        setMassEditBrand('');
        setSelectedKeys([]);
    };

    // Guardar productos modificados en localStorage cada vez que cambian
    React.useEffect(() => {
        const cambios = products.filter((p) => p.modificado);
        localStorage.setItem('kladi-cambios', JSON.stringify(cambios));
    }, [products]);

    // Guardar cambios en localStorage al confirmar
    const handleConfirmSummary = () => {
        localStorage.setItem('kladi-cambios', JSON.stringify(productChanges));
        setOpenSummary(false);
        setTimeout(() => setOpenSuccess(true), 300); // Pequeño delay para UX
    };

    // Limpiar localStorage al recargar
    React.useEffect(() => {
        window.addEventListener('beforeunload', () => {
            localStorage.removeItem('kladi-cambios');
        });
        return () => {
            window.removeEventListener('beforeunload', () => {
                localStorage.removeItem('kladi-cambios');
            });
        };
    }, []);

    // Pantalla de carga
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
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {progress}% Completado
                    </Typography>
                </Paper>
            </Box>
        );
    }

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
            <Container
                maxWidth="lg"
                disableGutters
                sx={{ py: 4, bgcolor: 'transparent', maxWidth: 800 }}
            >
                {/* Filtros */}
                <Paper
                    elevation={2}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        mb: 3,
                        borderRadius: 2,
                        background: COLOR_ACCENT,
                    }}
                >
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
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2.5,
                                borderRadius: 3,
                                background: COLOR_TABLE_HEADER_BG,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #2196f3 0%, #90caf9 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                }}
                            >
                                <span role="img" aria-label="productos" style={{ fontSize: 24 }}>
                                    📦
                                </span>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                    Total productos
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" color="primary.main">
                                    {filteredProducts.length}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                    <Box flex={1}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2.5,
                                borderRadius: 3,
                                background: COLOR_WARNING_BG,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #ffa751 0%, #fffde7 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                }}
                            >
                                <span role="img" aria-label="modificados" style={{ fontSize: 24 }}>
                                    ✏️
                                </span>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                    Modificados
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" color="warning.main">
                                    {productChanges.length}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                    <Box flex={1}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2.5,
                                borderRadius: 3,
                                background: COLOR_SUCCESS_BG,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #43a047 0%, #a5d6a7 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                }}
                            >
                                <span role="img" aria-label="precio" style={{ fontSize: 24 }}>
                                    💲
                                </span>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                    Precio promedio
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" color="success.main">
                                    ${precioPromedio.toFixed(2)}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                    <Box flex={1}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2.5,
                                borderRadius: 3,
                                background: '#fff3e0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #ff7043 0%, #ffccbc 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                }}
                            >
                                <span role="img" aria-label="inventario" style={{ fontSize: 24 }}>
                                    📊
                                </span>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                    Inventario total
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" color="secondary.main">
                                    {totalInventario}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                </Stack>
                {/* Fin resumen */}

                {/* NUEVO: Panel de edición masiva */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 2.5,
                        mb: 2,
                        borderRadius: 3,
                        background: COLOR_ACCENT,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2196f3 0%, #ffa751 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 3,
                        }}
                    >
                        <span role="img" aria-label="edición masiva" style={{ fontSize: 28 }}>
                            📝
                        </span>
                    </Box>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems="center"
                        sx={{ flex: 1 }}
                    >
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Campo a editar</InputLabel>
                            <Select
                                value={massEditField}
                                label="Campo a editar"
                                onChange={(e) =>
                                    setMassEditField(e.target.value as '' | 'precio' | 'inventario')
                                }
                            >
                                <MenuItem value="">Seleccionar campo</MenuItem>
                                <MenuItem value="precio">Precio</MenuItem>
                                <MenuItem value="inventario">Inventario</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            type="number"
                            size="small"
                            label="Nuevo valor"
                            value={massEditValue}
                            onChange={(e) => setMassEditValue(Number(e.target.value))}
                            sx={{ width: 120 }}
                            disabled={!massEditField}
                        />
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>Aplicar a</InputLabel>
                            <Select
                                value={massEditTarget}
                                label="Aplicar a"
                                onChange={(e) =>
                                    setMassEditTarget(
                                        e.target.value as 'seleccion' | 'categoria' | 'marca',
                                    )
                                }
                            >
                                <MenuItem value="seleccion">Selección</MenuItem>
                                <MenuItem value="categoria">Categoría</MenuItem>
                                <MenuItem value="marca">Marca</MenuItem>
                            </Select>
                        </FormControl>
                        {massEditTarget === 'categoria' && (
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                <InputLabel>Categoría</InputLabel>
                                <Select
                                    value={massEditCategory}
                                    label="Categoría"
                                    onChange={(e) => setMassEditCategory(e.target.value as string)}
                                >
                                    {Array.from(
                                        new Set(products.map((p) => p.categoria).filter(Boolean)),
                                    ).map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {massEditTarget === 'marca' && (
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                <InputLabel>Marca</InputLabel>
                                <Select
                                    value={massEditBrand}
                                    label="Marca"
                                    onChange={(e) => setMassEditBrand(e.target.value as string)}
                                >
                                    {Array.from(
                                        new Set(products.map((p) => p.marca).filter(Boolean)),
                                    ).map((marca) => (
                                        <MenuItem key={marca} value={marca}>
                                            {marca}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={
                                !massEditField ||
                                (massEditTarget === 'seleccion' && selectedKeys.length === 0) ||
                                (massEditTarget === 'categoria' && !massEditCategory) ||
                                (massEditTarget === 'marca' && !massEditBrand)
                            }
                            onClick={handleMassEdit}
                            sx={{
                                fontWeight: 700,
                                borderRadius: 2,
                                minWidth: 180,
                                boxShadow: '0 2px 8px 0 rgba(33,150,243,0.08)',
                                py: 1.2,
                            }}
                            startIcon={<EditIcon />}
                        >
                            Aplicar edición masiva
                        </Button>
                    </Stack>
                </Paper>

                {/* Tabla */}
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: COLOR_BG,
                        boxShadow: '0 4px 24px 0 rgba(33,150,243,0.06)',
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            p: { xs: 2, sm: 3 },
                            pb: 1,
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            background: COLOR_HEADER_BG,
                            borderRadius: { xs: '0 0 20px 20px', sm: '0 0 32px 32px' },
                            boxShadow: '0 4px 24px 0 rgba(33,150,243,0.10)',
                            mb: 2,
                            color: COLOR_HEADER_TEXT,
                            position: 'relative',
                            overflow: 'hidden',
                            gap: { xs: 2, sm: 0 },
                        }}
                    >
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                                variant="h5"
                                component="h2"
                                fontWeight="bold"
                                sx={{
                                    letterSpacing: 1,
                                    mb: 0.5,
                                    textShadow: '0 2px 8px rgba(33,150,243,0.18)',
                                    fontSize: { xs: 18, sm: 22 },
                                    whiteSpace: 'pre-line',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'inline-block',
                                        background: '#ffd3a1',
                                        color: '#2196f3',
                                        borderRadius: 12,
                                        padding: '2px 10px',
                                        fontWeight: 800,
                                        fontSize: 18,
                                        marginRight: 8,
                                        boxShadow: '0 2px 8px 0 rgba(255,193,7,0.10)',
                                        maxWidth: '100%',
                                    }}
                                >
                                    Catálogo de productos
                                </span>
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#fff',
                                    fontWeight: 500,
                                    textShadow: '0 1px 4px rgba(33,150,243,0.10)',
                                    fontSize: { xs: 13, sm: 16 },
                                    whiteSpace: 'pre-line',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                Edita los precios en tiempo real
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mt: { xs: 2, sm: 0 },
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: 36, sm: 48 },
                                    height: { xs: 36, sm: 48 },
                                    borderRadius: '50%',
                                    background: '#ffd3a1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px 0 rgba(33,150,243,0.10)',
                                }}
                            >
                                <span
                                    role="img"
                                    aria-label="catálogo"
                                    style={{ fontSize: 22, color: '#2196f3' }}
                                >
                                    🗂️
                                </span>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                position: 'absolute',
                                right: { xs: -30, sm: -60 },
                                top: { xs: -20, sm: -40 },
                                width: { xs: 80, sm: 160 },
                                height: { xs: 80, sm: 160 },
                                background: 'rgba(255,255,255,0.10)',
                                borderRadius: '50%',
                                zIndex: 0,
                            }}
                        />
                    </Box>

                    <TableContainer
                        sx={{
                            background: COLOR_WHITE,
                            borderRadius: 4,
                            boxShadow: '0 4px 24px 0 rgba(33,150,243,0.05)',
                            overflow: 'hidden',
                        }}
                    >
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead
                                sx={{
                                    background: COLOR_TABLE_HEADER_BG,
                                    boxShadow: '0 2px 8px 0 rgba(33,150,243,0.10)',
                                    borderBottom: '2px solid #90caf9',
                                    '& th': {
                                        background: 'white',
                                        color: COLOR_TABLE_HEADER_TEXT,
                                        fontWeight: 'bold',
                                        fontSize: 17,
                                        letterSpacing: 0.5,
                                        border: 'none',
                                        cursor: 'default',
                                    },
                                }}
                            >
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={
                                                selectedKeys.length > 0 &&
                                                selectedKeys.length < paginatedProducts.length
                                            }
                                            checked={
                                                paginatedProducts.length > 0 &&
                                                selectedKeys.length === paginatedProducts.length
                                            }
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedKeys(
                                                        paginatedProducts.map((p) => p.key_unique),
                                                    );
                                                } else {
                                                    setSelectedKeys([]);
                                                }
                                            }}
                                            inputProps={{ 'aria-label': 'Seleccionar todos' }}
                                            sx={{ color: 'blue' }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'white',
                                            fontSize: 17,
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                        }}
                                        onClick={() => {
                                            setOrderField('nombre');
                                            setOrderBy((prev) =>
                                                orderField === 'nombre'
                                                    ? prev === 'asc'
                                                        ? 'desc'
                                                        : 'asc'
                                                    : 'asc',
                                            );
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            Nombre
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 2,
                                                    color:
                                                        orderField === 'nombre'
                                                            ? '#2196f3'
                                                            : '#b0b0b0',
                                                    transition: 'color 0.2s',
                                                }}
                                            >
                                                {orderBy === 'asc' && orderField === 'nombre'
                                                    ? '▲'
                                                    : '▼'}
                                            </span>
                                        </Box>
                                    </TableCell>
                                    <TableCell
                                        sx={{ fontWeight: 'bold', color: 'white', fontSize: 17 }}
                                    >
                                        Categoría
                                    </TableCell>
                                    <TableCell
                                        sx={{ fontWeight: 'bold', color: 'white', fontSize: 17 }}
                                    >
                                        Marca
                                    </TableCell>
                                    <TableCell
                                        sx={{ fontWeight: 'bold', color: 'white', fontSize: 17 }}
                                    >
                                        Precio sugerido
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'white',
                                            fontSize: 17,
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                        }}
                                        onClick={() => {
                                            setOrderField('precio_actual');
                                            setOrderBy((prev) =>
                                                orderField === 'precio_actual'
                                                    ? prev === 'asc'
                                                        ? 'desc'
                                                        : 'asc'
                                                    : 'asc',
                                            );
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            Precio actual
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 2,
                                                    color:
                                                        orderField === 'precio_actual'
                                                            ? '#2196f3'
                                                            : '#b0b0b0',
                                                    transition: 'color 0.2s',
                                                }}
                                            >
                                                {orderBy === 'asc' && orderField === 'precio_actual'
                                                    ? '▲'
                                                    : '▼'}
                                            </span>
                                        </Box>
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'white',
                                            fontSize: 17,
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                        }}
                                        onClick={() => {
                                            setOrderField('inventario_actual');
                                            setOrderBy((prev) =>
                                                orderField === 'inventario_actual'
                                                    ? prev === 'asc'
                                                        ? 'desc'
                                                        : 'asc'
                                                    : 'asc',
                                            );
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            Inventario
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 2,
                                                    color:
                                                        orderField === 'inventario_actual'
                                                            ? '#2196f3'
                                                            : '#b0b0b0',
                                                    transition: 'color 0.2s',
                                                }}
                                            >
                                                {orderBy === 'asc' &&
                                                orderField === 'inventario_actual'
                                                    ? '▲'
                                                    : '▼'}
                                            </span>
                                        </Box>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: 'bold', color: 'white', fontSize: 17 }}
                                    >
                                        Estado
                                        <Tooltip title="Estado del producto. El color verde indica que no ha sido modificado, mientras que el color naranja indica que ha sido editado.">
                                            <Box
                                                component="span"
                                                sx={{
                                                    ml: 1,
                                                    color: 'info.main',
                                                    cursor: 'help',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                ?
                                            </Box>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedProducts.map((product) => (
                                    <TableRow
                                        key={product.key_unique}
                                        sx={{
                                            background: product.modificado
                                                ? COLOR_WARNING_BG
                                                : COLOR_BG,
                                            boxShadow: product.modificado
                                                ? '0 2px 8px 0 rgba(255,193,7,0.08)'
                                                : 'none',
                                            borderRadius: 3,
                                            transition: 'box-shadow 0.2s, background 0.2s',
                                            '&:hover': {
                                                boxShadow: '0 6px 24px 0 rgba(33,150,243,0.10)',
                                                background: COLOR_TABLE_HEADER_BG,
                                            },
                                        }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedKeys.includes(product.key_unique)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedKeys([
                                                            ...selectedKeys,
                                                            product.key_unique,
                                                        ]);
                                                    } else {
                                                        setSelectedKeys(
                                                            selectedKeys.filter(
                                                                (k) => k !== product.key_unique,
                                                            ),
                                                        );
                                                    }
                                                }}
                                                inputProps={{
                                                    'aria-label': `Seleccionar ${product.nombre}`,
                                                }}
                                                sx={{ color: '#2196f3' }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            sx={{ fontWeight: 600, fontSize: 16 }}
                                        >
                                            {product.nombre}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.categoria}
                                                size="small"
                                                sx={{
                                                    background: COLOR_CHIP_CAT_BG,
                                                    color: COLOR_CHIP_CAT_TEXT,
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    borderRadius: 2,
                                                    px: 1.5,
                                                    boxShadow: '0 1px 4px 0 rgba(67,160,71,0.08)',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.marca}
                                                size="small"
                                                sx={{
                                                    background: COLOR_CHIP_MARCA_BG,
                                                    color: COLOR_CHIP_MARCA_TEXT,
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    borderRadius: 2,
                                                    px: 1.5,
                                                    boxShadow: '0 1px 4px 0 rgba(33,150,243,0.08)',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontFamily: 'monospace',
                                                fontSize: 16,
                                                color: '#2196f3',
                                            }}
                                        >
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
                                                    sx: {
                                                        background: 'rgba(33,150,243,0.07)',
                                                        borderRadius: 2,
                                                        fontFamily: 'monospace',
                                                        fontSize: 16,
                                                    },
                                                }}
                                                sx={{
                                                    width: 120,
                                                    fontFamily: 'monospace',
                                                    fontSize: 16,
                                                }}
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
                                                InputProps={{
                                                    sx: {
                                                        background: 'rgba(67,160,71,0.07)',
                                                        borderRadius: 2,
                                                        fontFamily: 'monospace',
                                                        fontSize: 16,
                                                    },
                                                }}
                                                sx={{
                                                    width: 100,
                                                    fontFamily: 'monospace',
                                                    fontSize: 16,
                                                }}
                                                inputProps={{ step: '1', min: '0' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    backgroundColor: product.modificado
                                                        ? theme.palette.warning.main
                                                        : theme.palette.success.main,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto',
                                                    boxShadow: product.modificado
                                                        ? '0 0 12px 0 rgba(255,193,7,0.18)'
                                                        : '0 0 8px 0 rgba(76,175,80,0.10)',
                                                    transition: 'background 0.3s, box-shadow 0.3s',
                                                    animation: product.modificado
                                                        ? 'pulse 1.2s infinite alternate'
                                                        : 'none',
                                                    '@keyframes pulse': {
                                                        from: {
                                                            boxShadow:
                                                                '0 0 12px 0 rgba(255,193,7,0.18)',
                                                        },
                                                        to: {
                                                            boxShadow:
                                                                '0 0 24px 0 rgba(255,193,7,0.32)',
                                                        },
                                                    },
                                                }}
                                            >
                                                <EditIcon
                                                    sx={{
                                                        fontSize: 16,
                                                        color: 'white',
                                                        opacity: product.modificado ? 1 : 0.3,
                                                        transition: 'opacity 0.3s',
                                                    }}
                                                />
                                            </Box>
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
                        sx={{
                            background: 'rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(6px)',
                            borderRadius: 3,
                            boxShadow: '0 2px 8px 0 rgba(33,150,243,0.10)',
                            my: 2,
                            '.MuiTablePagination-toolbar': {
                                fontWeight: 600,
                                fontSize: 16,
                            },
                            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                color: '#2196f3',
                            },
                            '.MuiTablePagination-actions button': {
                                color: '#2196f3',
                            },
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            py: 3,
                            bgcolor: 'transparent',
                        }}
                    >
                        {/* Boton de revertir cambios */}
                        <Button
                            variant="outlined"
                            color="warning"
                            size="large"
                            sx={{
                                borderRadius: 3,
                                fontWeight: 700,
                                px: { xs: 2, sm: 4 },
                                py: { xs: 1, sm: 1.5 },
                                fontSize: { xs: 14, sm: 16 },
                                background: COLOR_ACCENT,
                                color: COLOR_PRIMARY,
                                boxShadow: '0 2px 8px 0 rgba(255,193,7,0.18)',
                                width: { xs: '100%', sm: 'auto' },
                                mb: { xs: 1, sm: 0 },
                                transition: 'box-shadow 0.2s, background 0.2s',
                                '&:hover': {
                                    background: '#ffe2c2',
                                    boxShadow: '0 4px 16px 0 rgba(255,193,7,0.22)',
                                },
                            }}
                            onClick={() => {
                                setProducts(
                                    products.map((p) => ({
                                        ...p,
                                        precio_actual: p.precio_sugerido,
                                        inventario_actual: p.inventario_original,
                                        modificado: false,
                                    })),
                                );
                                localStorage.removeItem('kladi-cambios');
                            }}
                        >
                            Revertir todos los cambios
                        </Button>
                        {/* Boton de confirmar cambios */}
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                                borderRadius: 3,
                                fontWeight: 700,
                                px: { xs: 2, sm: 4 },
                                py: { xs: 1, sm: 1.5 },
                                fontSize: { xs: 14, sm: 16 },
                                background: COLOR_PRIMARY,
                                color: COLOR_WHITE,
                                boxShadow: '0 2px 8px 0 rgba(33,150,243,0.18)',
                                width: { xs: '100%', sm: 'auto' },
                                transition: 'box-shadow 0.2s, background 0.2s',
                                '&:hover': {
                                    background: COLOR_PRIMARY_DARK,
                                    boxShadow: '0 4px 16px 0 rgba(33,150,243,0.22)',
                                },
                            }}
                            onClick={() => setOpenSummary(true)}
                            disabled={productChanges.length === 0}
                        >
                            Finalizar cambios
                        </Button>
                    </Box>
                </Paper>

                {/* Modal de filtros avanzados */}
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
                                <Typography
                                    gutterBottom
                                    fontWeight={600}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                    <img
                                        src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4b0.svg"
                                        alt="Precio"
                                        width={22}
                                        style={{ verticalAlign: 'middle' }}
                                    />
                                    Rango de precio sugerido
                                    <Tooltip title="Filtra productos por su precio sugerido. Mueve los extremos para ajustar el rango.">
                                        <Box
                                            component="span"
                                            sx={{
                                                ml: 1,
                                                color: 'primary.main',
                                                cursor: 'help',
                                                fontWeight: 700,
                                            }}
                                        >
                                            ?
                                        </Box>
                                    </Tooltip>
                                </Typography>
                                <Slider
                                    value={priceRange}
                                    min={minPrecio}
                                    max={maxPrecio}
                                    onChange={(_event: Event, v: number | number[]) =>
                                        setPriceRange(v as number[])
                                    }
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
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    sx={{ mt: 0.5 }}
                                >
                                    <Typography variant="caption" color="text.secondary">
                                        Mín: ${minPrecio}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Máx: ${maxPrecio}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Box>
                                <Typography
                                    gutterBottom
                                    fontWeight={600}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                    <img
                                        src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4e6.svg"
                                        alt="Inventario"
                                        width={22}
                                        style={{ verticalAlign: 'middle' }}
                                    />
                                    Rango de inventario
                                    <Tooltip title="Filtra productos por inventario actual. Ajusta el rango según tus necesidades.">
                                        <Box
                                            component="span"
                                            sx={{
                                                ml: 1,
                                                color: 'primary.main',
                                                cursor: 'help',
                                                fontWeight: 700,
                                            }}
                                        >
                                            ?
                                        </Box>
                                    </Tooltip>
                                </Typography>
                                <Slider
                                    value={invRange}
                                    min={minInv}
                                    max={maxInv}
                                    onChange={(_event: Event, v: number | number[]) =>
                                        setInvRange(v as number[])
                                    }
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
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    sx={{ mt: 0.5 }}
                                >
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

                {/* Modal de resumen de cambios */}
                <Dialog
                    open={openSummary}
                    onClose={() => setOpenSummary(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(16px)',
                            borderRadius: 4,
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                            border: '1px solid rgba(255,255,255,0.18)',
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
                        <InfoIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                        Resumen de cambios realizados
                        <Tooltip title="Cerrar">
                            <span>
                                <Button
                                    onClick={() => setOpenSummary(false)}
                                    sx={{ ml: 'auto', minWidth: 0, p: 0.5 }}
                                    color="inherit"
                                >
                                    <CloseIcon />
                                </Button>
                            </span>
                        </Tooltip>
                    </DialogTitle>
                    <DialogContent dividers sx={{ p: 3 }}>
                        {productChanges.length === 0 ? (
                            <Typography color="text.secondary" align="center">
                                No hay cambios para mostrar.
                            </Typography>
                        ) : (
                            <Stack spacing={2}>
                                {productChanges.map((p) => (
                                    <Paper
                                        key={p.key_unique}
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            background: 'rgba(255,255,255,0.7)',
                                            boxShadow: '0 1px 6px 0 rgba(255,193,7,0.08)',
                                        }}
                                    >
                                        <img
                                            src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4e6.svg"
                                            alt="Inventario"
                                            width={22}
                                            style={{ verticalAlign: 'middle' }}
                                        />
                                        <Box flex={1}>
                                            <Typography fontWeight={700}>{p.nombre}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {p.categoria} | {p.marca}
                                            </Typography>
                                        </Box>
                                        <Box textAlign="right">
                                            <Typography variant="body2" color="text.secondary">
                                                Precio: <b>${p.precio_actual.toFixed(2)}</b>{' '}
                                                {p.precio_actual !== p.precio_sugerido && (
                                                    <>
                                                        <span
                                                            style={{
                                                                color: '#ffa751',
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            (antes ${p.precio_sugerido.toFixed(2)})
                                                        </span>
                                                    </>
                                                )}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Inventario: <b>{p.inventario_actual}</b>{' '}
                                                {p.inventario_actual !== p.inventario_original && (
                                                    <>
                                                        <span
                                                            style={{
                                                                color: '#ffa751',
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            (antes {p.inventario_original})
                                                        </span>
                                                    </>
                                                )}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                ))}
                            </Stack>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, pt: 1, justifyContent: 'flex-end' }}>
                        <Button
                            onClick={() => setOpenSummary(false)}
                            color="inherit"
                            variant="outlined"
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                        >
                            Regresar
                        </Button>
                        <Button
                            onClick={handleConfirmSummary}
                            color="primary"
                            variant="contained"
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                        >
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Modal de alerta de éxito */}
                <Dialog
                    open={openSuccess}
                    onClose={() => setOpenSuccess(false)}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                        sx: {
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 4,
                            boxShadow: '0 8px 32px 0 rgba(33, 150, 243, 0.18)',
                            border: '1px solid rgba(33,150,243,0.12)',
                            textAlign: 'center',
                        },
                    }}
                >
                    <Box
                        sx={{
                            py: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CheckCircleIcon
                            sx={{
                                fontSize: 72,
                                color: 'success.main',
                                mb: 2,
                                animation: 'pop 0.5s cubic-bezier(.36,2,.6,1.2)',
                                '@keyframes pop': {
                                    '0%': { transform: 'scale(0.5)', opacity: 0 },
                                    '80%': { transform: 'scale(1.15)', opacity: 1 },
                                    '100%': { transform: 'scale(1)', opacity: 1 },
                                },
                            }}
                        />
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            color="success.main"
                            sx={{ mb: 1 }}
                        >
                            ¡Cambios guardados!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Todos los cambios han sido confirmados y almacenados correctamente.
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            sx={{ borderRadius: 2, fontWeight: 600, px: 4 }}
                            onClick={() => setOpenSuccess(false)}
                        >
                            Cerrar
                        </Button>
                    </Box>
                </Dialog>
            </Container>
        </Box>
    );
}
