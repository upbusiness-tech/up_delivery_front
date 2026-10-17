import { Box, Button, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

interface ScreenFooterActionsProps {
  nextPage: () => void;
  nextPageLabel?: string;
  viewNextPage?: boolean;
  loading?: boolean;
}

export function ScreenFooterActions({nextPageLabel, loading, nextPage, viewNextPage}: ScreenFooterActionsProps) {

  const navigate = useNavigate()

  return (
    <Box sx={{ position: "sticky", bottom: 0, left: 0, right: 0, mt: "auto", pt: 2, pb: 2, bgcolor: "background.paper", borderTop: "1px solid", borderColor: "grey.200" }}>
      <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            disabled={loading}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600, borderColor: "grey.300", color: "text.primary", px: 3, 
            "&:hover": { borderColor: "grey.400", bgcolor: "grey.50" }, flex: 1 }}
          >
            Voltar
          </Button>

        {viewNextPage && (
          <Button
            variant="contained"
            fullWidth
            onClick={nextPage}
            endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: 18 }} />}
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700, bgcolor: "success.main", boxShadow: "none", "&:hover": { bgcolor: "success.dark", boxShadow: "none" }, "&.Mui-disabled": { bgcolor: "grey.200", color: "grey.500" } }}
            >
            {nextPageLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
}