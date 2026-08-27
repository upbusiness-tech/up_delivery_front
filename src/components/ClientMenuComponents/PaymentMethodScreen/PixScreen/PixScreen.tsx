import { QrCode2, ContentCopy, CheckCircle } from "@mui/icons-material";
import { Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { moneyMask } from "../../../../utils/masks/mask";
import { UsePixScreenController } from "./UsePixScreenController";
import type { Order } from "../../../../types/Order.type";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DoneScreen from "../../DoneScreen/DoneScreen";
import { useEffect } from "react";

interface Props {
  total: number;
  order: Order;
  // userEmail: string;
  onNext: () => void;
  onBack: () => void;
  setDisabeHeader: (value: boolean) => void;
}

export default function PixScreen({total, order, onNext, setDisabeHeader}: Props) {

  const c = UsePixScreenController({order, total})

  const isApproved = c.paymentStatus === "approved"
  const isRejected = c.paymentStatus === "rejected";
  const isCancelled = c.paymentStatus === "cancelled";

  useEffect(() => {
    if (isApproved) setDisabeHeader(true);
  }, [isApproved]);

  return (
    <>
    <Paper sx={{ mt: 1, p: 2, borderRadius: 4, border: "1px solid", borderColor: "grey.200", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", textAlign: "center" }}>
      {isApproved && (
        <DoneScreen order={order} onNext={onNext}/>
      )}
      {!isApproved && (
        <Stack direction="row" sx={{mb: 2, position: "relative" }}>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <QrCode2 sx={{ color: "success.main" }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Pague com Pix
            </Typography>
          </Stack>
        </Stack>
      )}

      {/* Se não estiver carregando, se não tiver sido aprovado e se tiver expirado */}
      {!c.loading && !isApproved && c.expired && (
        <Stack sx={{ alignItems: "center", justifyContent: "center", py: 6, gap: 2.5 }}>
          <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: "error.dark", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.9 }}>
            <TimerOffIcon sx={{ fontSize: 36, color: "white" }} />
          </Box>

          <Stack sx={{ alignItems: "center", gap: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
              O código Pix expirou!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", maxWidth: 280 }}>
              O tempo para pagamento acabou. Gere um novo código para continuar.
            </Typography>
          </Stack>

          <Button endIcon={<SettingsBackupRestoreIcon/>} variant="contained" color="success" size="large" onClick={c.handleRetry} sx={{ mt: 1, px: 4, borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
            Gerar novo PIX
          </Button>
        </Stack>
      )}
      
      {/* Se não tiver carregando, se não tiver expirado, se tiver sido rejeitado */}
      {!c.loading && !c.expired && isRejected && (
        <Stack sx={{ alignItems: "center", justifyContent: "center", py: 6, gap: 2.5 }}>
          <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: "error.dark", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.9 }}>
            <HighlightOffIcon sx={{ fontSize: 36, color: "white" }} />
          </Box>

          <Stack sx={{ alignItems: "center", gap: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
              Pagamento rejeitado
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", maxWidth: 280 }}>
              Não foi possível processar o pagamento. Tente novamente.
            </Typography>
          </Stack>

          <Button endIcon={<SettingsBackupRestoreIcon />} variant="contained" color="success" size="large" onClick={c.handleRetry} sx={{ mt: 1, px: 4, borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
            Tentar novamente
          </Button>
        </Stack>
      )}

      {/* Se não estiver carregando, se não tiver sido aprovado, se não tiver expirado, se não tiver sido rejeitado, se não tiver sido cancelado */}
      {!c.loading && !isApproved && !c.expired && !isRejected && !isCancelled && (
        <Paper sx={{ mt: 1, p: 2.5, borderRadius: 4, border: "1px solid", borderColor: "grey.200", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <Stack direction="row" sx={{position: "relative" }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
              {c.formattedTime && (
                <Typography variant="body2" sx={{ mb: 1 }}>Expira em: {c.formattedTime}</Typography>
              )}
            </Stack>
          </Stack>
          <LinearProgress color="success" variant="determinate" value={c.progress} sx={{ height: 6, borderRadius: 999, mb: 2.5}} />
    
    
          {c.loading ? (
            <Stack sx={{ alignItems: "center", justifyContent: "center", py: 3 }}>
              <Typography variant="body2" color="text.secondary">Gerando QR Code...</Typography>
            </Stack>
          ) : (
            c.qrCodeBase64 && (
              <Stack sx={{ alignItems: "center", justifyContent: "center", mb: 2.5 }}>
                <img style={{ width: 180, height: 180 }} src={`data:image/png;base64,${c.qrCodeBase64}`} alt="QR Code Pix" />
              </Stack>
            )
          )}
    
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            Valor a pagar
          </Typography>
          <Typography color="success" variant="h5" sx={{ fontWeight: 800, mb: 2.5, textAlign: "center" }}>
            {moneyMask(total)}
          </Typography>
    
          <Paper variant="outlined" sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, borderRadius: 3, bgcolor: "grey.50", borderColor: "grey.200" }}>
            <Typography variant="body1" sx={{ flex: 1, textAlign: "center", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {c.qrCode ? c.truncatedCode : "Carregando código..."}
            </Typography>
            <Button size="small" onClick={c.handleCopy} startIcon={c.copied ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />} color={c.copied ? "success" : "success"} sx={{ textTransform: "none", flexShrink: 0, borderRadius: 2 }}>
              {c.copied ? "Copiado" : "Copiar"}
            </Button>
          </Paper>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, textAlign: "center" }}>
            Após o pagamento, a confirmação pode levar alguns instantes.
          </Typography>
        </Paper>
      )}
    </Paper>
    </>
  );
}