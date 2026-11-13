import { useRef } from "react";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import type { Product } from "../../../types/Product.type";
import { moneyMask } from "../../../utils/masks/mask";
import ProductImage from "../../Common/ProductImage";

interface FeaturedProductsCarouselProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function FeaturedProductsCarousel({
  products,
  onProductClick,
}: FeaturedProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scroll = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({
      left: direction * 280,
      behavior: "smooth",
    });
  };

  return (
    <Box sx={{ py: 2 }}>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1.5,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              bgcolor: "#FEF3C7",
              color: "#B45309",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <StarIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Destaques
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Escolhas da casa para você
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          <IconButton
            size="small"
            aria-label="Ver destaques anteriores"
            onClick={() => scroll(-1)}
            sx={{ border: "1px solid", borderColor: "grey.200" }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 15 }} />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Ver próximos destaques"
            onClick={() => scroll(1)}
            sx={{ border: "1px solid", borderColor: "grey.200" }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Stack>
      </Stack>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 1.5,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          pb: 1,
          mx: { xs: -2, sm: 0 },
          px: { xs: 2, sm: 0 },
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {products.map((product) => {
          const prices = product.sizes.map((size) => Number(size.price));
          const minPrice = Math.min(...prices);
          const isCommonProduct =
            product.sizes.length === 1 &&
            product.sizes[0].size.name === "COMUM";

          return (
            <Box
              key={product.id}
              role="button"
              tabIndex={0}
              aria-label={`Abrir ${product.productName}`}
              onClick={() => onProductClick(product)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onProductClick(product);
                }
              }}
              sx={{
                position: "relative",
                flex: "0 0 auto",
                width: { xs: 230, sm: 270 },
                height: { xs: 170, sm: 190 },
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                scrollSnapAlign: "start",
                boxShadow: "0 12px 24px rgba(15, 23, 42, 0.18)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 16px 30px rgba(15, 23, 42, 0.24)",
                },
                "&:focus-visible": {
                  outline: "3px solid #F59E0B",
                  outlineOffset: 2,
                },
              }}
            >
              {product.image ? (
                <ProductImage
                  src={product.image}
                  alt={product.productName}
                  variant="full"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, #0F172A 0%, #334155 55%, #F59E0B 140%)",
                  }}
                />
              )}

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.02) 20%, rgba(0,0,0,0.82) 100%)",
                }}
              />

              <Chip
                icon={
                  <StarIcon
                    sx={{ color: "#fff !important", fontSize: "0.9rem !important" }}
                  />
                }
                label="DESTAQUE"
                size="small"
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  bgcolor: "rgba(245, 158, 11, 0.96)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.64rem",
                  letterSpacing: "0.04em",
                  borderRadius: 999,
                  "& .MuiChip-icon": { ml: 0.75 },
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  left: 14,
                  right: 14,
                  bottom: 12,
                  color: "#fff",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    lineHeight: 1.15,
                    textShadow: "0 2px 10px rgba(0,0,0,0.55)",
                  }}
                >
                  {product.productName}
                </Typography>
                <Typography
                  noWrap
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "rgba(255,255,255,0.82)",
                    fontWeight: 600,
                    mb: 0.75,
                  }}
                >
                  {product.productCategory.categoryName}
                </Typography>

                <Stack
                  direction="row"
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    {!isCommonProduct && (
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.82)",
                          mr: 0.5,
                        }}
                      >
                        A partir de
                      </Typography>
                    )}
                    <Typography
                      component="span"
                      sx={{ fontSize: "1rem", fontWeight: 800 }}
                    >
                      {moneyMask(minPrice)}
                    </Typography>
                  </Box>
                  <Box
                    aria-hidden
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 18 }} />
                  </Box>
                </Stack>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
