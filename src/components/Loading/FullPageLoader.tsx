import { Box, CircularProgress, Typography } from "@mui/material";

interface FullPageLoaderProps {
  label?: string;
}

export function FullPageLoader({ label = "Carregando..." }: FullPageLoaderProps) {
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
      }}
    >
      <CircularProgress color="success" />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
