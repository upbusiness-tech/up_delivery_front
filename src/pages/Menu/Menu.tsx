import { Paper, Typography, Stack, Button, Box } from "@mui/material";
import ProductsTable from "../../components/MenuComponents/ProductsComponents/TableProducts/ProductsTable";
import RegisterProductModal from "../../components/MenuComponents/RegisterProduct/RegisterProductModal";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RegisterCategorytModal from "../../components/MenuComponents/RegisterCategory/RegisterCategorytModal";
import RegisterAdditionalModal from "../../components/MenuComponents/RegisterAdditional/RegisterAdditionalModal";

export default function Menu() {
  const [openRegisterProduct, setOpenRegisterProduct] = useState(false);
  const [openRegisterCategory, setOpenRegisterCategory] = useState(false);
  const [openRegisterAdittional, setOpenRegisterAdittional] = useState(false);

  return (
    <Stack spacing={2}>
      <Paper elevation={1} sx={{ overflow: "hidden", p: 2}}>
        <Stack direction="row"  spacing={1.5} sx={{ mb: 0.5, alignItems: "center", justifyContent: 'space-between'}}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>Produtos</Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}/>
          </Box>
          <Stack direction="row"  spacing={1.5}>
             <Button endIcon={<AddIcon/>} variant='contained' size="medium" color="primary" sx={{textTransform: 'none'}} onClick={() => setOpenRegisterAdittional(true)}>
              Novo adicional
            </Button>
            <Button endIcon={<AddIcon/>} variant='contained' size="medium" color="primary" sx={{textTransform: 'none'}} onClick={() => setOpenRegisterCategory(true)}>
              Nova categoria
            </Button>
            <Button endIcon={<AddIcon/>} variant='contained' size="medium" color="success" sx={{textTransform: 'none'}} onClick={() => setOpenRegisterProduct(true)}>
              Novo produto
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <ProductsTable/>
      <RegisterProductModal
        open={openRegisterProduct}
        onClose={() => setOpenRegisterProduct(false)}
      />
      <RegisterCategorytModal
        open={openRegisterCategory}
        onClose={() => setOpenRegisterCategory(false)}
      />
      <RegisterAdditionalModal
        open={openRegisterAdittional}
        onClose={() => setOpenRegisterAdittional(false)}
      />
    </Stack>
  );
}