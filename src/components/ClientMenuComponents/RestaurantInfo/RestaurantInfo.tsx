import { LocationOn } from "@mui/icons-material";
import { Box, Chip, Stack, Typography } from "@mui/material";
import UseRestauranteInfoController from "./UseRestauranteInfoController";

export default function RestaurantInfo(){
  const { restaurantIsOpen, restaurantInfos } = UseRestauranteInfoController()
  return(
    <Box sx={{ position: "relative", height: { xs: 140, md: 220 } }}>
      <img
        src={restaurantInfos?.image}
        alt="Capa"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0, 0, 0, 0.35) 10%, rgba(0, 0, 0, 0.84))" }} />
      <Box sx={{ position: "absolute", left: 16, right: 16, bottom: 12, color: "#fff" }}>
        <Typography variant="body1" sx={{ fontWeight: 800 }}>{restaurantInfos?.restaurantName}</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
          <Chip
            size="small"
            label={restaurantIsOpen ? "Aberto" : "Fechado"}
            sx={{bgcolor: restaurantIsOpen ? "success.main" : "error.main", color:  "#fff", fontWeight: 600, borderRadius: 2 }}

          />
          <Chip
            size="small"
            icon={<LocationOn sx={{ color: "#fff !important" }} />}
            label={restaurantInfos?.restaurantAddress}
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff" }}
          />
        </Stack>
      </Box>
    </Box>
  )
}