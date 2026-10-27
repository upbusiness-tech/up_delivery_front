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
import MenuBookIcon from '@mui/icons-material/MenuBook';
import icon from '../../../public/icon-512.png'

import LogoutIcon from "@mui/icons-material/Logout";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../../api/services/auth.service";
import { PATHS } from "../../routes/paths";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;
const SIDEBAR_COLLAPSED_STORAGE_KEY = "updelivery:sidebar-collapsed";

function getInitialCollapsed() {
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "true";
  } catch {
    // localStorage indisponível (modo privado, cota cheia...) — usa o padrão.
    return false;
  }
}

function persistCollapsed(collapsed: boolean) {
  try {
    window.localStorage.setItem(
      SIDEBAR_COLLAPSED_STORAGE_KEY,
      String(collapsed),
    );
  } catch {
    // Sem persistência disponível, o menu continua funcionando na sessão.
  }
}

const NAV = [
  { label: "Pedidos", route: PATHS.orders, icon: ReceiptLongIcon },
  { label: "Empresa", route: PATHS.enterprise, icon: RestaurantMenuIcon },
  { label: "Cardápio", route: PATHS.menu, icon: MenuBookIcon },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [collapsed, setCollapsed] = useState(getInitialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const width = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    persistCollapsed(next);
  }

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  // A rota é a fonte da verdade do item ativo (deep link, voltar/avançar, F5).
  const active = NAV.find((item) => matchPath({ path: item.route, end: true }, pathname)) ?? NAV[0];

  async function handleLogout() {
    try {
      await AuthService.signOut();
      // O `ProtectedRoute` reage ao estado do Firebase e leva para /login.
    } catch {
      navigate(PATHS.login, { replace: true });
    } finally {
      // Evita que dados do restaurante anterior fiquem disponíveis no cache.
      queryClient.clear();
    }
  }

  const drawerContent = (
    <>
      <Toolbar sx={{ px: collapsed ? 1 : 2.5, gap: 1.25, minHeight: 64, justifyContent: collapsed ? "center" : "flex-start" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, flexShrink: 0 }}>
          <img src={icon} alt="UpDelivery" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </Box>
        {!collapsed && (
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="h6" noWrap sx={{ lineHeight: 1, letterSpacing: -0.2, fontWeight: "bold" }}>
              <Box component="span" sx={{ color: "#e3bc37" }}>Up</Box>Delivery
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: "#94A3B8" }}>
              Gestão de pedidos
            </Typography>
          </Box>
        )}
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <List sx={{ px: 1, py: 1, flex: 1 }}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active.route === item.route;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                onClick={() => {
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
            onClick={handleLogout}
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
              onClick={() => (isDesktop ? toggleCollapsed() : setMobileOpen(true))}
              aria-label={isDesktop ? (collapsed ? "Expandir menu" : "Retrair menu") : "Abrir menu"}
            >
              {isDesktop ? (collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />) : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {active.label}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}