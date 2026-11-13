import { Box, type SxProps, type Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { getProductThumbUrl } from "../../lib/productImage";

interface ProductImageProps {
  src?: string | null;
  alt?: string;
  /**
   * "thumb" carrega a versão de 320px (listas e miniaturas).
   * "full" carrega a versão de até 1280px (ficha do produto).
   */
  variant?: "thumb" | "full";
  /** Imagem exibida quando o produto não tem foto. */
  fallbackSrc?: string;
  /** Desativa o lazy loading (use em imagens acima da dobra). */
  lazy?: boolean;
  sx?: SxProps<Theme>;
  className?: string;
}

/**
 * Imagem de produto com miniatura automática, lazy loading e fallback.
 *
 * Se a miniatura não existir (imagens antigas do Cloudinary, por exemplo),
 * o `onError` volta para a URL original sem quebrar o layout.
 */
export default function ProductImage({
  src,
  alt,
  variant = "thumb",
  fallbackSrc,
  lazy = true,
  sx,
  className,
}: ProductImageProps) {
  const [thumbFailed, setThumbFailed] = useState(false);

  useEffect(() => {
    setThumbFailed(false);
  }, [src]);

  const source = src || fallbackSrc;

  if (!source) {
    return (
      <Box
        role="presentation"
        className={className}
        sx={{ display: "block", bgcolor: "grey.100", ...sx }}
      />
    );
  }

  const resolvedSrc =
    variant === "thumb" && !thumbFailed ? getProductThumbUrl(source) : source;

  return (
    <Box
      component="img"
      src={resolvedSrc}
      alt={alt ?? ""}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      onError={() => {
        if (!thumbFailed) setThumbFailed(true);
      }}
      className={className}
      sx={{ display: "block", ...sx }}
    />
  );
}
