import { Box, Container, Stack, TextField, Typography, InputAdornment } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { ScreenFooterActions } from "../ScreenFooterActions/ScreenFooterActions";
import { phoneMask } from "../../../utils/masks/mask";
import { BackHeader } from "../BackHeader/BackHeader";

interface InfoScreenProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function InfoScreen({ name, setName, phone, setPhone, email, setEmail, onBack, onNext }: InfoScreenProps) {
  const isValid = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 10;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackHeader onBack={onBack} title="Voltar"/>
      <Container maxWidth="sm" sx={{ py: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Quem está pedindo?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Precisamos apenas do seu nome e WhatsApp para contato.
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Nome completo"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            placeholder="José Ferreira"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: "black" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />

          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="cliente@gmail.com"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailIcon sx={{ color: "blue" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />

          <TextField
            label="WhatsApp"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(phoneMask(e.target.value))}
            placeholder="(88) 99999-9999"
            inputMode="tel"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <WhatsAppIcon sx={{ color: "green" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          Usamos seu WhatsApp só para avisar sobre o status do pedido.
        </Typography>
      </Container>

      <Container maxWidth="sm">
        <ScreenFooterActions onBack={onBack} onNext={onNext} nextDisabled={!isValid} />
      </Container>
    </Box>
  );
}