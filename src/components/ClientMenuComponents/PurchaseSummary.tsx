import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { LocationOn, Storefront } from "@mui/icons-material";
import { useCheckout } from "../../checkout/CheckoutContext";
import { moneyMask } from "../../utils/masks/mask";

interface SummaryRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

function SummaryRow({ label, value, bold = false }: SummaryRowProps) {
  return (
    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2 }}>
      <Typography
        variant={bold ? "subtitle1" : "body2"}
        sx={{ fontWeight: bold ? 800 : 500, color: bold ? "text.primary" : "text.secondary" }}
      >
        {label}
      </Typography>
      <Typography
        variant={bold ? "subtitle1" : "body2"}
        sx={{
          fontWeight: bold ? 800 : 600,
          color: bold ? "success.dark" : "text.primary",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

interface PurchaseSummaryProps {
  /** Versão mais enxuta para a barra fixa do checkout. */
  compact?: boolean;
}

/**
 * Resumo compartilhado entre o carrinho e a seleção de pagamento.
 *
 * A modalidade é exibida de forma explícita porque o checkout reaproveita o
 * endereço salvo no dispositivo e pode iniciar com "Entrega" ativa. Assim o
 * cliente entende de onde vem a taxa antes de concluir o pedido.
 */
export function PurchaseSummary({ compact = false }: PurchaseSummaryProps) {
  const { mode, subtotal, neighborhood, total, hasAddress, deliveryFee, allowDelivery, settingsLoading } =
    useCheckout();
  const isDelivery = mode === "delivery";
  const deliveryFeePending = isDelivery && (!neighborhood || settingsLoading);
  const deliveryDisabled = !settingsLoading && !allowDelivery;
  const ModeIcon = isDelivery ? LocationOn : Storefront;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: compact ? 1.25 : 1.75,
        borderRadius: compact ? 2.5 : 3,
        borderColor: "grey.200",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <Stack spacing={compact ? 1 : 1.5}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant={compact ? "subtitle2" : "subtitle1"} sx={{ fontWeight: 800 }}>
            Resumo
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.4,
              borderRadius: 999,
              bgcolor: isDelivery ? "rgba(46, 125, 50, 0.1)" : "grey.100",
              color: isDelivery ? "success.dark" : "text.secondary",
            }}
          >
            <ModeIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {isDelivery ? "Entrega" : "Retirada"}
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            p: compact ? 0.75 : 1.25,
            borderRadius: compact ? 1.5 : 2,
            bgcolor: isDelivery ? "rgba(46, 125, 50, 0.06)" : "grey.50",
          }}
        >
          <ModeIcon
            sx={{
              fontSize: compact ? 15 : 17,
              color: isDelivery ? "success.main" : "text.secondary",
              mt: "1px",
              flexShrink: 0,
            }}
          />
          <Typography
            variant="caption"
            component="div"
            sx={{ color: "text.secondary", lineHeight: 1.45 }}
          >
            {isDelivery ? (
              <>
                <Box component="span" sx={{ fontWeight: 800, color: "text.primary" }}>
                  Entrega.
                </Box>{" "}
                {hasAddress
                  ? settingsLoading
                    ? `Endereço salvo neste dispositivo${
                        neighborhood ? ` (${neighborhood.neighborhoodName})` : ""
                      }. Calculando a taxa de entrega...`
                    : `Endereço salvo neste dispositivo${
                        neighborhood ? ` (${neighborhood.neighborhoodName})` : ""
                      }. A taxa de entrega já está incluída no total.`
                  : "Informe o endereço no passo Endereço para calcular a taxa de entrega."}
                {hasAddress && (
                  <Box component="span" sx={{ display: "block", mt: 0.25 }}>
                    Para retirar no local, altere para Retirada no passo Endereço.
                  </Box>
                )}
              </>
            ) : (
              <>
                <Box component="span" sx={{ fontWeight: 800, color: "text.primary" }}>
                  Retirada.
                </Box>{" "}
                {deliveryDisabled
                  ? "O restaurante não está aceitando entrega; a retirada foi selecionada automaticamente."
                  : "Você não paga taxa de entrega."}
              </>
            )}
          </Typography>
        </Box>

        <Stack spacing={compact ? 0.5 : 0.75}>
          <SummaryRow label="Subtotal" value={moneyMask(subtotal)} />
          <SummaryRow
            label="Taxa de entrega"
            value={deliveryFeePending ? "A calcular" : moneyMask(deliveryFee)}
          />
        </Stack>

        <Divider />

        <SummaryRow label="Total" value={moneyMask(total)} bold />
      </Stack>
    </Paper>
  );
}
