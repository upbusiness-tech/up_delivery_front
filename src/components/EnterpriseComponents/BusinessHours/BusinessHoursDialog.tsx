import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import {
  DAYS_LABEL,
  DAYS_ORDER,
  type BusinessHourInterval,
  type BusinessHours,
  type OrderModeCutoffs,
} from "../../../types/Restaurant.type";

interface Props {
  open: boolean;
  initialHours: BusinessHours;
  initialDeliveryCutoffTime?: string | null;
  initialPickupCutoffTime?: string | null;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (hours: BusinessHours, cutoffs: OrderModeCutoffs) => Promise<void>;
}

interface CutoffErrors {
  delivery?: string;
  pickup?: string;
}

function cloneHours(hours: BusinessHours): BusinessHours {
  return DAYS_ORDER.reduce((acc, day) => {
    acc[day] = (hours[day] ?? []).map((interval) => ({
      openTime: interval.openTime ?? "",
      closeTime: interval.closeTime ?? "",
    }));

    return acc;
  }, {} as BusinessHours);
}

function toMinutes(value: string | null) {
  if (!value) return null;

  const [hour, minute] = value.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;

  return hour * 60 + minute;
}

function normalizeHours(hours: BusinessHours): BusinessHours {
  return DAYS_ORDER.reduce((acc, day) => {
    acc[day] = (hours[day] ?? [])
      .filter((interval) => interval.openTime || interval.closeTime)
      .map((interval) => ({
        openTime: interval.openTime || null,
        closeTime: interval.closeTime || null,
      }));

    return acc;
  }, {} as BusinessHours);
}

function validateHours(hours: BusinessHours) {
  const errors: Record<string, string> = {};

  for (const day of DAYS_ORDER) {
    const ranges = (hours[day] ?? []).filter(
      (interval) => interval.openTime || interval.closeTime,
    );

    if (ranges.length === 0) continue;

    const parsed = ranges.map((interval) => {
      const open = toMinutes(interval.openTime);
      const close = toMinutes(interval.closeTime);

      if (open === null || close === null) {
        errors[day] = "Preencha abertura e fechamento.";
        return null;
      }

      if (open >= close) {
        errors[day] = "O fechamento deve ser depois da abertura.";
        return null;
      }

      return { open, close };
    });

    if (Object.prototype.hasOwnProperty.call(errors, day)) continue;

    const sorted = parsed
      .filter((range): range is { open: number; close: number } => Boolean(range))
      .sort((first, second) => first.open - second.open);

    for (let index = 1; index < sorted.length; index += 1) {
      if (sorted[index].open < sorted[index - 1].close) {
        errors[day] = "Os intervalos não podem se sobrepor.";
        break;
      }
    }
  }

  return errors;
}

