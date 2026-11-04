import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import { moneyMask } from "../../../utils/masks/mask";
import UseNeighborhoodsController from "./UseNeighborhoodsController";

export default function NeighborhoodsTab() {
  const {
    neighborhoods,
    isLoading,
    isFetching,
    error,
    refresh,
    dialogOpen,
    editing,
    form,
    formError,
    isSaving,
    openCreate,
    openEdit,
    closeFormDialog,
    updateFormField,
    submitForm,
    deleteTarget,
    deleteError,
    isDeleting,
    requestDelete,
    closeDeleteDialog,
    confirmDelete,
  } = UseNeighborhoodsController();

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="subtitle1">Taxas de entrega</Typography>
            <Typography variant="body2" color="text.secondary">
              Bairros cadastrados e valores cobrados por entrega.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={refresh}
              disabled={isFetching}
              sx={{ textTransform: "none" }}
            >
              Atualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
              sx={{ textTransform: "none" }}
            >
              Novo bairro
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {error ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={refresh}>
                Tentar novamente
              </Button>
            }
          >
            Não foi possível carregar os bairros.
          </Alert>
        ) : isLoading ? (
          <Stack direction="row" sx={{ justifyContent: "center", py: 6 }}>
            <CircularProgress size={32} />
          </Stack>
        ) : neighborhoods.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{ p: 5, textAlign: "center", borderRadius: 2 }}
          >
            <Typography sx={{ color: "#64748B", fontSize: "0.9rem", mb: 2 }}>
              Nenhum bairro cadastrado ainda. Cadastre o primeiro para definir
              as taxas de entrega.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
              sx={{ textTransform: "none" }}
            >
              Cadastrar bairro
            </Button>
          </Paper>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: "1px solid #E5E7EB", borderRadius: 2, overflow: "hidden" }}
          >
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                    Bairro
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, color: "#6b7280" }}
                  >
                    Taxa de entrega
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "#6b7280" }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {neighborhoods.map((neighborhood) => (
                  <TableRow
                    key={neighborhood.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "center" }}
                      >
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
                          <LocationOnIcon fontSize="small" />
                        </Box>
                        <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                          {neighborhood.neighborhoodName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{ color: "success.main", fontWeight: 700 }}
                      >
                        {moneyMask(Number(neighborhood.deliveryFee))}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ justifyContent: "flex-end" }}
                      >
                        <Tooltip title="Editar bairro">
                          <IconButton
                            size="small"
                            aria-label={`Editar ${neighborhood.neighborhoodName}`}
                            onClick={() => openEdit(neighborhood)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir bairro">
                          <IconButton
                            size="small"
                            color="error"
                            aria-label={`Excluir ${neighborhood.neighborhoodName}`}
                            onClick={() => requestDelete(neighborhood)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={isSaving ? undefined : closeFormDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
          >
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {editing ? "Editar bairro" : "Novo bairro"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Defina o nome do bairro e o valor da taxa de entrega.
              </Typography>
            </Box>
            <IconButton
              aria-label="Fechar"
              onClick={closeFormDialog}
              disabled={isSaving}
              sx={{ mt: -0.5, mr: -0.5 }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Nome do bairro"
              value={form.neighborhoodName}
              onChange={(event) =>
                updateFormField("neighborhoodName", event.target.value)
              }
              fullWidth
              size="small"
              autoFocus
              disabled={isSaving}
            />

            <TextField
              label="Taxa de entrega"
              value={form.deliveryFee}
              onChange={(event) =>
                updateFormField("deliveryFee", event.target.value)
              }
              fullWidth
              size="small"
              disabled={isSaving}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                },
                htmlInput: { inputMode: "decimal" },
              }}
            />

            {formError && <Alert severity="error">{formError}</Alert>}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={closeFormDialog}
            disabled={isSaving}
            sx={{ textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => void submitForm()}
            disabled={
              isSaving ||
              !form.neighborhoodName.trim() ||
              !form.deliveryFee.trim()
            }
            sx={{ textTransform: "none" }}
          >
            {isSaving
              ? "Salvando..."
              : editing
                ? "Salvar alterações"
                : "Cadastrar bairro"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onClose={isDeleting ? undefined : closeDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Excluir bairro</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Tem certeza que deseja excluir{" "}
            <strong>{deleteTarget?.neighborhoodName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Essa ação não pode ser desfeita.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDeleteDialog}
            disabled={isDeleting}
            sx={{ textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => void confirmDelete()}
            disabled={isDeleting}
            sx={{ textTransform: "none" }}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
