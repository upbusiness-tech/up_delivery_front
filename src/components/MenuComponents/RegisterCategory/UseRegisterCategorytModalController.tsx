import { useState } from "react";
import { useCreateCategory } from "../../../hooks/queries/useMenuQueries";

interface props {
  onClose?: () => void;
}

export default function UseRegisterCategory({ onClose }: props = {}) {
  const createCategoryMutation = useCreateCategory();
  const [categoryName, setCategoryName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setCategoryName("");
    setFormError(null);
  };

  const closeAndReset = () => {
    resetForm();
    onClose?.();
  };

  async function createCategory() {
    const name = categoryName.trim();

    if (!name) {
      setFormError("Informe o nome da categoria.");
      return;
    }
    if (createCategoryMutation.isPending) return;

    setFormError(null);

    try {
      await createCategoryMutation.mutateAsync(name);
      resetForm();
      onClose?.();
    } catch {
      setFormError("Não foi possível salvar a categoria. Confira os dados e tente novamente.");
    }
  }

  return {
    categoryName,
    setCategoryName,
    createCategory,
    closeAndReset,
    isCreating: createCategoryMutation.isPending,
    formError,
  };
}
