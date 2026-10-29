import { Box, Container } from "@mui/material";
import { PurchaseSummary } from "./PurchaseSummary";
import { ScreenFooterActions } from "./ScreenFooterActions/ScreenFooterActions";

interface CheckoutBottomBarProps {
  showSummary?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
}

/**
 * Barra inferior fixa do checkout.
 *
 * O conteúdo das telas rola dentro de uma área própria; esta barra fica fora
 * dela para que resumo e botões permaneçam sempre visíveis.
 */
export function CheckoutBottomBar({ showSummary = true, ...footerProps }: CheckoutBottomBarProps) {
  return (
    <Box
      sx={{
        flexShrink: 0,
        position: "sticky",
        bottom: 0,
        zIndex: 10,
        bgcolor: "background.default",
        borderTop: "1px solid",
        borderColor: "grey.200",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <Container maxWidth="sm" sx={{ pt: showSummary ? 1.25 : 0 }}>
        {showSummary && <PurchaseSummary compact />}
        <ScreenFooterActions {...footerProps} embedded />
      </Container>
    </Box>
  );
}
