import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Stack, Typography } from "@mui/material";

interface props {
  title: string;
  decription?: string;
  iconColor?: string;
  button?: boolean;
  titleButton?: string;
  colorButton?: "green" | "blue";
  loading?: boolean;
  open: boolean;
}

export default function GenericModal({ title, decription, open, loading }: props) {
  return (
    <Dialog open={open} maxWidth="sm">
    <DialogTitle>
      <Typography variant="body1">{title}</Typography>
    </DialogTitle>

    <DialogContent>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Stack spacing={3} sx={{ alignItems: "center", justifyContent: "center", textAlign: "center", py: 3 }}>
            {loading && (
              <CircularProgress size={80} />
            )}
            <Box>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                {decription}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </DialogContent>
  </Dialog>
  );
}