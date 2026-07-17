import {
  Paper, Stack, Typography, Grid, Divider,
  Table, TableRow, TableCell, TableBody, Chip,
  useMediaQuery, useTheme,
} from "@mui/material";
import UseEnterpriseController from "./UseEnterpriseController";
import { DAYS_LABEL, DAYS_ORDER } from "../../types/Restaurant.type";

export function EnterprisePage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { restaurant, loading, businessHours} = UseEnterpriseController();
  if(loading){return <Typography>Carregando...</Typography>}
  if (!restaurant) {return <Typography>Não foi possível carregar os dados do restaurante.</Typography>}


  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Dados da empresa
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="caption" color="text.secondary">Nome</Typography>
            <Typography>{restaurant.restaurantName}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary">Telefone</Typography>
            <Typography>{restaurant.restaurantPhone}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="caption" color="text.secondary">E-mail de contato</Typography>
            <Typography>{restaurant.restaurantEmail}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary">Descrição</Typography>
            <Typography>{restaurant.description}</Typography>
          </Grid>
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
  );
}
