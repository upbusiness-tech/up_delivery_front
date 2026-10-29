import { Box, Button, CircularProgress, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface ScreenFooterActionsProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  /** Quando verdadeiro, o rodapé não fixa sozinho (usado dentro da barra fixa do checkout). */
  embedded?: boolean;
}

/**
 * Rodapé padrão dos passos do checkout. A navegação é sempre explícita:
 * quem usa o componente informa para onde "Voltar" e "Continuar" vão.
 */
export function ScreenFooterActions({
  onBack,
  onNext,
  backLabel = "Voltar",
  nextLabel = "Continuar",
  nextDisabled = false,
  loading = false,
  embedded = false,
}: ScreenFooterActionsProps) {
  return (
    <Box
      sx={{
        ...(embedded
          ? {}
          : {
              position: "sticky",
              bottom: 0,
              left: 0,
              right: 0,
              mt: "auto",
              bgcolor: "background.paper",
              borderTop: "1px solid",
              borderColor: "grey.200",
            }),
        pt: embedded ? 1.5 : 2,
        pb: 2,
      }}
    >
      <Stack direction="row" spacing={1.5}>
        {onBack && (
          <Button
            variant="outlined"
            disabled={loading}
            onClick={onBack}
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600, borderColor: "grey.300", color: "text.primary", px: 3, "&:hover": { borderColor: "grey.400", bgcolor: "grey.50" }, flex: 1 }}
          >
            {backLabel}
          </Button>
        )}

        {onNext && (
          <Button
            variant="contained"
            fullWidth
            onClick={onNext}
            disabled={nextDisabled || loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
            endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: 18 }} />}
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700, bgcolor: "success.main", boxShadow: "none", "&:hover": { bgcolor: "success.dark", boxShadow: "none" }, "&.Mui-disabled": { bgcolor: "grey.200", color: "grey.500" } }}
          >
            {nextLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
