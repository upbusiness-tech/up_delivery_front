import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StraightenIcon from "@mui/icons-material/Straighten";
import type { Size } from "../../../../types/Product.type";
import UseSizesTableController from "./UseSizesTableController";

interface SizesTableProps {
  onCreateSize?: () => void;
  onEditSize?: (size: Size) => void;
}

export default function SizesTable({ onCreateSize, onEditSize }: SizesTableProps) {
  const c = UseSizesTableController();

  if (c.isLoading) {
    return (
      <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", py: 8 }}>
        <CircularProgress size={32} />
      </Stack>
    );
  }

  if (c.error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={c.refetch}>
            Tentar novamente
          </Button>
        }
      >
        Não foi possível carregar os tamanhos.
      </Alert>
    );
  }

  return (
    <Box>
      {c.deleteError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={c.clearDeleteError}>
          {c.deleteError}
        </Alert>
      )}

      {c.sizes.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ p: 5, textAlign: "center", border: "1px solid #E5E7EB", borderRadius: 3 }}
        >
          <Typography sx={{ color: "#64748B", fontSize: "0.9rem", mb: 2 }}>
            Nenhum tamanho cadastrado ainda.
          </Typography>
          {onCreateSize && (
            <Button
              endIcon={<AddIcon />}
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={onCreateSize}
            >
              Cadastrar tamanho
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={1}
          sx={{ border: "1px solid #E5E7EB", borderRadius: 3, overflowX: "auto" }}
        >
          <Table size="medium" sx={{ minWidth: 520 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Tamanho</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                  Limite de sabores
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }} align="right">
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {c.sizes.map((size) => {
                const isDefaultSize = size.name.toUpperCase() === "COMUM";
                const isDeleting = c.deletingId === size.id;

                return (
                  <TableRow
                    key={size.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 }, opacity: isDeleting ? 0.6 : 1 }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: "#F1F5F9",
                            color: "#475569",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <StraightenIcon fontSize="small" />
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                            {size.name}
                          </Typography>
                          {isDefaultSize && (
                            <Chip
                              label="Padrão"
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: 2 }}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          size.limitFlavors <= 1
                            ? "Sabor único"
                            : `Até ${size.limitFlavors} sabores`
                        }
                        size="small"
                        color={size.limitFlavors <= 1 ? "default" : "info"}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
                        <Tooltip
                          title={
                            isDefaultSize
                              ? "O tamanho COMUM é padrão do sistema"
                              : "Editar tamanho"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              disabled={isDefaultSize || isDeleting}
                              onClick={() => onEditSize?.(size)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip
                          title={
                            isDefaultSize
                              ? "O tamanho COMUM é padrão do sistema"
                              : "Excluir tamanho"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={isDefaultSize || isDeleting}
                              onClick={() => void c.deleteSize(size)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
