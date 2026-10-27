import { useState } from "react";

export function useOrderDetailController() {
  const [openModalOrderCancel, setOpenModalOrderCancel] = useState<boolean>(false)
  const handleOpenModalOrderCancel = () => setOpenModalOrderCancel(true)
  const handleCloseModalOrderCancel = () => setOpenModalOrderCancel(false)

  return {
    handleOpenModalOrderCancel,
    handleCloseModalOrderCancel,
    openModalOrderCancel,
  };
}