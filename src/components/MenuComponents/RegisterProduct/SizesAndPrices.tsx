import { useState, useEffect, useRef } from 'react';
import {
  Stack,
  Typography,
  Switch,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const DEFAULT_SIZE_LABEL = 'COMUM';

function createEmptyRow() {
  return { id: crypto.randomUUID(), sizeId: '', price: '' };
}

export default function SizesAndPrices({ sizes = [], onChange }) {
  const [multipleSizes, setMultipleSizes] = useState(false);
  const [singlePrice, setSinglePrice] = useState('');
  const [sizeRows, setSizeRows] = useState([createEmptyRow()]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!onChange) return;

    if (!multipleSizes) {
      onChange({
        multipleSizes: false,
        items: [{ sizeId: null, sizeName: DEFAULT_SIZE_LABEL, price: singlePrice }],
      });
    } else {
      onChange({
        multipleSizes: true,
        items: sizeRows.map((row) => ({
          sizeId: row.sizeId || null,
          sizeName: sizes.find((s) => s.id === row.sizeId)?.name ?? '',
          price: row.price,
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multipleSizes, singlePrice, sizeRows]);

  const handleToggle = (e) => {
    const checked = e.target.checked;
    setMultipleSizes(checked);
    // ao ligar o switch, garante que exista ao menos uma linha vazia pra preencher
    if (checked && sizeRows.length === 0) {
      setSizeRows([createEmptyRow()]);
    }
  };

  const handleAddSizeRow = () => {
    setSizeRows((prev) => [...prev, createEmptyRow()]);
  };

  const handleRemoveSizeRow = (rowId) => {
    setSizeRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  const handleSizeRowChange = (rowId, field, value) => {
    setSizeRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  };

  const usedSizeIds = (excludeRowId) =>
    sizeRows.filter((row) => row.id !== excludeRowId).map((row) => row.sizeId);

  return (
    <Stack sx={{ py: 1 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" gutterBottom>
          Tamanhos e preços
        </Typography>
      </Stack>

      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" gutterBottom>
          Esse produto vai aceitar mais de um tamanho?
        </Typography>
        <Switch checked={multipleSizes} onChange={handleToggle} />
      </Stack>

      {!multipleSizes ? (
        <Stack spacing={1} direction="row" sx={{ mt: 1, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              Tamanho
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={DEFAULT_SIZE_LABEL}
              disabled
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              Valor
            </Typography>
            <TextField
              placeholder="R$"
              size="small"
              value={singlePrice}
              onChange={(e) => setSinglePrice(e.target.value)}
            />
          </Box>
        </Stack>
      ) : (
        <Stack spacing={1} sx={{ mt: 1 }}>
          {sizeRows.map((row) => (
            <Stack key={row.id} spacing={1} direction="row" sx={{ alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                  Tamanho
                </Typography>
                <Select
                  size="small"
                  value={row.sizeId}
                  displayEmpty
                  onChange={(e) => handleSizeRowChange(row.id, 'sizeId', e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Selecione
                  </MenuItem>
                  {sizes.map((size) => (
                    <MenuItem
                      key={size.id}
                      value={size.id}
                      disabled={usedSizeIds(row.id).includes(size.id)}
                    >
                      {size.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                  Valor
                </Typography>
                <TextField
                  placeholder="R$"
                  size="small"
                  value={row.price}
                  onChange={(e) => handleSizeRowChange(row.id, 'price', e.target.value)}
                />
              </Box>
              <IconButton
                size="small"
                onClick={() => handleRemoveSizeRow(row.id)}
                disabled={sizeRows.length === 1}
                sx={{ mt: 2 }}
                aria-label="Remover tamanho"
              >
              </IconButton>
            </Stack>
          ))}

          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddSizeRow}
            sx={{ alignSelf: 'flex-start', mt: 0.5 }}
          >
            Adicionar tamanho
          </Button>
        </Stack>
      )}
    </Stack>
  );
}