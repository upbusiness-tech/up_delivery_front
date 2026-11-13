import { Paper, Typography, Stack, Button, Box, Tabs, Tab } from "@mui/material";
import ProductsTable from "../../components/MenuComponents/ProductsComponents/TableProducts/ProductsTable";
import CategoriesTable from "../../components/MenuComponents/CategoriesComponents/CategoriesTable/CategoriesTable";
import AdditionalsTable from "../../components/MenuComponents/AdditionalsComponents/AdditionalsTable/AdditionalsTable";
import SizesTable from "../../components/MenuComponents/SizesComponents/SizesTable/SizesTable";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RegisterProductModal from "../../components/MenuComponents/RegisterProduct/RegisterProductModal";
import RegisterCategorytModal from "../../components/MenuComponents/RegisterCategory/RegisterCategorytModal";
import RegisterAdditionalModal from "../../components/MenuComponents/RegisterAdditional/RegisterAdditionalModal";
import RegisterSizeModal from "../../components/MenuComponents/RegisterSize/RegisterSizeModal";
import type { Additionals, Size } from "../../types/Product.type";

const TABS = {
  PRODUCTS: 0,
  CATEGORIES: 1,
  ADDITIONALS: 2,
  SIZES: 3,
} as const;

export default function Menu() {
  const [tab, setTab] = useState<number>(TABS.PRODUCTS);
  const [openRegisterProduct, setOpenRegisterProduct] = useState(false);
  const [openRegisterCategory, setOpenRegisterCategory] = useState(false);
  const [openRegisterAdditional, setOpenRegisterAdditional] = useState(false);
  const [openRegisterSize, setOpenRegisterSize] = useState(false);
  const [additionalBeingEdited, setAdditionalBeingEdited] =
    useState<Additionals | null>(null);
  const [sizeBeingEdited, setSizeBeingEdited] = useState<Size | null>(null);

  const openNewAdditional = () => {
    setAdditionalBeingEdited(null);
    setOpenRegisterAdditional(true);
  };

  const editAdditional = (additional: Additionals) => {
    setAdditionalBeingEdited(additional);
    setOpenRegisterAdditional(true);
  };

  const openNewSize = () => {
    setSizeBeingEdited(null);
    setOpenRegisterSize(true);
  };

  const editSize = (size: Size) => {
    setSizeBeingEdited(size);
    setOpenRegisterSize(true);
  };

  const action =
    tab === TABS.CATEGORIES
      ? {
          label: "Nova categoria",
          color: "primary" as const,
          onClick: () => setOpenRegisterCategory(true),
        }
      : tab === TABS.ADDITIONALS
        ? {
            label: "Novo adicional",
            color: "primary" as const,
            onClick: openNewAdditional,
          }
        : tab === TABS.SIZES
          ? {
              label: "Novo tamanho",
              color: "primary" as const,
              onClick: openNewSize,
            }
          : {
              label: "Novo produto",
              color: "success" as const,
              onClick: () => setOpenRegisterProduct(true),
            };

  return (
    <Stack spacing={2}>
      <Paper elevation={1} sx={{ overflow: "hidden", p: { xs: 1.5, sm: 2 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            mb: 1.5,
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>
              Produtos
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Gerencie produtos, categorias, adicionais e tamanhos do cardápio.
            </Typography>
          </Box>
          <Button
            endIcon={<AddIcon />}
            variant="contained"
            size="medium"
            color={action.color}
            sx={{ textTransform: "none" }}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </Stack>

        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              minHeight: 40,
              textTransform: "none",
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Produtos" />
          <Tab label="Categorias" />
          <Tab label="Adicionais" />
          <Tab label="Tamanhos" />
        </Tabs>
      </Paper>

      {tab === TABS.PRODUCTS && (
        <ProductsTable onCreateProduct={() => setOpenRegisterProduct(true)} />
      )}
      {tab === TABS.CATEGORIES && (
        <CategoriesTable onCreateCategory={() => setOpenRegisterCategory(true)} />
      )}
      {tab === TABS.ADDITIONALS && (
        <AdditionalsTable
          onCreateAdditional={openNewAdditional}
          onCreateCategory={() => setOpenRegisterCategory(true)}
          onEditAdditional={editAdditional}
        />
      )}
      {tab === TABS.SIZES && (
        <SizesTable onCreateSize={openNewSize} onEditSize={editSize} />
      )}

      <RegisterProductModal
        open={openRegisterProduct}
        onClose={() => setOpenRegisterProduct(false)}
      />
      <RegisterCategorytModal
        open={openRegisterCategory}
        onClose={() => setOpenRegisterCategory(false)}
      />
      <RegisterAdditionalModal
        open={openRegisterAdditional}
        additional={additionalBeingEdited}
        onClose={() => {
          setOpenRegisterAdditional(false);
          setAdditionalBeingEdited(null);
        }}
      />
      <RegisterSizeModal
        open={openRegisterSize}
        size={sizeBeingEdited}
        onClose={() => {
          setOpenRegisterSize(false);
          setSizeBeingEdited(null);
        }}
      />
    </Stack>
  );
}
