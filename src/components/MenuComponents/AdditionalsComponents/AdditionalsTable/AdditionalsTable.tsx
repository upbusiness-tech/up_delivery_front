import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Additionals } from "../../../../types/Product.type";
import { moneyMask } from "../../../../utils/masks/mask";
import UseAdditionalsTableController from "./UseAdditionalsTableController";

interface AdditionalsTableProps {
  onCreateAdditional?: () => void;
  onCreateCategory?: () => void;
  onEditAdditional?: (additional: Additionals) => void;
}

export default function AdditionalsTable({
  onCreateAdditional,
  onCreateCategory,
  onEditAdditional,
}: AdditionalsTableProps) {
  const {
    additionals,
    hasCategories,
    search,
    setSearch,
    isSearching,
    hasSearchResults,
    isLoading,
    error,
    refetch,
    deleteAdditional,
    deletingId,
    deleteError,
    clearDeleteError,
  } = UseAdditionalsTableController();

  if (isLoading) {
    return (
      <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", py: 8 }}>
        <CircularProgress size={32} />
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={refetch}>
            Tentar novamente
          </Button>
        }
      >
        Não foi possível carregar os adicionais.
      </Alert>
    );
  }

  return (
    <Box>
      {deleteError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearDeleteError}>
          {deleteError}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 1.5, mb: 2, border: "1px solid #E5E7EB", borderRadius: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Pesquisar adicional..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Limpar pesquisa"
                    onClick={() => setSearch("")}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </Paper>

      {isSearching && !hasSearchResults ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: "center", border: "1px solid #E5E7EB", borderRadius: 3 }}>
          <Typography sx={{ color: "#64748B", fontSize: "0.9rem" }}>
            Nenhum adicional encontrado para "{search.trim()}".
          </Typography>
        </Paper>
      ) : additionals.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: "center", border: "1px solid #E5E7EB", borderRadius: 3 }}>
          <Typography sx={{ color: "#64748B", fontSize: "0.9rem", mb: hasCategories ? 2 : 1 }}>
            Nenhum adicional cadastrado ainda.
          </Typography>
          {!hasCategories && (
            <Typography sx={{ color: "#94A3B8", fontSize: "0.82rem", mb: 2 }}>
              Cadastre uma categoria antes de criar adicionais.
            </Typography>
          )}
          {!hasCategories && onCreateCategory ? (
            <Button
              endIcon={<AddIcon />}
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={onCreateCategory}
            >
              Cadastrar categoria
            </Button>
          ) : onCreateAdditional ? (
            <Button
              endIcon={<AddIcon />}
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={onCreateAdditional}
            >
              Cadastrar adicional
            </Button>
          ) : null}
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={1}
          sx={{ border: "1px solid #E5E7EB", borderRadius: 3, overflowX: "auto" }}
        >
          <Table size="medium" sx={{ minWidth: 680 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Adicional</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Categoria</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }} align="center">
                  Seleção
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }} align="right">
                  Preço
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }} align="right">
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {additionals.map((additional) => {
                const isDeleting = deletingId === additional.id;

                return (
                <TableRow
                  key={additional.id}
                  hover
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                    opacity: isDeleting ? 0.6 : 1,
                  }}
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
                        <TuneIcon fontSize="small" />
                      </Box>
                      <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                        {additional.additionalName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "#475569" }}>
                      {additional.category?.categoryName ?? "Sem categoria"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={additional.additionalType === "single" ? "Única" : "Múltipla"}
                      size="small"
                      color={additional.additionalType === "single" ? "default" : "info"}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ color: "success.main", fontWeight: 700 }}>
                      {moneyMask(Number(additional.additionalPrice))}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
                      <Tooltip title="Editar adicional">
                        <span>
                          <IconButton
                            size="small"
                            color="primary"
                            disabled={isDeleting}
                            onClick={() => onEditAdditional?.(additional)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Excluir adicional">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={isDeleting}
                            onClick={() => void deleteAdditional(additional)}
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
