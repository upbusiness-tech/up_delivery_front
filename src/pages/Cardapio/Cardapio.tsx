import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Box, Paper, Stack, Typography, Tabs, Tab, Button, IconButton, Chip,
  Table, TableHead, TableRow, TableCell, TableBody, Switch,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  FormControlLabel, Checkbox, Divider, InputAdornment, Grid,
  useMediaQuery, useTheme, Avatar, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import { products, categories, addons, brl, type Product, type ProductImage } from "@/lib/mock-data";
import { DataTablePagination, usePagination } from "@/components/DataTablePagination";

export const Route = createFileRoute("/cardapio")({ component: CardapioPage });

const availableSizes = ["Individual", "Média", "Grande", "Família", "350ml", "500ml", "Único"];

function CardapioPage() {
  const [tab, setTab] = useState(0);
  const [openProduct, setOpenProduct] = useState<Product | null | "new">(null);

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Cardápio</Typography>
          <Typography variant="body2" color="text.secondary">
            Produtos, categorias e adicionais do restaurante.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenProduct("new")}>
          Novo produto
        </Button>
      </Stack>

      <Paper>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          sx={{ px: 2, borderBottom: "1px solid #E5E7EB" }}
        >
          <Tab label="Produtos" />
          <Tab label="Categorias" />
          <Tab label="Adicionais" />
        </Tabs>

        {tab === 0 && <ProductsList onEdit={(p) => setOpenProduct(p)} />}
        {tab === 1 && <CategoriesTable />}
        {tab === 2 && <AddonsTable />}
      </Paper>

      <ProductDialog
        open={openProduct !== null}
        product={openProduct === "new" ? null : openProduct}
        onClose={() => setOpenProduct(null)}
      />
    </Stack>
  );
}

function ProductThumb({ images }: { images: ProductImage[] }) {
  const main = images.find((i) => i.primary) ?? images[0];
  if (!main) {
    return (
      <Avatar variant="rounded" sx={{ width: 44, height: 44, bgcolor: "#F3F4F6", color: "text.secondary" }}>
        <ImageIcon fontSize="small" />
      </Avatar>
    );
  }
  return (
    <Box sx={{ position: "relative" }}>
      <Avatar variant="rounded" src={main.url} sx={{ width: 44, height: 44 }} />
      {images.length > 1 && (
        <Chip
          label={`+${images.length - 1}`}
          size="small"
          sx={{ position: "absolute", bottom: -6, right: -6, height: 18, fontSize: 10, fontWeight: 700 }}
        />
      )}
    </Box>
  );
}

