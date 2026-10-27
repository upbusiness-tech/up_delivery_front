import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function getErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return `${error.status} — ${error.statusText || "Erro ao carregar a página"}`;
  }
  if (error instanceof Error) return error.message;
  return "Erro inesperado ao carregar a página.";
}

/** Error boundary das rotas: evita tela branca quando uma página quebra. */
export function RouteError() {
  const error = useRouteError();

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
      <ErrorOutlineRoundedIcon sx={{ fontSize: 64, color: "error.main" }} />
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Algo deu errado
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480 }}>
        {getErrorMessage(error)}
      </Typography>
      <Button variant="contained" color="success" onClick={() => window.location.reload()} sx={{ textTransform: "none", borderRadius: 999 }}>
        Recarregar página
      </Button>
    </Box>
  );
}
