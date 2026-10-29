import { Box, IconButton, Typography, Card, Chip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type { OrderItemBag } from "../../../../types/Order.type";
import { moneyMask } from "../../../../utils/masks/mask";
import { useCheckout } from "../../../../checkout/CheckoutContext";

interface Props {
  item: OrderItemBag;
  remove: () => void;
  onEdit?: () => void;
}

const chipSx = {
  height: 20,
  bgcolor: "rgba(46,125,50,0.1)",
  color: "success.dark",
  fontWeight: 600,
  borderRadius: 1.25,
  "& .MuiChip-label": { px: 0.75, fontSize: 10.5 },
};

export function CartItem({ item, remove, onEdit }: Props) {
  const hasAdditionals = item.additionals && item.additionals.length > 0;
  const additionalsSum = hasAdditionals ? item.additionals?.reduce((sum, ad) => sum + ad.additionalPrice, 0) : 0;
  const subtotal = item.price + (additionalsSum || 0);
  const total = subtotal * item.quantity;

  const { incrementProduct, decrementProduct } = useCheckout();

  return (
    <Card
      sx={{
        p: 1,
        mb: 0.75,
        borderRadius: 3,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        border: "1px solid",
        borderColor: "grey.200",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.07)", borderColor: "grey.300" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{ width: 56, height: 56, borderRadius: 2, objectFit: "cover", flexShrink: 0, display: "block" }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.25,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {item.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5, mt: 0.25 }}>
            <PriceLine itemPrice={item.price} total={total} />
            <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              {onEdit && (
                <IconButton
                  size="small"
                  aria-label="Editar item"
                  title="Editar item"
                  onClick={onEdit}
                  sx={{ p: 0.5, color: "text.secondary" }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
              <IconButton
                size="small"
                aria-label="Remover item"
                title="Remover item"
                onClick={remove}
                sx={{ p: 0.5, color: "#910404" }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "grey.100",
            borderRadius: 999,
            p: 0.25,
            gap: 0.25,
            flexShrink: 0,
          }}
        >
          <IconButton
            onClick={() => decrementProduct(item)}
            size="small"
            disabled={item.quantity <= (item.minQuantity ?? 1)}
            sx={{
              bgcolor: "background.paper",
              width: 26,
              height: 26,
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              "&:hover": { bgcolor: "grey.200" },
            }}
          >
            <RemoveIcon sx={{ fontSize: 16 }} />
          </IconButton>

          <Typography sx={{ width: 22, textAlign: "center", fontWeight: 700, fontSize: 13 }}>
            {item.quantity}
          </Typography>

          <IconButton
            onClick={() => incrementProduct(item.id)}
            size="small"
            sx={{
              bgcolor: "success.main",
              color: "success.contrastText",
              width: 26,
              height: 26,
              "&:hover": { bgcolor: "success.dark" },
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      {(item.flavorNames?.length || hasAdditionals || item.observation) && (
        <Box sx={{ mt: 0.75, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {item.flavorNames && item.flavorNames.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", fontSize: 10.5 }}>
                Sabores:
              </Typography>
              {item.flavorNames.map((flavor, index) => (
                <Chip key={`${flavor}-${index}`} label={flavor} size="small" sx={chipSx} />
              ))}
            </Box>
          )}

          {hasAdditionals && (
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", fontSize: 10.5 }}>
                Adicionais:
              </Typography>
              {item.additionals?.map((additional) => (
                <Chip
                  key={additional.id}
                  label={`${additional.additionalName} · +${moneyMask(additional.additionalPrice)}`}
                  size="small"
                  sx={chipSx}
                />
              ))}
            </Box>
          )}

          {item.observation && (
            <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic", fontSize: 10.5 }}>
              Obs: {item.observation}
            </Typography>
          )}
        </Box>
      )}

    </Card>
  );
}

function PriceLine({ itemPrice, total }: { itemPrice: number; total: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, minWidth: 0, flexWrap: "wrap" }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10.5 }}>
        {moneyMask(itemPrice)} cada
      </Typography>
      <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "success.main", lineHeight: 1.1 }}>
        {moneyMask(total)}
      </Typography>
    </Box>
  );
}
