import { useState } from "react";
import { useCategories, useCreateAdditional } from "../../../hooks/queries/useMenuQueries";
import type { AdditionalDTO } from "../../../types/Product.type";

interface props {
  onClose?: () => void;
}

function parsePrice(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export default function UseRegisterAdditionalModalController({ onClose }: props = {}) {
  const { data: categories = [] } = useCategories();
  const createAdditionalMutation = useCreateAdditional();

  const [additionalName, setAdditionalName] = useState("");
  const [additionalPrice, setAdditionalPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [additionalType, setAdditionalType] =
    useState<AdditionalDTO["additionalType"]>("multiple");
  const [formError, setFormError] = useState<string | null>(null);

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

  async function createAdditional() {
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
    if (createAdditionalMutation.isPending) return;

    setFormError(null);

    try {
      await createAdditionalMutation.mutateAsync({
        additionalName: name,
        additionalPrice: price,
        categoryId,
        additionalType,
      });
      resetForm();
      onClose?.();
    } catch {
      setFormError("Não foi possível salvar o adicional. Confira os dados e tente novamente.");
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
    createAdditional,
    closeAndReset,
    isCreating: createAdditionalMutation.isPending,
    formError,
  };
}
