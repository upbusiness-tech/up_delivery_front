import { Navigate, useNavigate, useParams } from "react-router-dom";
import { FullPageLoader } from "../../components/Loading/FullPageLoader";
import FlavorCountScreen from "../../components/ClientMenuComponents/ProductBySizeScreen/FlavorCountScreen";
import { publicPaths } from "../../routes/paths";
import { useSizeOrderData } from "./useSizeOrderData";

/**
 * Mostra quantos sabores o cliente quer em um tamanho (ex.: Pizza P até 2).
 * Tamanhos com apenas 1 sabor pulam direto para a seleção.
 */
export default function SizeFlavorCountPage() {
  const navigate = useNavigate();
  const { categoryId = "", sizeId = "" } = useParams<{ categoryId: string; sizeId: string }>();
  const { slug, category, size, isLoading } = useSizeOrderData({ categoryId, sizeId });

  if (isLoading) return <FullPageLoader label="Carregando tamanhos..." />;

  if (!category || !size) {
    return <Navigate to={publicPaths.menu(slug)} replace />;
  }

  if (size.limitFlavors <= 1) {
    return <Navigate to={publicPaths.sizeFlavors(slug, categoryId, sizeId, 1)} replace />;
  }

  return (
    <FlavorCountScreen
      size={size}
      categoryName={category.categoryName}
      onBack={() => navigate(publicPaths.menu(slug))}
      onChoose={(count) => navigate(publicPaths.sizeFlavors(slug, categoryId, sizeId, count))}
    />
  );
}
