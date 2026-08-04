import { QrCode2, ContentCopy, CheckCircle } from "@mui/icons-material";
import { Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { moneyMask } from "../../../../utils/masks/mask";

interface Props {
  total: number;
  qrCodeBase64: string;
  qrCode: string;
  loading: boolean;
  formattedTime: string | null;
  progress: number;
  copied: boolean;
  onCopy: () => void;
}

export default function PixScreen({
  total,
  qrCodeBase64,
  qrCode,
  loading,
  formattedTime,
  progress,
  copied,
  onCopy,
}: Props) {

  const truncatedCode = qrCode.length > 40 
    ? `${qrCode.slice(0, 20)}...${qrCode.slice(-15)}` 
    : qrCode;

  return (
    <Paper sx={{ mt: 1, p: 2.5, borderRadius: 4, border: "1px solid", borderColor: "grey.200", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", textAlign: "center" }}>
      <Stack direction="row" sx={{mb: 2, position: "relative" }}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          <QrCode2 sx={{ color: "success.main" }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Pague com Pix
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" sx={{position: "relative" }}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          {formattedTime && (
            <Typography variant="body2" sx={{ mb: 1 }}>Expira em: {formattedTime}</Typography>
          )}
        </Stack>
      </Stack>
      <LinearProgress color="success" variant="determinate" value={progress} sx={{ height: 6, borderRadius: 999, mb: 2.5}} />


      {loading ? (
        <Stack sx={{ alignItems: "center", justifyContent: "center", py: 3 }}>
          <Typography variant="body2" color="text.secondary">Gerando QR Code...</Typography>
        </Stack>
      ) : (
        qrCodeBase64 && (
          <Stack sx={{ alignItems: "center", justifyContent: "center", mb: 2.5 }}>
            <img style={{ width: 170, height: 170 }} src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code Pix" />
          </Stack>
        )
      )}

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
        Valor a pagar
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5, textAlign: "center" }}>
        {moneyMask(total)}
      </Typography>

      <Paper variant="outlined" sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, borderRadius: 3, bgcolor: "grey.50", borderColor: "grey.200" }}>
        <Typography variant="caption" sx={{ flex: 1, textAlign: "center", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {qrCode ? truncatedCode : "Carregando código..."}
        </Typography>
        <Button size="small" onClick={onCopy} startIcon={copied ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />} color={copied ? "success" : "primary"} sx={{ textTransform: "none", flexShrink: 0, borderRadius: 2 }}>
          {copied ? "Copiado" : "Copiar"}
        </Button>
      </Paper>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, textAlign: "center" }}>
        Após o pagamento, a confirmação pode levar alguns instantes.
      </Typography>
    </Paper>
  );
}