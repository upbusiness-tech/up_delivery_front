import { useState } from "react";
import {
  Paper, Stack, Typography, Grid, Divider,
  Table, TableRow, TableCell, TableBody, Chip,
  useMediaQuery, useTheme, Tabs, Tab, Box,
  Button, FormGroup, FormControlLabel, Checkbox,
  FormControl,
  Switch,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import UseEnterpriseController from "./UseEnterpriseController";
import { DAYS_LABEL, DAYS_ORDER } from "../../types/Restaurant.type";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import { phoneMask } from "../../utils/masks/mask";
import StorefrontIcon from '@mui/icons-material/Storefront';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const TABS = {
  GENERAL: 0,
  PAYMENTS: 1,
  PERMISSIONS: 2,
} as const;

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  return <Box sx={{ pt: 2 }}>{children}</Box>;
}

export function EnterprisePage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [tab, setTab] = useState<number>(TABS.GENERAL);

  const { restaurant, loading, businessHours, connectRestaurant } = UseEnterpriseController();
  const { 
    allowDelivery, allowPickup, paymentsPlatform, separetePayments, toggleSetting, togglePaymentMode,
    allowCardPayment, allowPixPayment
   } = useRestaurantSettings(restaurant?.id ?? "");

  if (loading) { return <Typography>Carregando...</Typography>; }
  if (!restaurant) { return <Typography>Não foi possível carregar os dados do restaurante.</Typography>; }

  return (
    <Stack spacing={0}>
      <Paper sx={{ px: { xs: 1, md: 2 } }}>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant={isDesktop ? "standard" : "scrollable"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          
        >
          <Tab sx={{textTransform: 'none'}} label="Informações gerais" />
          <Tab sx={{textTransform: 'none'}} label="Pagamentos" />
          <Tab sx={{textTransform: 'none'}} label="Permissões" />
        </Tabs>
      </Paper>

      <TabPanel value={tab} index={TABS.GENERAL}>
        <Stack spacing={2}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Dados da empresa
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StorefrontIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Nome</Typography>
                    <Typography variant="body1" sx={{fontWeight: 600}}>{restaurant.restaurantName}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Telefone</Typography>
                    <Typography variant="body1">{phoneMask(restaurant.restaurantPhone)}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">E-mail de contato</Typography>
                    <Typography variant="body1" noWrap>{restaurant.restaurantEmail}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" color="text.secondary">Descrição</Typography>
                <Typography variant="body2" sx={{ color: restaurant.description ? 'text.primary' : 'text.disabled', fontStyle: restaurant.description ? 'normal' : 'italic' }}>
                  {restaurant.description || 'Nenhuma descrição cadastrada'}
                </Typography>
              </Grid> */}
            </Grid>
          </Paper>

          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, mb: 1, gap: 1 }}>
              <Typography variant="subtitle1">Horários de funcionamento</Typography>
            </Stack>
            <Divider sx={{ mb: 1 }} />

            {isDesktop ? (
              <Table>
                <TableBody>
                  {DAYS_ORDER.map((day) => (
                    <TableRow key={day} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{DAYS_LABEL[day]}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                          {(businessHours[day] || []).length > 0 ? (
                            businessHours[day].map((interval, idx) => (
                              <Chip
                                key={idx}
                                label={`${interval.openTime ?? "--"} — ${interval.closeTime ?? "--"}`}
                                variant="filled"
                                color="success"
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">Fechado</Typography>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Stack spacing={1.25}>
                {DAYS_ORDER.map((day) => (
                  <Paper key={day} sx={{ p: 2 }} variant="outlined">
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>{DAYS_LABEL[day]}</Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                      {(businessHours[day] || []).length > 0 ? (
                        businessHours[day].map((interval, idx) => (
                          <Chip
                            key={idx}
                            label={`${interval.openTime ?? "--"} — ${interval.closeTime ?? "--"}`}
                            variant="filled"
                            color="success"
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">Fechado</Typography>
                      )}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Stack>
      </TabPanel>

      <TabPanel value={tab} index={TABS.PAYMENTS}>
        <Stack spacing={2}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="subtitle1" gutterBottom>
              Integração com o Mercado Pago
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <PaymentIcon color="action" />
                <Stack>
                  <Typography sx={{ fontWeight: 600 }}>Nenhuma conta conectada</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conecte sua conta do Mercado Pago para receber pagamentos online.
                  </Typography>
                </Stack>
              </Stack>

              <Button sx={{textTransform: 'none'}} endIcon={<AssuredWorkloadIcon/>} onClick={connectRestaurant} variant="contained">
                Integrar conta
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="subtitle1" gutterBottom>
              Pagamentos integrados
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Processados pela plataforma via Mercado Pago. O pagamento é confirmado automaticamente no pedido.
            </Typography>
            <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={paymentsPlatform} onChange={() => togglePaymentMode("payments_via_the_platform", "separete_payments")} />}
              label="Usar pagamentos integrados"
            />
            </FormGroup>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              Pagamentos à parte
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Acertados diretamente entre o cliente e o restaurante/entregador, fora da plataforma.
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={separetePayments} onChange={() => togglePaymentMode("separete_payments", "payments_via_the_platform")} />}
                label="Usar pagamentos a parte"
              />
            </FormGroup>
          </Paper>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="subtitle1" gutterBottom>
              Formas de pagamento
            </Typography>
            <FormGroup>
           <FormControlLabel
              control={<Checkbox checked={allowPixPayment} onChange={() => toggleSetting("allow_pix_payment")} />}
              label="Pix"
            />
            <FormControlLabel
              control={<Checkbox checked={allowCardPayment} onChange={() => toggleSetting("allow_card_payment")} />}
              label="Cartões Crédito e Débito"
            />
            </FormGroup>
          </Paper>
        </Stack>
      </TabPanel>

      <TabPanel value={tab} index={TABS.PERMISSIONS}>
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="subtitle1" gutterBottom>
            Modalidades de pedido
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <FormControl>
            <FormControlLabel control={<Switch checked={allowDelivery} onChange={() => toggleSetting("allow_delivery")} />} label="Permitir delivery" />
            <FormControlLabel control={<Switch checked={allowPickup} onChange={() => toggleSetting("allow_pickup")} />} label="Permitir retirada" />
          </FormControl>
        </Paper>
      </TabPanel>
    </Stack>
  );
}