/**
 * Este hook permite editar en masa los productos seleccionados.
 * Permite seleccionar productos, aplicar cambios masivos y manejar el estado de edición.
 */
import React from 'react';
import { Box, Stack, TextField, InputAdornment, Switch, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/FilterList';

// Define las propiedades del componente ProductFilters
interface ProductFiltersProps {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    showOnlyEdited: boolean;
    setShowOnlyEdited: (v: boolean) => void;
    onOpenFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    showOnlyEdited,
    setShowOnlyEdited,
    onOpenFilters,
}) => (
    <Box>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <Box flex={1}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 1 }}>
                        <Switch
                            checked={showOnlyEdited}
                            onChange={() => setShowOnlyEdited(!showOnlyEdited)}
                            color="warning"
                            inputProps={{ 'aria-label': 'Mostrar solo productos editados' }}
                            sx={{
                                '& .MuiSwitch-thumb': {
                                    boxShadow: '0 2px 8px rgba(255,193,7,0.18)',
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
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FilterIcon />}
                    onClick={onOpenFilters}
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                    Filtros avanzados
                </Button>
            </Box>
        </Stack>
    </Box>
);

export default ProductFilters;
