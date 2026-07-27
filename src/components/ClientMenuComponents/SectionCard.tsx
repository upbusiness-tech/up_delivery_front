import { Button, Paper, Stack, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";

interface SectionCardProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

export default function SectionCard({ title, onEdit, children }: SectionCardProps) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" sx={{ mb: 1, justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{title}</Typography>
        <Button size="small" startIcon={<Edit fontSize="small" />} onClick={onEdit}>Editar</Button>
      </Stack>
      {children}
    </Paper>
  );
}