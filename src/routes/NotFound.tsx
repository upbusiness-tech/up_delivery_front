import { Box, Button, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useNavigate } from "react-router-dom";
import { PATHS } from "./paths";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 3,
        textAlign: "center",
      }}
    >
      <SearchOffIcon sx={{ fontSize: 64, color: "grey.400" }} />
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Página não encontrada
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        O endereço que você tentou acessar não existe ou foi movido.
      </Typography>
      <Button variant="contained" color="success" onClick={() => navigate(PATHS.orders)} sx={{ textTransform: "none", borderRadius: 999 }}>
        Ir para o painel
      </Button>
    </Box>
  );
}
