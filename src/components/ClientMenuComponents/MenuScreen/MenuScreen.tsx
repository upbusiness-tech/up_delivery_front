import { Box, Container, Divider, Typography } from "@mui/material";
import { UseMenuScreenController } from "./UseMenuScreenController";
import RestaurantInfo from "../RestaurantInfo/RestaurantInfo";
import SizeCard from "../SizeCard/SizeCard";
import ProductCard from "../ProductCard/ProductCard";
import type { Product, Size } from "../../../types/Product.type";

interface MenuScreenProps {
  onSelectSize: (size: Size) => void;
  onSelectProduct: (product: Product) => void
}

export default function MenuScreen({ onSelectSize, onSelectProduct }: MenuScreenProps) {
  const {
    restaurant,
    CATEGORIES,
    produtosComuns,
    tamanhosDaCategoria,
  } = UseMenuScreenController();

  return (
    <Box>
      <RestaurantInfo restaurant={restaurant} />

      <Container maxWidth="md" sx={{ py: 2 }}>
        {CATEGORIES.map((cat) => {
          const produtos = produtosComuns(cat.id);
          const tamanhos = tamanhosDaCategoria(cat.id);

          return (
            <Box key={cat.id} sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {cat.categoryName}
              </Typography>

              {produtos.map((product) => (
                
                // So vai ser usado para produtos com 1 flavor
                // Clica no ProductCard -> Abre o ProductSheet -> 
                // Se o usuario confirmar -> Tranforma o Product em um OrderItemBag ->
                // Adicona o produto como OrderItemBag no array de itens para requisição

                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onSelectProduct(product)}
                />
              ))}
              
              {/* APROVEITAR ESSE SIZE QUE TA SENDO PASSADO AQUI */}
              {tamanhos.map((size) => (
                <SizeCard
                  key={size.id}
                  size={size}
                  cat={cat.categoryName}
                  onClick={onSelectSize}
                />
              ))}
              <Divider sx={{pb: 2}}/>
            </Box>
          );
        })}
      </Container>
    </Box>
  );
}