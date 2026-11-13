import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../api/firebase";
import { processProductImage } from "./imageProcessing";
import { getProductStoragePath } from "./productImage";

const MAX_SOURCE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const PRODUCT_IMAGE_ACCEPT = ALLOWED_TYPES.join(",");

const IMAGE_CACHE_CONTROL = "public,max-age=31536000,immutable";
const CONTENT_TYPES = {
  webp: "image/webp",
  jpg: "image/jpeg",
} as const;

/** Valida o arquivo escolhido e devolve a mensagem de erro, se houver. */
export function getProductImageError(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Formato de imagem não suportado. Use JPG, PNG ou WEBP.";
  }

  if (file.size > MAX_SOURCE_SIZE_BYTES) {
    return "A imagem deve ter no máximo 2 MB.";
  }

  return null;
}

function assertValidFile(file: File) {
  const error = getProductImageError(file);

  if (error) {
    throw new Error(error);
  }
}

/**
 * Envia duas variantes da imagem para o Storage:
 * - `{id}.{ext}`       -> até 1280px, usada na ficha do produto;
 * - `{id}_thumb.{ext}` -> até 320px, usada em listas e miniaturas.
 *
 * Retorna a URL pública da versão grande.
 */
export async function uploadProductImage(file: File): Promise<string> {
  assertValidFile(file);

  const restaurantId = auth.currentUser?.uid;

  if (!restaurantId) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const { full, thumb, extension } = await processProductImage(file);
  const imageId = crypto.randomUUID();
  const basePath = `restaurants/${restaurantId}/products/${imageId}`;

  const fullRef = ref(storage, `${basePath}.${extension}`);
  const thumbRef = ref(storage, `${basePath}_thumb.${extension}`);
  const metadata = {
    contentType: CONTENT_TYPES[extension],
    cacheControl: IMAGE_CACHE_CONTROL,
  };

  await Promise.all([
    uploadBytes(fullRef, full, metadata),
    uploadBytes(thumbRef, thumb, metadata),
  ]);

  return getDownloadURL(fullRef);
}

/**
 * Remove uma imagem de produto e a miniatura correspondente.
 * Ignora URLs externas (Cloudinary, por exemplo) e falhas de permissão.
 */
export async function deleteProductImage(image?: string | null): Promise<void> {
  const storagePath = getProductStoragePath(image);

  if (!storagePath) return;

  const restaurantId = auth.currentUser?.uid;

  if (!restaurantId || !storagePath.startsWith(`restaurants/${restaurantId}/products/`)) {
    return;
  }

  const paths = [storagePath];

  const thumbnailPath = storagePath.replace(/\.(webp|jpe?g|png)$/i, "_thumb.$1");

  if (thumbnailPath !== storagePath) {
    paths.push(thumbnailPath);
  }

  await Promise.all(
    paths.map((path) =>
      deleteObject(ref(storage, path)).catch(() => undefined),
    ),
  );
}
