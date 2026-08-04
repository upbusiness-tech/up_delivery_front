import { Box, Button, Stack, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface ScreenFooterActionsProps {
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  hideBack?: boolean;
}

export function ScreenFooterActions({
  onBack,
  onNext,
  backLabel = "Voltar",
  nextLabel = "Continuar",
  nextDisabled = false,
  loading = false,
  hideBack = false,
}: ScreenFooterActionsProps) {
  return (
    <Box sx={{ position: "sticky", bottom: 0, left: 0, right: 0, mt: "auto", pt: 2, pb: 2, bgcolor: "background.paper", borderTop: "1px solid", borderColor: "grey.200" }}>
      <Stack direction="row" spacing={1.5}>
        {!hideBack && (
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={loading}
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600, borderColor: "grey.300", color: "text.primary", px: 3, "&:hover": { borderColor: "grey.400", bgcolor: "grey.50" } }}
          >
            {backLabel}
          </Button>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={onNext}
          disabled={nextDisabled || loading}
          endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: 18 }} />}
          sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700, bgcolor: "success.main", boxShadow: "none", "&:hover": { bgcolor: "success.dark", boxShadow: "none" }, "&.Mui-disabled": { bgcolor: "grey.200", color: "grey.500" } }}
        >
          {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : nextLabel}
        </Button>
      </Stack>
    </Box>
  );
}