import { Paper, Typography, Stack, Button, Box } from "@mui/material";
import ProductsTable from "../../components/MenuComponents/ProductsComponents/ProductsTable";
import RegisterProductModal from "../../components/MenuComponents/RegisterProduct/RegisterProductModal";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';

export default function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <Stack spacing={2}>
      <Paper elevation={1} sx={{ overflow: "hidden", p: 2}}>
        <Stack direction="row"  spacing={1.5} sx={{ mb: 0.5, alignItems: "center", justifyContent: 'space-between'}}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>Produtos</Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>Gerencie os produtos do cardápio por categoria</Typography>
          </Box>
          <Button endIcon={<AddIcon/>} variant='contained' size="medium" color="success" sx={{textTransform: 'none'}} onClick={() => setOpen(true)}>
            Novo produto
          </Button>
        </Stack>
      </Paper>
      <ProductsTable/>
      <RegisterProductModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </Stack>
  );
}