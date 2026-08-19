import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UseRegisterProductSizeModalController from "./UseRegisterProductSizeModalController";
import type { Product } from "../../../../types/Product.type";
import GenericModal from "../../../LoadingModal/GenericModal";

interface props {
  open: boolean;
  onClose: () => void;
  product: Product
}


export default function RegisterProductSizetModal({open, onClose, product }: props) {

  const c = UseRegisterProductSizeModalController({product})

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body1">Novo tamanho</Typography>
          </Box>
        </Stack>
        <IconButton aria-label="Fechar" onClick={onClose} sx={{position: "absolute", right: 12, top: 12}}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 2 }}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Tamanhos disponiveis
                </Typography>
              </Box>
              <Stack spacing={1} sx={{mt: 1}}>
                {c.SIZES.filter((s) => s.name !== "COMUM").map((s, index) => (
                  <Stack key={index} direction="row" spacing={1} sx={{alignItems: 'center'}}>
                    <TextField value={s.name} size="small" sx={{width: 160}} disabled />
                    <TextField placeholder="R$ 0,00" size="small" sx={{width: 120}}
                      onChange={(e) => 
                        c.handleSetSizePrice(
                          s.id,
                          Number(e.target.value)
                        )
                      } 
                    />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" spacing={1}>
          <Button sx={{ textTransform: "none" }} variant="contained" color="inherit" size="medium" onClick={onClose}>
            Cancelar
          </Button>
          <Button sx={{ textTransform: "none" }} variant="contained" color="success" size="medium"
            onClick={c.addProductSize}
          >
            Salvar
          </Button>
        </Stack>
      </DialogActions>


      <GenericModal title="Aguarde" open={c.openLoading}/>
    </Dialog>
  );
}