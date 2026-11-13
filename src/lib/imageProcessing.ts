const FULL_MAX_DIMENSION = 1280;
const THUMB_MAX_DIMENSION = 320;
const WEBP_QUALITY = 0.82;
const JPEG_QUALITY = 0.85;

type Drawable = ImageBitmap | HTMLImageElement;
type OutputFormat = "image/webp" | "image/jpeg";
type OutputExtension = "webp" | "jpg";

interface DecodedImage {
  image: Drawable;
  width: number;
  height: number;
}

export interface ProcessedProductImage {
  /** Versão usada na ficha do produto: até 1280px no maior lado. */
  full: Blob;
  /** Versão usada em listas, carrinho e tabelas: até 320px no maior lado. */
  thumb: Blob;
  /** Extensão usada no nome dos dois arquivos (`{id}.{ext}` e `{id}_thumb.{ext}`). */
  extension: OutputExtension;
}

let webpSupport: boolean | null = null;

/**
 * Safari antigo ignora o formato pedido no `toBlob` e devolve PNG.
 * Nesse caso o fallback é JPEG, que todo navegador codifica.
 */
async function supportsWebpEncoding(): Promise<boolean> {
  if (webpSupport !== null) return webpSupport;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
    });

    webpSupport = blob?.type === "image/webp";
  } catch {
    webpSupport = false;
  }

  return webpSupport;
}

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
      return { image: bitmap, width: bitmap.width, height: bitmap.height };
    } catch {
      // Navegadores antigos: cai no fallback com HTMLImageElement.
    }
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () =>
        reject(new Error("Não foi possível ler a imagem selecionada."));
      element.src = objectUrl;
    });

    return {
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function fitInside(width: number, height: number, maxDimension: number) {
  const scale = Math.min(1, maxDimension / Math.max(width, height));

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function encode(
  image: Drawable,
  width: number,
  height: number,
  format: OutputFormat,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Não foi possível processar a imagem.");
  }

  // JPEG não tem transparência: preenche o fundo de branco.
  if (format === "image/jpeg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);

  const quality = format === "image/webp" ? WEBP_QUALITY : JPEG_QUALITY;

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, format, quality);
  });

  if (!blob || blob.type !== format) {
    throw new Error("Não foi possível converter a imagem.");
  }

  return blob;
}

/**
 * Redimensiona e converte a imagem antes do upload.
 * Reduz tipicamente 90 a 95% do peso de uma foto de celular.
 */
export async function processProductImage(
  file: File,
): Promise<ProcessedProductImage> {
  const format: OutputFormat = (await supportsWebpEncoding())
    ? "image/webp"
    : "image/jpeg";
  const extension: OutputExtension = format === "image/webp" ? "webp" : "jpg";

  const { image, width, height } = await decodeImage(file);

  try {
    const fullSize = fitInside(width, height, FULL_MAX_DIMENSION);
    const thumbSize = fitInside(width, height, THUMB_MAX_DIMENSION);

    const [full, thumb] = await Promise.all([
      encode(image, fullSize.width, fullSize.height, format),
      encode(image, thumbSize.width, thumbSize.height, format),
    ]);

    return { full, thumb, extension };
  } finally {
    if ("close" in image) {
      image.close();
    }
  }
}
