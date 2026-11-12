import { useEffect, useState } from "react";
import { useCreateSize, useUpdateSize } from "../../../hooks/queries/useMenuQueries";
import type { Size } from "../../../types/Product.type";

interface props {
  onClose?: () => void;
  size?: Size | null;
}

export default function UseRegisterSizeModalController({ onClose, size }: props = {}) {
  const createSizeMutation = useCreateSize();
  const updateSizeMutation = useUpdateSize();

  const [name, setName] = useState("");
  const [limitFlavors, setLimitFlavors] = useState("1");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (size) {
      setName(size.name);
      setLimitFlavors(String(size.limitFlavors));
    } else {
      setName("");
      setLimitFlavors("1");
    }
    setFormError(null);
  }, [size?.id]);

  const resetForm = () => {
    setName("");
    setLimitFlavors("1");
    setFormError(null);
  };

  const closeAndReset = () => {
    resetForm();
    onClose?.();
  };

  async function saveSize() {
    const trimmedName = name.trim();
    const parsedLimit = Number(limitFlavors);

    if (!trimmedName) {
      setFormError("Informe o nome do tamanho.");
      return;
    }

    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      setFormError("Informe um limite de sabores válido (mínimo 1).");
      return;
    }

    if (createSizeMutation.isPending || updateSizeMutation.isPending) return;

    setFormError(null);

    try {
      if (size) {
        await updateSizeMutation.mutateAsync({
          sizeId: size.id,
          body: { name: trimmedName, limitFlavors: parsedLimit },
        });
      } else {
        await createSizeMutation.mutateAsync({
          name: trimmedName,
          limitFlavors: parsedLimit,
        });
      }

      resetForm();
      onClose?.();
    } catch {
      setFormError(
        "Não foi possível salvar o tamanho. Confira se o nome já existe e tente novamente.",
      );
    }
  }

  return {
    name,
    setName,
    limitFlavors,
    setLimitFlavors,
    saveSize,
    closeAndReset,
    isSaving: createSizeMutation.isPending || updateSizeMutation.isPending,
    formError,
    isEditing: Boolean(size),
  };
}
