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
import CategoryIcon from "@mui/icons-material/Category";
import UseCategoriesTableController from "./UseCategoriesTableController";

interface CategoriesTableProps {
  onCreateCategory?: () => void;
}

export default function CategoriesTable({ onCreateCategory }: CategoriesTableProps) {
  const {
    categories,
    search,
    setSearch,
    isSearching,
    hasSearchResults,
    isLoading,
    error,
    refetch,
  } = UseCategoriesTableController();

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
        Não foi possível carregar as categorias.
      </Alert>
    );
  }

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 1.5, mb: 2, border: "1px solid #E5E7EB", borderRadius: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Pesquisar categoria..."
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
            Nenhuma categoria encontrada para "{search.trim()}".
          </Typography>
        </Paper>
      ) : categories.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: "center", border: "1px solid #E5E7EB", borderRadius: 3 }}>
          <Typography sx={{ color: "#64748B", fontSize: "0.9rem", mb: 2 }}>
            Nenhuma categoria cadastrada ainda.
          </Typography>
          {onCreateCategory && (
            <Button
              endIcon={<AddIcon />}
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={onCreateCategory}
            >
              Cadastrar categoria
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={1}
          sx={{ border: "1px solid #E5E7EB", borderRadius: 3, overflow: "hidden" }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Categoria</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }} align="center">
                  Produtos
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }} align="center">
                  Adicionais
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
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
                        <CategoryIcon fontSize="small" />
                      </Box>
                      <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                        {category.categoryName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={category.productCount}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2, minWidth: 36 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={category.additionalCount}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ borderRadius: 2, minWidth: 36 }}
                    />
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
