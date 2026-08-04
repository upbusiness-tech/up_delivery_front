import { Box, Card, Typography } from "@mui/material";

interface Props {
  deliveryFee?: number;
  total: number;
}

const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

export function OrderSummary({total }: Props) {
  const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
      <Typography variant={bold ? "subtitle1" : "body2"} color={bold ? "text.primary" : "text.secondary"}>
        {label}
      </Typography>
      <Typography variant={bold ? "subtitle1" : "body2"}>{value}</Typography>
    </Box>
  );
  return (
    <Card sx={{ p: 2 }}>
      <Row label="Total" value={fmt(total)} bold />
    </Card>
  );
}
