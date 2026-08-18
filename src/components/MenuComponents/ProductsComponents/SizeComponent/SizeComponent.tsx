import { Box, Button, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { Size } from "../../../../types/Product.type";

interface props {
  sizes: Size[]
}

export default function SizeComponent({sizes}: props){
  return(
    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 2, overflow: "hidden", mb: 2 }}>
      <Table size="medium">
        <TableHead>
          <TableRow sx={{ bgcolor: "#fafafa" }}>
            <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Tamanhos</TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#6b7280" }} align="center">Limite de sabores</TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#6b7280" }} align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
       <TableBody>
        {sizes.map((s) => (
          <TableRow key={s.id} sx={{ '&:last-child td': { borderBottom: 0 }, cursor: 'pointer' }}>
            <TableCell sx={{ py: 0.5 }}>
              <Typography sx={{ fontWeight: 700, color: '#111827' }}>
                {s.name}
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ verticalAlign: 'middle', py: 0.5 }}>
              <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                {s.limitFlavors}
              </Typography>
            </TableCell>

            <TableCell sx={{ py: 0.5 }}>
              <Stack sx={{ alignItems: 'center' }}>
                <Switch onClick={(e) => e.stopPropagation()} defaultChecked />
              </Stack>
            </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}