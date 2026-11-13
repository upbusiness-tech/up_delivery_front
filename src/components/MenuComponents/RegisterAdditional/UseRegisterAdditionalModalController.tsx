import { useEffect, useState } from "react";
import {
  useCategories,
  useCreateAdditional,
  useUpdateAdditional,
} from "../../../hooks/queries/useMenuQueries";
import type { AdditionalDTO, Additionals } from "../../../types/Product.type";

interface props {
  onClose?: () => void;
  additional?: Additionals | null;
}

function parsePrice(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export default function UseRegisterAdditionalModalController({
  onClose,
  additional,
}: props = {}) {
  const { data: categories = [] } = useCategories();
  const createAdditionalMutation = useCreateAdditional();
  const updateAdditionalMutation = useUpdateAdditional();

  const [additionalName, setAdditionalName] = useState("");
  const [additionalPrice, setAdditionalPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [additionalType, setAdditionalType] =
    useState<AdditionalDTO["additionalType"]>("multiple");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (additional) {
      setAdditionalName(additional.additionalName);
      setAdditionalPrice(String(additional.additionalPrice).replace(".", ","));
      setCategoryId(additional.category?.id ?? "");
      setAdditionalType(additional.additionalType);
    } else {
      setAdditionalName("");
      setAdditionalPrice("");
      setCategoryId("");
      setAdditionalType("multiple");
    }
    setFormError(null);
  }, [additional?.id]);

  const resetForm = () => {
    setAdditionalName("");
    setAdditionalPrice("");
    setCategoryId("");
    setAdditionalType("multiple");
    setFormError(null);
  };

  const closeAndReset = () => {
    resetForm();
    onClose?.();
  };

  async function saveAdditional() {
    const name = additionalName.trim();
    const price = parsePrice(additionalPrice);

    if (!name) {
      setFormError("Informe o nome do adicional.");
      return;
    }
    if (!categoryId) {
      setFormError("Selecione a categoria do adicional.");
      return;
    }
    if (price === null || price < 0) {
      setFormError("Informe um preço válido.");
      return;
    }
    if (createAdditionalMutation.isPending || updateAdditionalMutation.isPending) {
      return;
    }

    setFormError(null);

    try {
      if (additional) {
        await updateAdditionalMutation.mutateAsync({
          additionalId: additional.id,
          body: {
            additionalName: name,
            additionalPrice: price,
            categoryId,
            additionalType,
          },
        });
      } else {
        await createAdditionalMutation.mutateAsync({
          additionalName: name,
          additionalPrice: price,
          categoryId,
          additionalType,
        });
      }

      resetForm();
      onClose?.();
    } catch {
      setFormError(
        "Não foi possível salvar o adicional. Confira os dados e tente novamente.",
      );
    }
  }

  return {
    CATEGORIES: categories,
    additionalName,
    setAdditionalName,
    additionalPrice,
    setAdditionalPrice,
    categoryId,
    setCategoryId,
    additionalType,
    setAdditionalType,
    createAdditional: saveAdditional,
    closeAndReset,
    isCreating: createAdditionalMutation.isPending || updateAdditionalMutation.isPending,
    formError,
    isEditing: Boolean(additional),
  };
}
