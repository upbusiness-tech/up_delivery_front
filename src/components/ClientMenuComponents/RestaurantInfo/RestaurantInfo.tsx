import { LocationOn } from "@mui/icons-material";
import { Box, Chip, Stack, Typography } from "@mui/material";
import genericImage from "../../../assets/capa.avif";
import type { Restaurant } from "../../../types/Restaurant.type";

interface props {
  restaurant: Restaurant | undefined
}

export default function RestaurantInfo({restaurant}: props){
  return(
    <Box sx={{ position: "relative", height: { xs: 140, md: 220 } }}>
      <img
        src={genericImage}
        alt="Capa"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0, 0, 0, 0.35) 10%, rgba(0, 0, 0, 0.84))" }} />
      <Box sx={{ position: "absolute", left: 16, right: 16, bottom: 12, color: "#fff" }}>
        <Typography variant="body1" sx={{ fontWeight: 800 }}>{restaurant?.restaurantName}</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
          <Chip
            size="small"
            color="success"
            label={restaurant?.isOpen ? "Aberto agora" : "Fechado"}
            sx={{ color: "#fff", fontWeight: 600 }}
            />
          <Chip
            size="small"
            icon={<LocationOn sx={{ color: "#fff !important" }} />}
            label={"Centro"}
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff" }}
          />
        </Stack>
      </Box>
    </Box>
  )
}