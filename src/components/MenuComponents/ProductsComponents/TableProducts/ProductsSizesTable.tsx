import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { moneyMask } from "../../../../utils/masks/mask";

interface SizeItem {
  size: { name: string };
  price: number;
}

interface Props {
  sizes: SizeItem[];
}

export default function ProductsSizesTable({ sizes }: Props) {
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
          {sizes.map((s) => (
            <TableRow key={s.size.name} sx={{ "&:last-child td": { borderBottom: 0 } }}>
              <TableCell>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {s.size.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" color="success" sx={{ fontWeight: 600 }}>
                  {moneyMask(s.price)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  color="info"
                  sx={{"&:hover": { bgcolor: "#dae1ff" } }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "#dc2626", "&:hover": { bgcolor: "#fef2f2" } }}
                >
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}