function ProductsList({ onEdit }: { onEdit: (p: Product) => void }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const flat = useMemo(() => products, []);
  const pg = usePagination(flat, 10);

  if (!isDesktop) {
    return (
      <Box>
        <Stack spacing={1.25} sx={{ p: 2 }}>
          {pg.paginated.map((p) => {
            const prices = p.sizes.map((s) => s.price);
            return (
              <Paper key={p.id} sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <ProductThumb images={p.images} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontWeight: 700 }} noWrap>{p.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.category}</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {brl(Math.min(...prices))} — {brl(Math.max(...prices))}
                    </Typography>
                  </Box>
                  <Switch defaultChecked={p.active} size="small" />
                </Stack>
                <Divider sx={{ my: 1.5 }} />
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                  {p.sizes.map((s) => (
                    <Chip key={s.label} size="small" label={`${s.label} · ${brl(s.price)}`} variant="outlined" />
                  ))}
                </Stack>
                <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                  <IconButton size="small" onClick={() => onEdit(p)} aria-label="Editar"><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" aria-label="Excluir"><DeleteIcon fontSize="small" /></IconButton>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
        <DataTablePagination
          count={pg.total} page={pg.page} rowsPerPage={pg.rowsPerPage}
          onPageChange={pg.onPageChange} onRowsPerPageChange={pg.onRowsPerPageChange}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={72}>Imagem</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Tamanhos</TableCell>
              <TableCell>Faixa de preço</TableCell>
              <TableCell align="center">Ativo</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pg.paginated.map((p) => {
              const prices = p.sizes.map((s) => s.price);
              return (
                <TableRow key={p.id} hover>
                  <TableCell><ProductThumb images={p.images} /></TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                  <TableCell><Chip size="small" label={p.category} variant="outlined" /></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                      {p.sizes.map((s) => (
                        <Chip key={s.label} size="small" label={`${s.label} · ${brl(s.price)}`} variant="outlined" />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>{brl(Math.min(...prices))} — {brl(Math.max(...prices))}</TableCell>
                  <TableCell align="center"><Switch defaultChecked={p.active} size="small" /></TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => onEdit(p)} aria-label="Editar"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" aria-label="Excluir"><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <DataTablePagination
        count={pg.total} page={pg.page} rowsPerPage={pg.rowsPerPage}
        onPageChange={pg.onPageChange} onRowsPerPageChange={pg.onRowsPerPageChange}
      />
    </Box>
  );
}

function CategoriesTable() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const pg = usePagination(categories, 10);

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button startIcon={<AddIcon />} variant="outlined">Nova categoria</Button>
      </Stack>
      {isDesktop ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Categoria</TableCell>
              <TableCell align="center">Produtos</TableCell>
              <TableCell align="center">Ativa</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pg.paginated.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                <TableCell align="center">{c.products}</TableCell>
                <TableCell align="center"><Switch defaultChecked={c.active} size="small" /></TableCell>
                <TableCell align="right">
                  <IconButton size="small" aria-label="Editar"><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" aria-label="Excluir"><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Stack spacing={1.25} sx={{ px: 2 }}>
          {pg.paginated.map((c) => (
            <Paper key={c.id} sx={{ p: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{c.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{c.products} produtos</Typography>
                </Box>
                <Switch defaultChecked={c.active} size="small" />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 1 }}>
                <IconButton size="small" aria-label="Editar"><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small" aria-label="Excluir"><DeleteIcon fontSize="small" /></IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
      <DataTablePagination
        count={pg.total} page={pg.page} rowsPerPage={pg.rowsPerPage}
        onPageChange={pg.onPageChange} onRowsPerPageChange={pg.onRowsPerPageChange}
      />
    </Box>
  );
}

function AddonsTable() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const pg = usePagination(addons, 10);

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button startIcon={<AddIcon />} variant="outlined">Novo adicional</Button>
      </Stack>
      {isDesktop ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Adicional</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell align="right">Preço</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pg.paginated.map((a) => (
              <TableRow key={a.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{a.name}</TableCell>
                <TableCell><Chip size="small" label={a.category} variant="outlined" /></TableCell>
                <TableCell align="right">{brl(a.price)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" aria-label="Editar"><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" aria-label="Excluir"><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Stack spacing={1.25} sx={{ px: 2 }}>
          {pg.paginated.map((a) => (
            <Paper key={a.id} sx={{ p: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{a.name}</Typography>
                  <Chip size="small" label={a.category} variant="outlined" sx={{ mt: 0.5 }} />
                </Box>
                <Typography sx={{ fontWeight: 700 }}>{brl(a.price)}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 1 }}>
                <IconButton size="small" aria-label="Editar"><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small" aria-label="Excluir"><DeleteIcon fontSize="small" /></IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
      <DataTablePagination
        count={pg.total} page={pg.page} rowsPerPage={pg.rowsPerPage}
        onPageChange={pg.onPageChange} onRowsPerPageChange={pg.onRowsPerPageChange}
      />
    </Box>
  );
}

interface ImgState { id: string; url: string; primary: boolean }

function ProductDialog({ open, onClose, product }: { open: boolean; onClose: () => void; product: Product | null }) {
  const [sizes, setSizes] = useState<{ label: string; price: string }[]>(
    product?.sizes.map((s) => ({ label: s.label, price: s.price.toFixed(2).replace(".", ",") }))
    ?? [
      { label: "Média", price: "49,90" },
      { label: "Grande", price: "59,90" },
    ],
  );

  const [images, setImages] = useState<ImgState[]>(
    product?.images.map((i) => ({ id: i.id, url: i.url, primary: !!i.primary }))
    ?? [],
  );

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const next: ImgState[] = [...images];
    Array.from(files).forEach((file) => {
      // Apenas visual: cria uma URL de pré-visualização local
      const url = URL.createObjectURL(file);
      next.push({ id: `${Date.now()}-${file.name}`, url, primary: next.length === 0 });
    });
    setImages(next);
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      if (filtered.length && !filtered.some((i) => i.primary)) filtered[0].primary = true;
      return filtered;
    });
  };
  const setPrimary = (id: string) => {
    setImages((prev) => prev.map((i) => ({ ...i, primary: i.id === id })));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
          {product ? `Editar produto` : "Novo produto"}
          <IconButton onClick={onClose} aria-label="Fechar"><CloseIcon /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField label="Nome do produto" fullWidth defaultValue={product?.name ?? "Pizza Calabresa"} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField select label="Categoria" fullWidth defaultValue={product?.category ?? "Pizzas"}>
              {categories.map((c) => <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={12}>
            <TextField label="Descrição" fullWidth multiline rows={2} placeholder="Descrição opcional do produto" />
          </Grid>

          {/* Imagens */}
          <Grid size={12}>
            <Divider textAlign="left" sx={{ my: 1 }}>
              <Typography variant="subtitle2">Imagens do produto</Typography>
            </Divider>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" }, mb: 2 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Enviar imagens
                <input type="file" accept="image/*" multiple hidden onChange={handleFilePick} />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Você pode enviar uma ou mais imagens. A primeira imagem marcada como principal será usada na listagem e nos detalhes.
              </Typography>
            </Stack>

            {images.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderStyle: "dashed" }}>
                <ImageIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Nenhuma imagem adicionada.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={1.5}>
                {images.map((im) => (
                  <Grid key={im.id} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Paper
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderColor: im.primary ? "primary.main" : undefined,
                        borderWidth: im.primary ? 2 : 1,
                      }}
                    >
                      <Box
                        component="img"
                        src={im.url}
                        alt="Pré-visualização do produto"
                        sx={{ display: "block", width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }}
                      />
                      {im.primary && (
                        <Chip
                          size="small"
                          color="primary"
                          icon={<StarIcon />}
                          label="Principal"
                          sx={{ position: "absolute", top: 6, left: 6, fontWeight: 700 }}
                        />
                      )}
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ position: "absolute", top: 6, right: 6 }}
                      >
                        {!im.primary && (
                          <Tooltip title="Definir como principal">
                            <IconButton
                              size="small"
                              onClick={() => setPrimary(im.id)}
                              sx={{ bgcolor: "rgba(255,255,255,.9)", "&:hover": { bgcolor: "#fff" } }}
                              aria-label="Definir como principal"
                            >
                              <StarBorderIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Remover imagem">
                          <IconButton
                            size="small"
                            onClick={() => removeImage(im.id)}
                            sx={{ bgcolor: "rgba(255,255,255,.9)", "&:hover": { bgcolor: "#fff" } }}
                            aria-label="Remover imagem"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          <Grid size={12}>
            <Divider textAlign="left" sx={{ my: 1 }}>
              <Typography variant="subtitle2">Tamanhos aceitos</Typography>
            </Divider>
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mb: 2 }}>
              {availableSizes.map((s) => {
                const active = sizes.some((x) => x.label === s);
                return (
                  <FormControlLabel
                    key={s}
                    control={
                      <Checkbox
                        checked={active}
                        onChange={() =>
                          setSizes((prev) =>
                            active
                              ? prev.filter((x) => x.label !== s)
                              : [...prev, { label: s, price: "" }],
                          )
                        }
                      />
                    }
                    label={s}
                  />
                );
              })}
            </Stack>

            <Stack spacing={1}>
              {sizes.map((s, i) => (
                <Paper key={s.label} sx={{ p: 1.5 }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
                    <Chip label={s.label} color="primary" variant="outlined" sx={{ minWidth: 100 }} />
                    <TextField
                      size="small"
                      label={`Preço ${s.label}`}
                      fullWidth
                      value={s.price}
                      onChange={(e) =>
                        setSizes((prev) => prev.map((p, idx) => idx === i ? { ...p, price: e.target.value } : p))
                      }
                      slotProps={{ input: { startAdornment: <InputAdornment position="start">R$</InputAdornment> } }}
                    />
                    <IconButton onClick={() => setSizes((prev) => prev.filter((_, idx) => idx !== i))} aria-label="Remover tamanho">
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
              {sizes.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                  Selecione ao menos um tamanho acima.
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid size={12}>
            <FormControlLabel control={<Switch defaultChecked={product?.active ?? true} />} label="Produto ativo no cardápio" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained">Salvar produto</Button>
      </DialogActions>
    </Dialog>
  );
}
