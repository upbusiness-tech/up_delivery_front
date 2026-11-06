import { useState } from "react";
import axios from "axios";
import type { Neighborhood } from "../../../types/Restaurant.type";
import {
  useCreateNeighborhood,
  useDeleteNeighborhood,
  useNeighborhoods,
  useUpdateNeighborhood,
} from "../../../hooks/queries/useNeighborhoodQueries";

type NeighborhoodForm = {
  neighborhoodName: string;
  deliveryFee: string;
};

const EMPTY_FORM: NeighborhoodForm = {
  neighborhoodName: "",
  deliveryFee: "",
};

function formatFeeInput(value: number) {
  return Number(value ?? 0).toFixed(2).replace(".", ",");
}

function parseFee(value: string) {
  if (!value.trim()) return null;

  const normalized = value.includes(",")
    ? value.replace(/\./g, "").replace(",", ".")
    : value;
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}

function getDeleteErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (
      typeof message === "string" &&
      message.trim() &&
      !/internal server error/i.test(message)
    ) {
      return message;
    }
  }

  return "Não foi possível excluir o bairro. Ele pode estar vinculado a pedidos existentes.";
}

export default function UseNeighborhoodsController() {
  const neighborhoodsQuery = useNeighborhoods();
  const createMutation = useCreateNeighborhood();
  const updateMutation = useUpdateNeighborhood();
  const deleteMutation = useDeleteNeighborhood();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Neighborhood | null>(null);
  const [form, setForm] = useState<NeighborhoodForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Neighborhood | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setDialogOpen(true);
  }

  function openEdit(neighborhood: Neighborhood) {
    setEditing(neighborhood);
    setForm({
      neighborhoodName: neighborhood.neighborhoodName,
      deliveryFee: formatFeeInput(neighborhood.deliveryFee),
    });
    setFormError(null);
    setDialogOpen(true);
  }

  function closeFormDialog() {
    if (isSaving) return;
    setDialogOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  }

  function updateFormField(field: keyof NeighborhoodForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitForm() {
    const neighborhoodName = form.neighborhoodName.trim();
    const deliveryFee = parseFee(form.deliveryFee);

    if (!neighborhoodName) {
      setFormError("Informe o nome do bairro.");
      return;
    }
    if (deliveryFee === null || deliveryFee < 0) {
      setFormError("Informe uma taxa de entrega válida.");
      return;
    }
    if (isSaving) return;

    setFormError(null);

    try {
      if (editing) {
        await updateMutation.mutateAsync({
          neighborhoodId: editing.id,
          body: { neighborhoodName, deliveryFee },
        });
      } else {
        await createMutation.mutateAsync({ neighborhoodName, deliveryFee });
      }

      setDialogOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      setFormError(null);
    } catch (error) {
      setFormError(
        getApiErrorMessage(
          error,
          "Não foi possível salvar o bairro. Verifique os dados e tente novamente.",
        ),
      );
    }
  }

  function requestDelete(neighborhood: Neighborhood) {
    setDeleteTarget(neighborhood);
    setDeleteError(null);
  }

  function closeDeleteDialog() {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!deleteTarget || isDeleting) return;

    setDeleteError(null);

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      setDeleteError(null);
    } catch (error) {
      setDeleteError(getDeleteErrorMessage(error));
    }
  }

  function refresh() {
    void neighborhoodsQuery.refetch();
  }

  return {
    neighborhoods: neighborhoodsQuery.data ?? [],
    isLoading: neighborhoodsQuery.isPending,
    isFetching: neighborhoodsQuery.isFetching,
    error: neighborhoodsQuery.error,
    refresh,
    dialogOpen,
    editing,
    form,
    formError,
    isSaving,
    openCreate,
    openEdit,
    closeFormDialog,
    updateFormField,
    submitForm,
    deleteTarget,
    deleteError,
    isDeleting,
    requestDelete,
    closeDeleteDialog,
    confirmDelete,
  };
}
