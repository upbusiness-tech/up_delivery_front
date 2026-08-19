import { Avatar, Badge, Box, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack, Tooltip, Typography } from "@mui/material";
import WebIcon from '@mui/icons-material/Web';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import React from "react";

export function HeadarOrders() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Stack direction="row" spacing={2}>
        <Badge badgeContent={4} color="error">
          <Button size="small" endIcon={<PendingActionsIcon />} variant="contained" sx={{ textTransform: 'none' }}>
            Pedidos Pendentes
          </Button>
        </Badge>
        <Button onClick={() => window.open('http://localhost:5173/upbusiness', '_blank')} endIcon={<WebIcon />} variant="contained" sx={{ textTransform: 'none' }}>
          Cardápio Web
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ minWidth: 100, textAlign: 'right' }}>@Empresa</Typography>

        <Tooltip title="Sua conta">
          <IconButton onClick={handleClick} size="small" aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ mr: 1 }} /> Perfil
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ mr: 1 }} /> Minha conta
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <ListItemIcon><PersonAdd fontSize="small" /></ListItemIcon>
            Adicionar conta
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
            Configurações
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
            Sair
          </MenuItem>
        </Menu>
      </Box>
    </Stack>
  );
}