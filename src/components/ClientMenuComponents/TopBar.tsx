import { AppBar, Toolbar, IconButton, Typography, Box, Stack, Avatar } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRestaurant } from "../../context/RestaurantContext";
import { titles, type Step } from "../../types/MenuClient.type";
import genericImage from "../../assets/capa.avif"

interface TopBarProps {
  step: Step;
  onBack: () => void;
}

export default function TopBar({ step, onBack }: TopBarProps) {
  const { restaurant } = useRestaurant();

  return (
    <AppBar position="sticky" color="inherit" sx={{ borderBottom: "1px solid #E5E7EB" }}>
      <Toolbar>
        {step !== "menu" && step !== "done" && (
          <IconButton edge="start" onClick={onBack} aria-label="Voltar"><ArrowBack /></IconButton>
        )}
        {step === "menu" ? (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Avatar src={genericImage} sx={{ width: 36, height: 36 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ lineHeight: 1.1 }}>{restaurant?.restaurantName}</Typography>
              <Typography variant="caption" color="text.secondary">Cardápio digital</Typography>
            </Box>
          </Stack>
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{titles[step]}</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}