import { Button, Container, Stack, TextField, Typography } from "@mui/material";

interface InfoScreenProps {
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function InfoScreen({ name, setName, phone, setPhone, onBack, onNext }: InfoScreenProps) {
  const maskPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>Quem está pedindo?</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Precisamos apenas do seu nome e WhatsApp para contato.
      </Typography>
      <Stack spacing={2}>
        <TextField label="Nome completo" fullWidth value={name} onChange={e => setName(e.target.value)} autoFocus />
        <TextField
          label="WhatsApp"
          fullWidth
          value={phone}
          onChange={e => setPhone(maskPhone(e.target.value))}
          placeholder="(11) 99999-9999"
          inputMode="tel"
        />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: "auto", pt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={onBack}
        >
          Voltar
        </Button>

        <Button
          variant="contained"
          fullWidth
          onClick={onNext}
        >
          Continuar
        </Button>
      </Stack>
    </Container>
  );
}