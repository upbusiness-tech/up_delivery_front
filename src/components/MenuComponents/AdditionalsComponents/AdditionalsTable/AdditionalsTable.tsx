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
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import { moneyMask } from "../../../../utils/masks/mask";
import UseAdditionalsTableController from "./UseAdditionalsTableController";

interface AdditionalsTableProps {
  onCreateAdditional?: () => void;
  onCreateCategory?: () => void;
}

export default function AdditionalsTable({
  onCreateAdditional,
  onCreateCategory,
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
          <Table size="medium" sx={{ minWidth: 560 }}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {additionals.map((additional) => (
                <TableRow key={additional.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
