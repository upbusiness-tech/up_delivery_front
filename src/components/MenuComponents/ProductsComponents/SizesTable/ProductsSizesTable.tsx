import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { moneyMask } from "../../../../utils/masks/mask";
import UseProductsSizesTableController from "./UseProductsSizesTableController";
import type { ProducSize, Product } from "../../../../types/Product.type";

interface Props {
  sizes: ProducSize[];
  product: Product;
}

export default function ProductsSizesTable({ sizes, product }: Props) {
  const c = UseProductsSizesTableController({ sizes, product });

  return (
    <TableContainer sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "#fafafa" }}>
            <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Tamanho</TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Preço</TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#6b7280", width: 88 }} align="center">
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {c.sizes.map((s) => {
            const editing = c.isEditing(s.id);
            const loading = c.loadingId === s.id;

            return (
              <TableRow key={s.id} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {s.size.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {editing ? (
                    <TextField
                      type="number"
                      size="small"
                      value={c.editedPrice}
                      onChange={(e) => c.changeEditedPrice(Number(e.target.value))}
                      autoFocus
                    />
                  ) : (
                    <Typography variant="body1" color="success" sx={{ fontWeight: 600 }}>
                      {moneyMask(s.price)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : editing ? (
                    <>
                      <IconButton
                        size="small"
                        color="success"
                        disabled={!c.isPriceDirty(s)}
                        onClick={() => c.saveEdit(s)}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={c.cancelEdit}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        size="small"
                        color="info"
                        sx={{ "&:hover": { bgcolor: "#dae1ff" } }}
                        onClick={() => c.startEdit(s)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: "#dc2626", "&:hover": { bgcolor: "#fef2f2" } }}
                        onClick={() => c.deleteSize(s)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}