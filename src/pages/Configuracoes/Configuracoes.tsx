import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Box, Paper, Stack, Typography, Tabs, Tab, Switch, FormControlLabel,
  TextField, Button, Divider, Slider, MenuItem, Grid, Chip, IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export const Route = createFileRoute("/configuracoes")({ component: ConfiguracoesPage });

function ConfiguracoesPage() {
  const [tab, setTab] = useState(0);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Configurações</Typography>
        <Typography variant="body2" color="text.secondary">
          Ajustes de operação do restaurante.
        </Typography>
      </Box>

      <Paper>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          sx={{ px: 2, borderBottom: "1px solid #E5E7EB" }}
        >
          <Tab label="Restaurante" />
          <Tab label="Impressoras" />
          <Tab label="Sons" />
          <Tab label="Pagamentos" />
          <Tab label="Cardápio web e links" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 0 && <RestauranteTab />}
          {tab === 1 && <ImpressorasTab />}
          {tab === 2 && <SonsTab />}
          {tab === 3 && <PagamentosTab />}
          {tab === 4 && <WebTab />}
        </Box>
      </Paper>
    </Stack>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="subtitle1">{title}</Typography>
      {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{subtitle}</Typography>}
      {children}
    </Box>
  );
}

function RestauranteTab() {
  return (
    <Stack spacing={3} divider={<Divider />}>
      <Section title="Status da loja" subtitle="Controla se o restaurante aceita novos pedidos.">
        <Stack spacing={1}>
          <FormControlLabel control={<Switch defaultChecked />} label="Aceitar pedidos de delivery" />
          <FormControlLabel control={<Switch defaultChecked />} label="Aceitar pedidos para retirada" />
          <FormControlLabel control={<Switch />} label="Pausar temporariamente (30 min)" />
        </Stack>
      </Section>
      <Section title="Tempo médio de preparo">
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <TextField label="Delivery (min)" defaultValue={45} sx={{ maxWidth: 200 }} />
          <TextField label="Retirada (min)" defaultValue={20} sx={{ maxWidth: 200 }} />
        </Stack>
      </Section>
      <Section title="Pedido mínimo">
        <TextField label="Valor mínimo (R$)" defaultValue="25,00" sx={{ maxWidth: 240 }} />
      </Section>
    </Stack>
  );
}

function ImpressorasTab() {
  return (
    <Stack spacing={3}>
      <FormControlLabel control={<Switch defaultChecked />} label="Impressão automática ao receber pedido" />
      <Grid container spacing={2}>
        {[
          { name: "Cozinha", type: "Térmica 80mm", status: "Conectada" },
          { name: "Balcão", type: "Térmica 58mm", status: "Conectada" },
          { name: "Bar", type: "Térmica 80mm", status: "Desconectada" },
        ].map((p) => (
          <Grid key={p.name} size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">{p.name}</Typography>
              <Typography variant="body2" color="text.secondary">{p.type}</Typography>
              <Chip
                size="small"
                sx={{ mt: 1 }}
                label={p.status}
                color={p.status === "Conectada" ? "success" : "default"}
                variant={p.status === "Conectada" ? "filled" : "outlined"}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button variant="outlined" sx={{ alignSelf: "flex-start" }}>Adicionar impressora</Button>
    </Stack>
  );
}

function SonsTab() {
  return (
    <Stack spacing={3} divider={<Divider />}>
      <Section title="Notificações sonoras">
        <FormControlLabel control={<Switch defaultChecked />} label="Tocar som ao receber novo pedido" />
        <FormControlLabel control={<Switch defaultChecked />} label="Repetir a cada 15 segundos até visualizar" />
      </Section>
      <Section title="Volume">
        <Slider defaultValue={70} sx={{ maxWidth: 320 }} />
      </Section>
      <Section title="Toque">
        <TextField select defaultValue="sino" sx={{ maxWidth: 240 }}>
          <MenuItem value="sino">Sino</MenuItem>
          <MenuItem value="alerta">Alerta</MenuItem>
          <MenuItem value="campainha">Campainha</MenuItem>
        </TextField>
      </Section>
    </Stack>
  );
}

function PagamentosTab() {
  const methods = [
    { name: "Dinheiro", enabled: true },
    { name: "Pix", enabled: true },
    { name: "Cartão de Crédito (na entrega)", enabled: true },
    { name: "Cartão de Débito (na entrega)", enabled: true },
    { name: "Vale-Refeição", enabled: false },
    { name: "Pagamento online", enabled: false },
  ];
  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Formas de pagamento aceitas</Typography>
      {methods.map((m) => (
        <Paper key={m.name} sx={{ p: 2 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography>{m.name}</Typography>
            <Switch defaultChecked={m.enabled} />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

function WebTab() {
  const link = "https://updelivery.app/r/pizzaria-do-tonio";
  return (
    <Stack spacing={3} divider={<Divider />}>
      <Section title="Cardápio web" subtitle="Link público que seus clientes acessam para fazer pedidos.">
        <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ alignItems: { md: "center" } }}>
          <TextField value={link} fullWidth slotProps={{ input: { readOnly: true } }} />
          <IconButton><ContentCopyIcon /></IconButton>
          <Button variant="outlined">Abrir</Button>
        </Stack>
      </Section>
      <Section title="Personalização">
        <Stack spacing={2}>
          <TextField label="Slug do restaurante" defaultValue="pizzaria-do-tonio" sx={{ maxWidth: 360 }} />
          <TextField label="Cor primária do cardápio" defaultValue="#E53935" sx={{ maxWidth: 240 }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Exibir tempo estimado" />
          <FormControlLabel control={<Switch defaultChecked />} label="Permitir agendamento" />
        </Stack>
      </Section>
      <Section title="Integrações">
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Chip label="WhatsApp conectado" color="success" />
          <Chip label="Instagram" variant="outlined" />
          <Chip label="Google Meu Negócio" variant="outlined" />
        </Stack>
      </Section>
    </Stack>
  );
}
