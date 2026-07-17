import { useState, type ReactNode } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
// import SettingsIcon from "@mui/icons-material/Settings";
// import StoreIcon from "@mui/icons-material/Store";
// import PaidIcon from "@mui/icons-material/Paid";
// import DescriptionIcon from "@mui/icons-material/Description";
// import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { useNavigate } from "react-router-dom";
import { ROUTES_ENUM } from "../../routes/routes.enum";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

const NAV = [
  { label: "Pedidos", route: ROUTES_ENUM.ORDERS , icon: ReceiptLongIcon },
  { label: "Empresa", route: ROUTES_ENUM.ENTERPRISE, icon: RestaurantMenuIcon },
  // { label: "Configurações", route: , icon: SettingsIcon },
  // { label: "Empresa", route: , icon: StoreIcon },
  // { label: "Finanças", route: , icon: PaidIcon },
  // { label: "Faturas", route: , icon: DescriptionIcon },
  // { label: "Conta", route: , icon: PersonIcon },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [active, setActive] = useState("Pedidos");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const width = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const navigate = useNavigate()

  const drawerContent = (
    <>
      <Toolbar sx={{ px: collapsed ? 1 : 2.5, gap: 1.25, minHeight: 64, justifyContent: collapsed ? "center" : "flex-start" }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            bgcolor: "#e3bc37",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <TwoWheelerIcon fontSize="small" />
        </Box>
        {!collapsed && (
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1, letterSpacing: -0.2 }}>
              UpDelivery
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
              Gestão de pedidos
            </Typography>
          </Box>
        )}
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <List sx={{ px: 1, py: 1, flex: 1 }}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.label;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                onClick={() => {
                  setActive(item.label);
                  setMobileOpen(false);
                  navigate(item.route)

                }}
                sx={{
                  borderRadius: 1.5,
                  px: collapsed ? 1.5 : 1.5,
                  py: 1.1,
                  justifyContent: collapsed ? "center" : "flex-start",
                  color: "#fff",
                  bgcolor: isActive ? "#e3bc37" : "transparent",
                  "&:hover": {
                    bgcolor: isActive ? "#e3bc37" : "rgba(255,255,255,0.06)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: "inherit", justifyContent: "center" }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    slotProps={{ primary: { sx: { fontWeight: 600, fontSize: 15 } } }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <List sx={{ px: 1, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 1.5,
              justifyContent: collapsed ? "center" : "flex-start",
              color: "#CBD5E1",
              "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
            }}
            onClick={() => navigate(ROUTES_ENUM.LOGIN)}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: "inherit", justifyContent: "center" }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Sair"
                slotProps={{ primary: { sx: { fontWeight: 600, fontSize: 15 } } }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            width,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width,
              border: 0,
              boxSizing: "border-box",
              bgcolor: "#1F1F1F",
              color: "#fff",
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              bgcolor: "#1F1F1F",
              color: "#fff",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
        <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #E5E7EB" }}>
          <Toolbar sx={{ gap: 1 }}>
            <IconButton
              edge="start"
              onClick={() => (isDesktop ? setCollapsed((c) => !c) : setMobileOpen(true))}
              aria-label={isDesktop ? (collapsed ? "Expandir menu" : "Retrair menu") : "Abrir menu"}
            >
              {isDesktop ? (collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />) : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {active}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}