export default function BusinessHoursDialog({
  open,
  initialHours,
  initialDeliveryCutoffTime = null,
  initialPickupCutoffTime = null,
  isSaving = false,
  onClose,
  onSave,
}: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [hours, setHours] = useState<BusinessHours>(() => cloneHours(initialHours));
  const [deliveryCutoffEnabled, setDeliveryCutoffEnabled] = useState(
    Boolean(initialDeliveryCutoffTime),
  );
  const [deliveryCutoffTime, setDeliveryCutoffTime] = useState(
    initialDeliveryCutoffTime ?? "23:30",
  );
  const [pickupCutoffEnabled, setPickupCutoffEnabled] = useState(
    Boolean(initialPickupCutoffTime),
  );
  const [pickupCutoffTime, setPickupCutoffTime] = useState(
    initialPickupCutoffTime ?? "23:30",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cutoffErrors, setCutoffErrors] = useState<CutoffErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    // Só reinicia ao abrir o diálogo. Um refetch em segundo plano não pode
    // apagar o que o usuário já digitou.
    setHours(cloneHours(initialHours));
    setDeliveryCutoffEnabled(Boolean(initialDeliveryCutoffTime));
    setDeliveryCutoffTime(initialDeliveryCutoffTime ?? "23:30");
    setPickupCutoffEnabled(Boolean(initialPickupCutoffTime));
    setPickupCutoffTime(initialPickupCutoffTime ?? "23:30");
    setErrors({});
    setCutoffErrors({});
    setSaveError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function updateInterval(
    day: string,
    index: number,
    field: keyof BusinessHourInterval,
    value: string,
  ) {
    setHours((current) => ({
      ...current,
      [day]: (current[day] ?? []).map((interval, intervalIndex) =>
        intervalIndex === index
          ? { ...interval, [field]: value }
          : interval,
      ),
    }));
  }

  function addInterval(day: string) {
    setHours((current) => ({
      ...current,
      [day]: [
        ...(current[day] ?? []),
        { openTime: "", closeTime: "" },
      ],
    }));
  }

  function removeInterval(day: string, index: number) {
    setHours((current) => ({
      ...current,
      [day]: (current[day] ?? []).filter(
        (_, intervalIndex) => intervalIndex !== index,
      ),
    }));
  }

  async function handleSave() {
    const normalized = normalizeHours(hours);
    const validationErrors = validateHours(normalized);
    const nextCutoffErrors: CutoffErrors = {};

    if (deliveryCutoffEnabled && !deliveryCutoffTime) {
      nextCutoffErrors.delivery = "Informe o horário de encerramento das entregas.";
    }

    if (pickupCutoffEnabled && !pickupCutoffTime) {
      nextCutoffErrors.pickup = "Informe o horário de encerramento das retiradas.";
    }

    setErrors(validationErrors);
    setCutoffErrors(nextCutoffErrors);
    setSaveError(null);

    if (
      Object.keys(validationErrors).length > 0 ||
      Object.keys(nextCutoffErrors).length > 0
    ) {
      return;
    }

    try {
      await onSave(normalized, {
        deliveryCutoffTime: deliveryCutoffEnabled ? deliveryCutoffTime : null,
        pickupCutoffTime: pickupCutoffEnabled ? pickupCutoffTime : null,
      });
    } catch (error) {
      setSaveError(
        error instanceof Error && error.message.trim()
          ? error.message
          : "Não foi possível salvar os horários.",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="md"
      fullWidth
      fullScreen={!isDesktop}
    >
      <DialogTitle sx={{ fontWeight: 800 }}>
        Editar horários e modalidades
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Dias sem intervalos ficam fechados. Para abrir ou fechar fora do
            horário, use o controle “Aberto agora” ou o botão de status na tela
            de pedidos.
          </Typography>

          {saveError && <Alert severity="error">{saveError}</Alert>}

          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>
              Encerramento automático das modalidades
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1.5 }}
            >
              A modalidade deixa de aceitar novos pedidos nesse horário todos os
              dias, mesmo que esteja habilitada em Permissões. O restaurante
              continua aberto normalmente. O corte vale para o restante do dia,
              inclusive quando houver mais de um período de funcionamento.
            </Typography>

            <Stack spacing={1.5}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ alignItems: { sm: "center" } }}
              >
                <FormControlLabel
                  sx={{ m: 0, flex: 1 }}
                  control={
                    <Switch
                      checked={deliveryCutoffEnabled}
                      onChange={(event) => {
                        const enabled = event.target.checked;
                        setDeliveryCutoffEnabled(enabled);
                        if (enabled && !deliveryCutoffTime) {
                          setDeliveryCutoffTime("23:30");
                        }
                        setCutoffErrors((current) => ({
                          ...current,
                          delivery: undefined,
                        }));
                      }}
                      disabled={isSaving}
                    />
                  }
                  label="Encerrar entregas automaticamente"
                />
                <TextField
                  size="small"
                  type="time"
                  label="Horário de encerramento"
                  value={deliveryCutoffEnabled ? deliveryCutoffTime : ""}
                  onChange={(event) => {
                    setDeliveryCutoffTime(event.target.value);
                    setCutoffErrors((current) => ({
                      ...current,
                      delivery: undefined,
                    }));
                  }}
                  disabled={!deliveryCutoffEnabled || isSaving}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ width: { xs: "100%", sm: 200 }, flexShrink: 0 }}
                />
              </Stack>
              {cutoffErrors.delivery && (
                <Typography variant="caption" color="error">
                  {cutoffErrors.delivery}
                </Typography>
              )}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ alignItems: { sm: "center" } }}
              >
                <FormControlLabel
                  sx={{ m: 0, flex: 1 }}
                  control={
                    <Switch
                      checked={pickupCutoffEnabled}
                      onChange={(event) => {
                        const enabled = event.target.checked;
                        setPickupCutoffEnabled(enabled);
                        if (enabled && !pickupCutoffTime) {
                          setPickupCutoffTime("23:30");
                        }
                        setCutoffErrors((current) => ({
                          ...current,
                          pickup: undefined,
                        }));
                      }}
                      disabled={isSaving}
                    />
                  }
                  label="Encerrar retiradas automaticamente"
                />
                <TextField
                  size="small"
                  type="time"
                  label="Horário de encerramento"
                  value={pickupCutoffEnabled ? pickupCutoffTime : ""}
                  onChange={(event) => {
                    setPickupCutoffTime(event.target.value);
                    setCutoffErrors((current) => ({
                      ...current,
                      pickup: undefined,
                    }));
                  }}
                  disabled={!pickupCutoffEnabled || isSaving}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ width: { xs: "100%", sm: 200 }, flexShrink: 0 }}
                />
              </Stack>
              {cutoffErrors.pickup && (
                <Typography variant="caption" color="error">
                  {cutoffErrors.pickup}
                </Typography>
              )}
            </Stack>
          </Box>

          {DAYS_ORDER.map((day) => {
            const intervals = hours[day] ?? [];

            return (
              <Box
                key={day}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: intervals.length > 0 ? 1.5 : 0.5,
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>
                    {DAYS_LABEL[day]}
                  </Typography>

                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addInterval(day)}
                    disabled={isSaving}
                    sx={{ textTransform: "none" }}
                  >
                    Adicionar horário
                  </Button>
                </Stack>

                {intervals.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Fechado
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {intervals.map((interval, index) => (
                      <Stack
                        key={`${day}-${index}`}
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        sx={{ alignItems: { sm: "center" } }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          type="time"
                          label="Abertura"
                          value={interval.openTime ?? ""}
                          onChange={(event) =>
                            updateInterval(
                              day,
                              index,
                              "openTime",
                              event.target.value,
                            )
                          }
                          disabled={isSaving}
                          slotProps={{ inputLabel: { shrink: true } }}
                        />

                        <TextField
                          fullWidth
                          size="small"
                          type="time"
                          label="Fechamento"
                          value={interval.closeTime ?? ""}
                          onChange={(event) =>
                            updateInterval(
                              day,
                              index,
                              "closeTime",
                              event.target.value,
                            )
                          }
                          disabled={isSaving}
                          slotProps={{ inputLabel: { shrink: true } }}
                        />

                        <IconButton
                          aria-label={`Remover horário de ${DAYS_LABEL[day]}`}
                          color="error"
                          onClick={() => removeInterval(day, index)}
                          disabled={isSaving}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}

                {errors[day] && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block", mt: 1 }}
                  >
                    {errors[day]}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={isSaving}
          sx={{ textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => void handleSave()}
          disabled={isSaving}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
