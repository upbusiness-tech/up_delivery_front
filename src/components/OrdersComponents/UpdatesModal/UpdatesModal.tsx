import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from "@mui/material";
import { useEffect, useState } from "react";

const UPDATES_MODAL_KEY = "updelivery:orders-updates-modal-dismissed";

export interface UpdateItem {
  text: string;
}

interface UpdatesModalProps {
  updates: UpdateItem[];
  title?: string;
}

export default function UpdatesModal({ updates, title = "Novidades no painel" }: UpdatesModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(UPDATES_MODAL_KEY);
      if (!dismissed) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem(UPDATES_MODAL_KEY, "true");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (updates.length === 0) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "text.primary" }}>
          Atualizações importantes:
        </DialogContentText>
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          {updates.map((update, index) => (
            <DialogContentText key={index} sx={{ color: "text.primary" }}>
              • {update.text}
            </DialogContentText>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="contained" color="primary" sx={{ textTransform: "none" }}>
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
