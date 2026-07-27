import { AppBar, Toolbar, IconButton, Typography, Box, LinearProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
  title: string;
  step?: number;
  totalSteps?: number;
  onBack: () => void;
}

export function BackHeader({ title, step, totalSteps, onBack }: Props) {
  const showStep = typeof step === "number" && typeof totalSteps === "number";
  const progress = showStep ? (step! / totalSteps!) * 100 : 0;
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton edge="start" onClick={onBack} aria-label="Voltar">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" component="h1" sx={{ lineHeight: 1.2 }}>
            {title}
          </Typography>
          {showStep && (
            <Typography variant="caption" color="text.secondary">
              Passo {step} de {totalSteps}
            </Typography>
          )}
        </Box>
      </Toolbar>
      {showStep && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 3 }}
        />
      )}
    </AppBar>
  );
}
