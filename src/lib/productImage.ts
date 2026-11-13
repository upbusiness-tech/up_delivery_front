const FIREBASE_STORAGE_HOST = "firebasestorage.googleapis.com";
const THUMB_SUFFIX = "_thumb";

/**
 * Monta a URL da miniatura de 320px a partir da URL da imagem original.
 *
 * As imagens novas são enviadas em pares (`{id}.{ext}` e `{id}_thumb.{ext}`).
 * Imagens antigas (Cloudinary ou qualquer URL externa) não têm miniatura e
 * retornam a própria URL original, sem quebrar o cardápio.
 */
export function getProductThumbUrl(image?: string | null): string {
  if (!image) return "";
  if (!image.includes(FIREBASE_STORAGE_HOST)) return image;

  const [path] = image.split(/[?#]/);
  const match = path.match(/\.(webp|jpe?g|png)$/i);

  if (!match) return image;

  const extension = match[0];
  const thumbPath = `${path.slice(0, -extension.length)}${THUMB_SUFFIX}${extension}`;

  // Sem o token: a leitura é pública pelas Storage Rules.
  return `${thumbPath}?alt=media`;
}

/**
 * Extrai o caminho do objeto dentro do bucket a partir da URL de download.
 * Retorna `null` para imagens que não estão no nosso Firebase Storage.
 */
export function getProductStoragePath(image?: string | null): string | null {
  if (!image || !image.includes(FIREBASE_STORAGE_HOST)) return null;

  try {
    const url = new URL(image);
    const marker = "/o/";
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex < 0) return null;

    const encodedPath = url.pathname.slice(markerIndex + marker.length);

    return decodeURIComponent(encodedPath);
  } catch {
    return null;
  }
}
