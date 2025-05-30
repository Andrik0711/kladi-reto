import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';

interface MassEditPanelProps {
    selectedCount: number;
    onEdit: () => void;
    onClear: () => void;
    isEditing: boolean;
    colorAccent: string;
}

const MassEditPanel: React.FC<MassEditPanelProps> = ({
    selectedCount,
    onEdit,
    onClear,
    isEditing,
    colorAccent,
}) => (
    <Box mb={2}>
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
        >
            <Typography variant="subtitle1" fontWeight={600} color={colorAccent}>
                {selectedCount > 0
                    ? `${selectedCount} productos seleccionados`
                    : 'Ningún producto seleccionado'}
            </Typography>
            <Stack direction="row" spacing={2}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={selectedCount === 0 || isEditing}
                    onClick={onEdit}
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                    Editar seleccionados
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    disabled={selectedCount === 0 || isEditing}
                    onClick={onClear}
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                    Limpiar selección
                </Button>
            </Stack>
        </Stack>
    </Box>
);

export default MassEditPanel;
