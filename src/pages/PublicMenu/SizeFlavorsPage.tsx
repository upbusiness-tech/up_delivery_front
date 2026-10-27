import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { FullPageLoader } from "../../components/Loading/FullPageLoader";
import ProductBySizeScreen from "../../components/ClientMenuComponents/ProductBySizeScreen/ProductBySizeScreen";
import { useCheckout } from "../../checkout/CheckoutContext";
import { publicPaths } from "../../routes/paths";
import { useSizeOrderData } from "./useSizeOrderData";

/**
 * Seleção dos sabores de um tamanho e, em seguida, adicionais/observação.
 * A quantidade de sabores vem da URL para sobreviver a refresh e deep links.
 */
export default function SizeFlavorsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addProduct, updateProduct, products } = useCheckout();
  const { categoryId = "", sizeId = "", flavorCount = "1" } = useParams<{
    categoryId: string;
    sizeId: string;
    flavorCount: string;
  }>();
  const { slug, category, size, productsBySize, additionals, isLoading } = useSizeOrderData({
    categoryId,
    sizeId,
  });

  const editingItemId = (location.state as { editingItemId?: string } | null)?.editingItemId;
  const editingItem = editingItemId
    ? products.find((item) => item.id === editingItemId)
    : undefined;

  if (isLoading) return <FullPageLoader label="Carregando sabores..." />;

  if (!category || !size || productsBySize.length === 0) {
    return <Navigate to={publicPaths.menu(slug)} replace />;
  }

  const maxFlavors = Math.max(1, size.limitFlavors);
  const requested = Number(flavorCount);
  const validCount = Number.isInteger(requested) && requested >= 1 && requested <= maxFlavors;

  if (!validCount) {
    const fallbackCount = Math.min(Math.max(Math.floor(requested) || 1, 1), maxFlavors);
    return <Navigate to={publicPaths.sizeFlavors(slug, categoryId, sizeId, fallbackCount)} replace />;
  }

  const handleBack = () => {
    if (editingItem) {
      navigate(publicPaths.cart(slug), { replace: true });
      return;
    }

    if (maxFlavors > 1) {
      navigate(publicPaths.size(slug, categoryId, sizeId));
      return;
    }
    navigate(publicPaths.menu(slug));
  };

  return (
    <ProductBySizeScreen
      key={`${size.id}-${requested}-${editingItem?.id ?? "new"}`}
      size={{ ...size, limitFlavors: requested }}
      products={productsBySize}
      category={category}
      additionals={additionals}
      initialItem={editingItem}
      onBack={handleBack}
      onFinish={() =>
        navigate(editingItem ? publicPaths.cart(slug) : publicPaths.menu(slug), {
          replace: true,
        })
      }
      saveProduct={editingItem ? updateProduct : addProduct}
    />
  );
}
