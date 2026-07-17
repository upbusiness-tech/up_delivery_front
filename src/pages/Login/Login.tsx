import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { UseLoginController } from "./UseLoginController";


export default function Login() {

  const { signIn } = UseLoginController()

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          p: 6,
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundImage: "linear-gradient(135deg, #1F1F1F 0%, #1b1b1b 100%)",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
            <span style={{ color: "#e3bc37" }}>Up</span>Delivery
          </Typography>
        </Stack>
        <Box>
          <Box sx={{ display: "flex", gap: 4 }}>
            <DeliveryDiningIcon sx={{ fontSize: 50, color: '#e3bc37'}} />
            <WhatsAppIcon sx={{ fontSize: 50, color: '#e3bc37'}} />
            <RestaurantMenuIcon sx={{ fontSize: 50, color: '#e3bc37' }} />
            <ReceiptLongIcon sx={{ fontSize: 50, color: '#e3bc37' }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.15, color: 'white'}}>
            Gerencie seu delivery com agilidade.
          </Typography>
          <Typography sx={{ mt: 2, opacity: 0.9, maxWidth: 460, color: 'white'}}>
            Pedidos em tempo real, cardápio inteligente e integrações que
            simplificam a operação do seu restaurante.
          </Typography>
        </Box>
        <Typography variant="caption" sx={{color: 'white' }}>
          © {new Date().getFullYear()} UpBusiness Tecnologia
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 6 },
        }}
      >
        <Paper
          component="form"
          sx={{ p: { xs: 3, sm: 5 }, width: "100%", maxWidth: 420 }}
          elevation={0}

        >
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              <span style={{ color: "#e3bc37" }}>Up</span>Delivery
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Entre com seu e-mail e senha para acessar o painel.
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <TextField
              label="E-mail"
              type="email"
              fullWidth
              autoComplete="email"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              />
            <TextField
              label="Senha"
              fullWidth
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                      >
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography
                component="a"
                href="#"
                variant="body2"
                sx={{
                  color: "#161616",
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Esqueceu sua senha?
              </Typography>
            </Stack>

            <Button
              variant="contained"
              color="success"
              size="large"
              sx={{ py: 1.25 }}
              onClick={() => signIn("upbusinessenterprise@gmail.com", "senha12345")}
            >
              Entrar
            </Button>

            <Divider sx={{ my: 1 }}>ou</Divider>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 1 }}
            >
              Ainda não tem conta?{" "}
              <Typography
                component="a"
                href="#"
                variant="body2"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Fale com o comercial
              </Typography>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}