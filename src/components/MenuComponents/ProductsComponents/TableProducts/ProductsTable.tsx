import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Paper, TextField, Typography, Stack, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Switch } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { moneyMask } from "../../../../utils/masks/mask";
import ProductDetail from "../ProductDetailModal/ProductDetail";
import UseProductsTablesController from "./UseProductsTablesController";
// import StopCircleIcon from '@mui/icons-material/StopCircle';
// import SizeComponent from "../SizeComponent/SizeComponent";


export default function ProductsTable(){
  const {
    categories,
    // sizes,
    additionalsByCategory,
    openProductDetail,
    produtosPorCategoria,
    isLoading,
    error,
    refetch,
    updateActiveProduct,
    togglingProductId,
    selectedProduct,
    closeProductDetail,
    search,
    setSearch,
    isSearching,
    hasSearchResults,
  } = UseProductsTablesController()

  if (isLoading) {
    return (
      <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", py: 8 }}>
        <CircularProgress size={32} />
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={refetch}>
            Tentar novamente
          </Button>
        }
      >
        Não foi possível carregar o cardápio.
      </Alert>
    );
  }

  return (
    <Box >
      {/* <SizeComponent sizes={sizes}/> */}
      <Paper elevation={0} sx={{ p: 1.5, mb: 2, border: "1px solid #E5E7EB", borderRadius: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Pesquisar produto ou adicional..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Limpar pesquisa"
                    onClick={() => setSearch("")}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </Paper>

      {isSearching && !hasSearchResults ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: "center", border: "1px solid #E5E7EB", borderRadius: 3 }}>
          <Typography sx={{ color: "#64748B", fontSize: "0.9rem" }}>
            Nenhum item encontrado para "{search.trim()}".
          </Typography>
        </Paper>
      ) : (
        <Box>
          {categories.map((cat) => {
        const produtos = produtosPorCategoria(cat.id)
        const adicionais = additionalsByCategory(cat.id)
        return (
          <Paper key={cat.id} elevation={1} sx={{p: 2, mb: 4}}>
            <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: "center", justifyContent: "space-between" }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937" }}>{cat.categoryName}</Typography>
                <Chip label={produtos.length} color="error" size="small" sx={{ borderRadius: 2 }} />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                {/* <Button endIcon={<StopCircleIcon/>} variant="contained" size="small" color="warning" sx={{ textTransform: "none" }}>Pausar Categoria</Button> */}
              </Stack>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 2, overflow: "hidden", mb: 2 }}>
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#fafafa" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Produto</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280" }} align="center">Tamanhos</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280" }} align="center">Preços</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280", width: 88 }} align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {produtos.map((p) => (
                    <TableRow 
                      key={p.id} 
                      sx={{ '&:last-child td': { borderBottom: 0 }, cursor: 'pointer' }}
                      onClick={() => openProductDetail(p)}
                      >
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction='row' spacing={2} sx={{alignItems:'center'}}>
                          <Box
                            component='img'
                            src={p.image}
                            alt={p.productName}
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: 2,
                              objectFit: 'cover',
                              flexShrink: 0,
                              bgcolor: '#f3f4f6',
                            }}
                          />

                          <Box>
                            <Typography sx={{ fontWeight: 700, color: '#111827' }}>
                              {p.productName}
                            </Typography>

                            <Typography variant='body2' sx={{ color: '#6b7280' }}>
                              {p.sizes.length} tamanho{p.sizes.length > 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        <Box>
                          {p.sizes.map((s) => (
                            <Typography sx={{ fontWeight: 600, color: "#111827", mb: 1 }}>
                              {s.size.name}
                            </Typography>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                       <Box>
                          {p.sizes.map((s) => (
                            <Typography color="success" sx={{ fontWeight: 600, mb: 1 }}>
                              {moneyMask(s.price)}
                            </Typography>
                          ))}
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Stack sx={{alignItems: 'center'}}>
                          <Typography variant="caption">Ativo</Typography>
                          {/* <Switch onClick={(e) => e.stopPropagation() } defaultChecked /> */}
                          <Switch
                            checked={p.productActive}
                            disabled={togglingProductId === p.id}
                            onChange={() => updateActiveProduct(p.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>


            <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937" }}>Adicionais de {cat.categoryName}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937" }}>{adicionais.length}</Typography>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 2, overflow: "hidden" }}>
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#fafafa" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Adicional</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280" }} align="center">Preço</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280", width: 88 }} align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adicionais.map((adicional) => (
                    <TableRow key={adicional.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography sx={{ fontWeight: 600, color: "#111827" }}>{adicional.additionalName}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        <Typography color="success" sx={{ fontWeight: 600 }}>{moneyMask(adicional.additionalPrice)}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                        <Stack sx={{alignItems: 'center'}}>
                          <Typography variant="caption">Ativo</Typography>
                          <Switch onClick={(e) => e.stopPropagation()} defaultChecked />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )
      })}
        </Box>
      )}

      <ProductDetail
        product={selectedProduct}
        onClose={closeProductDetail}
      />
    </Box>
  );
}