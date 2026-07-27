import { Stack, Typography } from "@mui/material";

interface RowProps {
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
}

export default function Row({ label, value, bold, color }: RowProps) {
  return (
    <Stack direction="row" sx={{ py: 0.5, justifyContent: "space-between" }}>
      <Typography variant={bold ? "subtitle1" : "body2"} sx={{ fontWeight: bold ? 700 : 400 }}>
        {label}
      </Typography>
      <Typography
        variant={bold ? "subtitle1" : "body2"}
        sx={{ fontWeight: bold ? 700 : 500, color: color ?? (bold ? "primary.main" : undefined) }}
      >
        {value}
      </Typography>
    </Stack>
  );
}